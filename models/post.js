const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: { type: String, require: true },
    text: { type: String, require: true },
    author: { type: mongoose.SchemaTypes.ObjectId, ref: "User", require: true }
}, { timestamps: true });

PostSchema.virtual("createdAtRelative").get(function () {
    // Reference: https://blog.webdevsimplified.com/2020-07/relative-time-format/

    const formatter = new Intl.RelativeTimeFormat("en", {
        numeric: "auto",
    })

    const DIVISIONS = [
        { amount: 60, name: "seconds" },
        { amount: 60, name: "minutes" },
        { amount: 24, name: "hours" },
        { amount: 7, name: "days" },
        { amount: 4.34524, name: "weeks" },
        { amount: 12, name: "months" },
        { amount: Number.POSITIVE_INFINITY, name: "years" },
    ]

    let duration = (this.createdAt - new Date()) / 1000

    for (let i = 0; i < DIVISIONS.length; i++) {
        const division = DIVISIONS[i]
        if (Math.abs(duration) < division.amount) {
            return formatter.format(Math.round(duration), division.name)
        }
        duration /= division.amount
    }
})

module.exports = mongoose.model("Post", PostSchema);