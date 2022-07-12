express = require('express')
var morgan = require('morgan')
const cors = require('cors')

app = express()


morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(express.json())

app.use(morgan('tiny'))
app.use(morgan(':url :method :body'))

app.use(cors())
app.use(express.static('build'))

var persons = [
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



app.get('/api/persons', morgan('tiny'), (req, res) => {
    res.send(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    
    const filteredPersons = persons.filter(person => person.id === id)

    if (filteredPersons.length == 0) {
        res.status(404).end()
    } else {
        res.send(filteredPersons)
    }

})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const newPersons = persons.filter(person => person.id !== id)

    persons = newPersons

    res.status(200).end()
})

app.post('/api/persons/', morgan('body'), (req, res) => {
    const contact = req.body

    if (!contact.name || !contact.number) {
        res.status(400).end()
    } else if (persons.filter(person => person.name === contact.name).length > 0) {
        res.status(400).send({
            error: 'name must be unique'
        })
    }
     else {

        const newContact = {
            name: contact.name,
            number: contact.number,
            id: Math.floor(Math.random() * 9999)
        }

        persons = persons.concat(newContact)
        res.send(newContact)
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