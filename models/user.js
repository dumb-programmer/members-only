const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true }
});

UserSchema.virtual("full_name").get(() => `${this.firstName} ${this.lastName}`);

module.exports = mongoose.model("User", UserSchema);