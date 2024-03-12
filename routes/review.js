const   express = require('express');
const router = express.Router({mergeParams:true});
const Listing = require('../models/listing')
const wrapAsync = require("../utils/wrapAsync")
const ExpressError = require("../utils/expressError")
const {reviewSchema} = require("../schema.js")
const Review = require("../models/review.js");
const {isauthenticated,isauthor} = require("../middleware.js")
const reviwControllers = require("../controllers/review.js") 
          

const validateReview = (req,res,next)=>{
    let {error} =  reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((e)=>el.message).join(",");
        throw new ExpressError(400,result.error)
    }else{
        next();
    }
}

// review route
router.post("/",validateReview,wrapAsync(reviwControllers.newReview ))

// dele    te review
router.delete("/:reviewId",isauthenticated,wrapAsync(reviwControllers.destroyReview))    

module.exports = router;                                                                                             