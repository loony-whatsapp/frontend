import { apiHttpClient, authHttpClient } from "./httpClient";

export const login = (creds) => authHttpClient.post("/login", creds);
export const logout = () => authHttpClient.post("/logout");
export const register = (creds) => authHttpClient.post("/signup", creds);

/** User */
export const getUserInfo = (userId) =>
  authHttpClient.get("/user/user_info" + "/" + userId);
export const getGroupInfo = (group_id) =>
  authHttpClient.get("/user/groupInfo" + "/" + group_id);
export const getUserContacts = () => authHttpClient.get("/user/contacts");
export const getUserGroups = (userId) =>
  authHttpClient.get("/user/groups" + "/" + userId);
export const getUserMessages = () => authHttpClient.get("/user/messages");
export const getMessagesFromId = (userId) =>
  authHttpClient.get("/user/messagesFrom" + "/" + userId);
export const getGroupMessagesFromId = (groupId) =>
  authHttpClient.get("/user/messagesFrom/group" + "/" + groupId);
export const newMessage = (body) =>
  authHttpClient.post("/user/newMessage", body);
export const newGroupMessage = (body) =>
  authHttpClient.post("/user/group/newMessage", body);

export const getUserCommunities = () => authHttpClient.get("/user/communities");
