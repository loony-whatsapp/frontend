import { useContext } from "react";
import { calls } from "../../data/mockData";
import CallItem from "./CallItem";
import { AppContext, ViewContext } from "../../context/AppContext";

export default function Calls() {
  const { viewContext } = useContext(AppContext);
  if (viewContext !== ViewContext.CALLS) return null;

  return (
    <div className="flex-1 overflow-y-auto">
      {calls.map((call) => (
        <CallItem key={call.id} call={call} />
      ))}
    </div>
  );
}
