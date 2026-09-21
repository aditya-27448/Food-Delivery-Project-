import { createSlice } from "@reduxjs/toolkit";
import { update } from "firebase/database";

const savedLat = localStorage.getItem("defaultLat");
const savedLon = localStorage.getItem("defaultLon");
const savedAddress = localStorage.getItem("defaultAddress");

const mapSlice = createSlice({
  name: "map",
  initialState: {
    location: {
      lat: savedLat ? parseFloat(savedLat) : 20.2961,
      lon: savedLon ? parseFloat(savedLon) : 85.8245,
    },
    address: savedAddress || "Bhubaneswar, Odisha, India",
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
