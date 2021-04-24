////const mongoose = require('mongoose')

////if (process.argv.length < 3) {
////    console.log('give password as argument')
////    process.exit(1)
////}

////const password = process.argv[2]
////const name = process.argv[3]
////const number = process.argv[4]
////const id = process.argv[5]
 
////const url = `mongodb+srv://fullstack:${password}@cluster0.hjz9y.mongodb.net/phonebook?retryWrites=true'`

////mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

////const personSchema = new mongoose.Schema({
////    name: String,
////    number: String,
////    id: Number,
////})

////const Person = mongoose.model('Person', personSchema, 'persons') 

////const person = new Person({
////    name: name,
////    number: number,
////    id: id
////})


////if (process.argv[3] === undefined && process.argv[4] === undefined) {  
////    Person.find({ "id": 1 }).then(result => {
     
////    Person
////        .find({})
////        .then(result => {

////            console.log(result)

////            result.forEach(person => {
////                console.log(person)
////            })
             

////            mongoose.connection.close()
////        })

////}
////else { 
////    node mongo.js yourpassword Anna 040 - 1234556
////    person
////        .save()
////        .then(response => {
////        console.log(`Added ${name} ${number} to phonebook`)
////        console.log(response)
////        mongoose.connection.close()
////    })
////}
