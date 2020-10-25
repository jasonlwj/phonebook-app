import axios from 'axios'

const baseUrl = '/api/persons'

const getAll = () => {
	const req = axios.get(baseUrl)
	return req.then(res => res.data)
}

const create = newPerson => {
	const req = axios.post(baseUrl, newPerson)
	return req.then(res => res.data)
}

const remove = id => {
	const req = axios.delete(`${baseUrl}/${id}`)
	return req.then(res => res.data)
}

const update = (id, newPerson) => {
	const req = axios.put(`${baseUrl}/${id}`, newPerson)
	return req.then(res => res.data)
}

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default { getAll, create, remove, update }
