const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId


const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter event name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "please Enter event description"]
    },
    createdBy: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    invitees: [
        {
            invitee: {
                type:ObjectId,
                ref : 'User',
                required : [true, "please enter invitee id"]
            },
        }
    ],
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("Event", eventSchema)