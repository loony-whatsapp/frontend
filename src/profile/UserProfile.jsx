import { useState, useContext, useEffect } from "react";
import {
  ArrowLeft,
  Camera,
  Edit2,
  Shield,
  Bell,
  Lock,
  MessageCircle,
  Star,
  Smartphone,
  Globe,
  HelpCircle,
  Users,
  Video,
  UserX,
  ChevronRight,
  Check,
} from "lucide-react";
import Api from "loony-api";
import { AppContext } from "../context/AppContext";
import { API_URL } from "../Config";

const api = Api(API_URL);
const { getUserInfo, getGroupInfo } = api;

const UserProfile = () => {
  const { screen, userProfile, resetAppContext } = useContext(AppContext);
  const [profileData, setProfileData] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(null);
  const [tempAbout, setTempAbout] = useState(null);
  const [statusPrivacy, setStatusPrivacy] = useState("mycontacts");

  useEffect(() => {
    // console.log("userProfile changed:", userProfile);
    if (
      userProfile &&
      !userProfile.other_user_id &&
      !userProfile.group_id &&
      !userProfile.com_id &&
      !userProfile.id
    ) {
      setProfileData((prev) => ({
        ...prev,
        ...userProfile,
      }));
      setTempName(userProfile.display_name);
      setTempAbout(userProfile.about);
    }
    if (userProfile && userProfile.other_user_id) {
      getUserInfo(userProfile.other_user_id).then((res) => {
        setProfileData(res.data);
      });
    }
    if (userProfile && userProfile.group_id) {
      getGroupInfo(userProfile.group_id).then((res) => {
        setProfileData(res.data);
      });
    }
    if (userProfile && userProfile.com_id) {
      setProfileData(userProfile);
    }
    if (userProfile && userProfile.id) {
      setProfileData(userProfile);
    }
  }, [userProfile]);

  const handleSave = () => {
    setProfileData({
      ...profileData,
      name: tempName,
      about: tempAbout,
    });
    setIsEditing(false);
  };

  const menuItems = [
    { icon: <Star size={18} />, label: "Starred Messages", count: 24 },
    {
      icon: <Lock size={18} />,
      label: "Account",
      subtitle: "Privacy, security, change number",
    },
    {
      icon: <Shield size={18} />,
      label: "Privacy",
      subtitle: "Block contacts, disappearing messages",
    },
    {
      icon: <Bell size={18} />,
      label: "Notifications",
      subtitle: "Message, group & call tones",
    },
    {
      icon: <MessageCircle size={18} />,
      label: "Chats",
      subtitle: "Theme, wallpapers, chat history",
    },
    {
      icon: <Smartphone size={18} />,
      label: "Storage and Data",
      subtitle: "Network usage, auto-download",
    },
    {
      icon: <Video size={18} />,
      label: "Video Calls",
      subtitle: "Ringtone, notifications",
    },
    {
      icon: <HelpCircle size={18} />,
      label: "Help",
      subtitle: "FAQ, contact us, privacy policy",
    },
  ];

  const privacyOptions = [
    { value: "everyone", label: "Everyone" },
    { value: "mycontacts", label: "My contacts" },
    { value: "nobody", label: "Nobody" },
  ];

  if (screen !== "profile" || !profileData) {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-100 relative overflow-y-auto">
      <div className="min-h-screen bg-gray-50">
        {/* Main Profile Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <div className="bg-white border-b border-gray-300 p-4">
            <div className="flex items-center">
              <button
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={() => resetAppContext()}
              >
                <ArrowLeft size={24} className="text-gray-600" />
              </button>
              <h1 className="ml-3 text-lg font-semibold">Profile</h1>
            </div>
          </div>

          {/* Profile Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Profile Header */}
            <div className="bg-white mt-6 mx-auto max-w-2xl rounded-lg shadow-sm border border-gray-200">
              <div className="p-8">
                <div className="flex flex-col items-center">
                  <div className="relative mb-6">
                    {profileData.profile_photo ? (
                      <img
                        src={
                          profileData
                            ? `${API_URL}/media/${
                                profileData.user_id ||
                                profileData.uid ||
                                profileData.id ||
                                profileData.group_id ||
                                profileData.com_id
                              }`
                            : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"
                        }
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      // <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-4xl font-bold text-green-800">
                      //   {profileData.display_name.charAt(0)}
                      // </div>
                      <img
                        src={
                          profileData
                            ? `${API_URL}/media/${
                                profileData.user_id ||
                                profileData.uid ||
                                profileData.id ||
                                profileData.group_id ||
                                profileData.com_id
                              }`
                            : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"
                        }
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover"
                      />
                    )}
                    <button className="absolute bottom-2 right-2 bg-green-500 text-white rounded-full p-2 hover:bg-green-600 transition-colors">
                      <Camera size={20} />
                    </button>
                  </div>

                  {!isEditing ? (
                    <div className="text-center w-full max-w-md">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                        {profileData.display_name ||
                          profileData.group_name ||
                          profileData.com_name ||
                          profileData.name}
                      </h2>
                      <p className="text-gray-600 mb-6">
                        {profileData.about || profileData.description}
                      </p>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                        Edit profile
                      </button>
                    </div>
                  ) : (
                    <div className="w-full max-w-md space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          About
                        </label>
                        <input
                          type="text"
                          value={tempAbout}
                          onChange={(e) => setTempAbout(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex gap-2 justify-end pt-2">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white mt-6 mx-auto max-w-2xl rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Contact Information
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <Smartphone size={20} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{profileData.phone_number}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <Globe size={20} className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{profileData.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white mt-6 mx-auto max-w-2xl rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Privacy Settings
                </h3>

                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Last seen & online
                    </p>
                    <div className="flex gap-2">
                      {privacyOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setStatusPrivacy(option.value)}
                          className={`px-4 py-2 rounded-lg border ${
                            statusPrivacy === option.value
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <Check size={20} className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Read receipts</p>
                        <p className="text-sm text-gray-500">
                          Show blue check marks
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={profileData.readReceipts}
                        onChange={() =>
                          setProfileData({
                            ...profileData,
                            readReceipts: !profileData.readReceipts,
                          })
                        }
                        className="sr-only"
                        id="read-receipts"
                      />
                      <label
                        htmlFor="read-receipts"
                        className={`block w-12 h-6 rounded-full cursor-pointer ${
                          profileData.readReceipts
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`block w-5 h-5 mt-0.5 ml-0.5 rounded-full bg-white transition-transform ${
                            profileData.readReceipts
                              ? "transform translate-x-6"
                              : ""
                          }`}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shared Media & Groups */}
            <div className="bg-white mt-6 mx-auto max-w-2xl rounded-lg shadow-sm border border-gray-200 mb-8">
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                        <span className="text-orange-600">📁</span>
                      </div>
                      <div>
                        <p className="font-medium">{profileData.mediaShared}</p>
                        <p className="text-sm text-gray-500">Media shared</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <Users size={20} className="text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {profileData.groupsInCommon}
                        </p>
                        <p className="text-sm text-gray-500">
                          Groups in common
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Menu */}
            <div className="bg-white mx-auto max-w-2xl rounded-lg shadow-sm border border-gray-200 mb-8">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="border-t border-gray-100 first:border-t-0"
                >
                  <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                        {item.icon}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-800">
                          {item.label}
                        </p>
                        {item.subtitle && (
                          <p className="text-sm text-gray-500">
                            {item.subtitle}
                          </p>
                        )}
                        {item.count && (
                          <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full mt-1">
                            {item.count}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </button>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mx-auto max-w-2xl mb-8 flex gap-4">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                <UserX size={20} />
                Block Contact
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                <Shield size={20} />
                Report Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
