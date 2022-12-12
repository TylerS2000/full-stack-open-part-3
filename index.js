const express = require('express')
const morgan = require('morgan')
const cors= require('cors')
const app = express()

app.use(express.json())
app.use(morgan('tiny',{skip:function(req,res){return res.statusCode>201}}))
app.use(cors())
app.use(express.static('build'))
let numbers =[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    { 
        "id": 5,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]


app.get('/info',(req,res)=>{
    res.send(`Phonebook has info for ${numbers.length} people (request made at ${new Date})`)
    
})

app.get('/api/numbers',(req,res)=>{
    res.json(numbers);
})

app.get('/api/numbers/:id',(req,res)=>{
  const id = Number(req.params.id)
  const number = numbers.find(contact=>contact.id===id)
  console.log(number)
  res.json(number)
})

app.delete('/api/numbers/:id',(req,res)=>{
  const id= Number(req.params.id)
  numbers=numbers.filter(number=>number.id!==id)
  res.status(204).end()
})

app.post('/api/numbers', (req,res)=>{
  const number = req.body

  if(!number.name||!number.number){
    return res.status(400).json({error:"name or number is missing"})
  }
  for(let i = 0; i<numbers.length; i++){
    if(numbers[i].name===number.name){
      return res.status(400).json({error:"Name must be unique"})
    }
  }

  const contact = {
    name : number.name,
    number:number.number,
    id:Math.random(1000)
  }

numbers=numbers.concat(contact)
  res.json(numbers)
})


const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})