import { useState } from "react";

import axios from "axios";


export default function AddEmission(){

 const [type,setType] =
  useState("electricity");

 const [value,setValue] =
  useState(0);


 const submit = async () => {

  await axios.post(

   "http://localhost:5000/emissions",

   {
    activity_type:type,

    value

   },

   {
    headers:{

     Authorization:

     "Bearer " +

     localStorage.getItem("token")

    }

   }

  );

 };


 return (

  <div>

   <select
    onChange={

     e=>setType(e.target.value)

    }
   >

    <option>
     electricity
    </option>

    <option>
     diesel
    </option>

    <option>
     flight
    </option>

   </select>


   <input

    type="number"

    onChange={

     e=>setValue(e.target.value)

    }

   />

   <button onClick={submit}>

    add emission

   </button>

  </div>

 );

}