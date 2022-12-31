const mongoose = require ('mongoose');

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
  }
     
  const url = process.env.MONGODB_URI

  const numberSchema = new mongoose.Schema({
    id: String, 
    name: String,
    number: String,
  })
  
  const Number = mongoose.model('Number', numberSchema)
  
  mongoose
    .connect(url)
    .then((result) => {
      console.log('connected')
  
      const number = new Number({
        id: process.argv[3],
        name: process.argv[4],
        number: process.argv[5],
      })
  
      return number.save()
    })
    .then(() => {
      console.log('number saved!')
      Number.find({}).then(result => {
        result.forEach(note => {
          console.log(note)
        })
        mongoose.connection.close()
      })
    })
    .catch((err) => console.log(err))