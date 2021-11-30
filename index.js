/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
require('dotenv').config()
const express = require('express')
var morgan = require('morgan')


const app = express()
app.use(express.static('build'))
app.use(express.json())

const cors = require('cors')
app.use(cors())

morgan.token('body-data', function getPostData(req) {
  return (JSON.stringify(req.body))
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body-data'))


const errorHandler = (error, _request, response, next) => {
  console.log(error.name)
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send(
      {
        error: 'malformatted id'
      }
    )
  } else
  if (error.name === 'ValidationError') {
    return response.status(400).json(
      {
        error: error.message
      }
    )
  }

  next(error)
}


const requestLogger = (request, _response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)

const Person = require('./models/person')


app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  let personFound = false

  //Teht�v� 3.20
  //N�ytet��n frontissa fronttiin  error.response.data.error
  //persons.js tiedostossa  .error(error => error.response.data)

  Person
    .findOne({ name: body.name })
    .then(person => {

      //Tested uniqueness
      //addPerson(request, response, next)

      if (person !== null) {
        personFound = true
      }

      if (!personFound) {
        addPerson(request, response, next)
      }
      else {
        updatePerson(request, response, next, person.id)
      }
    })
    .catch(error => next(error))
})



app.put('/api/persons/:id', (request, response, next) => {
  updatePerson(request, response, next, request.params.id)
})

function updatePerson(request, response, next, id) {
  console.log('Update person ', id)
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  console.log(id)

  Person.findByIdAndUpdate(id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
}


function addPerson(request, response, next) {
  console.log('Add person')

  const person = new Person({
    name: request.body.name,
    number: request.body.number
  })

  person.save()

  //.then(savedPerson => {
  //    response.json(savedPerson)
  //})

    .then(savedPerson => savedPerson.toJSON())
    .then(savedAndFormattedPerson => {
      response.json(savedAndFormattedPerson)
    })

    .catch(error => next(error))

}

app.get('/api/persons', (_request, response, next) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))

})


//GET http://localhost:3001/api/persons/1
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

//DELETE http://localhost:3001/api/persons/1
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(_result => {
      response.status(204).end()
    })
    .catch(error =>
      next(error)
    )
})

//GET http://localhost:3001/info
app.get('/info', (_request, response, next) => {
  let currentDateTime = new Date()
  Person
    .find({})
    .then(persons => {
      //response.json(persons)
      let html = `<div>
                    <p>Phonebook has info for ${persons.length} people </p>
                    <p>${currentDateTime}</p>
                </div>`
      response.send(html)
    })
    .catch(error => next(error))
})


//health test 23.10.2021
app.get('/health', (req, res) => {
  res.send('ok')
})

//version 23.10.2021
app.get('/version', (req, res) => {
  res.send('1.1') // change this string to ensure a new version deployed
})

//test

const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// olemattomien osoitteiden k�sittely
app.use(unknownEndpoint)

// t�m� tulee kaikkien muiden middlewarejen rekister�innin j�lkeen!
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

