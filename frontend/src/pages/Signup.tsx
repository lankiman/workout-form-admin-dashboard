import { useState } from "react";
import handleKeyDown from "../utils/keyboardUtils";
import useSignup from "../hooks/useSignup";
import { useAdminContext } from "../hooks/useAdminContext";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authToken, setAuthToken] = useState<any>("");
  const { signup, error, loading } = useSignup();
  const { role } = useAdminContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signup(email, password, role, authToken);
  };
  return (
    <div>
      <form className="signup" onSubmit={handleSubmit}>
        <h3>Sign up</h3>
        <label htmlFor="email">Email</label>
        <input
          value={email}
          onKeyDown={handleKeyDown}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <label htmlFor="password">Password</label>
        <input
          value={password}
          onKeyDown={handleKeyDown}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          name="password"
        />
        {role == "Admin" ? (
          <>
            <label htmlFor="authToken">Enter Authorization Token</label>
            <input
              type="password"
              value={authToken}
              onChange={(e) => {
                setAuthToken(e.target.value);
              }}
            />
          </>
        ) : (
          ""
        )}
        <button disabled={loading}>Sign Up</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default Signup;
