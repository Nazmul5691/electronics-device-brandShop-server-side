const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5001;

//MIDDLE WARE
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.laemifb.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const allProducts = client.db('productDB').collection('product');


    app.get('/addProduct', async(req, res) =>{
        const curser = allProducts.find()
        const result = await curser.toArray()
        res.send(result);
       })


    app.get('/addProduct/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await allProducts.findOne(query)
        res.send(result)
       })
    


    app.post('/addProduct', async(req, res) =>{
        const newProduct = req.body;
        console.log(newProduct);
        const result = await allProducts.insertOne(newProduct)
        res.send(result);
  
      })

    
      app.put('/addProduct/:id', async(req, res) =>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = {upsert: true}
        const updatedProduct = req.body;
        const update = {
          $set: {
            name: updatedProduct.name, 
            quantity: updatedProduct.quantity, 
            type: updatedProduct.supplier, 
            price: updatedProduct.taste, 
            brandsName: updatedProduct.brandsName, 
            details: updatedProduct.details, 
            photo: updatedProduct.photo
          }
        }
  
        const result = await allProducts.updateOne(filter, update, options)
        res.send(result)
      })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Brand Shop server is running')
})

app.listen(port, () =>{
    console.log(`Brand Shop server is running os port: ${port}`);
})