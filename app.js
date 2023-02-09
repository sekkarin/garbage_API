require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const stripe = require('stripe')(process.env.KEY_TEST);
const authRoutes = require('./routes/auth')
const invoiceRouter = require("./routes/invoice")
const dashboardRouter = require('./routes/dashboard')
const userRouter = require('./routes/user')
const orderRouter = require('./routes/order')
const app = express();
const cors = require("cors")
const User = require("./models/user")
const bcrypt = require('bcryptjs')
const isAuth = require('./middlewares/is-auth')
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
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


app.use(cors())
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/auth', authRoutes);
app.use('/admin', invoiceRouter);
app.use('/dashboard', dashboardRouter);
app.use('/user', userRouter);
app.use('/user', orderRouter);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data
    res.status(status).json({ message: message, data: data });
});

app.post('/payment-sheet',isAuth, async (req, res) => {
    // Use an existing Customer ID if this is a returning customer.
    const price = req.body.price
    const customer = await stripe.customers.create();
    // console.log(customer.id);
    const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: '2022-11-15' }
    );
    const paymentIntent = await stripe.paymentIntents.create({
        amount: price*100,
        currency: 'thb',
        customer: customer.id,
        automatic_payment_methods: {
            enabled: true,
        },
    });

    res.json({
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
        publishableKey: 'pk_test_51MRWDYL9mFxnSBD4okDalpRO8YO9BQovF44Jdm2qYrdh30nwKXo9A8oX1zFh7O3075cCZdih0bOo0fy5HNkIvdUp00VZ18p3ku'
    });
});


app.get('/', async (req, res) => {
    res.send("garbage App");
});

mongoose
    .connect(`mongodb+srv://sekkarin:${process.env.PASSWORDMONGODB}@cluster0.o8efvyv.mongodb.net/garbage?retryWrites=true&w=majority`)
    .then(result => {
        bcrypt.hash("123456789", 12)
            .then(hashPw => {
                User.find({status: "Admin" })
                    .then(user => {
                        if (!user.length) {
                            const user = new User({
                                email: "Admin@Admin.com",
                                password: hashPw,
                                f_name: "AdminMyGarbage",
                                l_name: "Grabage",
                                house_on: "null",
                                village: "null",
                                sub_district: "null",
                                district: "null",
                                postal_code: "null",
                                imageUrl: "null",
                                province: "null",
                                status: "Admin",
                            })
                            console.log("crete admin", user);
                            return user.save()
                        }

                    })
            })



    }).then(result => {
        app.listen(8080);
    })
    .catch(err => console.log(err));
