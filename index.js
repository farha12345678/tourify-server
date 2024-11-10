const express = require('express')
const cors = require('cors')

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000


app.use(cors());

console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);


// const uri = "mongodb+srv://<username>:<password>@cluster0.rnkwiqi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rnkwiqi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // await client.connect()

        const spotCollection = client.db("spotDB").collection('spot');
        const countryCollection = client.db("spotDB").collection('countries')

        

// addSpot
        app.get('/add', async(req,res)=> {
            const cursor = spotCollection.find()
            const result = await cursor.toArray();
            
            res.send(result)
        })

        app.get('/add/:id', async(req,res)=> {
            const id = req.params.id;
            const query = { _id : new ObjectId(id)}
            const result = await spotCollection.findOne(query)
            res.send(result)
        })

        app.put('/add/:id', async(req,res)=> {
            const id = req.params.id;
            const query = { _id : new ObjectId(id)}
            const options = { upsert: true };
            const updatedSpot = req.body;
            const update = {
              $set: {
                spot:updatedSpot.spot ,
                photo:updatedSpot.photo ,
                description:updatedSpot.description ,
                 cost:updatedSpot.cost , 
                 location:updatedSpot.location ,
                  country:updatedSpot.country, 
                  visitor:updatedSpot.visitor,
                  season:updatedSpot.season,
                  time:updatedSpot.time
              },
            };
            const result = await spotCollection.updateOne(query, update, options);
            res.send(result)
          })

          app.delete('/add/:id', async(req,res)=> {
            const id = req.params.id;
            const query = { _id : new ObjectId(id)}
            const result = await spotCollection.deleteOne(query)
            res.send(result)
           
          })
          
        // myList
        app.get('/myList/:email', async(req,res)=> {
            console.log(req.params.email);
            const result =await spotCollection.find({email:req.params.email}).toArray()
           
            res.send(result)
            })
        // country
        app.get('/countries', async(req,res)=> {
            const cursor = countryCollection.find()
            const result = await cursor.toArray();
           
            res.send(result)
            
        })
        app.get('/:country', async(req,res)=> {
            console.log(req.params.country);
            const result =await spotCollection.find({country:req.params.country}).toArray()
           console.log(result);
            res.send(result)
        })

        app.post('/add', async (req, res)=>{
            const newSpot = req.body;
            console.log(newSpot);
            const result = await spotCollection.insertOne(newSpot)
            res.send(result)
        })

       

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('start server')
})

app.listen(port, () => {
    console.log(`assignment-10 is running ${port}`)
})