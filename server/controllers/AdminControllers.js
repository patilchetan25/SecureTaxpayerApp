const { hashPassword, comparePassword } = require('../helpers/auth');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const File = require('../models/file');


// Controller to list all users
const listUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Exclude the password field for security

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving users' });
    }
};

const updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedUser = req.body;
      const result = await User.findByIdAndUpdate(id, updatedUser, { new: true });
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating user' });
    }
  };

// Get files by user email
const filesuser = async (req, res) => {
  try {
      const { email } = req.params;
      const files = await File.find({ userEmail: email }); // Fetch files for the specified user
      res.json(files);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

const downloadFileuser = async (req, res) => {
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

module.exports = { downloadFileuser };


module.exports = {
    listUsers, 
    updateUser, 
    filesuser, 
    downloadFileuser
};
