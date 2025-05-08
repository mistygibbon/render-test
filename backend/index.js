require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Entry = require('./models/entry')
const app = express()

morgan.token('content', (request, response)=>{
    const string = JSON.stringify(request.body)
    if (request.method==="POST"){
        return string ? string : ''
    }
    return ''
})

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

let entries = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// app.get('/', (request, response) => {
//   response.send('<h1>Hello World!</h1>')
// })

app.get('/api/persons', (request, response) => {
    Entry.find({}).then(entries => {
        response.json(entries)
    })
})

app.get('/info',(request,response)=>{
    response.send(`Phonebook has info for ${entries.length} people <br\> ${new Date(Date.now()).toString()}`)
})

app.get('/api/persons/:id',(request,response,next)=> {
    Entry.findById(request.params.id).then(entry=>{
        if (entry){
            response.json(entry)
        } else {
            response.status(404).end()
        }
    }).catch(error=>next(error))
})

app.delete('/api/persons/:id',(request,response)=>{
    const id = request.params.id
    Entry.deleteOne({_id: id}).then(()=>{
        response.status(204).end()
    })
})

const generateId = () => {
    const maxId = entries.length>0 ? Math.max(...entries.map(entry=>Number(entry.id))) : 0

    return String(maxId+1)
}

app.post('/api/persons',(request,response,next)=>{
    const body = request.body
    // console.log(body)

    if (!body.name) {
        return response.status(400).json({error: 'name missing'})
    }

    if (!body.number) {
        return response.status(400).json({error: 'number missing'})
    }

    if (entries.some(entry=>entry.name===body.name)){
        return response.status(400).json({error: 'duplicate name'})
    }

    const entry = new Entry({
        "name": body.name,
        "number": body.number,
    })
    entry.save().then(savedEntry=>{
        response.json(savedEntry)
    }).catch(error=>next(error))
})

app.put('/api/persons/:id',(request, response)=>{
    const id = request.params.id
    Entry.findById(id).then(entry=>{
        entry.number = request.body.number
        entry.save().then(savedEntry=>{
            response.status(204).end()
        })
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  // handler of requests with unknown endpoint
  app.use(unknownEndpoint)

const errorHandler = (error,request,response,next) => {
    console.error(error.message)

    if  (error.name === 'CastError'){
        return response.status(400).end()
    } else if (error.name === 'ValidationError'){
        return response.status(400).json({error: error.message})
    }
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})