
import axios from 'axios';

//http://localhost:3005/
//https://mastering-backend-648a4cdef801.herokuapp.com/

export const AllInOneApi = axios.create({
	baseURL: "https://all-in-one-system-cfe0c681a225.herokuapp.com/",
});

