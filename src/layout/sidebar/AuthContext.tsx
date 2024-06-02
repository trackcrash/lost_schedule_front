import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  checkAuthorization: () => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAuthorization = useCallback((): boolean => {
    const userToken = localStorage.getItem("token");
    return !!userToken;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userNickname");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    setTimeout(() => {
      window.location.href = "/signin";
    }, 100);
  }, []);

  const saveTokenFromUrl = useCallback(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const userToken = urlSearchParams.get("token");
    const userNickname = urlSearchParams.get("nickname");
    const refreshToken = urlSearchParams.get("refreshtoken");

    if (userNickname && userToken && refreshToken) {
      localStorage.setItem("token", userToken);
      localStorage.setItem("userNickname", userNickname);
      localStorage.setItem("refreshToken", refreshToken);
      setIsLoggedIn(true);
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    setIsLoggedIn(checkAuthorization());
    saveTokenFromUrl();
  }, [checkAuthorization, saveTokenFromUrl]);

  return <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, checkAuthorization, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("AuthProvider밖에서 사용할 수 없습니다.");
  }
  return auth;
};
