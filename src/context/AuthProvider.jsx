import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Creating AuthContext
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  //UseState for Auth Values
  
  const [auth, setAuth] = useState(localStorage.getItem('Status') !== true);
  const navigate = useNavigate();
  console.log(auth)
  console.log(localStorage.getItem('Username'))

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
