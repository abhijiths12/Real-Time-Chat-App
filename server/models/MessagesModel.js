import mongoose from "mongoose";
import User from "./UserModel.js";  // This import is not necessary unless you need the model for other purposes, as Mongoose will automatically look for the collection name in plural form.

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",  // Corrected here to match the model name
        required: false,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",  // Corrected here to match the model name
        required: false,
    },
    messageType: {
        type: String,
        enum: ["text", "file"],
        required: true,
    },
    content: {
        type: String,
        required: function () {
            return this.messageType === "text";
        },
    },
    fileUrl: {
        type: String,
        required: function () {
            return this.messageType === "file";
        },
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const Message = mongoose.model("Messages", messageSchema);

export default Message;
