import { useState, useContext } from "react";
import GroupItem from "./GroupItem";
import { AppContext } from "../../context/AppContext";
import { useGroups } from "../../hooks";
import Empty from "../Empty";

export default function Groups() {
  const [groups] = useGroups();
  const [selectedChat, setSelectedChat] = useState(null);

  const { viewContext } = useContext(AppContext);
  if (viewContext !== "groups") return null;
  if (!groups) return <Empty />;

  return (
    <div className="flex-1 overflow-y-auto">
      {groups.map((group) => (
        <GroupItem
          key={group.group_id}
          group={group}
          isActive={selectedChat?.id === group.group_id}
          onClick={() => setSelectedChat(group)}
        />
      ))}
    </div>
  );
}
