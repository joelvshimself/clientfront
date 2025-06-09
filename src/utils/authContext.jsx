import { createContext, useState, useEffect } from "react";
import { getUserInfo } from "../services/authService";
import PropTypes from "prop-types";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { ok, data } = await getUserInfo();
        if (!ok)   
        throw new Error("No auth");
        setUser(data);
      } catch (err) {
        console.error("Error fetching user info:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
