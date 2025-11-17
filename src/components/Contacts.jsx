import { useContext } from "react";
import { FaPlus } from "react-icons/fa";
import { contacts, statusUpdates } from "../data/mockData";
import { AppContext } from "../context/AppContext";
import { useContacts } from "../hooks";

export default function Contacts() {
  const { viewContext } = useContext(AppContext);
  const [contacts] = useContacts();

  if (viewContext !== "contacts") return null;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center mb-4">
          <div className="relative">
            <img
              src="http://localhost:2000/file/1"
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="absolute bottom-0 right-0 bg-whatsapp-green text-white rounded-full p-1">
              <FaPlus size={12} />
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
          Recent Updates
        </h3>
        {contacts.map((status) => (
          <div
            key={status.user_id}
            className="flex items-center p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
          >
            <div className="relative">
              <img
                src={
                  status
                    ? `http://localhost:2000/file/${status.user_id}`
                    : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"
                }
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="font-semibold text-gray-800">
                {status.display_name}
              </h3>
              <p className="text-sm text-gray-600">{status.phone_number}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
