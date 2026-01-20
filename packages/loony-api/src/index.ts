import { Axios } from "./httpClient";

export { Axios } from "./httpClient";

export default function run(url: string) {
  const axios = Axios(url);

  return {
    login: (creds: any) => axios.post("/login", creds),
    logout: () => axios.post("/logout"),
    register: (creds: any) => axios.post("/signup", creds),
    getUserInfo: (userId) => axios.get(`/user/${userId}/userInfo`),
    getAuthUserInfo: (userId) => axios.get(`/users/info`),
    getUserContacts: (userId) => axios.get(`/users/contacts`),
    getUserGroups: (userId) => axios.get(`/groups`),
    getUserDMAndGM: (userId) =>
      axios.get(`/messages/direct/group/${userId}/messages`),
    getMessagesFromId: (userId, otherUserId) =>
      axios.get(`/messages/direct/${otherUserId}`),
    newMessage: (body: any) => axios.post("/messages/direct", body),
    getUserCommunities: (userId) => axios.get(`/communities`),

    getGroupInfo: (groupId) => axios.get(`/group/${groupId}/groupInfo`),
    getGroupMessagesFromId: (groupId) =>
      axios.get(`/messages/groups/${groupId}/messages`),
    getCommsPostsFromId: (com_id) => axios.get(`/communities/${com_id}/posts`),
    newGroupMessage: (body: any) => axios.post("/messages/group/message", body),
  };
}
