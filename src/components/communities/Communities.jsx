import { useContext } from "react";
import { AppContext, ViewContext } from "../../context/AppContext";
import { useCommunities } from "../../hooks";
import Empty from "../Empty";

export default function Communities() {
  const [communities] = useCommunities(1);
  const { viewContext, setAppContext } = useContext(AppContext);
  if (viewContext !== ViewContext.COMMS) return null;
  if (!communities) return <Empty />;

  const onClickItem = (item, vc) => {
    setAppContext((prev) => ({
      ...prev,
      selectedChat: item,
      chatAreaContext: vc,
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="bg-whatsapp-green-500 text-gray p-4 rounded-lg mb-4">
        <h3 className="font-bold text-lg">Communities</h3>
        <p className="text-sm opacity-90">
          Stay connected with your communities
        </p>
      </div>
      {communities.map((community) => (
        <div
          key={community.com_id}
          className="flex items-center p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
          onClick={() => onClickItem(community, ViewContext.COMMS)}
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
