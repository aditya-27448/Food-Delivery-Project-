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
  const { userData } = useSelector((state) => state.user);
  const apikey = import.meta.env.VITE_GEOAPIKEY;
  useEffect(() => {
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
              const fetchedCity = result.data.results[0].city || result.data.results[0].county || "Bhubaneswar";
              const fetchedState = result.data.results[0].state || "Odisha";
              const fetchedAddress = result.data.results[0].formatted || "Bhubaneswar, Odisha, India";

              dispatch(setCurrentCity(fetchedCity));
              dispatch(setCurrentState(fetchedState));
              dispatch(setCurrentAddress(fetchedAddress));
              dispatch(setAddress(fetchedAddress));
            }
          }
        } catch (err) {
          console.log("Error fetching reverse geocode location:", err);
        }
      },
      (error) => {
        console.log("Geolocation permission or position error:", error?.message);
      }
    );
  }, [userData]);
}

export default useGetCity;
