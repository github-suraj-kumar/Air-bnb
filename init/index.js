const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

const mongo = "mongodb+srv://surajkumar:surajkumar@cluster0.lww2s4j.mongodb.net/hotel-project?retryWrites=true&w=majority"
mongoose.connect(mongo).then(()=>{
    console.log("Db is connected")
}).catch((err)=>{
    console.log(err)
})

const initdata = async ()=>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=>({...obj, owner:"65e350cd92cbce8660b764a4",}));
    await Listing.insertMany(initData.data);
    console.log("data was initilized");
}

initdata();
