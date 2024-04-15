// import mongoose from'mongoose';
const mongoose = require('mongoose');

// connect mongoose
mongoose.connect('mongodb://localhost:27017/test');

// create a schema
const db = mongoose.connection;

// handle connection error
db.on('error', console.error.bind(console, 'connection error:'));

// create a schema
const studentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    hobbies: Array,
    current: {
        type: Boolean,
        default: false,
        required: true
    }
});

// create a model
const Student = mongoose.model('Student', studentSchema);

// create a document
const fatima = new Student({
    name: 'Fatima',
    age: 20,
    hobbies: ['Music', 'Movies', 'Sports'],
    current: true
});

// save the document
fatima.save()
    .then(() => console.log('Fatima saved to the database'))
    .catch(() => console.error('Error saving Fatima to the database'))
    .finally(() => mongoose.disconnect());

// create a document
let wei = new Student({
    name: 'Wei',
    age: 22,
    hobbies: ['Music', 'Movies', 'Sports'],
    current: true
});

// save the document
wei.save()
    .then(() => console.log('Wei saved to the database'))
    .catch(() => console.error('Error saving Wei to the database'))
    .finally(() => mongoose.disconnect());