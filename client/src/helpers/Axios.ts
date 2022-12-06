import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:3080",
  timeout: 8000,
});
