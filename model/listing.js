const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,

    },
    images:{
        type:String,
        // default:"https://plus.unsplash.com/premium_photo-1676321688630-9558e7d2be10?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set:(v)=>v===""?"https://plus.unsplash.com/premium_photo-1676321688630-9558e7d2be10?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v
    },
    price:{
        type:Number,
        default:1000
    },
    location:{
        type:String,
    },
    country:{
        type:String
    }
})

const listing=mongoose.model("listing",listingSchema);

module.exports=listing;