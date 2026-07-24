import AsyncStorage from "@react-native-async-storage/async-storage";

// Small helpers around AsyncStorage (React Native's version of
// localStorage) for saving/reading the login token and username. Every
// function here returns a Promise because AsyncStorage is always async.
const TOKEN_KEY = "token";
const USER_KEY = "user";

export const saveToken = (token: string) => AsyncStorage.setItem(TOKEN_KEY, token);
export const getToken = () => AsyncStorage.getItem(TOKEN_KEY);

export const saveUser = (username: string) => AsyncStorage.setItem(USER_KEY, username);
export const getUser = () => AsyncStorage.getItem(USER_KEY);

export const clearAuth = () => AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
