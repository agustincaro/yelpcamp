const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync');
const { campgroundSchema } = require('./schemas.js');
const mongoose = require('mongoose');
const Campground = require('./models/campground')
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');



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
app.engine('ejs',ejsMate);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


//Error middleware
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get('/', (req,res)=> {
    res.render('home');
})

// All campgrounds route
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));


//create route
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))


//show route
app.get('/campgrounds/:id', catchAsync(async (req, res,) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', { campground });
}));

//edit route
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
}));

//delete route
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));


//for EVERY request
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found'),404)
})
//custom error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

//run express sv
app.listen(process.env.PORT,() => {
    console.log(`Serving on port ${process.env.PORT}`)
})