require('dotenv').config()
const express = require('express')
var morgan = require('morgan') 


const app = express()
app.use(express.json())
app.use(express.static('build'))

const cors = require('cors')
app.use(cors())

morgan.token('body-data', function getPostData(req) {
    return (JSON.stringify(req.body))
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body-data'))


const Person = require('./models/person')


app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(persons => {
            res.json(persons)
        })
})


//GET http://localhost:3001/api/persons/1
app.get('/api/persons/:id', (request, response) => { 
    Person.findById(request.params.id).then(person => { 
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
})

//DELETE http://localhost:3001/api/persons/1
app.delete('/api/persons/:id', (request, response) => { 
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

//GET http://localhost:3001/info
app.get('/info', (req, res) => {
    let currentDateTime = new Date();
    let html = `<div>
                    <p>Phonebook has info for ${persons.length} people </p>
                    <p>${currentDateTime}</p>
                </div>`
    res.send(html)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})