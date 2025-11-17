import { apiHttpClient, authHttpClient } from "./httpClient";

export const login = (creds) => authHttpClient.post("/login", creds);
export const logout = () => authHttpClient.post("/logout");
export const register = (creds) => authHttpClient.post("/signup", creds);

/** User */
export const getUserInfo = () => authHttpClient.get("/user/msgd_users");
export const getUserContacts = () => authHttpClient.get("/user/contacts");
export const getUserGroups = () => authHttpClient.get("/user/groups");
export const getUserMessages = () => authHttpClient.get("/user/messages");
export const getUserCommunities = () => authHttpClient.get("/user/communities");
