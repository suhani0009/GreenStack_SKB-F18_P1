const pool =
 require("../../config/db");

const { v4:uuid } =
 require("uuid");

 const {
 trainModel,
 predictEmission
} = require("../ai/predict");


const model =
 trainModel(existingData);


const predicted =
 predictEmission(
  model,
  2000
 );


async function createEmission({

 company_id,
 activity_type,
 value,
 scope,
 emission

}){

 const result =
  await pool.query(

   `
   INSERT INTO emissions

   VALUES
   (
    $1,$2,$3,$4,$5,$6,now()
   )

   RETURNING *
   `,

   [

    uuid(),

    company_id,

    activity_type,

    value,

    scope,

    emission

   ]

  );


 return result.rows[0];

}


async function getCompanyData(

 company_id

){

 const result =
  await pool.query(

   `
   SELECT *
   FROM emissions

   WHERE company_id=$1
   `,

   [company_id]

  );


 return result.rows;

}


module.exports = {

 createEmission,

 getCompanyData

};