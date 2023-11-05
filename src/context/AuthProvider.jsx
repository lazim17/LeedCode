import { createContext, useState } from "react";

//Creating AuthContext
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  //UseState for Auth Values
  const [auth, setAuth] = useState({
    success:false
  });
  console.log(auth)
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
