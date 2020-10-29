require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

/**
 * Middleware Config
 */

// Binding the JSON Parser Middleware
app.use(express.json())

// Morgan token definitions
morgan.token('body', (req, res) => JSON.stringify(req.body))

// Binding the Morgan Middleware
app.use(morgan(
	'dev',
	{ skip: (req, res) => req.method === 'POST' }
))
app.use(morgan(
	':method :url :status :response-time ms - :res[content-length] :body', 
	{ skip: (req, res) => req.method !== 'POST' }
))

// Binding the CORS Middleware
app.use(cors())

// GET requests for index.html will redirect to the frontend
app.use(express.static('build'))

/**
 * Data
 */

let persons = [
	{
		"name": "Arto Hellas",
		"number": "040-123457",
		"id": 1
	},
	{
		"name": "Ada Lovelace",
		"number": "39-44-5323523",
		"id": 2
	},
	{
		"name": "Mary Poppendieck",
		"number": "39-23-6423122",
		"id": 4
	}
]

/**
 * Routes
 */

// GET all
app.get('/api/persons', (req, res) => {
	Person
		.find({})
		.then(persons => res.json(persons))
})

// GET by ID
app.get('/api/persons/:id', (req, res) => {
	Person
		.findById(req.params.id)
		.then(person => res.json(person))

	// if (person) res.json(person)
	// else res.status(404).end()
})

// DELETE by ID
app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	persons = persons.filter(person => person.id !== id)

	res.status(204).end()
})

// POST
app.post('/api/persons', (req, res) => {
	const body = req.body

	if (!body.name || !body.number) 
		return res.status(400).json({
			error: 'name/number missing'
		})

	const person = new Person({
		name: body.name,
		number: body.number
	})

	person
		.save()
		.then(savedPerson => res.json(savedPerson))
})

// GET API information
app.get('/info', (req, res) => {
	res.send(`
		<div>Phonebook has info for ${persons.length} people</div>
		<div>${new Date()}</div>
	`)
})

/**
 * Bind to port and listen for requests
 */

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server now running on port ${PORT}`)
})
