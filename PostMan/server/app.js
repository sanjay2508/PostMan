const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const postRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();

app.use(cors({ origin: true, credentials: true }));

mongoose.connect("mongodb+srv://SanjayGangwar:Xperia@7@postbook-yled4.mongodb.net/test?w=majority", { useNewUrlParser: true })
    .then(() => {
        console.log('connected to Database');
    })
    .catch(() => {
        console.log('Error');
    })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); //Not used currently but can be used if required

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    next();
});

app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

module.exports = app;