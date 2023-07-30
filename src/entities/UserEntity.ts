import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    faceId: {
        type: String,
        required: true,
    },

    userName: {
        type: String,
        required: true,
        index: -1
    },

    photoUrl: {
        type: String,
        required: false,
    },

    locale: {
        type: String,
        required: false,
    },

    sessionId: {
        type: String,
        required: false,
    },
},
{ timestamps: true }
)

UserSchema.index({faceId: 1})
export const UserModel = mongoose.model('User', UserSchema);
