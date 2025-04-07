// const { default: axios } = require("axios");
import { HOST } from "@/utils/constants.jsx";
import axios from 'axios';




export const apiClient = axios.create({
    baseURL: HOST

})
// console.log(HOST+'hello')
