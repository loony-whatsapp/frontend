export const contacts = [
  {
    id: 1,
    name: "John Doe",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    phone_number: "1234567890",
  },
  {
    id: 2,
    name: "Sarah Wilson",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    phone_number: "0234567891",
  },
  {
    id: 3,
    name: "Mike Johnson",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    phone_number: "1234567890",
  },
];

export const groups = [
  {
    id: 1,
    name: "Family Group",
    avatar:
      "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=150&h=150&fit=crop&crop=face",
    members: ["You", "Mom", "Dad", "Sister"],
    lastMessage: "Mom: Dinner at 7 PM",
    unread: 3,
  },
  {
    id: 2,
    name: "Work Team",
    avatar:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=150&h=150&fit=crop&crop=face",
    members: ["You", "Alice", "Bob", "Charlie"],
    lastMessage: "Alice: Meeting postponed",
    unread: 0,
  },
];

export const communities = [
  {
    id: 1,
    name: "React Developers",
    avatar:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=150&h=150&fit=crop&crop=face",
    description: "Discuss React and related technologies",
    members: 1250,
  },
  {
    id: 2,
    name: "Travel Enthusiasts",
    avatar:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=150&h=150&fit=crop&crop=face",
    description: "Share travel experiences and tips",
    members: 890,
  },
];

export const calls = [
  {
    id: 1,
    name: "John Doe",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    time: "2:30 PM",
    type: "outgoing",
    duration: "5:32",
    date: "Today",
  },
  {
    id: 2,
    name: "Sarah Wilson",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    time: "11:15 AM",
    type: "incoming",
    duration: "2:15",
    date: "Today",
  },
];

export const messages = [
  {
    id: 1,
    text: "Hey there! How are you doing?",
    time: "10:30 AM",
    isSent: false,
    sender: "John Doe",
  },
  {
    id: 2,
    text: "I'm good! Just working on some projects. How about you?",
    time: "10:31 AM",
    isSent: true,
    sender: "You",
  },
  {
    id: 3,
    text: "That's great! I was wondering if you'd like to grab coffee sometime this week?",
    time: "10:32 AM",
    isSent: false,
    sender: "John Doe",
  },
  {
    id: 4,
    text: "Sure, that sounds good! How about Friday?",
    time: "10:33 AM",
    isSent: true,
    sender: "You",
  },
];

export const statusUpdates = [
  {
    id: 1,
    name: "My Status",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
    time: "Just now",
    isUser: true,
  },
  {
    id: 2,
    name: "Sarah Wilson",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    time: "20 minutes ago",
    isUser: false,
  },
  {
    id: 3,
    name: "Mike Johnson",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    time: "45 minutes ago",
    isUser: false,
  },
];
