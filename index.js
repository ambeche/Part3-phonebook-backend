require('dotenv').config()
const express = require('express')

const app = express()
const cors = require('cors')
const morgan = require('morgan')
const Contact = require('./models/contact')

morgan.token('data', (req) => (req.method === 'POST' || req.method === 'PUT'
  ? JSON.stringify(req.body)
  : null))

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data'),
)

app.get('/info', (req, res) => {
  Contact.where({})
    .countDocuments()
    .then((count) => res.send(
      `<p>Phonebook has info for ${count} people</p> 
    <p>${new Date()}</p>`,
    ))
})

app.get('/api/persons', (req, res) => {
  Contact.find({}).then((contacts) => res.json(contacts.map((contact) => contact.toJSON())))
})

app.get('/api/persons/:id', (req, res, next) => {
  Contact.findById(req.params.id)
    .then((contact) => {
      if (contact) {
        res.json(contact.toJSON())
      }
      res.status(404).end()
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Contact.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const data = req.body

  const contact = {
    name: data.name,
    number: data.number,
  }

  Contact.findByIdAndUpdate(req.params.id, contact, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    // eslint-disable-next-line max-len
    .then((updatedContact) => (updatedContact ? res.json(updatedContact.toJSON()) : res.status(404).end()))
    .catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const data = req.body

  const contact = new Contact({
    name: data.name,
    number: data.number,
  })

  contact
    .save()
    .then((savedContact) => res.json(savedContact.toJSON()))
    .catch((error) => next(error))
})

const unrecognisedEnpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  console.error(`error: ${error.name}\t${error.message}`)
  const err = res.status(400)
  if (error.name === 'CastError') return err.send({ error: 'wrongly formatted id' })
  if (error.name === 'ValidationError') return err.json({ error: error.message })

  return next(error)
}

app.use(unrecognisedEnpoint)
app.use(errorHandler)

const { PORT } = process.env
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
