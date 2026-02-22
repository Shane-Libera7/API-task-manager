const express = require('express');
const app = express();
const port = 3000;

//Start Server
app.listen(port);

//routes 
app.get('/health', (req,res) =>{
    res.status(200).json({ status: 'ok'});
});


