import { apiHttpClient, authHttpClient } from "./httpClient";

export const login = (creds) => authHttpClient.post("/login", creds);
export const logout = () => authHttpClient.post("/logout");
export const register = (creds) => authHttpClient.post("/signup", creds);

const authUserId = 1;

/** User */
export const getUserInfo = (userId) =>
  authHttpClient.get(`/user/${userId}/userInfo`);
export const getUserContacts = (userId) =>
  authHttpClient.get(`/user/${userId}/contacts`);
export const getUserGroups = (userId) =>
  authHttpClient.get(`/user/${userId}/groups`);
export const getUserDMAndGM = (userId) =>
  authHttpClient.get(`/user/${userId}/dmAndgm`);
export const getMessagesFromId = (userId, otherUserId) =>
  authHttpClient.get(`/user/${userId}/${otherUserId}/messagesFrom`);
export const newMessage = (body) =>
  authHttpClient.post("/user/newMessage", body);
export const getUserCommunities = (userId) =>
  authHttpClient.get(`/user/${userId}/communities`);

/** Group */

export const getGroupInfo = (groupId) =>
  authHttpClient.get(`/group/${groupId}/groupInfo`);
export const getGroupMessagesFromId = (groupId) =>
  authHttpClient.get(`/group/${groupId}/groupMessages`);
export const getCommsPostsFromId = (com_id) =>
  authHttpClient.get(`/community/${com_id}/posts`);
export const newGroupMessage = (body) =>
  authHttpClient.post("/group/newMessage", body);
