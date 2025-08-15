// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://handyconnect.onrender.com/api',
});

// Automatically attach Authorization header if token exists


export default API;
