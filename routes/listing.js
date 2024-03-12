if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


const express = require ("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync")
const {listingSchema} = require("../schema.js")
const Listing = require('../models/listing')
const ExpressError = require("../utils/expressError.js")
const {isauthenticated} = require("../middleware.js");
const {isOwner} = require("../middleware.js")
const listingControllers = require("../controllers/listing.js")
const multer  = require('multer')
const {storage} = require('../cloudConfig.js')
const upload = multer({ storage })


 
const validateListing = (req,res,next)=>{
    let {error} =  listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((e)=>el.message).join(",");
        throw new ExpressError(400,result.error)
    }else{
        next();
    }
}

router.route("/")
.get(wrapAsync(listingControllers.index))
.post(isauthenticated,upload.single('listing[image]'),validateListing,wrapAsync(listingControllers.newListing))


router.get("/new",isauthenticated,listingControllers.newForm)

router.route("/:id")
.get(wrapAsync(listingControllers.showListing))
.put(isauthenticated,isOwner,upload.single('listing[image]'),validateListing,wrapAsync
    (listingControllers.updateLisitng))               
.delete(wrapAsync(listingControllers.deleteLisitng))
 
 router.get("/:id/edit",isauthenticated,isOwner,wrapAsync
 (listingControllers.editListing))    
 


module.exports = router;