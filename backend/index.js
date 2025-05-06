const express = require('express')
const morgan = require('morgan')
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
  response.json(entries)
})

app.get('/info',(request,response)=>{
    response.send(`Phonebook has info for ${entries.length} people <br\> ${new Date(Date.now()).toString()}`)
})

app.get('/api/persons/:id',(request,response)=> {
    const id = request.params.id
    const entry = entries.find(entry=>entry.id===id)
    if (entry){
        response.json(entry)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id',(request,response)=>{
    const id = request.params.id
    entries = entries.filter(entry=>entry.id!==id)
    response.status(204).end()
})

const generateId = () => {
    const maxId = entries.length>0 ? Math.max(...entries.map(entry=>Number(entry.id))) : 0

    return String(maxId+1)
}

app.post('/api/persons',(request,response)=>{
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

    const entry = {
        "id": generateId(),
        "name": body.name,
        "number": body.number,
    }
    entries = entries.concat(entry)
    // console.log(entries)
    response.json(entry)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})