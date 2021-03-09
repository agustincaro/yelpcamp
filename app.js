const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const Campground = require('./models/campground')

//db connection
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser : true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

//db error checking
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req,res)=> {
    res.render('home');
})

app.listen(process.env.PORT,() => {
    console.log(`Serving on port ${process.env.PORT}`)
})