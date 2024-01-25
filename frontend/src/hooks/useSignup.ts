import { useAdminContext } from "./useAdminContext";
import { useAuthContext } from "./useAuthContext";
import { useState } from "react";

const useSignup = () => {
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { dispatch } = useAuthContext();
  const { dispatch: roleDispatch } = useAdminContext();

  const signup = async (
    email: string,
    password: string,
    role: string,
    AuthToken: string
  ) => {
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("All Fields Are Required");
      setLoading(false);
      return;
    }
    if (role == "Admin" && !AuthToken) {
      setError("All Fields Are Required");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AuthToken}`
      } as HeadersInit,
      body: JSON.stringify({ email, password, role })
    });

    if (response.status == 500) {
      setLoading(false);
      setError("Unable to Signup Right now, Please try again later");
    }
    const data = await response.json();
    if (!response.ok) {
      setLoading(false);
      setError(data.error);
    }
    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(data));
      dispatch({
        type: "LOGIN",
        payload: data
      });
      roleDispatch({
        type: "ROLE",
        payload: "Basic"
      });
      setLoading(false);
    }
  };
  return { signup, loading, error };
};

export default useSignup;
