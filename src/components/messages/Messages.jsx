import { useContext } from "react";
import { MessageItem, GroupMessageItem } from "./MessageItem";
import { AppContext, ViewContext } from "../../context/AppContext";
import { useDMAndGM } from "../../hooks";
import Empty from "../Empty";

function RenderMessages() {
  const [messages] = useDMAndGM(1);
  const { setAppContext, selectedChat } = useContext(AppContext);
  if (!messages) return <Empty />;

  const onClickItem = (item, vc) => {
    setAppContext((prev) => ({
      ...prev,
      selectedChat: item,
      chatAreaContext: vc,
      screen: "chat",
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.directMessages.map((message, index) => (
        <MessageItem
          key={index}
          message={message}
          isActive={selectedChat?.msg_id === message.msg_id}
          onClick={() => onClickItem(message, ViewContext.DM)}
        />
      ))}
      {messages.groupMessages.map((message, index) => (
        <GroupMessageItem
          key={index}
          message={message}
          onClick={() => onClickItem(message, ViewContext.GM)}
        />
      ))}
    </div>
  );
}

export default function Messages() {
  const { tabContext } = useContext(AppContext);
  if (tabContext !== ViewContext.DM) return null;
  return <RenderMessages />;
}
