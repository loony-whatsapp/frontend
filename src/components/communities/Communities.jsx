import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useCommunities } from "../../hooks";
import Empty from "../Empty";

export default function Communities() {
  const [communities] = useCommunities();
  const { viewContext } = useContext(AppContext);
  if (viewContext !== "communities") return null;
  if (!communities) return <Empty />;

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="bg-whatsapp-green text-gray p-4 rounded-lg mb-4">
        <h3 className="font-bold text-lg">Communities</h3>
        <p className="text-sm opacity-90">
          Stay connected with your communities
        </p>
      </div>
      {communities.map((community) => (
        <div
          key={community.com_id}
          className="flex items-center p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
        >
          <img
            src={`http://localhost:2000/file/${community.com_id}`}
            alt={community.com_name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="ml-3">
            <h3 className="font-semibold text-gray-800">
              {community.com_name}
            </h3>
            <p className="text-sm text-gray-600">{community.description}</p>
            <p className="text-xs text-gray-500">{343} members</p>
          </div>
        </div>
      ))}
    </div>
  );
}
