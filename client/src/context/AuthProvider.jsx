import { createContext, useEffect, useState } from "react";

//Creating AuthContext
const TokenContext = createContext({});

export const TokenProvider = ({ children }) => {
  //UseState for Auth Values
  
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [taskStatus, setTaskStatus] = useState(localStorage.getItem("taskStatus"));

  const [idDictionary, setIdDictionary] = useState(() => {
    const storedIdDictionary = localStorage.getItem("idDictionary");
    return storedIdDictionary ? JSON.parse(storedIdDictionary) : []; // Initialize as an array
  });

  const setIds = (examid, taskId) => {
    // Ensure idDictionary is an array
    const currentIdDictionary = Array.isArray(idDictionary) ? idDictionary : [];

    // Create a new key-value pair object
    const newPair = { examid, taskId };

    // Update the idDictionary by creating a new array
    const newIdDictionary = [...currentIdDictionary, newPair];

    // Update localStorage with the new array
    localStorage.setItem("idDictionary", JSON.stringify(newIdDictionary));

    // Set the new array in state
    setIdDictionary(newIdDictionary);
  };


  return (
    <TokenContext.Provider value={{ token, role, setToken, setRole,taskStatus, setTaskStatus, setIdDictionary,setIds,idDictionary }}>
      {children}
    </TokenContext.Provider>
  );
};

export default TokenContext;
