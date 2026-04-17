const regression = require("regression");

function trainModel(dataset){

 const trainingData =
  dataset.map(d=>[
   d.value,
   d.emission
  ]);

 return regression.linear(
  trainingData
 );

}


function predictEmission(model,value){

 const result =
  model.predict(value);

 return result[1];

}


module.exports = {
 trainModel,
 predictEmission
};