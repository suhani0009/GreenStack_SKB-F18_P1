const users = [

 {
  id:1,
  email:"admin@test.com",
  password:"123456",
  role:"admin"
 },

 {
  id:2,
  email:"user@test.com",
  password:"123456",
  role:"user"
 },

 {
  id:3,
  email:"supplier@test.com",
  password:"123456",
  role:"supplier"
 }

];

const emissionFactors = {

 electricity:{
  factor:0.82,
  scope:"Scope 2"
 },

 diesel:{
  factor:2.68,
  scope:"Scope 1"
 },

 petrol:{
  factor:2.31,
  scope:"Scope 1"
 },

 flight:{
  factor:0.15,
  scope:"Scope 3"
 },

 logistics:{
  factor:0.25,
  scope:"Scope 3"
 }

};

let activityData = [

 {
  id:1,
  activity_type:"electricity",
  value:12000,
  date:"2025-01"
 },

 {
  id:2,
  activity_type:"diesel",
  value:500,
  date:"2025-02"
 },

 {
  id:3,
  activity_type:"flight",
  value:3000,
  date:"2025-03"
 }

];

let suppliers = [

 {
  id:1,
  name:"ABC logistics",
  category:"transport",
  emissions:1500
 },

 {
  id:2,
  name:"XYZ steel",
  category:"manufacturing",
  emissions:2800
 }

];

let auditLogs = [];

module.exports = {

 users,

 emissionFactors,

 activityData,

 suppliers,

 auditLogs

};