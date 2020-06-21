const mongoose = require('mongoose')

const arg = process.argv
const clog = (str) => {
  console.log(str)
  process.exit(1)
}

if (arg.length < 3) clog('Provide password: node mongo.js <password here>')

const url = `mongodb+srv://fullstack:${arg[2]}@cluster0-jalrk.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

const contact = new Contact({
  name: arg[3],
  number: arg[4],
})

if (arg.length === 3) {
  Contact.find({}).then((res) => {
    console.log('Phonebook:')
    res.forEach((returnedContact) => console.log(`${returnedContact.name} ${returnedContact.number}`))

    mongoose.connection.close()
  })
} else if (arg.length === 5) {
  contact.save().then((res) => {
    console.log(`Added ${res.name} number ${res.number} to Phonebook`)

    mongoose.connection.close()
  })
} else clog('Missing argument: name or number!')
