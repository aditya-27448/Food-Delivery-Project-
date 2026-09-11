import { createSlice } from "@reduxjs/toolkit";
import { update } from "firebase/database";

const mapSlice = createSlice({
  name: "user",
  initialState: {
    location: {
      lat: 20.2961,
      lon: 85.8245,
    },
    address: "Bhubaneswar, Odisha, India",
  },
  reducers: {
    setLocation: (state, action) => {
      const { lat, lon } = action.payload;
      state.location.lat = lat;
      state.location.lon = lon;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
  },
});

export const { setAddress, setLocation } = mapSlice.actions;
export default mapSlice.reducer;
