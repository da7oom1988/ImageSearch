const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const db = require('./models/db')
var Bing = require('node-bing-api')({ accKey: "f170f6c9a73e4b1db18333a299126e1a" });

var app = express();
app.use(bodyParser.json());
app.use(cors());
var port = process.env.PORT || 3000;

mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost/searchTearm');


app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/api/search/:word',function(req,res){
    var search = req.params.word;
    var val = [];
    var offset = req.query.offset;

    var data = new db({
        term: search,
        when: Date().toString()
    });

    data.save(function(err){
        if(err){
        console.log("error with the DB");
        }
    });

    if(!offset || offset <= 0){
        offset = 1;
    }
    Bing.images(search, {
        top: (10 * offset),  
        skip: (10 * (offset -1 ))    
  }, function(error, rez, body){

    for(var i = 0 ; i < body.value.length ; i++){
        val.push({
            "name": body.value[i].name,
            "contentUrl": body.value[i].contentUrl,
            "thumbnailUrl": body.value[i].thumbnailUrl
        });
    }
    res.json(val);
  });
  
});

app.get('/api/latest',function(req,res){
    db.find({},{"_id": 0 ,"__v":0},function(err,data){
        if(err){
            return res.send("ERROR!!");
        }else{
            if(data){
                res.json(data);
            }else{
                res.send("ERROR!! page NOT found ");
            }
            
        }
    });
});




app.listen(port,function(){
    console.log('we are listining to port ' + port);
});