import { useEffect, useState } from "react";
import {
  getUserInfo,
  getUserContacts,
  getUserGroups,
  getUserMessages,
  getUserCommunities,
} from "loony-api";

export const useUserInfo = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    getUserInfo().then((res) => {
      setUser(res.data);
    });
  }, []);

  return [user, setUser];
};

export const useContacts = () => {
  const [contacts, setContacts] = useState(null);
  useEffect(() => {
    getUserContacts().then((res) => {
      setContacts(res.data);
    });
  }, []);

  return [contacts, setContacts];
};

export const useGroups = () => {
  const [groups, setGroups] = useState(null);
  useEffect(() => {
    getUserGroups().then((res) => {
      setGroups(res.data);
    });
  }, []);

  return [groups, setGroups];
};

export const useMessages = () => {
  const [messages, setMessages] = useState(null);
  useEffect(() => {
    getUserMessages().then((res) => {
      setMessages(res.data);
    });
  }, []);

  return [messages, setMessages];
};

export const useCommunities = () => {
  const [communities, setCommunities] = useState(null);
  useEffect(() => {
    getUserCommunities().then((res) => {
      setCommunities(res.data);
    });
  }, []);

  return [communities, setCommunities];
};
