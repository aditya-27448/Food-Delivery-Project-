import toast from "react-hot-toast";

export const showError = (message) => {
  const text = message || "Something went wrong";
  toast.error(text, { id: `error-${text}` });
};