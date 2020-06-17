require('dotenv').config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Contact = require('./models/contact')



morgan.token("data", (req, res) => {
  return req.method === "POST" || req.method === "PUT"
    ? JSON.stringify(req.body)
    : null;
});

app.use(express.static("build"));
app.use(express.json());
app.use(cors());

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p> 
    <p>${new Date()}</p>`
  );
});

app.get("/api/persons", (req, res) => {
  Contact.find({})
  .then( contacts => res.json(contacts) )
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  person ? res.json(person) : res.status(400).json({ "unknown id": id });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);
  console.log("deleted person", id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const data = req.body;

  if (!data.name) {
    return res.status(400).json({ error: "missing name" });
  } else if (!data.number) {
    console.log("missing number");
    return res.status(400).json({ error: "missing number" });
  }

  const contact = new Contact({
    name: data.name,
    number: data.number,
  }) 

  contact.save().then( savedContact => {
    console.log('saved contact', savedContact);
    res.json(savedContact)
  })

});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
