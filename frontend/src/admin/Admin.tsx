import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAdminContext } from "../hooks/useAdminContext";
import { useAuthContext } from "../hooks/useAuthContext";

const Admin = () => {
  const access = import.meta.env.VITE_ACCESS;
  const [key, setKey] = useState<any>("");
  const [message, setMessage] = useState<any>(null);
  const navigate = useNavigate();
  const { dispatch } = useAdminContext();
  const { user } = useAuthContext();

  console.log(user);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (key != access) {
      setMessage("invalid Acess Token");
      dispatch({
        type: "ROLE",
        payload: "Basic"
      });
      setTimeout(() => {
        navigate("/");
      }, 1500);
      return;
    }
    setMessage("Token Accepted");
    dispatch({
      type: "ROLE",
      payload: "Admin"
    });
    setTimeout(() => {
      navigate("/signup");
    }, 1500);
  };
  return (
    <div className="">
      <form className="admin" onSubmit={handleSubmit}>
        <p>Welcome Administrator!</p>
        <label>Enter Admin Key to Signup as Admin</label>
        <input
          value={key}
          type="password"
          onChange={(e) => {
            setKey(e.target.value);
          }}
        />
        <button>Submit</button>
        {message ? <div className="mt-6">{message}</div> : ""}
      </form>
    </div>
  );
};

export default Admin;
