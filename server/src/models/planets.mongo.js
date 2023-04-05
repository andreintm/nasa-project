import mongoose from "mongoose";

const planetSchema = mongoose.Schema({
    keplerName: {
        type: String,
        required: true
    }
})

export default mongoose.model('Planet', planetSchema)