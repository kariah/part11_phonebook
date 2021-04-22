const express = require('express') 
var morgan = require('morgan')

const app = express()
app.use(express.json()) 


const cors = require('cors')
app.use(cors())

morgan.token('body-data', function getPostData(req) { 
    return (JSON.stringify(req.body))
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body-data'))

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
] 

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}

//POST http://localhost:3001/api/persons
app.post('/api/persons', (request, response) => { 

    const body = request.body

    console.log("body ", body)

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }
    else {
        let isPersonFound = (persons.find(person => person.name === body.name))

        if (isPersonFound) {
            return response.status(409).json({
                error: (`Name must be unique`)
            })
        }
    }
     
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    } 

    persons = persons.concat(person)

    response.json(person)
})

//GET http://localhost:3001/api/persons
app.get('/api/persons', (req, res) => {  
    res.json(persons)
})

//GET http://localhost:3001/api/persons/1
app.get('/api/persons/:id', (request, response) => {  
    const id = Number(request.params.id)  
    const person = persons.find(person => person.id === id) 

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    } 
})

//DELETE http://localhost:3001/api/persons/1
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    console.log(persons)

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



const PORT = 3001;

// run the server
app.listen(PORT, () => {
    console.log(`Puhelinluettelo-server app listening on port ${PORT}!`);
});
