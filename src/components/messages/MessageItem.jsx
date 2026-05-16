import { API_URL } from "../../Config";

function formatTime(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Single grey tick — message sent to server
const TickSent = () => (
  <svg viewBox="0 0 16 11" width="16" height="11" fill="none">
    <path d="M1 5.5L5.5 10L15 1" stroke="#8696a0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Double grey ticks — message delivered to device
const TickDelivered = () => (
  <svg viewBox="0 0 18 11" width="18" height="11" fill="none">
    <path d="M1 5.5L5.5 10L15 1" stroke="#8696a0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 5.5L9.5 10L19 1" stroke="#8696a0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Double blue ticks — message read
const TickRead = () => (
  <svg viewBox="0 0 18 11" width="18" height="11" fill="none">
    <path d="M1 5.5L5.5 10L15 1" stroke="#53bdeb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 5.5L9.5 10L19 1" stroke="#53bdeb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function StatusTick({ status }) {
  if (status === "read") return <TickRead />;
  if (status === "delivered") return <TickDelivered />;
  return <TickSent />;
}

function MediaContent({ message }) {
  const isImage = message.message_type === "image" ||
    (message.media_url && /\.(jpe?g|png|gif|webp)$/i.test(message.media_url));

  if (!message.media_url) return null;

  const src = message.media_url.startsWith("blob:")
    ? message.media_url                           // optimistic preview
    : `${API_URL}${message.media_url}`;           // fetched from server

  if (isImage) {
    return (
      <img
        src={src}
        alt="attachment"
        className="rounded-md max-w-full mb-1 cursor-pointer"
        style={{ maxHeight: 260 }}
        onClick={() => window.open(src, "_blank")}
      />
    );
  }
  return (
    <a
      href={src}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 text-blue-600 underline text-sm mb-1"
    >
      <span>📄</span>
      <span>{message.media_url.split("/").pop()}</span>
    </a>
  );
}

export const ViewMessage = ({ message, currentUserId }) => {
  const isMine = message.sender_id === currentUserId;
  const isPending = !message.id && !!message.temp_id && !message.status;
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
          isMine
            ? "bg-[#dcf8c6] text-gray-800 rounded-br-none"
            : "bg-white text-gray-800 rounded-bl-none"
        } ${isPending ? "opacity-70" : ""}`}
      >
        <MediaContent message={message} />
        {message.body_text && <p className="text-sm">{message.body_text}</p>}
        <div className="text-xs mt-1 text-gray-500 text-right flex items-center justify-end gap-1">
          {isPending ? (
            <span title="Sending...">&#x23F3;</span>
          ) : (
            <>
              <span>{formatTime(message.sent_at)}</span>
              {isMine && <StatusTick status={message.status} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const ViewPost = ({ message, currentUserId }) => {
  const isMine = message.author_id === currentUserId;
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
          isMine
            ? "bg-[#dcf8c6] text-gray-800 rounded-br-none"
            : "bg-white text-gray-800 rounded-bl-none"
        }`}
      >
        <p className="text-sm">{message.body_text}</p>
        <div className="text-xs mt-1 text-gray-500 text-right">
          {formatTime(message.posted_at || message.sent_at)}
        </div>
      </div>
    </div>
  );
};

export const MessageItem = ({ message, onClick }) => {
  return (
    <div
      className="flex items-center p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
      onClick={onClick}
    >
      <div className="relative flex-shrink-0">
        <img
          src={`${API_URL}/media/${message.other_user_id}`}
          alt={message.other_user_name}
          className="w-12 h-12 rounded-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(message.other_user_name || "?")}&background=25D366&color=fff`;
          }}
        />
      </div>
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800 truncate">
            {message.other_user_name}
          </h3>
          <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
            {formatTime(message.last_message_at)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 truncate">{message.last_message_text}</p>
          {message.unread_count > 0 && (
            <span className="ml-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
              {message.unread_count}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export const GroupMessageItem = ({ message, onClick }) => {
  return (
    <div
      className="flex items-center p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
      onClick={onClick}
    >
      <div className="relative flex-shrink-0">
        <img
          src={`${API_URL}/media/${message.group_id}`}
          alt={message.group_name}
          className="w-12 h-12 rounded-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(message.group_name || "?")}&background=128C7E&color=fff`;
          }}
        />
      </div>
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800 truncate">{message.group_name}</h3>
          <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
            {formatTime(message.last_message_at)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 truncate">
            {message.sender_name && <span className="font-medium">{message.sender_name}: </span>}
            {message.last_message_text}
          </p>
          {message.unread_count > 0 && (
            <span className="ml-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
              {message.unread_count}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
