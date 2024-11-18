import axios from "axios";

// Function to create Axios instance
const ApiInstance = (contentType) => {
  const instance = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_URL}`,
    timeout: 20000,
    headers: {
      "Content-Type": contentType,
    },
  });

  return instance;
};

const main_url = ApiInstance("application/json");

export default main_url;
