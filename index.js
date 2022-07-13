express = require('express')
var morgan = require('morgan')
const cors = require('cors')

app = express()

const Person = require('./models/person')


morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})

// MIDDLEWARES

const errorHandler = (error, request, response, next) => {  
    if (error.name === 'CastError') {
        response.status(400).send({ error: 'malformatted id' })
    }

    if (error.name === 'ValidationError') {
        response.status(400).send({
            error: `Person validation failed: ${error.message}
        `})
    }
        
    next(error)
  }

app.use(express.static('build'))
app.use(express.json())


app.use(morgan('tiny'))
app.use(morgan(':url :method :body'))

app.use(cors())


app.get('/api/persons', morgan('tiny'), (req, res) => {
    
    Person.find({}).then(result => {
        res.send(result)
    })
    
})


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

app.delete('/api/persons/:id', (req, res, next) => {


    Person.findByIdAndRemove(req.params.id)
    .then (result => {
        res.status(204).end()
    })
    .catch(error => next(error))

    
})

app.post('/api/persons/', morgan('body'), (req, res, next) => {
    const contact = req.body

    if (!contact.name || !contact.number) {
        res.status(400).json({
            error: 'content missing'
        })
    } else {

        const newContact = new Person ({
            name: contact.name,
            number: contact.number
        })

        newContact.save().then(result => {
            console.log('Saved contact in the db.')

            res.send(result)
        }).catch(error => next(error))
        
    }
})


app.put('/api/persons/:id', (req, res, next) => {

    const contact = req.body

    if (contact.name === undefined || contact.number === undefined) {
        res.status(400).end()
    } else {

        const person = {
            name: contact.name,
            number: contact.number
        }

        Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
          res.json(updatedPerson)
        })
        .catch(error => next(error))
    }
})




app.get('/info', (req, res) => {
    res.send (
        `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
        `
    )
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})

app.use(errorHandler)