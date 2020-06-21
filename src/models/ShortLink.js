import mongoose from "mongoose";
const shortLinkSchema = new mongoose.Schema(
    {
        title: String,
        original_url: {
            type: String,
            required: true,
        },
        short_url: String,
        clicks: {
            type: Number,
            default: 0,
        },
        user_id: String,
    },
    {
        timestamps: true, // createdAt, updatedAt automatically added!
    }
);

export default mongoose.model("ShortLink", shortLinkSchema);
