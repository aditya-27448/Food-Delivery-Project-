import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentAddress,
  setCurrentCity,
  setCurrentState,
} from "../redux/userSlice";
import { setAddress, setLocation } from "../redux/mapSlice";

function useGetCity() {
  const dispatch = useDispatch();
  const { userData, defaultAddress } = useSelector((state) => state.user);
  const apikey = import.meta.env.VITE_GEOAPIKEY;

  // Normalize city names by stripping common suffixes from geocoding APIs
  const normalizeCity = (cityName) => {
    if (!cityName) return cityName;
    return cityName
      .replace(/\s*\(M\.Corp\.\)\s*/gi, '')
      .replace(/\s*Municipal\s*Corporation\s*/gi, '')
      .replace(/\s*M\.Corp\.\s*/gi, '')
      .trim();
  };

  useEffect(() => {
    // If user already has a saved default address in localStorage or profile, respect it
    const storedDefault =
      localStorage.getItem("defaultAddress") || userData?.defaultAddress;
    if (storedDefault) {
      const storedCity =
        localStorage.getItem("defaultCity") || userData?.defaultCity;
      const storedState =
        localStorage.getItem("defaultState") || userData?.defaultState;
      if (storedCity) dispatch(setCurrentCity(storedCity));
      if (storedState) dispatch(setCurrentState(storedState));
      dispatch(setCurrentAddress(storedDefault));
      dispatch(setAddress(storedDefault));
      return;
    }

    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          dispatch(setLocation({ lat: latitude, lon: longitude }));
          if (apikey) {
            const result = await axios.get(
              `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apikey}`,
            );
            if (result?.data?.results?.[0]) {
              const fetchedCity =
                normalizeCity(result.data.results[0].city ||
                result.data.results[0].county) ||
                "Bhubaneswar";
              const fetchedState =
                result.data.results[0].state || "Odisha";
              const fetchedAddress =
                result.data.results[0].formatted ||
                `${fetchedCity}, ${fetchedState}, India`;

              dispatch(setCurrentCity(fetchedCity));
              dispatch(setCurrentState(fetchedState));
              dispatch(setCurrentAddress(fetchedAddress));
              dispatch(setAddress(fetchedAddress));

              // Set as default for the first time
              localStorage.setItem("defaultAddress", fetchedAddress);
              localStorage.setItem("defaultCity", fetchedCity);
              localStorage.setItem("defaultState", fetchedState);
              localStorage.setItem("defaultLat", latitude.toString());
              localStorage.setItem("defaultLon", longitude.toString());
            }
          }
        } catch (err) {
          console.log("Error fetching reverse geocode location:", err);
        }
      },
      (error) => {
        console.log(
          "Geolocation permission or position error:",
          error?.message,
        );
      },
    );
  }, [userData]);
}

export default useGetCity;
