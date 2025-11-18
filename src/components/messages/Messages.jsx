import { useState, useContext } from "react";
import { contacts, groups } from "../../data/mockData";
import { GroupMessageItem, MessageItem } from "./MessageItem";
import { AppContext } from "../../context/AppContext";
import { useMessages } from "../../hooks";
import Empty from "../Empty";

export default function Chats() {
  const [messages] = useMessages();
  const [selectedChat, setSelectedChat] = useState(null);
  const { viewContext } = useContext(AppContext);
  if (viewContext !== "chats") return null;
  if (!messages) return <Empty />;

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.users.map((item, index) => (
        <MessageItem
          key={index}
          message={item}
          onClick={() => setSelectedChat(item)}
        />
      ))}
      {messages.groups.map((item, index) => (
        <GroupMessageItem
          key={index}
          message={item}
          // isActive={selectedChat?.id === item.id}
          onClick={() => setSelectedChat(item)}
        />
      ))}
    </div>
  );
}
