import { useContext } from "react";
import { FaPhone } from "react-icons/fa";
import { AppContext, TAB_NAME } from "../../context/AppContext";

export default function Calls() {
  const { tabName } = useContext(AppContext);
  if (tabName !== TAB_NAME.CALLS) return null;

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
      <FaPhone size={40} className="mb-4 opacity-30" />
      <p className="text-sm">No recent calls</p>
    </div>
  );
}
