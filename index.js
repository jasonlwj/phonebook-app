const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

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
	res.json(persons)
})

// GET by ID
app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	const person = persons.find(person => person.id === id)

	if (person)
		res.json(person)
	else
		res.status(404).end()
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
	
	if (persons.map(person => person.name).includes(body.name))
		return res.status(400).json({
			error: 'name must be unique'
		})

	const person = {
		name: body.name,
		number: body.number,
		id: Math.floor(Math.random() * 1000)
	}

	persons = persons.concat(person)

	res.json(person)
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

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server now running on port ${PORT}`)
})
