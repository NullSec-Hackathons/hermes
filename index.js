const bodyParser = require('body-parser');

const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
app.use('/assets/css',express.static(__dirname + '/client/assets/css'));
app.use('/assets/fonts',express.static(__dirname + '/client/assets/fonts'));
app.use('/assets/js',express.static(__dirname + '/client/assets/js'));
app.use('/assets/img',express.static(__dirname + '/client/assets/img'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));//trial


var db =require('./db');
app.get('/',(req,res)=>res.sendFile(__dirname+'/client/home.html'));
//app.get('/match',(req,res)=>{console.log("hello");res.send('asd');});

app.post('/match/donors',(req,res)=>{
  /*console.log("Hello");
  console.log(`${req.body.bloodType}:${req.body.disease}:${req.body.organ}`);
  res.send('OK');*/
  db.getDonors(req.body.bloodType,req.body.disease,req.body.organ,res);
});
app.post('/match/requesters',(req,res)=>{
  /*console.log("Hello");
  console.log(`${req.body.bloodType}:${req.body.disease}:${req.body.organ}`);
  res.send('OK');*/
  db.getRequesters(req.body.bloodType,req.body.disease,req.body.organ,res);
});
app.post('/add/donor',(req,res)=>{
  console.log("Donor POST");
  db.addDonor({
  name:req.body.name,
  contact:req.body.contact,
  organ:req.body.organ,
  disease:req.body.disease,
  bloodType:req.body.bloodType,
  hla:req.body.hla,
  address:req.body.address
},res)
});
app.post('/add/pair/donor',(req,res)=>{
  console.log("Donor Pair POST");
  db.addDonorPair({
  name:req.body.name,
  contact:req.body.contact,
  organ:req.body.organ,
  disease:req.body.disease,
  bloodType:req.body.bloodType,
  hla:req.body.hla,
  address:req.body.address
},req.body.linkContact,res)
});//TOTEST
app.post('/add/requester',(req,res)=>{
  console.log(req.body);
  db.addRequester({
  name:req.body.name,
  contact:req.body.contact,
  organ:req.body.organ,
  disease:req.body.disease,
  bloodType:req.body.bloodType,
  hla:req.body.hla,
  address:req.body.address
},res)
});

app.post('/delete/donor',(req,res)=>{db.deleteDonor({
  contact:req.body.contact,
  bloodType:req.body.bloodType
},res);
});//contact and bloodType
app.post('/delete/pair/donor',(req,res)=>{db.deleteDonorPair({
    contact:req.body.contact,
    bloodType:req.body.bloodType
},res)
});//TOTEST
app.post('/delete/requester',(req,res)=>{db.deleteRequester({
  contact:req.body.contact,
  bloodType:req.body.bloodType
},res)
})

app.get('/add/requester',(req,res)=>{
  res.sendFile(__dirname + '/client/formRequester.html');
})
app.get('/add/donor',(req,res)=>{
  res.sendFile(__dirname + '/client/formDonor.html');
})
app.listen(PORT,(req,res)=>console.log(`Listening on port ${PORT}`));
