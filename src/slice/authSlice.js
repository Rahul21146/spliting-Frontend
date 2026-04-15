import { createSlice } from '@reduxjs/toolkit';

const initialState={
    userData:null,
    userToken:localStorage.getItem('userToken') ?localStorage.getItem('userToken'):null,
    loading:false
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    loginSuccess: (state, value) => {
      state.userData = value.payload;
    },
    logout: (state) => {
      state.userData = null;
    },
    setToken:(state, value) => {
      state.userToken = value.payload;
    },
    setLoading:(state, value) => {
      state.loading = value.payload;
    }
  }
});

export const { loginSuccess, logout, setToken, setLoading } = authSlice.actions;
export default authSlice.reducer;