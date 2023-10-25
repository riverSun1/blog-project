import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    toasts: []
};

const toastSlice = createSlice({
    name: 'toast',
    initialState: initialState,
    reducers: {
        addToast: (state, action) => {
            state.toasts.push(action.payload);
        },
        removeToast: (state, action) => {
            state.toasts = state.toasts.filter(toast => {
                return toast.id !== action.payload // 다를 경우 남겨두고 같으면 삭제
            })
        }
    }
})

export const { addToast, removeToast } = toastSlice.actions;

export default toastSlice.reducer;