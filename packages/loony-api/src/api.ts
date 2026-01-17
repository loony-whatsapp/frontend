import { apiHttpClient, authHttpClient } from "./httpClient";

export const login = (creds) => authHttpClient.post("/login", creds);
export const logout = () => authHttpClient.post("/logout");
export const register = (creds) => authHttpClient.post("/signup", creds);

const authUserId = 1;

/** User */
export const getUserInfo = (userId) =>
  apiHttpClient.get(`/user/${userId}/userInfo`);
export const getAuthUserInfo = (userId) =>
  apiHttpClient.get(`/user/${userId}/authUserInfo`);
export const getUserContacts = (userId) =>
  apiHttpClient.get(`/user/${userId}/contacts`);
export const getUserGroups = (userId) =>
  apiHttpClient.get(`/user/${userId}/groups`);
export const getUserDMAndGM = (userId) =>
  apiHttpClient.get(`/user/${userId}/dmAndgm`);
export const getMessagesFromId = (userId, otherUserId) =>
  apiHttpClient.get(`/user/${userId}/${otherUserId}/messagesFrom`);
export const newMessage = (body) =>
  apiHttpClient.post("/user/newMessage", body);
export const getUserCommunities = (userId) =>
  apiHttpClient.get(`/user/${userId}/communities`);

/** Group */

export const getGroupInfo = (groupId) =>
  apiHttpClient.get(`/group/${groupId}/groupInfo`);
export const getGroupMessagesFromId = (groupId) =>
  apiHttpClient.get(`/group/${groupId}/groupMessages`);
export const getCommsPostsFromId = (com_id) =>
  apiHttpClient.get(`/community/${com_id}/posts`);
export const newGroupMessage = (body) =>
  apiHttpClient.post("/group/newMessage", body);
