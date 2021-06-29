const express = require('express');
const path = require('path');
const app = express();
const Rollbar = require("rollbar");
const rollbar = new Rollbar({
  accessToken: 'bbbb73daa3484b6b83c0af3d43587c3e',
  captureUncaught: true,
  captureUnhandledRejections: true
});



app.use(express.json());

app.get('/', (req,res)=>{
    rollbar.log("Hello world!");
    rollbar.error('User tried to access incorrect path')
    
    
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.get('/birds', (req,res)=>{
    return res.error('this is not real')
})

app.get('/mordor', (req,res)=>{
    rollbar.critical('One does not simply walk into Mordor')
})

app.get('/rohan', (req,res)=>{
    rollbar.warning('Tell me your name horsemaster, and Ill tell you mine')
})


const port = process.env.PORT || 4550
app.use(rollbar.errorHandler())
app.listen(port, ()=>{console.log(`Running on ${port}`)})