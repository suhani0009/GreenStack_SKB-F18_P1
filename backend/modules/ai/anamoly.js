function detectAnomaly(data){

 let anomalies = [];

 for(let i=1;i<data.length;i++){

  if(

   data[i].emission >

   data[i-1].emission * 1.5

  ){

   anomalies.push(data[i]);

  }

 }

 return anomalies;

}


module.exports = {

 detectAnomaly

};