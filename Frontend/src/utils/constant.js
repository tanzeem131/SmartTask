// export const API_URL = "http://localhost:5000/api";
// export const API_URL = "https://smarttask-backend-rget.onrender.com/api";

export const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://smarttask-backend-rget.onrender.com/api";
