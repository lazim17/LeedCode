import { createContext, useEffect, useState } from "react";

//Creating AuthContext
const TokenContext = createContext({});

export const TokenProvider = ({ children }) => {
  //UseState for Auth Values
  
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  console.log(token)
  console.log(localStorage.getItem('Username'))
  console.log(localStorage.getItem('status'))

  return (
    <TokenContext.Provider value={{ token, role, setToken, setRole }}>
      {children}
    </TokenContext.Provider>
  );
};

export default TokenContext;
