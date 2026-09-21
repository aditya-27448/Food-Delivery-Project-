import { createSlice } from "@reduxjs/toolkit";
const savedDefaultAddress = "Bhubaneswar, Odisha, India";
const savedDefaultCity = "Bhubaneswar";
const savedDefaultState = "Odisha";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    defaultAddress: savedDefaultAddress,
    defaultCity: savedDefaultCity,
    defaultState: savedDefaultState,
    currentCity: savedDefaultCity,
    currentState: savedDefaultState,
    currentAddress: savedDefaultAddress,
    shopsInMyCity: null,
    itemsInMyCity: null,
    cartItems: [],
    totalAmount: 0,
    myOrders: [],
    searchItems: null,
    socket: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      if (action.payload?.defaultAddress) {
        state.currentAddress = action.payload.defaultAddress;
        state.currentCity = action.payload.defaultCity || state.currentCity;
        state.currentState = action.payload.defaultState || state.currentState;
      }
    },
    setCurrentCity: (state, action) => {
      state.currentCity = action.payload;
    },
    setCurrentState: (state, action) => {
      state.currentState = action.payload;
    },
    setCurrentAddress: (state, action) => {
      state.currentAddress = action.payload;
    },
    setDefaultAddressState: (state, action) => {
      const { address, city, state: st } = action.payload;
      if (address) {
        state.defaultAddress = address;
        state.currentAddress = address;
        localStorage.setItem("defaultAddress", address);
      }
      if (city) {
        state.defaultCity = city;
        state.currentCity = city;
        localStorage.setItem("defaultCity", city);
      }
      if (st) {
        state.defaultState = st;
        state.currentState = st;
        localStorage.setItem("defaultState", st);
      }
    },
    setShopsInMyCity: (state, action) => {
      state.shopsInMyCity = action.payload;
    },
    setItemsInMyCity: (state, action) => {
      state.itemsInMyCity = action.payload;
    },
    addToCart: (state, action) => {
      const cartItem = action.payload;
      const existingItem = state.cartItems.find((i) => i.id == cartItem.id);
      if (existingItem) {
        existingItem.quantity += cartItem.quantity;
      } else {
        state.cartItems.push(cartItem);
      }
      state.totalAmount = state.cartItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0,
      );
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((i) => i.id == id);
      if (item) {
        item.quantity = quantity;
      }
      state.totalAmount = state.cartItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0,
      );
    },
    removeCartItem: (state, action) => {
      state.cartItems = state.cartItems.filter((i) => i.id !== action.payload);
      state.totalAmount = state.cartItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0,
      );
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
    },

    setMyOrders: (state, action) => {
      state.myOrders = action.payload;
    },

    addMyOrder: (state, action) => {
      state.myOrders = [action.payload, ...state.myOrders];
    },
    updateOrderStatus: (state, action) => {
      const { orderId, shopId, status } = action.payload;
      const order = state.myOrders.find((o) => o._id == orderId);
      if (order) {
        if (order.shopOrders && order.shopOrders.shop._id == shopId) {
          order.shopOrders.status = status;
        }
      }
    },
    updateRealtimeOrderStatus: (state, action) => {
      const { orderId, shopId, status } = action.payload;
      const order = state.myOrders.find((o) => o._id == orderId);
      if (order) {
        const shopOrder = order.shopOrders.find((so) => so._id == shopId);
        if (shopOrder) {
          shopOrder.status = status;
        }
      }
    },
    setSearchItems: (state, action) => {
      state.searchItems = action.payload;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
  },
});

export const {
  setSocket,
  setUserData,
  setCurrentCity,
  setCurrentState,
  setCurrentAddress,
  setDefaultAddressState,
  setShopsInMyCity,
  setItemsInMyCity,
  addToCart,
  updateQuantity,
  removeCartItem,
  clearCart,
  setMyOrders,
  addMyOrder,
  updateOrderStatus,
  setSearchItems,
  updateRealtimeOrderStatus,
} = userSlice.actions;
export default userSlice.reducer;
