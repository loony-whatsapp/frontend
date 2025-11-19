import { useCallback, useEffect, useState } from "react";
import {
  getUserInfo,
  getUserContacts,
  getUserGroups,
  getUserDMAndGM,
  getUserCommunities,
  getMessagesFromId,
  getGroupMessagesFromId,
  newMessage,
  newGroupMessage,
  getGroupInfo,
} from "loony-api";

/** User */
export const useUserInfo = (userId: number) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (userId) {
      getUserInfo(userId).then((res) => {
        setUser(res.data);
      });
    }
  }, [userId]);

  return [user, setUser];
};

export const useContacts = (userId: number) => {
  const [contacts, setContacts] = useState(null);
  useEffect(() => {
    if (userId) {
      getUserContacts(userId)
        .then((res) => {
          setContacts(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [userId]);

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

export const useDMAndGM = (userId: number) => {
  const [messages, setMessages] = useState(null);
  useEffect(() => {
    if (userId) {
      getUserDMAndGM(userId)
        .then((res) => {
          setMessages(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    return () => {
      setMessages(null);
    };
  }, [userId]);

  return [messages, setMessages];
};

export const useMessagesFromId = (userId: number, otherUserId: number) => {
  const [messages, setMessages] = useState(null);
  useEffect(() => {
    if (userId && otherUserId) {
      getMessagesFromId(userId, otherUserId)
        .then((res) => {
          setMessages(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [userId, otherUserId]);

  return [messages, setMessages];
};

export const useCommunities = (userId: number) => {
  const [communities, setCommunities] = useState(null);
  useEffect(() => {
    if (userId) {
      getUserCommunities(userId)
        .then((res) => {
          setCommunities(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [userId]);

  return [communities, setCommunities];
};

/** Group */

export const useGroupInfo = (groupId: number) => {
  const [group, setGroupInfo] = useState(null);
  useEffect(() => {
    if (groupId) {
      getGroupInfo(groupId).then((res) => {
        setGroupInfo(res.data);
      });
    }
  }, [groupId]);

  return [group, setGroupInfo];
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

/** Merged */

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
    newGroupMessage: (x: any) => {
      newGroupMessage(x)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  };
};
