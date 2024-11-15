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

const allowedOrigins = [
    'https://auto-deploy-helper-dj2lxga3zq-uc.a.run.app/', // frontend's actual domain
    'http://localhost:8000' // local development
];

//middleware
app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from your specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true
  }));
app.use(express.json());
app.use(express.static('../client/dist'));
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))

app.use('/', require('./routes/authRoutes'))
app.use(express.static(path.resolve(__dirname, "dist")))

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"))
})

const port = process.env.PORT || 8000;

app.listen(port , () => console.log(`Server is running on port ${port}`));