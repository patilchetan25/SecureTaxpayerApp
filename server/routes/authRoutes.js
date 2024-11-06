const express = require('express')
const router = express.Router()
const cors = require('cors')
const { test, registerUser, loginUser, loginAdmin, checkAuth, logoutUser, uploadFile, upload, downloadFile, getFileList } = require('../controllers/authControllers')
const { listUsers } = require('../controllers/AdminControllers')
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
//middleware
router.use(
    cors({
        origin: ['http://localhost:5173'],
        credentials: true
    })
)

router.get('/', test)
router.post('/registerUser', registerUser);
router.post('/loginUser', loginUser);
router.post('/loginAdmin', loginAdmin);
router.get('/checkAuth', authMiddleware, checkAuth);
router.post('/logoutUser', authMiddleware, logoutUser);
router.post('/upload', authMiddleware, upload.single('file'), uploadFile);
router.get('/download/:email/:filename', authMiddleware, downloadFile);
router.get('/files/:email',authMiddleware, getFileList)


//admin
router.get('/listUsers', adminMiddleware, listUsers)



module.exports = router