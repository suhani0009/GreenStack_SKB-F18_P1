const {
 activityData
} = require("../../data");

const {
 calculateEmission,
 addEmission
} = require("./service");


function getAll(req,res){

 const result =
  activityData.map(
   calculateEmission
  );

 res.json(result);

}


function create(req,res){

 const record =
  addEmission(req.body);

 res.json(record);

}

module.exports = {

 getAll,

 create

};