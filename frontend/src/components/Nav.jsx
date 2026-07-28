import { useEffect, useState } from "react";
import { FaLocationDot, FaPlus } from "react-icons/fa6";
import { LuReceiptIndianRupee } from "react-icons/lu";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { ImCross } from "react-icons/im";
import axios from "axios";
import { serverURL } from "../App";
import { setSearchItems, setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

function Nav() {
  const { userData, currentCity, cartItems } = useSelector(
    (state) => state.user,
  );
  const { myShopData } = useSelector((state) => state.owner);
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");

  const handleLogOut = async () => {
    try {
      const result = await axios.get(`${serverURL}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };
  const handleSearchItems = async (query) => {
    try {
      const result = await axios.get(
        `${serverURL}/api/item/search-items?query=${query}&city=${currentCity}`,
        { withCredentials: true },
      );
      dispatch(setSearchItems(result.data));
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (query) {
      handleSearchItems(query);
    } else {
      dispatch(setSearchItems(null));
    }
  }, [query]);

  return (
    // main nav container - fixed at top, high z-index
    <div className="w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] px-[20px] fixed top-0 z-[9999] bg-[#fff9f6] overflow-visible">
      {/* mobile search dropdown - only for user role, shown when showSearch is true */}
      {userData.role == "user" && showSearch && (
        <div className="w-[90%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-[20px] flex fixed top-[80px] left-[5%] md:hidden">
          {/* location section */}
          <div className="flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400">
            <FaLocationDot size={25} className="text-[#ff4d2d]" />
            <div className="w-[80%] truncate text-gray-600">{currentCity}</div>
          </div>
          {/* search input section */}
          <div className="flex items-center w-[80%] gap-[10px]">
            <FaSearch size={25} className="text-[#ff4d2d] " />
            <input
              type="text"
              placeholder="Search delicious food..."
              className="px-[10px] text-gray-700 outline-0 w-full"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
          </div>
        </div>
      )}

      {/* brand logo */}
      <h1 className="text-3xl font-bold md-2 text-[#ff4d2d]">Food Bus</h1>

      {/* desktop searchbar - only for user role, hidden on mobile */}
      {userData.role == "user" && (
        <div className="md:w-[60%] lg:w-[40%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-[20px] hidden md:flex">
          {/* location section */}
          <div className="flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400">
            <FaLocationDot size={25} className="text-[#ff4d2d]" />
            <div className="w-[80%] truncate text-gray-600">{currentCity}</div>
          </div>
          {/* search input section */}
          <div className="flex items-center w-[80%] gap-[10px]">
            <FaSearch size={25} className="text-[#ff4d2d] " />
            <input
              type="text"
              placeholder="Search delicious food..."
              className="px-[10px] text-gray-700 outline-0 w-full"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
          </div>
        </div>
      )}

      {/* right side icons and buttons */}
      <div className="flex items-center gap-4">
        {/* mobile search toggle icon - only for user role */}
        {userData.role == "user" &&
          (showSearch ? (
            // close icon when search is open
            <ImCross
              size={25}
              className="text-[#ff4d2d] md:hidden"
              onClick={() => setShowSearch(false)}
            />
          ) : (
            // search icon when search is closed
            <FaSearch
              size={25}
              className="text-[#ff4d2d] md:hidden"
              onClick={() => setShowSearch(true)}
            />
          ))}

        {/* role-based buttons */}
        {userData.role == "owner" ? (
          <>
            {/* add food item button - only shown if shop exists */}
            {myShopData && (
              <>
                {/* desktop add food button */}
                <button
                  className="hidden md:flex items-center gap-1 p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]"
                  onClick={() => navigate("/add-item")}
                >
                  <FaPlus size={20} />
                  <span>Add Food Item</span>
                </button>
                {/* mobile add food button (icon only) */}
                <button className="md:hidden flex items-center gap-1 p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]">
                  <FaPlus size={20} />
                </button>
              </>
            )}

            {/* desktop pending orders button */}
            <div
              className="hidden md:flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg font-medium bg-[#ff4d2d]/10 text-[#ff4d2d]"
              onClick={() => navigate("/my-orders")}
            >
              <LuReceiptIndianRupee size={20} />
              <span>My Orders</span>
            </div>
            {/* mobile pending orders button (icon only) */}
            <div
              className="md:hidden flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg font-medium bg-[#ff4d2d]/10 text-[#ff4d2d]"
              onClick={() => navigate("/my-orders")}
            >
              <LuReceiptIndianRupee size={20} />
            </div>
          </>
        ) : (
          <>
            {userData.role == "user" && (
              <div
                className="relative cursor-pointer"
                onClick={() => navigate("/cart")}
              >
                <FaShoppingCart size={25} className="text-[#ff4d2d]" />
                <span className="absolute right-[-9px] top-[-12px] text-[#ff4d2d]">
                  {cartItems.length}
                </span>
              </div>
            )}
            {/* cart icon - for non-owner roles */}

            {/* my orders button - hidden on mobile */}
            <button
              className="hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium "
              onClick={() => navigate("/my-orders")}
            >
              My Orders
            </button>
          </>
        )}

        {/* user avatar - shows first letter of name, toggles info dropdown */}
        <div
          className="w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#ff4d2d] text-white text-[18px] shadow-xl font-semibold cursor-pointer "
          onClick={() => setShowInfo((prev) => !prev)}
        >
          {userData?.fullName.slice(0, 1)}
        </div>

        {/* user info dropdown */}
        {showInfo && (
          <div
            className={`fixed top-[80px] right-[10px]
          ${userData.role == "deliveryBoy" ? "md:right-[20%] lg:right-[40%]" : "md:right-[10%] lg:right-[25%]"}  w-[180px] bg-white shadow-2xl rounded-xl p-[20px] flex flex-col gap-[10px] z-[9999]`}
          >
            {/* user full name */}
            <div className="text-[17px] font-semibold ">
              {userData.fullName}
            </div>

            {/* my orders - mobile only && owner only */}
            {userData.role == "user" && (
              <div
                className="md:hidden text-[#ff4d2d] font-semibold cursor-pointer "
                onClick={() => navigate("/my-orders")}
              >
                My Orders
              </div>
            )}

            {/* logout button */}
            <div
              className="text-[#ff4d2d] font-semibold cursor-pointer "
              onClick={handleLogOut}
            >
              Log Out
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Nav;
