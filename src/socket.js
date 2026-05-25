import { io } from "socket.io-client";
const SERVER_URL = import.meta.env.VITE_API_BASE_URL;

const socket = io(`${SERVER_URL}`, {
  autoConnect: false,
  auth: {
    userId: localStorage.getItem("id"),
    role: localStorage.getItem("role"),
    token: localStorage.getItem("token"),
  },
});

export const connectSocket = () => {
  const auth = {
    userId: localStorage.getItem("id"),
    role: localStorage.getItem("role"),
    token: localStorage.getItem("token"),
  };

  const authChanged = socket.auth?.userId !== auth.userId || socket.auth?.token !== auth.token;
  socket.auth = auth;

  if (socket.connected && authChanged) {
    socket.disconnect();
  }

  if (auth.userId && !socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  socket.disconnect();
};

connectSocket();

export default socket;
