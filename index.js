const express = require("express");
const app = express();
const cors = require("cors");

// create the body token
const morgan = require("morgan");
const { response } = require("express");
morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(cors());
app.use(express.json());
app.use(express.static("build"));
app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens.body(req, res),
    ].join(" ");
  })
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${
      persons.length
    } people</p>\n <p>${new Date()}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id == id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id != id);

  response.status(204).end();
});

app.put("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const newNumber = request.body.number;
  for (i = 0; i < persons.length; i++) {
    if (persons[i].id == id) {
      persons[i].number = newNumber;
    }
  }

  response.json(request.body);
});

app.post("/api/persons", (request, response) => {
  const newPerson = request.body;
  // Check if the name is empty
  if (!newPerson.name) {
    response.status(400).json({
      error: "the person must have a name",
    });
  } else if (!newPerson.number) {
    // Check if the number is empty
    response.status(400).json({
      error: "the person must have a number",
    });
  } else if (
    persons.some((person) => {
      return person.name == newPerson.name;
    })
  ) {
    // The name already exists
    response.status(400).json({
      error: "name must be unique",
    });
  } else {
    const newId = Math.floor(Math.random() * 10000000);
    newPerson.id = newId;
    persons = persons.concat([newPerson]);
    response.json(persons);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
