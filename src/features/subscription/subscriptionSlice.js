import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPlan: 'free_trial',
  status: 'active',
  isLoading: false,
};

export const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscription: (state, action) => {
      state.currentPlan = action.payload.planType;
      state.status = action.payload.status;
    }
  },
});

export const { setSubscription } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
