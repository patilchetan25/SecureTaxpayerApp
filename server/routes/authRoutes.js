const express = require('express')
const router = express.Router()
const cors = require('cors')
const { test, registerUser, loginUser, loginAdmin, checkAuth, logoutUser, uploadFile, upload, downloadFile, getFileList } = require('../controllers/authControllers')

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
router.get('/checkAuth', checkAuth);
router.post('/logoutUser', logoutUser);
router.post('/upload', upload.single('file'), uploadFile);
router.get('/download/:email/:filename', downloadFile);
router.get('/files/:email',getFileList)



module.exports = router