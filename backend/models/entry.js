const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

mongoose.connect(process.env.MONGODB_URI).then(result=>{
  console.log('connected to MongoDB')
}).catch(error => {
  console.log('error connecting to MongoDB',error.message)
})

const phonebookSchema = new mongoose.Schema({
    name: {
      type: String,
      minLength: 3,
      required: true,
    },
    number: {
      type: String,
      validate: {
        validator: (number)=>{
          return number.length>=8 && /^\d{2,3}-\d+$/.test(number)
        }
      }
    },
})

phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Entry',phonebookSchema)

// if (process.argv.length===3){

//     Entry.find().then(result => {
//         console.log("phonebook:")
//         result.forEach(element => {
//             console.log(`${element.name} ${element.number}`)
//         });
//         mongoose.connection.close()
//     })

// } else {

//     const newName = process.argv[3]
//     const newNumber = process.argv[4]

//     const entry = new Entry({
//         name: newName,
//         number: newNumber
//     })

//     entry.save().then(result => {
//         console.log(`added ${newName} number ${newNumber} to phonebook`)
//         mongoose.connection.close()
//     })

// }