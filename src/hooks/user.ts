import { useCallback, useEffect, useState } from "react";
import {
  getUserInfo,
  getUserContacts,
  getUserGroups,
  getUserMessages,
  getUserCommunities,
  getMessagesFromId,
  getGroupMessagesFromId,
  newMessage,
} from "loony-api";
import { body } from "framer-motion/client";

export const useUserInfo = (userId: number) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    getUserInfo(userId).then((res) => {
      setUser(res.data);
    });
  }, [userId]);

  return [user, setUser];
};

export const useContacts = () => {
  const [contacts, setContacts] = useState(null);
  useEffect(() => {
    getUserContacts()
      .then((res) => {
        setContacts(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return [contacts, setContacts];
};

export const useGroups = (userId: number) => {
  const [groups, setGroups] = useState(null);
  useEffect(() => {
    getUserGroups(userId)
      .then((res) => {
        setGroups(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [userId]);

  return [groups, setGroups];
};

export const useMessages = () => {
  const [messages, setMessages] = useState(null);
  useEffect(() => {
    getUserMessages()
      .then((res) => {
        setMessages(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return [messages, setMessages];
};

export const useMessagesFromId = (userId: number) => {
  const [messages, setMessages] = useState(null);
  useEffect(() => {
    if (userId) {
      getMessagesFromId(userId)
        .then((res) => {
          setMessages(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [userId]);

  return [messages, setMessages];
};

export const useGroupMessagesFromId = (groupId: number) => {
  const [messages, setMessages] = useState(null);
  useEffect(() => {
    if (groupId) {
      getGroupMessagesFromId(groupId)
        .then((res) => {
          setMessages(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [groupId]);

  return [messages, setMessages];
};

export const useNewMessage = () => {
  return {
    newMessage: (x: any) => {
      newMessage(x)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  };
};

export const useCommunities = () => {
  const [communities, setCommunities] = useState(null);
  useEffect(() => {
    getUserCommunities()
      .then((res) => {
        setCommunities(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return [communities, setCommunities];
};
