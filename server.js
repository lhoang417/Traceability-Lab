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
let characters = []
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
    rollbar.warning('Give me your name horsemaster, and I shall give you mine')
})

app.post('/api/characters', (req, res) => {
    let {name} = req.body
    name = name.trim()

    const index = characters.findIndex((character) => { // check if character name exists already
        character === name
    })
    console.log(index)
    try { // using a "try catch" block will handle any generic 500 errors (not necessary, but a good addition)
        if (index === -1 && name !== '') {
            // we'll send responses to the user based upon whether or not they gave us a valid user to add
            // also we'll send information to rollbar so we can keep track of the activity that's happening
            characters.push(name)
            rollbar.log("There's some good in the world", {author: 'Linh', type: 'manual'})
            res.status(200).send(characters)
        } else if (name === '') {
            rollbar.error('You must be an orc!')
            res.status(400).send("Don't be hasty!")
        } else {
            rollbar.error('You cannot wield it!')
            res.status(400).send('None of us can')
        }
    } catch (err) {
        rollbar.error(err)
    }
})



const port = process.env.PORT || 4550
app.use(rollbar.errorHandler())
app.listen(port, ()=>{console.log(`Running on ${port}`)})