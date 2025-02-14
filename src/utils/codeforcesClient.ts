import axios from "axios";

const client = axios.create({
  baseURL: "https://codeforces.com/api",
  timeout: 10000,
});

export default client;
