const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// MIDDLE__WARE
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send("Toys Hunter running in the server")
})

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.fsoo8nr.mongodb.net/?retryWrites=true&w=majority`;

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

        const toysCollection = client.db('toysDB').collection('toys');


        // ALL TOYS GET HERE   
        app.get('/toys', async (req, res) => {
            const cursor = toysCollection.find();
            const result = await cursor.toArray();
            // console.log('toys get Success')
            res.send(result);
        })


        //ASCENDING_IMPLEMENT
        app.get('/asstoys', async(req, res)=>{
            const cursor = toysCollection.find().sort({price : 1});
            const result = await cursor.toArray()
            res.send(result);
        })

        // DESCENDING_IMPLEMENT
        app.get('/destoys', async(req, res)=>{
            const cursor = toysCollection.find().sort({price : -1});
            const result = await cursor.toArray();
            res.send(result);
        })

        // SPECIFIC TOY GET
        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toysCollection.findOne(query);
            res.send(result);
        })


        // TOYS NEW DATA ADD 
        app.post('/toys', async (req, res) => {
            const toy = req.body;
            const result = await toysCollection.insertOne(toy);
            res.send(result);
        })


       
        // EMAIL_QUERY 
        app.get('/toys', async(req, res)=>{
            let query = {};
            if(req.query?.email){
                query = {email : req.query.email}
            }
            const result = await toysCollection.find(query).sort().toArray();
            res.send(result);
        })


        // TOYS_DELETE_ITEM
        app.delete('/toys/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id : new ObjectId(id)}
            const result = await toysCollection.deleteOne(query);
            res.send(result);
        })


        // DATA_UPDATE_INTEGRATE
        app.put('/toys/:id', async(req, res)=>{
            const id = req.params.id;
            const filter = {_id : new ObjectId(id)};
            const updatetoy = req.body;
            const option = {upsert: true};
            const toy = {
                $set : {
                    price : updatetoy.price,
                    available_quantity :updatetoy.available_quantity,
                    detail_description : updatetoy.detail_description
                }
            }
            const result = await toysCollection.updateOne(filter, toy, option);
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


app.listen(port, () => {
    console.log('Toys hunter running in the server which port are ', port)
})