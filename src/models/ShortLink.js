import mongoose from "mongoose";
const shortLinkSchema = new mongoose.Schema(
    {
        original_url: {
            type: String,
            required: true,
        },
        short_url: String,
    },
    {
        timestamps: true, // createdAt, updatedAt automatically added!
    }
);

export default mongoose.model("ShortLink", shortLinkSchema);
