import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    name: {type: String,required: true},
    image: {type: String,required: true}
    
})

const restaurantModel = mongoose.model.restaurant || mongoose.model("restaurant",restaurantSchema);

export default restaurantModel;