// redux/slices/chatSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeChats: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addChat: (state, action) => {
      const user = action.payload;
      if (!state.activeChats.some(chat => chat.user.id === user.id)) {
        const updatedChats = [...state.activeChats, { user, minimized: false }];
        if (updatedChats.length > 5) {
          updatedChats.shift(); // Remove the first chat if there are more than 5
        }
        state.activeChats = updatedChats;
      }
    },
    toggleMinimizeChat: (state, action) => {
      const id = action.payload;
      state.activeChats = state.activeChats.map((chat) =>
        chat.user.id === id
          ? { ...chat, minimized: !chat.minimized }
          : chat
      );
    },
    closeChat: (state, action) => {
      const id = action.payload;
      state.activeChats = state.activeChats.filter(chat => chat.user.id !== id);
    },
  },
});
export const { addChat, toggleMinimizeChat, closeChat } = chatSlice.actions;
export default chatSlice.reducer;
