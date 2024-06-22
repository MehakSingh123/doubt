const mongoose=require("mongoose");
const intialdata=require("./data.js");
const Listing=require("../models/listing.js");
const Mongo_Url="mongodb://127.0.0.1:27017/wanderlust";
main()
.then(()=>{
    console.log("listening to db");

})
.catch((err)=>{
    console.log(err);
});
async function main(){
   await mongoose.connect(Mongo_Url);
};
const initDB=async()=>{
    await Listing.deleteMany({});
    intialdata.data=intialdata.data.map((obj)=>({...obj,owner:"666ec8b2b066295e25918264"}));
    await Listing.insertMany(intialdata.data);
    console.log("Data was intialized");


};
initDB();