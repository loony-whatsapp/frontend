import { useState, useContext } from "react";
import { GroupMessageItem, MessageItem } from "./MessageItem";
import { AppContext } from "../../context/AppContext";
import { useMessages } from "../../hooks";
import Empty from "../Empty";

function RenderMessages() {
  const [messages] = useMessages();
  const { setAppContext, viewContext, selectedChat } = useContext(AppContext);
  if (!messages) return <Empty />;

  const onClickItem = (item) => {
    setAppContext({
      viewContext,
      selectedChat: item,
    });
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.users.map((message, index) => (
        <MessageItem
          key={index}
          message={message}
          isActive={selectedChat?.msg_id === message.msg_id}
          onClick={() => onClickItem(message)}
        />
      ))}
      {messages.groups.map((message, index) => (
        <GroupMessageItem
          key={index}
          message={message}
          // isActive={selectedChat?.id === item.id}
          onClick={() => {}}
        />
      ))}
    </div>
  );
}

export default function Messages() {
  const { viewContext } = useContext(AppContext);
  if (viewContext !== "chats") return null;
  return <RenderMessages />;
}
