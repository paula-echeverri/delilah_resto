
const  express= require('express');
const bodyParser= require('body-parser');
const apiRouter=require('./routes/api');

const app=express();

require('./db');

app.use(express.json());



app.use('/', apiRouter);

app.listen(4000,(req, res)=>{

    console.log("it is working");
   
   } )