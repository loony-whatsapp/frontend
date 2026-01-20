import { useContext } from "react";
import { calls } from "../../data/mockData";
import CallItem from "./CallItem";
import { AppContext, CHAT_AREA_NAME, TAB_NAME } from "../../context/AppContext";

export default function Calls() {
  const { tabName, setAppContext } = useContext(AppContext);
  if (tabName !== TAB_NAME.CALLS) return null;

  const onClickItem = (callData, tabName) => {
    setAppContext((prev) => ({
      ...prev,
      chatAreaName: CHAT_AREA_NAME.USER_INFO,
      data: callData,
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {calls.map((call) => (
        <CallItem
          key={call.id}
          call={call}
          onClickItem={() => {
            onClickItem(call, CHAT_AREA_NAME.USER_INFO);
          }}
        />
      ))}
    </div>
  );
}
