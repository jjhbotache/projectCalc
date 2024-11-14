import { createSlice } from '@reduxjs/toolkit';




const initialState = {
    history: [
    ],
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addMessage(state, action) {
            state.history.push(action.payload);
        },
        resetChat(state) {
            state.history = [];
        },
    }
});

export const { addMessage, resetChat } = chatSlice.actions;
export default chatSlice.reducer;
