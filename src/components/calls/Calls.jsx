import { useContext } from "react";
import { calls } from "../../data/mockData";
import CallItem from "./CallItem";
import { AppContext, ViewContext } from "../../context/AppContext";

export default function Calls() {
  const { viewContext, setAppContext } = useContext(AppContext);
  if (viewContext !== ViewContext.CALLS) return null;

  const onClickItem = (item, vc) => {
    setAppContext((prev) => ({
      ...prev,
      userProfile: item,
      screen: "profile",
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {calls.map((call) => (
        <CallItem
          key={call.id}
          call={call}
          onClickItem={() => {
            onClickItem(call, ViewContext.CALLS);
          }}
        />
      ))}
    </div>
  );
}
