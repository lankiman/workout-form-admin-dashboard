import { ReactNode, createContext, useReducer } from "react";

interface Props {
  children: ReactNode;
}

export const AdminAuthContext = createContext<any>([]);

export const AuthReducer = (role: any, action: any) => {
  switch (action.type) {
    case "ROLE":
      return { role: action.payload };
    default:
      return role;
  }
};

export const AdminProvider = ({ children }: Props) => {
  const [role, dispatch] = useReducer(AuthReducer, {
    role: "Basic"
  });
  console.log("Admin State", role);
  return (
    <AdminAuthContext.Provider value={{ ...role, dispatch }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
