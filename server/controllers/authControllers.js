const { hashPassword, comparePassword } = require('../helpers/auth');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const File = require('../models/file'); // Your file model
const { generateToken, verifyToken } = require('../config/jwt');
const { sendVerificationEmail, sendUnlockAccountEmail } = require('../config/email');


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
    const { firstName,lastName, email, password } = req.body;
    try {
        
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
            firstName,lastName, email, password: hashedPassword,
            isVerified: false
        });       

        const token = generateToken(user._id); // verification token 
        await sendVerificationEmail(user.email, token);

        

        return res.json(user);

    } catch (error) {
        console.error(error); 
        const user = await User.findOne({ email: email });
        if (user && user._id) {
            await User.findByIdAndDelete(user._id);
            console.log("Usuario eliminado debido a fallo en el envío del correo.");
        }
        return res.json({error: "There was an error creating your user, please contact support"});
        
    }
}

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) return res.json({ error: "Token is required" });

        // Decodificar el token
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.userId);

        if (!user) return res.json({ error: "Invalid token or user not found" });

        // Actualizar isVerified a true
        user.isVerified = true;
        await user.save();

        return res.json({ message: "Email verified successfully. You can now log in." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Verification failed" });
    }
};

const unlockAccount = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) return res.status(400).json({ error: "Token is required" });

        // Decodificar el token
        const decoded = verifyToken(token); // Usa tu función de verificación JWT
        const user = await User.findById(decoded.userId);

        if (!user) return res.status(404).json({ error: "User not found" });

        if (!user.isBlocked) {
            return res.status(400).json({ error: "Account is not blocked" });
        }

        // Desbloquear la cuenta
        user.isBlocked = false;
        user.failedAttempts = 0;
        await user.save();

        return res.json({ message: "Account unlocked successfully. You can now log in." });
    } catch (error) {
        console.error("Error unlocking account:", error);
        return res.status(500).json({ error: "Unlocking account failed" });
    }
};


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
        return res.json({error: "There was an error creating your user, please contact support"});
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        //check if user exist
        const user = await User.findOne({ email })
        if (!user) {
            return res.json({ error: "Incorrect credentials" })
        }

        // Check if the account is locked
        //if (user.lockUntil && user.lockUntil > Date.now()) {
        //    return res.json({ error: "Account is locked. Please Try again in 30 minutes." });
        //}
        if (!user.isVerified) {

            if(user.isVerified == undefined)
            {
                user.isVerified = false
    
                const token = generateToken(user._id); // verification token 
                await sendVerificationEmail(user.email, token);
                await user.save();
                return res.json({ error: "Email not verified. Please check your inbox. The verification link is valid for one hour. After that, please contact support for assistance." });

            }
            return res.json({ error: "Email not verified. Please check your inbox." });
        }

        if (user.isBlocked) {
            return res.json({ error: "Your account is blocked. Please check your email to unlock your account." });
        }

        //check if password match
        const match = await comparePassword(password, user.password);
        if (!match) {
            user.failedAttempts = (user.failedAttempts || 0) + 1;

            // Lock account if failed attempts exceed 3
            if (user.failedAttempts >= 3) {
                //user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
                user.isBlocked = true;
                // send verificaction email
                const unlockToken = generateToken(user._id);
                await sendUnlockAccountEmail(user.email, unlockToken);
                await user.save();
                return res.json({ error: "Your account has been blocked. The verification link is valid for one hour. After that, please contact support for assistance." });
            
            }

            await user.save();
            return res.json({ error: "Incorrect credentials" });
        } else {

            user.failedAttempts = 0;

            await user.save();
            
            const payload = {
                email: user.email,
                id: user._id,
                isAdminUser: user.isAdminUser
            };


            jwt.sign(payload, process.env.JWT_SECRET, {}, (error, token) => {
                if (error) throw error
                res.cookie('token', token).json({
                    token,
                    user: {
                        email: user.email,
                        id: user._id,
                        isAdminUser: user.isAdminUser
                    }
                });
            })
        }


    } catch (error) {
        return res.json({error: "There was an error, please contact support"});
    }
}


const checkAuth = async (req, res) => {
    try {
        const { token } = req.cookies;
        if (token) {
            // Verify the token asynchronously
            jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
                if (error) {
                    console.log('Error verifying token:', error);
                    return res.status(401).json({ authenticated: false, user: null });
                }

                // After successful verification, you get the decoded token (which contains user info like _id or email)
                const userEmail = decoded.email;  // Assuming the email is included in the token's payload

                // Fetch user from the database using email (or use user._id if that's stored in the token)
                try {
                    const user = await User.findOne({ email: userEmail });

                    if (!user) {
                        return res.status(404).json({ authenticated: false, user: null });
                    }

                    const userObject = user.toObject();
                    delete userObject.password; 
                    delete userObject.isBlocked; 
                    delete userObject.isVerified; 

                    // If user is found, return the full user object
                    res.json({
                        authenticated: true,
                        user: userObject // The whole user object returned from the database
                    });

                } catch (dbError) {
                    console.error('Database query error:', dbError);
                    res.status(500).json({ authenticated: false, user: null });
                }
            });
        } else {
            res.json({ authenticated: false, user: null });
        }
    } catch (error) {
        console.log('Error in checkAuth:', error);
        res.status(500).json({ authenticated: false, user: null });
    }
};

const getUserById = async (req, res) => {
    try {
        // Extract userId from the URL params
        const email = req.user.email;

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
        const email = req.user.email;  // Assuming you are using a userId to find the user

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
        //const email = req.body.userEmail; // Ensure you're using userEmail
        const email = req.user.email;
        

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
    const email = req.user.email;
    const { filename } = req.params; // Get the email and filename from the request params

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
        //const { email } = req.params;
        const email = req.user.email;
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
    getUserById,
    verifyEmail, 
    unlockAccount
}