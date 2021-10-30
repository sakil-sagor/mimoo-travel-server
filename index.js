const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
app.use(express.json())

const port = process.env.PORT || 5000
// middleware
var cors = require('cors')
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9clk0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




async function run() {
    try {
        await client.connect();
        const database = client.db("mimoo-travel");
        const coursesCollection = database.collection("services");
        const ordersCollection = database.collection("orders");

        //get all services
        app.get('/services', async (req, res) => {
            const cursor = coursesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })

        //get all orders
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            console.log(orders);
            res.send(orders)
        })

        // get single service details get api 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await coursesCollection.findOne(query)
            res.json(result);
        });


        // post api add single service
        app.post('/services', async (req, res) => {
            const newServices = req.body;
            const result = await coursesCollection.insertOne(newServices)
            res.json(result);
        })

        // post api add single order
        app.post('/orders', async (req, res) => {
            const newOrders = req.body;
            const result = await ordersCollection.insertOne(newOrders)
            res.json(result);
        })




    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running Node Server for aim-as')
})

app.listen(port, () => {
    console.log(`Running Node Server at http://localhost:${port}`)
})
