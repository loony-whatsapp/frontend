import { useContext } from "react";
import { FaPlus } from "react-icons/fa";
import { AppContext, CHAT_AREA_NAME, TAB_NAME } from "../../context/AppContext";
import { useContacts } from "../../hooks";
import Empty from "../Empty";
import { API_URL } from "../../Config";

export default function Contacts() {
  const { tabName, setAppContext, currentUser } = useContext(AppContext);
  const [contacts] = useContacts();

  if (tabName !== TAB_NAME.CONTACTS) return null;
  if (!contacts) return <Empty />;

  const onClickItem = (data, chatAreaName) => {
    setAppContext((prev) => ({
      ...prev,
      data,
      chatAreaName: chatAreaName,
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Current user's status */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="relative">
            <img
              src={`${API_URL}/media/${currentUser?.id}`}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.display_name || "?")}&background=25D366&color=fff`;
              }}
            />
            <div className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full p-1">
              <FaPlus size={8} />
            </div>
          </div>
          <div className="ml-4">
            <h3 className="font-semibold">My Status</h3>
            <p className="text-sm text-gray-600">Tap to add status update</p>
          </div>
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
          Contacts
        </h3>
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
            onClick={() => {
              // Open a DM by passing the contact as if it were a conversation
              onClickItem(
                {
                  other_user_id: contact.contact_user_id,
                  other_user_name: contact.alias_name || contact.display_name,
                  context_id: contact.contact_user_id,
                  context_name: contact.alias_name || contact.display_name,
                },
                CHAT_AREA_NAME.DIRECT_MESSAGES,
              );
            }}
          >
            <div className="relative">
              <img
                src={`${API_URL}/media/${contact.contact_user_id}`}
                alt={contact.display_name}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.display_name || "?")}&background=25D366&color=fff`;
                }}
              />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="font-semibold text-gray-800">
                {contact.alias_name || contact.display_name}
              </h3>
              <p className="text-sm text-gray-600">{contact.phone_number}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
