const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;


// MIDDLE__WARE
app.use(cors());
app.use(express.json());


app.get('/', (req, res)=>{
    res.send("Toys Hunter running in the server")
})

app.listen(port, ()=>{
    console.log('Toys hunter running in the server which port are ', port)
})