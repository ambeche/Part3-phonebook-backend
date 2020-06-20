const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true, })
  .then((res) => console.log("Connected to DB", res.connections[0].name))
  .catch((e) => console.error("error in connection", e.message));

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: '{PATH} is required',
    unique: true,
    uniqueCaseInsensitive: true,
  },
  number: {
    type: String,
    required: '{PATH} is required',
  }
});

contactSchema.plugin(uniqueValidator, {message: '{VALUE} already exitst, {PATH} must be unique'})

contactSchema.set("toJSON", {
  transform: (doc, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

module.exports = mongoose.model("Contact", contactSchema);
