const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../model/listing.js");
const Mongo_url="mongodb://127.0.0.1:27017/wonderNest"

main().then((res)=>{
    console.log("Database Connected...");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(Mongo_url);
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({
        ...obj,
        owner:"6821c44a268aeca3ea75682c"
    }));
    await Listing.insertMany(initData.data);
    console.log("data initialzation successfull...");
};

initDB();