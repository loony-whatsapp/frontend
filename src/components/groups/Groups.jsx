import { useState, useContext } from "react";
import GroupItem from "./GroupItem";
import { AppContext, CHAT_AREA_NAME, TAB_NAME } from "../../context/AppContext";
import { useGroups } from "../../hooks";
import Empty from "../Empty";

export default function Groups() {
  const [groups] = useGroups(1);
  const { setAppContext, tabName } = useContext(AppContext);

  if (!groups) return <Empty />;
  if (tabName !== TAB_NAME.GROUPS) return null;

  const onClickItem = (data) => {
    setAppContext((prev) => ({
      ...prev,
      data,
      chatAreaName: CHAT_AREA_NAME.GROUP_MESSAGES,
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {groups.map((group) => (
        <GroupItem
          key={group.id}
          group={group}
          onClick={() => onClickItem(group)}
        />
      ))}
    </div>
  );
}
