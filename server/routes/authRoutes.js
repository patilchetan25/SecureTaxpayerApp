const express = require('express')
const router = express.Router()
const cors = require('cors')
const { test, registerUser, loginUser, loginAdmin, checkAuth, logoutUser, uploadFile, upload, downloadFile, getFileList, saveTaxpayerQuestions, getUserById, verifyEmail, unlockAccount} = require('../controllers/authControllers')
const { listUsers, updateUser, filesuser, downloadFileuser} = require('../controllers/AdminControllers')
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
//middleware
router.use(
    cors({
        origin: [process.env.CORS_ORIGIN || 'http://localhost:5173'],
        credentials: true
    })
)

// router.get('/', test)
router.post('/registerUser', registerUser);
router.post('/loginUser', loginUser);
router.post('/loginAdmin', loginAdmin);
router.get('/checkAuth', authMiddleware, checkAuth);
router.post('/logoutUser', authMiddleware, logoutUser);
router.post('/saveTaxpayerQuestions', authMiddleware, saveTaxpayerQuestions);
router.get('/getUserById', getUserById);
router.post('/upload', authMiddleware, upload.single('file'), uploadFile);
router.get('/download/:filename', authMiddleware, downloadFile);
router.get('/files',authMiddleware, getFileList)
router.get('/verify-email', verifyEmail);
router.get('/unlock-account', unlockAccount);

//admin
router.get('/listUsers', adminMiddleware, listUsers)
router.put('/updateUser/:id',adminMiddleware, updateUser);
router.get('/filesuser/:email',adminMiddleware, filesuser);
router.get('/downloadadmin/:email/:filename', adminMiddleware, downloadFileuser);



module.exports = router