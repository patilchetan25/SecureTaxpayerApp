const express = require('express')
const router = express.Router()
const cors = require('cors')
const { test, registerUser, loginUser, getProfile, logoutUser } = require('../controllers/authControllers')

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
router.get('/getProfile', getProfile);
router.post('/logoutUser', logoutUser);


module.exports = router