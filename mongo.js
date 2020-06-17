const mongoose = require("mongoose");

const arg = process.argv;
const clog = (str) => {
  console.log(str);
  process.exit(1);
};

arg.length < 3 ? clog("Provide password: node mongo.js <password here>") : null;

const url = `mongodb+srv://fullstack:${arg[2]}@cluster0-jalrk.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model("Contact", contactSchema);

const contact = new Contact({
  name: arg[3],
  number: arg[4],
});

arg.length === 3
  ? Contact.find({}).then((res) => {
      console.log("Phonebook:");
      res.forEach((contact) =>
        console.log(`${contact.name} ${contact.number}`)
      );

      mongoose.connection.close();
    })
  : arg.length === 5
  ? contact.save().then((res) => {
      console.log(`Added ${res.name} number ${res.number} to Phonebook`);

      mongoose.connection.close();
    })
  : clog("Missing argument: name or number!");
