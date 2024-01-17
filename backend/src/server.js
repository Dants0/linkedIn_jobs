const express = require('express');
const cors = require('cors');
const api = require("./controller/index.js");
const Jobs = require('./class/Jobs.js');
const cache = require('memory-cache');
const app = express();

app.use(express.json())
app.use(cors())

const db = new Jobs()

const ONE_TIME_MINUTE = 60 * 1000;

app.get('/api/jobs', async (req, res) => {

    const cachedData = cache.get("jobs")

    if(cachedData){
        return res.status(200).json(cachedData)
    }

    try{

        const response = await api.query(db.jobSetupDefault());
        const data = response;
    
        cache.put('jobs', data, ONE_TIME_MINUTE);
    
        return res.status(200).json(data);
    

    }catch(err){
        console.error(err);
        return res.status(500).json({error: 'Error getting jobs'})
    }
})

app.get("/api/jobSearch", async (req, res) => {
    const { keyword } = req.body;

    api.query(db.searchJobByKeyword(keyword)).then((response)=>{
        const data = response
        res.send(data);
    })

})

const url = "http://localhost:8080"

app.listen(8080, ()=> console.log(`listening on ${url}`))