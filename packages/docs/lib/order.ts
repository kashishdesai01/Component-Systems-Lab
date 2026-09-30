import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type PickupTime = 'soon' | 'later';
export type OrderStatus = 'editing' | 'pending' | 'success' | 'failed';
export interface OrderState {
  email: string;
  name: string;
  pickup: PickupTime;
  reusable: boolean;
  status: OrderStatus;
}
const initialState: OrderState = {
  email: '',
  name: '',
  pickup: 'soon',
  reusable: false,
  status: 'editing',
};
const canEdit = (status: OrderStatus) => status === 'editing' || status === 'failed';
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    emailChanged(state, action: PayloadAction<string>) {
      if (canEdit(state.status)) state.email = action.payload;
    },
    nameChanged(state, action: PayloadAction<string>) {
      if (canEdit(state.status)) state.name = action.payload;
    },
    pickupChanged(state, action: PayloadAction<PickupTime>) {
      if (canEdit(state.status)) state.pickup = action.payload;
    },
    reusableChanged(state, action: PayloadAction<boolean>) {
      if (canEdit(state.status)) state.reusable = action.payload;
    },
    submissionStarted(state) {
      if (canEdit(state.status)) state.status = 'pending';
    },
    submissionSucceeded(state) {
      if (state.status === 'pending') state.status = 'success';
    },
    submissionFailed(state) {
      if (state.status === 'pending') state.status = 'failed';
    },
    restarted(state) {
      if (state.status === 'success') return initialState;
    },
  },
});
export const orderActions = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
export function makeOrderStore() {
  return configureStore({ reducer: { order: orderReducer } });
}
export type OrderStore = ReturnType<typeof makeOrderStore>;
export type RootState = ReturnType<OrderStore['getState']>;
export const selectOrder = (state: RootState) => state.order;
