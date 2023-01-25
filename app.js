const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const stripe = require('stripe')('sk_test_51MRWDYL9mFxnSBD4qTECjGr5s5ZdPRIjKEBvT9MH4OjIzra8kLBsFWTQzTy7gPAniKVIhawu3aPfacKySChewlcd000NRBJZ6w');
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth')
const invoiceRouter = require("./routes/invoice")
const dashboardRouter = require('./routes/dashboard')
const userRouter = require('./routes/user')
const orderRouter = require('./routes/order')
const app = express();
const cors = require("cors")
const User = require("./models/user")
const bcrypt = require('bcryptjs')
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

app.use('/feed', feedRoutes);
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

app.post('/payment-sheet', async (req, res) => {
    // Use an existing Customer ID if this is a returning customer.
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      {customer: customer.id},
      {apiVersion: '2022-11-15'}
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: 'eur',
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
    });
  
    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: ''
    });
  });
mongoose
    .connect(
        "mongodb://localhost:27017/garbage"
    )
    .then(result => {
        bcrypt.hash("123456789", 12)
        .then(hashPw => {
            User.find({ f_name:"SupperAdmin",status:"Admin" })
            .then(user => {
                if (!user.length) {
                    const user = new User({
                        email: "Admin@Admin.com",
                        password: hashPw,
                        f_name: "SupperAdmin",
                        l_name: "123456789",
                        house_on: "null",
                        village: "null",
                        sub_district: "null",
                        district: "null",
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
