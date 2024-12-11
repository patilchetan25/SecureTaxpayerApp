const path = require("path")
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config()
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const app = express();

mongoose.connect(process.env.MONGO_URL)
.then(() =>  console.log('DB Connected'))
.catch((error)  => console.log(error))

//middleware
app.use(cors({
    origin: ['https://securetaxpayer.com/', 'https://auto-deploy-helper-dj2lxga3zq-uc.a.run.app', 'http://localhost:8000'],
    credentials: true
  }));
app.use(express.json());
app.use(express.static('../client/dist'));
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))
require("./middleware/decrypt-payload")(app);


app.use('/', require('./routes/authRoutes'))
app.use(express.static(path.resolve(__dirname, "dist")))

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"))
})

const port = process.env.PORT || 8000;

app.listen(port , () => console.log(`Server is running on port ${port}`));