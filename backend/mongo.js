const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('not enough arguments')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://leechy2015:${password}@cluster0.uhk0f43.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Entry = mongoose.model('Entry',phonebookSchema)

if (process.argv.length===3){

    Entry.find().then(result => {
        console.log("phonebook:")
        result.forEach(element => {
            console.log(`${element.name} ${element.number}`)
        });
        mongoose.connection.close()
    })

} else {

    const newName = process.argv[3]
    const newNumber = process.argv[4]

    const entry = new Entry({
        name: newName,
        number: newNumber
    })

    entry.save().then(result => {
        console.log(`added ${newName} number ${newNumber} to phonebook`)
        mongoose.connection.close()
    })

}