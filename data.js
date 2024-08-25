const Chance = require('chance');
const mongoose = require('mongoose');

const chance = new Chance();

const uri = 'mongodb+srv://gabrielpius0311:8VpzJeD26DCI2c3s@cluster0.vvlp0lg.mongodb.net/wee?retryWrites=true&w=majority/'; // Replace with your MongoDB Atlas connection string
const dbName = 'wee'; // Replace with your database name
const collectionName = 'students'; // Replace with your collection name

// Define the Mongoose schema
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  admission: {
    type: Number,
    required: true,
    unique: true,
  },
  course: {
    type: String,
    required: true,
  },
  admindate: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  telephone: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // Ensure the telephone number begins with "254"
        return /^254\d{9}$/.test(value);
      },
      message: 'Telephone number must begin with "254" and have a total of 12 digits.',
    },
  },
  exam: {
    type: String,
    enum: ['KNEC', 'JPUK', 'ICM'],
  },
  module: {
    type: String,
    enum: ['general', 'ModI', 'ModII', 'ModIII'],
    default: 'general',
  },
  modStudy: {
    type: String,
    enum: ['general', 'Fullday', 'Evening', 'Distance', 'Virtual', 'Saturday'],
    default: 'general',
  },
  level: {
    type: String,
    enum: ['general', 'Certificate', 'Diploma'],
    default: 'general',
  },
  accommodation: {
    type: String,
    enum: ['general', 'Hostel', 'Non-resident'],
    default: 'general',
  },
  covered: {
    type: String,
  },
  uncovered: {
    type: String,
  },
}, { timestamps: true });

// Create the Mongoose model
const Student = mongoose.model('Student', studentSchema);

// Function to generate random exam
function getRandomExam() {
  const exams = ['KNEC', 'JPUK', 'ICM'];
  return chance.pickone(exams);
}

// Function to generate random module
function getRandomModule() {
  const modules = ['ModI', 'ModII', 'ModIII'];
  return chance.pickone(modules);
}

// Function to generate random mode of study
function getRandomModStudy() {
  const modStudies = ['Fullday', 'Evening', 'Distance', 'Virtual', 'Saturday'];
  return chance.pickone(modStudies);
}

// Function to generate random level
function getRandomLevel() {
  const levels = ['Certificate', 'Diploma'];
  return chance.pickone(levels);
}

// Function to generate random accommodation
function getRandomAccommodation() {
  const accommodations = ['Hostel', 'Non-resident'];
  return chance.pickone(accommodations);
}

// Function to generate random student data
async function generateData(numRecords) {
  const students = [];
  for (let i = 0; i < numRecords; i++) {
    students.push({
      name: chance.name(),
      admission: chance.integer({ min: 1000000, max: 9999999 }),
      course: chance.word(),
      admindate: chance.date({ year: chance.integer({ min: 2015, max: 2023 }) }).toISOString().split('T')[0],
      email: chance.email(),
      telephone: `254${chance.string({ length: 9, pool: '0123456789' })}`,
      exam: getRandomExam(),
      module: getRandomModule(),
      modStudy: getRandomModStudy(),
      level: getRandomLevel(),
      accommodation: getRandomAccommodation(),
      covered: chance.sentence(),
      uncovered: chance.sentence()
    });
  }
  return students;
}

// Function to insert data into MongoDB
async function insertData() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Generate data
    const data = await generateData(600); // Change the number to generate more or fewer records

    // Insert data into MongoDB
    const result = await Student.insertMany(data);
    console.log(`${result.length} records inserted`);

  } catch (err) {
    console.error('Error inserting data:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Connection closed');
  }
}

// Run the data generation and insertion
insertData();




// const { MongoClient } = require('mongodb');

// // Replace with your MongoDB Atlas connection string
// const uri = 'mongodb+srv://gabrielpius0311:8VpzJeD26DCI2c3s@cluster0.vvlp0lg.mongodb.net/wee?retryWrites=true&w=majority/';

// // Replace with your database and collection names
// const dbName = 'wee'; // The name of your database
// const collectionName = 'students'; // The name of your collection

// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// async function deleteAllData() {
//     try {
//         await client.connect();
//         console.log('Connected to MongoDB');

//         const db = client.db(dbName);
//         const collection = db.collection(collectionName);

//         // Delete all documents in the collection
//         const result = await collection.deleteMany({});
//         console.log(`${result.deletedCount} documents deleted`);

//     } catch (err) {
//         console.error('Error deleting data:', err);
//     } finally {
//         await client.close();
//         console.log('Connection closed');
//     }
// }

// deleteAllData();