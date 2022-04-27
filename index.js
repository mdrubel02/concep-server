const express = require("express");
const app = express();
const port =process.env.PORT || 4000;
const cors = require('cors')
require('dotenv').config()


app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion,ObjectId} = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ptkiw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   console.log('connected to db')



async function run (){
    try{
        await client.connect();
        const userCollection = client.db("notesTaker").collection("totes");
        console.log('connected to db')

        //get api to read all notes
        app.get('/notes',async (req,res) =>{
            const q = req.query;
            console.log(q);
            const cursor = userCollection.find({})
            const result = await cursor.toArray();
            res.send(result)
        })


        //create notes taker    
        app.post('/note', async(req,res) =>{
            const data =req.body;
            const result = await userCollection.insertOne(data)
          res.send(result)
        })

        //update 
        app.put('/note/:id',async (req,res)=>{
            const id =req.params.id;
            const data =req.body;
            const filter = {_id: ObjectId(id)};
            
            const options = { upsert: true }; 
            const updateDoc = {
                $set: {
                  userName:data.userName,
                  textData:data.textData
                },
              };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })
 
        //delete note
        app.delete('/note/:id',async (req,res) =>{
            const id =req.params.id;
            const filter = {_id: ObjectId(id)};
            console.log(filter)
            const result = await userCollection.deleteOne(filter);

            res.send(result)

        })
    }
    finally{
        //   client.close();
    }
}


app.get('/', (req,res) =>{

    res.send('hello world')
})

app.listen(port,()=>{
    console.log(`example app listening at http:localhost:${port}`)
})
run().catch(console.dir);



// password:w0xeMNEJZ7fq1Rme
// user name:rubel