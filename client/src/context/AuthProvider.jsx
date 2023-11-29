import { createContext, useEffect, useState } from "react";

//Creating AuthContext
const TokenContext = createContext({});

export const TokenProvider = ({ children }) => {
  //UseState for Auth Values
  
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [taskId, setTaskId] = useState(localStorage.getItem("taskId"));
  const [taskStatus, setTaskStatus] = useState(localStorage.getItem("taskStatus"));


  return (
    <TokenContext.Provider value={{ token, role, setToken, setRole, taskId, setTaskId,taskStatus, setTaskStatus }}>
      {children}
    </TokenContext.Provider>
  );
};

export default TokenContext;
