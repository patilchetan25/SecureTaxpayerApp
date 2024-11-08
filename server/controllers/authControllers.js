const { hashPassword, comparePassword } = require('../helpers/auth');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const File = require('../models/file'); // Your file model



const test = (req, res) => {
    res.json("test is working")
}


// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to avoid filename conflicts
    },
});

// File filter to allow specific types
const fileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|xls|xlsx|jpg|jpeg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    }
    cb('Error: File type not allowed');
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // Limit file size to 10MB
    fileFilter: fileFilter,
});


const registerUser = async (req, res) => {
    try {
        const { firstName,lastName, email, password } = req.body;
        //check if name is entered
        if (!firstName) {
            return res.json({ error: "First Name is required" })
        }
        if (!lastName) {
            return res.json({ error: "Last Name is required" })
        }
        if (!password || password.length < 6) {
            return res.json({ error: "Password required and must be at least 6 characters long" })
        }
        //check email
        const exist = await User.findOne({ email })
        if (exist) {
            return res.json({ error: "Email already exist" });
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            firstName,lastName, email, password: hashedPassword
        });

        return res.json(user);

    } catch (error) {
        console.log(error)
    }
}
//Login Admin
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        //check if Admin exist
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.json({ error: "Admin not found" })
        }

        //check if password match for Admin
        const match = await comparePassword(password, admin.password)
        if (!match) {
            return res.json({ error: "Admin Password is incorrect" })
        } else {
            jwt.sign({ email: admin.email, id: admin._id, name: admin.name, role: 'Admin' }, process.env.JWT_SECRET,{},(error,token)=>{
                if (error) throw error;
                res.cookie('token',token).json(admin)
            })
        }


    } catch (error) {
        console.log(error)
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        //check if user exist
        const user = await User.findOne({ email })
        if (!user) {
            return res.json({ error: "User not found" })
        }

        //check if password match
        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.json({ error: "Password is incorrect" })
        } else {
            
            const payload = {
                email: user.email,
                id: user._id,
                isAdmin: user.isAdminUser
            };


            jwt.sign(payload, process.env.JWT_SECRET, {}, (error, token) => {
                if (error) throw error
                res.cookie('token', token).json({
                    token,
                    user: {
                        email: user.email,
                        id: user._id,
                        isAdmin: user.isAdminUser
                    }
                });
            })
        }


    } catch (error) {
        console.log(error)
    }
}


const checkAuth = async (req, res) => {
    try {
        const { token } = req.cookies
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, {}, (error, user) => {
                if (error) throw error
                console.log(user)
                res.json({authenticated:true,user:user})
            });
        } else {
            res.json({authenticated:false,user:null});
        }
    } catch (error) {
        console.log(error)
    }
}

const getUserById = async (req, res) => {
    try {
        // Extract userId from the URL params
        const { email } = req.params;

        // Fetch the full user document by userId from the database
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Respond with the user document
        res.json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const saveTaxpayerQuestions = async (req, res) => {
    try {
        // Destructure fields from the request body
        const {
            firstName, lastName,
            phoneNumber, ssn, streetAddress, zipCode, state, city, dateOfBirth,
            maritalStatus, filingStatus,
            spouseSSN, spouseFirstName, spouseLastName, spouseDateOfBirth, spousePhoneNumber, spouseStreetAddress
        } = req.body;

        // Extract the user's email or userId from params or body to locate the user (can also use _id if using MongoDB)
        const { email } = req.params;  // Assuming you are using a userId to find the user

        // Validate that the user exists in the database
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({ error: "email not found" });
        }

        // Validate required fields for taxpayer (user)
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (ssn) user.ssn = ssn;
        if (streetAddress) user.streetAddress = streetAddress;
        if (zipCode) user.zipCode = zipCode;
        if (state) user.state = state;
        if (city) user.city = city;
        if (dateOfBirth) user.dateOfBirth = dateOfBirth;

        // Update marital status and spouse fields (if applicable)
        if (maritalStatus) user.maritalStatus = maritalStatus;
        if (filingStatus) user.filingStatus = filingStatus;

        if (maritalStatus === "Married") {
            if (spouseSSN) user.spouseSSN = spouseSSN;
            if (spouseFirstName) user.spouseFirstName = spouseFirstName;
            if (spouseLastName) user.spouseLastName = spouseLastName;
            if (spouseDateOfBirth) user.spouseDateOfBirth = spouseDateOfBirth;
            if (spousePhoneNumber) user.spousePhoneNumber = spousePhoneNumber;
            if (spouseStreetAddress) user.spouseStreetAddress = spouseStreetAddress;
        }

        // Save the updated user document
        await user.save();

        // Return the updated user data
        return res.json(user);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred while updating the user" });
    }
};


const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token'); // Clear the cookie
        res.json({ message: 'Logout successful' });
    } catch (error) {
        console.log(error)
    }
}

// Endpoint for uploading files
const uploadFile = async (req, res) => {
    try {
        const file = req.file; // Access the uploaded file
        const email = req.body.userEmail; // Ensure you're using userEmail

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Save file information to the database
        await File.create({
            userEmail: email,
            filename: file.filename,
            originalname: file.originalname,
            path: file.path,
            createdAt: new Date()
        });

        res.json({
            message: 'File uploaded successfully',
            file: {
                filename: file.filename,
                originalname: file.originalname,
                path: file.path,
                userEmail: email
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error uploading file' });
    }
};

const downloadFile = async (req, res) => {
    const { email, filename } = req.params; // Get the email and filename from the request params

    try {
        // Find the file by user email and filename
        const fileRecord = await File.findOne({ userEmail: email, filename });

        if (!fileRecord) {
            return res.status(404).json({ error: "File not found" });
        }

        const filePath = path.join(__dirname, '../uploads', fileRecord.filename); // Path to the uploaded file

        // Use the originalname for the download
        res.download(filePath, fileRecord.originalname, (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "Error downloading file" });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get files by user email
const getFileList = async (req, res) => {
    try {
        const { email } = req.params;
        const files = await File.find({ userEmail: email }); // Fetch files for the specified user
        res.json(files);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = {
    test,
    registerUser,
    loginUser,
    loginAdmin,
    checkAuth,
    logoutUser,
    uploadFile,
    upload,
    downloadFile,
    getFileList,
    saveTaxpayerQuestions,
    getUserById
}