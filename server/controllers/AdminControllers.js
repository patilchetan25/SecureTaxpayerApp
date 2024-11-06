const { hashPassword, comparePassword } = require('../helpers/auth');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const File = require('../models/file');


// Controller to list all users
const listUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Excluye el campo de contraseña por seguridad
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving users' });
    }
};

module.exports = {
    listUsers
};
