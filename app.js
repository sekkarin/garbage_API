const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
const feedRoutes = require('./routes/feed');
const multer = require('multer')
const app = express();
const mongoose = require('mongoose');


const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};



// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode
    const message = error.message
    res.status(status).json({
        message: message
    })
})
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Acces-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);

mongoose.connect('mongodb://localhost:27017/message')
    .then(result => {
        app.listen(8080, () => {
            console.log(`http://localhost:8080/`);
        });
    })
    .catch(
        err => {
            console.log(err);
        }
    )

