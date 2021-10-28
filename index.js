const express = require("express");
const { MongoClient } = require('mongodb')
require('dotenv').config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.minbj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

async function run() {

    try {
        await client.connect();
        const database = client.db("drinks_bar");
        const drinksCollection = database.collection("drinks_bar_collections");

        // add a drink
        app.post("/add/drinks", async (req, res) => {
            const drink = req.body;
            const result = await drinksCollection.insertOne(drink);
            res.json(result);
        });

        // get all drinks 
        app.get("/drinks", async (req, res) => {
            const cursor = drinksCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        });

        // get a specific drink
        app.get("/drinks/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await drinksCollection.findOne(query);
            res.json(result);
        });

        //    delete a drink 
        app.delete("/drinks/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await drinksCollection.deleteOne(query);
            res.json(result);
        })
    }

    finally {

    }

}

run().catch(error => {
    console.dir(error);
});

app.get("/", (req, res) => {
    res.send("Running");
})


app.listen(port, () => {
    console.log("Running server at port", port);
})