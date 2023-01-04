/* eslint-disable */
const express = require('express');
//const morgan = require('morgan');
const cors = require('cors')
const app = express()
const Number = require('./models/number')

app.use(express.json())
//app.use(morgan('tiny',{skip:function(req,res){return res.statusCode>201}}))
app.use(cors())
app.use(express.static('build'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
let counts = 0
Number.count({}, function (err, count) {

  console.log('Number of docs:', count);
  counts = count
});

app.get('/info', (req, res) => {
  res.send(`Phonebook has info for ${counts} people (request made at ${new Date})`)

})

app.get('/api/numbers', (req, res) => {

  Number.find({}).then(number => {
    res.json(number)

  })
})

app.get('/api/numbers/:id', (req, res, next) => {
  Number.findById(req.params.id)
    .then(number => { res.json(number) })
    .catch(error => next(error))
})

app.delete('/api/numbers/:id', (req, res) => {
  Number.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end
    })
    .catch(error => next(error))
})


app.post('/api/numbers', (req, res, next) => {
  const body = req.body

  if (body.name.length === 0 || body.number.length === 0) {
    res.status(400).json({ error: "name or number is missing" })
  }


  const number = new Number({
    name: body.name,
    number: body.number,
    id: JSON.stringify(Math.random(1000))
  }
  )

  number.save().then(savedNumber => {
    res.json(savedNumber)
  })
    .catch(error => next(error))
})

app.put('/api/numbers/:id', (req, res, next) => {
  const body = req.body

  const number = {
    name: body.name,
    number: body.number
  }
  Number.findByIdAndUpdate(req.params.id, number, { new: true })
    .then(updatedNumber => {
      res.json(updatedNumber)
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
app.use(errorHandler)