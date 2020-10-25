import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Person from './components/Person'
import Notification from './components/Notification'
import Error from './components/Error'

const App = () => {
	// declare state
	const [ persons, setPersons ] = useState([]) 
	const [ newName, setNewName ] = useState('')
	const [ newNumber, setNewNumber ] = useState('')
	const [ filterValue, setFilterValue ] = useState('')
	const [ notificationMessage, setNotificationMessage] = useState(null)
	const [ errorMessage, setErrorMessage] = useState(null)

	// fetch data from server
	useEffect(() => {
		personService
			.getAll()
			.then(returnedPersons => setPersons(returnedPersons))
	}, [])

	// form state event handlers
	const handleNewNameChange = event => setNewName(event.target.value)
	const handleNewNumberChange = event => setNewNumber(event.target.value)
	const handleFilterValueChange = event => setFilterValue(event.target.value)

	// create entry
	const addPerson = event => {
		event.preventDefault()

		const personToAdd = { 
			name: newName,
			number: newNumber
		}

		for (const person of persons) {
			if (person.name.toLowerCase() === newName.toLowerCase()) {
				if (window.confirm(`${newName} has already been added to the phonebook, replace the older number with a new one?`))
					personService
						.update(person.id, personToAdd)
						.then(returnedPerson => {
							setPersons(persons.map(
								person => person.id === returnedPerson.id ? returnedPerson : person
							))
							setNotificationMessage(`Updated ${returnedPerson.name}`)
						})
						.catch(error => {
							setErrorMessage(`Information of ${person.name} has already been removed from server`)
							setPersons(persons.filter(p => p.id !== person.id))
							setTimeout(() => setErrorMessage(null), 5000)
						})
						setNewName('')
						setNewNumber('')
						setTimeout(() => setNotificationMessage(null), 5000)
				return
			}
		}

		personService
			.create(personToAdd)
			.then(returnedPerson => {
				setPersons(persons.concat(returnedPerson))
				setNotificationMessage(`Added ${returnedPerson.name}`)
				setNewName('')
				setNewNumber('')
				setTimeout(() => setNotificationMessage(null), 5000)
			})
	}

	// delete entry
	const deletePerson = personToDelete => {
		if (window.confirm(`Delete ${personToDelete.name} ?`))
			personService
				.remove(personToDelete.id)
				.then(setPersons(persons.filter(person => person.id !== personToDelete.id)))
	}

	// filter persons to show
	const personsToShow = persons.filter(person => 
		person.name.toLowerCase().includes(filterValue.toLowerCase())
	)

	// render
	return (
		<div className="App">
			<div>
				<h2>Phonebook</h2>
				<Notification message={notificationMessage} />
				<Error message={errorMessage} />
				<Filter 
					filterValue={filterValue}
					handleFilterValueChange={handleFilterValueChange}
				/>
				<h2>Add a new</h2>
				<PersonForm 
					addPerson={addPerson}
					newName={newName}
					handleNewNameChange={handleNewNameChange}
					newNumber={newNumber}
					handleNewNumberChange={handleNewNumberChange} 
				/>
				<h2>Numbers</h2>
				<ul>
					{personsToShow.map(person => 
						<Person key={person.id} person={person} deletePerson={deletePerson} />
					)}
				</ul>
			</div>
		</div>
	)
}

export default App