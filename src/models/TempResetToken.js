import mongoose from "mongoose";
const TempResetToken = new mongoose.Schema(
    {
        source_id: String,
        source_type: String,
        token: String,
        valid: Boolean,
    },
    {
        timestamps: true, // createdAt, updatedAt automatically added!
    }
);

export default mongoose.model("TempResetToken", TempResetToken);
