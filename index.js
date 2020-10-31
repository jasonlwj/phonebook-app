require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')
const { update } = require('./models/person')

/**
 * Middleware Config
 */

// GET requests for index.html will redirect to the frontend
app.use(express.static('build'))

// Binding the JSON Parser Middleware
app.use(express.json())

// Binding the CORS Middleware
app.use(cors())

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

// Defining the middleware for error handling
const errorHandler = (err, req, res, next) => {
	console.error(err.message)

	if (err.name === 'CastError') {
		return res.status(400).send({ error: 'malformed id' })
	}

	next(err)
}

// Defining the middleware for unknown endpoints
const unknownEndpoint = (req, res, next) => {
	return res.status(404).send({ error: 'unknown endpoint' })
}

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
app.get('/api/persons/:id', (req, res, next) => {
	Person.findById(req.params.id)
		.then(person => {
			if (person) 
				res.json(person)
			else 
				res.status(404).end()
		})
		.catch(err => next(err))
})

// DELETE by ID
app.delete('/api/persons/:id', (req, res) => {
	Person.findByIdAndDelete(req.params.id)
		.then(result => res.status(204).end())
		.catch(err => next(err))
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

// PUT
app.put('/api/persons/:id', (req, res, next) => {
	const body = req.body

	const person = {
		name: body.name,
		number: body.number
	}

	Person.findByIdAndUpdate(req.params.id, person, { new: true })
		.then(updatedPerson => res.json(updatedPerson))
		.catch(err => next(err))
})

// GET API information
app.get('/info', (req, res) => {
	res.send(`
		<div>Phonebook has info for ${persons.length} people</div>
		<div>${new Date()}</div>
	`)
})

// Handle requests with unknown endpoint
app.use(unknownEndpoint)

// Handle requests which result in errors
app.use(errorHandler)

/**
 * Bind to port and listen for requests
 */

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server now running on port ${PORT}`)
})
