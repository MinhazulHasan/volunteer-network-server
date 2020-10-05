const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ObjectId } = require('mongodb');
require('dotenv').config();
const port = 5000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rdyuw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
client.connect(err => {
	const categoryCollections = client.db("volunteerNetwork").collection("categories");
	const volunteerCollections = client.db("volunteerNetwork").collection("volunteer");

	app.post('/addCategory', (req, res) => {
		const category = req.body;
		categoryCollections.insertOne(category)
			.then(result => {
				res.send(result.insertedCount > 0)
			})
	})

	app.get('/categories', (req, res) => {
		categoryCollections.find({})
			.toArray((err, documents) => res.status(200).send(documents))
	})

	app.get('/category/:categoryId', (req, res) => {
		categoryCollections.find({ _id: ObjectId(req.params.categoryId) })
			.toArray((err, document) => {
				res.status(200).send(document[0]);
			})
	})

	app.post('/volunteerInfo', (req, res) => {
		const volunteer = req.body;
		volunteerCollections.insertOne(volunteer)
			.then(result => {
				res.send(result.insertedCount > 0)
			})
	})

	app.get('/volunteer', (req, res) => {
		volunteerCollections.find({ email: req.query.email })
			.toArray((err, documents) => {
				res.status(200).send(documents);
			})
	})

	app.delete('/delete/:id', (req, res) => {
		volunteerCollections.deleteOne({ _id: ObjectId(req.params.id) })
			.then((result) => {
				res.send(result.deletedCount > 0);
			})
	})

	app.get('/volunteers/all', (req, res) => {
		volunteerCollections.find({})
			.toArray((err, documents) => {
				res.status(200).send(documents);
			})
	})

});

app.get('/', (req, res) => {
	res.send('Server is Working');
})

app.listen(process.env.PORT || port, () => console.log(`Listening to port http://localhost:${port}`))