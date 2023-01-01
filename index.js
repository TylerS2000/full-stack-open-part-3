const express = require('express')
const morgan = require('morgan')
const cors= require('cors')
const app = express()
const Number = require('./models/number')


app.use(express.json())
app.use(morgan('tiny',{skip:function(req,res){return res.statusCode>201}}))
app.use(cors())
app.use(express.static('build'))



app.get('/info',(req,res)=>{
    res.send(`Phonebook has info for ${numbers.length} people (request made at ${new Date})`)
    
})

app.get('/api/numbers',(req,res)=>{
    Number.find({}).then(number => {
    res.json(number)
  })
})

app.get('/api/numbers/:id',(req,res)=>{
  const id = Number(req.params.id)
  const number = numbers.find(contact=>contact.id===id)
  console.log(number)
  res.json(number)
})

app.delete('/api/numbers/:id',(req,res)=>{
  Number.findByIdAndDelete(req.params.id)
 .then(result=>{
  res.status(204).end
 })
})


app.post('/api/numbers', (req,res)=>{
  const body = req.body

  if(body.name)
  if(!body.name||!body.number){
    return res.status(400).json({error:"name or number is missing"})
  }

  const number = new Number({
    name : body.name,
    number:body.number,
    id: JSON.stringify(Math.random(1000))
  })

  number.save().then(savedNumber => {
  res.json(savedNumber)
})
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})