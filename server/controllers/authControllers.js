const { hashPassword, comparePassword } = require('../helpers/auth');
const User = require('../models/user');
const jwt = require('jsonwebtoken');


const test = (req, res) => {
    res.json("test is working")
}

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
            jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, {}, (error, token) => {
                if (error) throw error
                res.cookie('token', token).json(user)
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
                res.json({authenticated:true,user:user})
            });
        } else {
            res.json({authenticated:false,user:null});
        }
    } catch (error) {
        console.log(error)
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token'); // Clear the cookie
        res.json({ message: 'Logout successful' });
    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    test,
    registerUser,
    loginUser,
    loginAdmin,
    checkAuth,
    logoutUser
}