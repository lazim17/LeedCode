import { createContext, useEffect, useState } from "react";
//Creating AuthContext
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  //UseState for Auth Values
  const [auth, setAuth] = useState({});
  console.log(auth)
  useEffect(() => {
    if (auth.loginData !== undefined) {
      sessionStorage.setItem("Username", auth.loginData.username);
    } else {
      var username = sessionStorage.getItem("Username");
      if (username !== null) {
        setAuth({ success: true, loginData: { "username": username } });
      }
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
