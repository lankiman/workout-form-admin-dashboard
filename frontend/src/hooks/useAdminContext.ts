import { useContext } from "react";
import { AdminAuthContext } from "../context/AdminContext";

export const useAdminContext = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw Error("Context used within wrong component tree");
  }
  return context;
};
