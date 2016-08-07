const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hermes');

const donorSchema = mongoose.Schema({
  name: String,
  contact: Number,
  organ: String,
  disease: String,
  bloodType: String,
  address:String,
  hla:[Number]
});
const requesterSchema = mongoose.Schema({
  name: String,
  contact: Number,
  organ: String,
  disease: String,
  bloodType: String,
  address:String,
  hla:[Number]
});
const donorPairSchema = mongoose.Schema({
  name: String,
  contact: Number,
  organ: String,
  disease: String,
  bloodType: String,
  address:String,
  linkContact:Number,
  hla:[Number]
});
const requesterPairSchema = mongoose.Schema({
  name: String,
  contact: Number,
  organ: String,
  disease: String,
  bloodType: String,
  address:String,
  linkContact:Number,
  hla:[Number]
});

const donorModel = mongoose.model('donor',donorSchema);
const requesterModel = mongoose.model('requester',requesterSchema);
const donorPairModel = mongoose.model('donor_pair',donorPairSchema);
const requesterPairModel = mongoose.model('requester_pair',requesterPairSchema);

function donorCurry(requester){
  return function(donors){
    let temp_requester = requester;
    return function(res){
      res.render('match',{requester:temp_requester,donors:donors});
    }
  }
}

function getDonors(contact,res) {
  requesterModel.findOne({contact:contact})
              .exec(function(err,doc){
                if(err) res.render('match',{requester:doc,donors:[]});
                else {
                var dModelFind = {
                  bloodType: doc.bloodType,
                  disease: doc.disease,
                  organ: doc.organ
                };
                var dcurry = donorCurry(doc);
                donorModel.
                  find(dModelFind).exec(function(err,donors){
                    if (err){ throw err; res.send('error');}
                    else {
                      dcurry = dcurry(donors);
                      dcurry(res);
                    }
                  });
                }
              });

}
function requesterCurry(donor){
  return function(requesters){
    let temp_donor = donor;
    return function(res){
      res.render('cardview_requesters',{donor:temp_donor,requesters:requesters});
    }
  }
}
function getRequesters(contact,res) {
  console.log("sdfasa");
  donorModel.findOne({contact:contact})
              .exec(function(err,doc){
                if(err){res.render('cardview_requesters',{donor:[],requesters:[]});}
                else{
                  var rModelFind = {
                    bloodType: doc.bloodType,
                    disease: doc.disease,
                    organ: doc.organ
                  };
                var curry = requesterCurry(doc);
                requesterModel.
                  find(rModelFind).exec(function(err,requesters){
                    if (err){ throw err; res.send('error');}
                    else {
                      curry = curry(requesters);
                      curry(res);
                    }
                  });
                }
              });
}
function addDonor(donor,res){
  let newDonor = new donorModel({
    name:donor.name,
    contact:donor.contact,
    organ:donor.organ,
    disease:donor.disease,
    bloodType:donor.bloodType,
    hla:donor.hla,
    address:donor.address
  });
  newDonor.save(function(err,newDonor){
    if (err){throw err; res.send('error');}
    else{
      res.send(newDonor);//chain with getRequesters
    }
  })
}
function addRequester(requester,res){
  let newRequester = new requesterModel({
    name:requester.name,
    contact:requester.contact,
    organ:requester.organ,
    disease:requester.disease,
    bloodType:requester.bloodType,
    hla:requester.hla,
    address:requester.address
  });
  newRequester.save(function(err,newRequester){
    if (err){throw err; res.send('error');}
    else{
      res.send(newRequester);//chain with getRequesters
    }
  })
}
function deleteDonor(donor,res){
  donorModel.findOne({
    bloodType:donor.bloodType,
    contact:donor.contact
  }).remove(function(err,data){
    if (err){throw err; res.send('error');}
    else{
      console.log('Donor Deleted');
      res.send(data);
    }
  })
}
  //HACK ALERT PLS CHANGE :P :D ;) :)
function deleteRequester(requester,res){
  requesterModel.findOne({
    bloodType:requester.bloodType,
    contact:requester.contact
  }).remove(function(err,data){
    if (err){throw err;}
    else{
      console.log('requester Deleted');
    }
  })
  requesterPairModel.findOne({
    bloodType:requester.bloodType,
    contact:requester.contact
  }).exec(function(err,doc){
      if(err) throw err;
      else{
        let donor_contact = doc.linkContact;
        donorPairModel.findOne({contact:donor_contact}).remove(function(err,data){
          if (err){throw err;}
          else{
            console.log('donor_pair Deleted');
          }
        });
      }
  })
  requesterPairModel.findOne({
    bloodType:requester.bloodType,
    contact:requester.contact
  }).remove(function(err,data){
    if (err){throw err;}
    else{
      console.log('requester_pair Deleted');
    }
  })
}
function addRequesterPair(requester,linkContact){
  let newRequesterPair = new requesterPairModel({
    name:requester.name,
    contact:requester.contact,
    organ:requester.organ,
    disease:requester.disease,
    bloodType:requester.bloodType,
    hla:requester.hla,
    address:requester.address,
    linkContact:linkContact
  });
  newRequesterPair.save(function(err,newRequesterPair){
    if(err){throw err;}
    else {
      console.log("Requester Pair Copied from Requester");
    }
  })
}
function addDonorPair(donor,linkContact,res){
  let newDonorPair = new donorPairModel({
    name:donor.name,
    contact:donor.contact,
    organ:donor.organ,
    disease:donor.disease,
    bloodType:donor.bloodType,
    hla:donor.hla,
    address:donor.address,
    linkContact:linkContact
  });
  newDonorPair.save(function(err,newDonorPair){
    if (err){throw err; res.send('error');}
    else
      requesterModel.findOne({contact:newDonorPair.linkContact})
                      .exec(function(err,doc){
                        if (err) throw err;
                        else {
                          addRequesterPair(doc,newDonorPair.contact);//HACK MAYBE
                        }
                      })
      res.send(newDonorPair);//What to send in case of pairs? Currently newDonorPair
  })
}
//HACK ALERT
function deleteDonorPair(donor,res){
  donorPairModel.findOne({
    bloodType:donor.bloodType,
    contact:donor.contact
  }).remove(function(err,data){
    if (err){throw err;}
    else{
      console.log('Donor Deleted');
    }
  })
  requesterPairModel.findOne({
    linkContact:donor.contact
  }).exec(function(err,data){
    requesterModel.findOne({
      contact:data.contact
    }).remove(function(err,data){if(err) throw err;});
  })
  requesterPairModel.findOne({
    linkcontact:donor.contact
  }).remove(function(err,data){
    if(err) throw err;
  });
  res.send('OK');
}

//HACK ALERT , Beauty & the BEAST
function getCrossMatch(paired_donor,res){
  var paired_requester;
  requesterPairModel.findOne({
    contact:paired_donor.linkContact
  }).exec(function(err,doc){
    paired_requester = doc;
  });
  donorPairModel.findOne({
    contact:paired_donor.contact
  }).exec(function(err,doc){
    requesterPairModel.
    find({
        bloodType: doc.bloodType,
        disease: doc.disease,
        organ: doc.organ
      }).exec(function(err,requesters){
        if (err){ throw err; res.send('error');}
        else {
          var pot_donors = new Array();
          for(var i = 0;i < requesters.length ; ++i)
          {
            donorPairModel.findOne({contact:requesters[i].linkContact})
                            .exec(function(err,doc){
                              if(err) throw err;
                              else
                                pot_donors.push(doc);
                            });
          }
          res.send({pot_donors:pot_donors,pot_requesters:requesters,paired_requester:paired_requester});
        }
      });
  })
}
module.exports = {
  getCrossMatch:getCrossMatch,
  deleteDonorPair:deleteDonorPair,
  addDonorPair:addDonorPair,
  deleteRequester:deleteRequester,
  deleteDonor:deleteDonor,
  addRequester:addRequester,
  addDonor:addDonor,
  getDonors:getDonors,
  getRequesters:getRequesters
};
