var express= require('express');
var app=express();

let server=require('./server');
let middleware=require('./middleware');
let config=require('./config');
const { connect } = require('mongodb');

const MongoClient=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017';
const dbName='HospitalDetails';

const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//hospital details
let db


MongoClient.connect(url, (err,client)=>{
        if(err) return console.log(err);
        db=client.db(dbName);
        //console.log(dbName);
        console.log(`Connected Database: ${url}`);
        console.log(`Database : ${dbName}`);
});
//get hospital details
app.get('/HospitalDetails',middleware.checkToken,(req,res)=>{
    console.log("got the hospital details");
    var a=db.collection('hospital').find().toArray()
    .then(re=>res.json(re));
});
//get ventilator details
app.get('/VentilatorDetails',middleware.checkToken,(req,res)=>{
    console.log("got the ventilators details");
    var a=db.collection('ventilators').find().toArray()
    .then(re=>res.json(re));
});
//searching hospital by name//
app.post('/searchbyhospitalname',middleware.checkToken,(req,res)=>{
    var n=req.body.name;
    console.log(n);
    var hosptaldetails=db.collection('hospital')
    .find({"name":n}).toArray().then(re=>res.json(re)); 
});
//searching ventilator by hospital name//
app.post('/searchbyventname',middleware.checkToken,(req,res)=>{
    var na=req.query.name;
    console.log(na);
    var ventdetails=db.collection('ventilators') 
    .find({"name":na}).toArray().then(re=>res.json(re));  
});
//searching ventilator by status//
app.post('/searchbyventstatus',middleware.checkToken,(req,res)=>{
    var status=req.body.status;
    console.log(status);
    var ventdetails=db.collection('ventilators')
    .find({"status":status}).toArray().then(re=>res.json(re));
});
//updating ventilator details
app.put('/updateventilators',middleware.checkToken,(req,res)=>{
    var vid={ventilator:req.body.ventilator};
    console.log(vid);
    var newval={$set:{status:req.body.status}};
    db.collection("ventilators").updateOne(vid,newval,function(err,re){
        res.json("details updated");
        if(err)throw err;
    });

});
//delete ventilator by id
app.delete('/deleteventilators',middleware.checkToken,(req,res)=>{
    var vid=req.body.ventilator;
    console.log(vid);
    var q1={ventilator:vid};
    db.collection("ventilators").deleteOne(q1,function(err,obj){
        res.json("details deleted");
        if(err)throw err;
    });

});
//add ventilator
app.post('/addventilator',middleware.checkToken,(req,res)=>{
    var hId=req.body.hId;
    var ventilator =req.body.ventilator;
    var status=req.body.status;
    var name=req.body.name;
    var item=
    {
        hId:hId,ventilator:ventilator,status:status,name:name
    };
    db.collection("ventilators").insertOne(item,function(err,re){
        res.json("new ventilator is added");
        if(err)throw err;
    });
});
app.listen(1100);
