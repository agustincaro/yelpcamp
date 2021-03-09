const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req,res)=> {
    res.render('home');
})

app.listen(process.env.PORT,() => {
    console.log(`Serving on port ${process.env.PORT}`)
})