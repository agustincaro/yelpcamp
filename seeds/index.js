
const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')
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


const sample = (array) => {
    num = Math.floor(Math.random() * array.length)
    return array[num];
}

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i<50;i++) {
        const random1000 = Math.floor(Math.random()*1000)

        const camp = new Campground( {
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
            
        })
        console.log(camp.title)
        await camp.save();
    }
    
}

seedDB().then(()=> {
    mongoose.connection.close();
})