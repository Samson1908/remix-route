import { useParams, useNavigate } from "@remix-run/react";
import { useState } from "react";

type Chat = { sender: string; text: string };

const chatHistory = [
  { id: 1, title: "Chat with AI - March 25" },
  { id: 2, title: "Tech Discussion - March 24" },
  { id: 3, title: "Random Talk - March 23" },
];

const initialChats: Record<number, Chat[]> = {
  1: [{ sender: "assistant", text: "Welcome to your March 25 chat!" }],
  2: [{ sender: "assistant", text: "This is your Tech Discussion!" }],
  3: [{ sender: "assistant", text: "Let's chat about random things!" }],
};

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const chatIdNumber = parseInt(chatId || "1", 10);

  const [selectedChatId, setSelectedChatId] = useState<number>(chatIdNumber);

  const handleChatClick = (id: number) => {
    setSelectedChatId(id);
    navigate(`/chat/${id}`); // Update URL without reloading
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Chat History</h2>
      <div className="space-y-2">
        {chatHistory.map((chat) => (
          <button
            key={chat.id}
            className={`block p-2 border rounded-md ${
              selectedChatId === chat.id ? "bg-blue-300" : "bg-gray-200"
            }`}
            onClick={() => handleChatClick(chat.id)}
          >
            {chat.title}
          </button>
        ))}
      </div>

      <h3 className="mt-4 text-lg font-semibold">Chat Messages</h3>
      <div className="border p-4 rounded-md bg-white shadow-md">
        {initialChats[selectedChatId]?.map((msg, index) => (
          <p key={index} className="mb-2">
            <strong>{msg.sender}:</strong> {msg.text}
          </p>
        ))}
      </div>
    </div>
  );
}
