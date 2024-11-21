import { createSlice } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';
let serverUrl="http://localhost:5000";
// Initial state for the socket
const initialState = {
  socket: null,
  isSocketConnected: false,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    initializeSocket: (state, action) => {
      // Initialize socket only if not already initialized
      if (!state.socket) {
        const socket = io(serverUrl,{withCredentials:true});
        state.socket = socket;
        state.isSocketConnected = true;
      }
    },
    disconnectSocket: (state) => {
      if (state.socket) {
        state.socket.disconnect();
        state.socket = null;
        state.isSocketConnected = false;
      }
    },
  },
});

// Export the actions for use in components
export const { initializeSocket, disconnectSocket } = socketSlice.actions;

// Export the reducer to add to the store
export default socketSlice.reducer;