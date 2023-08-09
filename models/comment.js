const mongoose = require("mongoose");

const {Schema} = mongoose;


const commentSchema = new Schema({
    author: {type: mongoose.SchemaTypes.ObjectId, ref: "User"},
    blog: {type: mongoose.SchemaTypes.ObjectId, ref: "Blog"},
    content: {type: String, require: true},
}, {
    timestamps: true
})


module.exports = mongoose.model("Comment", commentSchema, "comments");