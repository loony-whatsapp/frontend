import { Axios } from "./httpClient";

export { Axios } from "./httpClient";

export default function run(url: string) {
  const axios = Axios(url);

  return {
    login: (creds: any) => axios.post("/auth/login", creds),
    logout: () => axios.post("/auth/logout"),
    register: (creds: any) => axios.post("/auth/register", creds),

    getAuthUserInfo: () => axios.get("/users/info"),
    getUserInfo: (userId: number) => axios.get(`/users/${userId}/info`),
    getUserContacts: () => axios.get("/users/contacts"),
    getUserGroups: () => axios.get("/groups"),
    getUserDMAndGM: (userId: number) =>
      axios.get(`/messages/direct/group/${userId}/messages`),
    getMessagesFromId: (userId: number, otherUserId: number) =>
      axios.get(`/messages/direct/${otherUserId}`),
    newMessage: (body: any) => axios.post("/messages/direct", body),
    getUserCommunities: () => axios.get("/communities"),

    getGroupInfo: (groupId: number) => axios.get(`/groups/${groupId}`),
    getGroupMessagesFromId: (groupId: number) =>
      axios.get(`/messages/groups/${groupId}/messages`),
    getCommsPostsFromId: (com_id: number) =>
      axios.get(`/communities/${com_id}/posts`),
    newGroupMessage: (body: any) => axios.post("/messages/group/message", body),
  };
}
