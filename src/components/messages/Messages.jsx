import { useContext } from "react";
import { MessageItem, GroupMessageItem } from "./MessageItem";
import { AppContext, CHAT_AREA_NAME, TAB_NAME } from "../../context/AppContext";
import { useDMAndGM } from "../../hooks";
import Empty from "../Empty";

function RenderMessages() {
  const [messages] = useDMAndGM(1);
  const { setAppContext, tabName } = useContext(AppContext);
  if (!messages) return <Empty />;
  if (tabName !== TAB_NAME.ALL_MESSAGES) return null;

  const onClickItem = (item, chatAreaName) => {
    setAppContext((prev) => ({
      ...prev,
      data: item,
      chatAreaName: chatAreaName,
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.directMessages.map((message, index) => (
        <MessageItem
          key={index}
          message={message}
          onClick={() => onClickItem(message, CHAT_AREA_NAME.DIRECT_MESSAGES)}
        />
      ))}
      {messages.groupMessages.map((message, index) => (
        <GroupMessageItem
          key={index}
          message={message}
          onClick={() => onClickItem(message, CHAT_AREA_NAME.GROUP_MESSAGES)}
        />
      ))}
    </div>
  );
}

export default function Messages() {
  const { tabName } = useContext(AppContext);
  if (tabName !== TAB_NAME.ALL_MESSAGES) return null;
  return <RenderMessages />;
}
