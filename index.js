const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kqyf4iv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const coffeeCollection = client.db('coffeeDB').collection('coffees');
    
    app.post('/coffees', async (req,res) => {
      const newCoffee = req.body;
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result)
    })

    app.get('/coffees', async (req,res) => {
        const result = await coffeeCollection.find().toArray();
        res.send(result);
    })
    
    app.delete('/coffees/:id', async (req,res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    })

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res) => {
    res.send('coffee comming soon..')
})

app.listen(port, () => {
    console.log(`view this port ${port}`)
})
