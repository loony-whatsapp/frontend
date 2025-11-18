import { useState, useContext } from "react";
import { GroupMessageItem, MessageItem } from "./MessageItem";
import { AppContext } from "../../context/AppContext";
import { useMessages } from "../../hooks";
import Empty from "../Empty";

function RenderMessages() {
  const [messages] = useMessages();
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

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(null);
  const { viewContext } = useContext(AppContext);
  if (viewContext !== "chats") return null;
  return <RenderMessages />;
}
