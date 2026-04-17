const jwt = require("jsonwebtoken");

const { users } =
 require("../../data");

function login(req,res){

 const { email,password } =
  req.body;

 const user =
  users.find(

   u => u.email===email &&
   u.password===password

  );

 if(!user){

  return res.status(401)
   .json({
    message:"invalid credentials"
   });

 }

 const token =
  jwt.sign(

   {
    id:user.id,
    role:user.role
   },

   "secret123"

  );

 res.json({token});

}

module.exports = { login };