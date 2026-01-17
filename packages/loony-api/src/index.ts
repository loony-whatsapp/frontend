import { Axios } from "./httpClient";

export { Axios, apiHttpClient, authHttpClient } from "./httpClient";

export default function run(url: string) {
  const axios = Axios(url);

  return {
    login: (creds: any) => axios.post("/login", creds),
    logout: () => axios.post("/logout"),
    register: (creds: any) => axios.post("/signup", creds),
    getUserInfo: (userId) => axios.get(`/user/${userId}/userInfo`),
    getAuthUserInfo: (userId) => axios.get(`/user/${userId}/authUserInfo`),
    getUserContacts: (userId) => axios.get(`/users/contacts`),
    getUserGroups: (userId) => axios.get(`/groups`),
    getUserDMAndGM: (userId) =>
      axios.get(`/messages/direct/group/${userId}/messages`),
    getMessagesFromId: (userId, otherUserId) =>
      axios.get(`/messages/direct/${otherUserId}`),
    newMessage: (body: any) => axios.post("/user/newMessage", body),
    getUserCommunities: (userId) => axios.get(`/communities`),

    getGroupInfo: (groupId) => axios.get(`/group/${groupId}/groupInfo`),
    getGroupMessagesFromId: (groupId) =>
      axios.get(`/messages/groups/${groupId}/messages`),
    getCommsPostsFromId: (com_id) => axios.get(`/community/${com_id}/posts`),
    newGroupMessage: (body: any) => axios.post("/group/newMessage", body),
  };
}
