const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require('mongodb'); 
const fs = require('fs').promises; // Import the 'fs' module to read the file
const app = express();
const port = process.env.PORT || 5500;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rurzeff.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const AllArtCollection = client.db("AllArtDB").collection("AllArt")


   app.post('/all-arts', async (req, res) => {
    const art = req.body;
    console.log('All Art', art);
    const result = await AllArtCollection.insertOne(art);
    res.send(result);
   })

   app.get('/all-arts', async (req, res) => {
    const cursor = AllArtCollection.find();
    const result = await cursor.toArray();
    res.send(result);
   })

   app.get('/myArts/:User_Email', async (req, res) => {
    const result = await AllArtCollection.find({ User_Email: req.params.User_Email }).toArray();
    res.send(result);
  });
  
  app.put('/updateProduct/:id', async (req, res) => {
    console.log(req.params.id)
  })

app.get('/all-arts/:id', async (req, res) => {
  console.log('id:', req.params.id)
  const result = await AllArtCollection.findOne({ _id: new ObjectId(req.params.id) });
  res.send(result);
})

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensure that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Art and Craft Server is Running');
});

app.listen(port, () => {
  console.log(`Art and Craft Server is Running on port ${port}`);
});
