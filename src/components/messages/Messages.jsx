import { useContext } from "react";
import { MessageItem, GroupMessageItem } from "./MessageItem";
import { AppContext, ViewContext } from "../../context/AppContext";
import { useMessages } from "../../hooks";
import Empty from "../Empty";

function RenderMessages() {
  const [messages] = useMessages();
  const { setAppContext, selectedChat } = useContext(AppContext);
  if (!messages) return <Empty />;

  const onClickItem = (item, vc) => {
    setAppContext((prev) => ({
      ...prev,
      selectedChat: item,
      sideViewContext: vc,
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.users.map((message, index) => (
        <MessageItem
          key={index}
          message={message}
          isActive={selectedChat?.msg_id === message.msg_id}
          onClick={() => onClickItem(message, ViewContext.DM)}
        />
      ))}
      {messages.groups.map((message, index) => (
        <GroupMessageItem
          key={index}
          message={message}
          // isActive={selectedChat?.id === item.id}
          onClick={() => onClickItem(message, ViewContext.GM)}
        />
      ))}
    </div>
  );
}

export default function Messages() {
  const { viewContext } = useContext(AppContext);
  if (viewContext !== ViewContext.DM) return null;
  return <RenderMessages />;
}
