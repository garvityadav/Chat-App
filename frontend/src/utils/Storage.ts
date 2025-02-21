//To store user id on session storage

export const setUser = (userId: string, sessionExpiry: number): void => {
  if (userId) sessionStorage.setItem("userId", userId);
  sessionStorage.setItem("expiryTime", sessionExpiry.toString());
};

export const getUser = () => {
  const userId = sessionStorage.getItem("userId") || "";
  const expiryTime = sessionStorage.getItem("expiryTime") || "";

  if (userId && expiryTime && Date.now() < Number(expiryTime))
    return sessionStorage.getItem("userId");
};
