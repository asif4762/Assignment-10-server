const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
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
    const database = client.db("allCartsDB");
    const allCarts = database.collection("allCarts");
    // const dataBaseMyArt = client.db("myArt");
    // const myArt = dataBaseMyArt.collection("myArt");

    const myArtCollection = client.db("myArtDB").collection("myArt")

    
    const count = await allCarts.countDocuments();
    if (count === 0) {
      
      const jsonData = await fs.readFile('./data.json', 'utf8');
      const doc = JSON.parse(jsonData);

      
      await allCarts.insertMany(doc);
    }

   app.post('/my-arts', async (req, res) => {
    const art = req.body;
    console.log('My art', art);
    const result = await myArtCollection.insertOne(art);
    res.send(result);
   })

   app.get('/my-arts', async (req, res) => {
    const cursor = myArtCollection.find();
    const result = await cursor.toArray();
    res.send(result);
   })

    app.get('/allCarts', async (req, res) => {
      try {
        const items = await allCarts.find({}).toArray();
        res.json(items);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensure that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('BrandShop Server is Running');
});

app.listen(port, () => {
  console.log(`BrandShop Server is Running on port ${port}`);
});
