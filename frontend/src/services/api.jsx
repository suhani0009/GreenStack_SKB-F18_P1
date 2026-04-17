import axios from "axios";

const API =
 "http://localhost:5000/api";

export const getDashboard =
 () => axios.get(`${API}/dashboard`);

export const getSuppliers =
 () => axios.get(`${API}/suppliers`);

export const simulateScenario =
 percent =>
 axios.post(
  `${API}/scenario`,
  { renewablePercent: percent }
 );

export const getReport =
 () => axios.get(`${API}/report`);