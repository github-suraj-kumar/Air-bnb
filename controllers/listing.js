const Listing = require('../models/listing.js')

module.exports.index = async (req,res)=>{
    const allListings =  await Listing.find({});
    res.render("listings/index.ejs",{allListings})
 }

 module.exports.newForm = (req,res)=>{
    res.render("listings/new.ejs")
}

module.exports.showListing = async (req,res)=>{
    const {id} = req.params;
   const listing =  await Listing.findById(id)
   .populate(
       {path:"review",populate:({path:"author"})})
   .populate("owner");
   if(!listing){
       req.flash("error","Listing you requested not exist")
       res.redirect("/listings")
       
   }
   console.log(listing)
    res.render("listings/show.ejs",{listing})
}

module.exports.newListing = async(req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newLsiting = new Listing(req.body.listing)
    newLsiting.image = {url,filename}
    newLsiting.owner = req.user._id;

    await newLsiting.save();
   req.flash("success","New listing added")
    res.redirect("/listings")
}

module.exports.editListing = async(req,res)=>{
    let {id} = req.params;
    const listing =  await Listing.findById(id);
    if(!listing){
       req.flash("error","Listing you requested not exist")
       res.redirect("/listings")
   }
//    let originalListing  = listing.image.url;
//   originalListing = originalListing.replace("/upload","/upload/w_250")
    res.render("listings/edit.ejs",{listing})
}

module.exports.updateLisitng = async(req,res)=>{
    let {id} = req.params
    const listing =await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename}
        await listing.save();
    }
    req.flash("success","Listing updated successfully")
    res.redirect(`/listings/${id}`)
     
 }

module.exports.deleteLisitng = async(req,res)=>{
    let {id} = req.params;
   await Listing.findByIdAndDelete(id)
   res.redirect("/listings")
}