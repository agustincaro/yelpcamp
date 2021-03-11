const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const Campground = require('./models/campground')
const methodOverride = require('method-override');



//body parser
app.use(express.urlencoded({extended:true}));
//method overriding
app.use(methodOverride('_method'));

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

//view engine and path adding config
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req,res)=> {
    res.render('home');
})

// All campgrounds route
app.get('/campgrounds', async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds:campgrounds})
});


//create route
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', async(req, res) => {
    
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
})


//show route
app.get('/campgrounds/:id', async (req,res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', {campground : campground})
});

//edit route
app.get('/campgrounds/:id/edit', async(req,res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit',  { campground});
})

app.put('/campgrounds/:id', async(req,res) => {
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id, {... req.body.campground}) //spreading whats in req.body
    res.redirect(`/campgrounds/${campground._id}`)
    
})

//delete route
app.delete('/campgrounds/:id', async(req,res) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

//run express sv
app.listen(process.env.PORT,() => {
    console.log(`Serving on port ${process.env.PORT}`)
})