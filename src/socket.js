import { io } from "socket.io-client";
const SERVER_URL = import.meta.env.VITE_API_BASE_URL;

const socket = io(`${SERVER_URL}`, {
  auth: {
    userId: localStorage.getItem("id"), // must be organizerId
  },
});

export default socket;