import { useEffect, useState, useRef } from "react";
import { useLoaderData, useNavigate, useParams, Link } from "@remix-run/react";
import { getUserSession } from "../utils/session.server";
import type { LoaderFunction } from "@remix-run/node";
import {
  Search,
  Grid,
  FileText,
  FileSpreadsheet,
  ListTodo,
  Network,
  FileCode,
  Database,
  Settings,
  BookOpen,
  Menu as MenuIcon,
} from "lucide-react";
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserSession(request);
  return {
    user,
    isAuthenticated: !!user,
    apiKey: process.env.OPENROUTER_API_KEY,
  };
};

export default function ChatPage() {
  const { user, isAuthenticated, apiKey } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const [isAppLauncherOpen, setAppLauncherOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);

  const appLauncherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        appLauncherRef.current &&
        !appLauncherRef.current.contains(event.target as Node)
      ) {
        setAppLauncherOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const chatHistory = [
    { id: "1", title: "Chat with AI - March 25" },
    { id: "2", title: "Tech Discussion - March 18" },
    { id: "3", title: "Random Talk - March 23" },
  ];

  const selectedChatId = params.chatId || chatHistory[0].id;

  const [chats, setChats] = useState<
    Record<string, Array<{ sender: string; text: string }>>
  >({
    "1": [{ sender: "assistant", text: "Welcome to your March 25 chat!" }],
    "2": [{ sender: "assistant", text: "This is your Tech Discussion!" }],
    "3": [{ sender: "assistant", text: "Let's chat about random things!" }],
  });

  const fetchAIResponse = async (
    messagesHistory: Array<{ sender: string; text: string }>
  ) => {
    if (!apiKey) {
      console.error("API key is missing");
      return "Error: API key is missing!";
    }

    try {
      const formattedMessages = messagesHistory.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));

      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-3.5-turbo",
            messages: formattedMessages,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      return (
        data.choices?.[0]?.message?.content || "No valid response from AI."
      );
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return "Sorry, something went wrong.";
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };

    setChats((prevChats) => ({
      ...prevChats,
      [selectedChatId]: [...(prevChats[selectedChatId] || []), userMessage],
    }));

    setInput("");
    setLoading(true);

    const updatedMessages = [...(chats[selectedChatId] || []), userMessage];
    const aiResponse = await fetchAIResponse(updatedMessages);

    setChats((prevChats) => ({
      ...prevChats,
      [selectedChatId]: [
        ...(prevChats[selectedChatId] || []),
        { sender: "assistant", text: aiResponse },
      ],
    }));

    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 font-sans">
      {/* Sidebar - Glass Morphism Effect */}
      <aside
        className={`bg-gray-900/50 backdrop-blur-md border-r border-gray-800 p-3 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex justify-between items-center mb-6 p-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-800/50 transition-all"
          >
            <MenuIcon size={20} className="text-gray-400" />
          </button>
          {sidebarOpen && (
            <div className="relative">
              <button className="absolute left-2 top-1/2 transform -translate-y-1/2">
                <Search size={16} className="text-gray-500" />
              </button>
              <input
                type="text"
                placeholder="Search"
                className="pl-8 pr-3 py-1.5 bg-gray-900/30 border border-gray-800 rounded-lg text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              />
            </div>
          )}
        </div>

        {/* Chat History with Glowing Accent */}
        <ul className="space-y-1.5">
          {chatHistory.map((chat) => (
            <li
              key={chat.id}
              className={`p-2.5 rounded-lg cursor-pointer flex items-center transition-all ${
                selectedChatId === chat.id
                  ? "bg-gradient-to-r from-blue-900/30 to-blue-900/10 border border-blue-800/30 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                  : "hover:bg-gray-800/30 border border-transparent"
              }`}
              onClick={() => navigate(`/chat/${chat.id}`)}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  selectedChatId === chat.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                {chat.title.charAt(0)}
              </div>
              {sidebarOpen && (
                <span className="text-sm font-medium truncate">
                  {chat.title}
                </span>
              )}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Chat Area - Futuristic Design */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-950 to-gray-900/80 relative overflow-hidden">
        {/* Glowing Grid Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
            {[...Array(144)].map((_, i) => (
              <div key={i} className="border border-gray-800/50"></div>
            ))}
          </div>
        </div>

        {/* Header with Electric Blue Accent */}
        <header className="border-b border-gray-800/50 p-4 flex justify-between items-center relative z-10">
          <div className="flex items-center">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mr-3">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
            </div>
            <h1 className="font-medium tracking-tight">Neural Interface</h1>
          </div>

          <button
            onClick={() => setAppLauncherOpen(!isAppLauncherOpen)}
            className="p-2 rounded-lg hover:bg-gray-800/50 border border-gray-800 hover:border-blue-500/30 transition-all"
          >
            <Grid
              size={18}
              className="text-gray-400 hover:text-blue-400 transition-colors"
            />
          </button>
        </header>

        {/* App Launcher - Futuristic Grid */}
        {isAppLauncherOpen && (
          <div
            ref={appLauncherRef}
            className="absolute top-16 right-4 bg-gray-900/90 backdrop-blur-lg rounded-xl shadow-2xl p-4 w-72 grid grid-cols-3 gap-3 z-20 border border-gray-800/50"
            style={{ boxShadow: "0 0 20px rgba(59, 130, 246, 0.15)" }}
          >
            {[
              {
                icon: <FileText size={18} />,
                label: "Neuro Docs",
                color: "text-blue-400",
              },
              {
                icon: <FileSpreadsheet size={18} />,
                label: "Data Grid",
                color: "text-blue-400",
              },
              {
                icon: <ListTodo size={18} />,
                label: "Task Flow",
                color: "text-blue-400",
              },
              {
                icon: <Network size={18} />,
                label: "Mind Map",
                color: "text-blue-400",
              },
              {
                icon: <FileCode size={18} />,
                label: "Code Nexus",
                color: "text-blue-400",
              },
              {
                icon: <Database size={18} />,
                label: "Memory Bank",
                color: "text-blue-400",
              },
            ].map((app, index) => (
              <Link
                key={index}
                to={app.link}
                className={`flex flex-col items-center p-3 rounded-lg border border-transparent hover:border-blue-500/30 transition-all hover:bg-gray-800/50 group ${app.color}`}
              >
                <div className="p-2.5 rounded-lg bg-gray-800/50 group-hover:bg-blue-500/10 mb-2 border border-gray-800 group-hover:border-blue-500/20 transition-all">
                  {app.icon}
                </div>
                <span className="text-xs text-center text-gray-400 group-hover:text-blue-300 transition-colors">
                  {app.label}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* Chat Messages - Futuristic Bubbles */}
        <div className="flex-1 overflow-auto p-4 space-y-4 relative z-10">
          {(chats[selectedChatId] || []).map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-xl p-4 relative ${
                  msg.sender === "user"
                    ? "bg-blue-500/10 border border-blue-500/20 text-blue-100 rounded-br-none shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                    : "bg-gray-800/50 border border-gray-800 text-gray-300 rounded-bl-none"
                }`}
              >
                {msg.text}
                {/* Glowing dot indicator */}
                {msg.sender === "assistant" && (
                  <div className="absolute -left-1.5 top-3 w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_#3b82f6]"></div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800/50 border border-gray-800 rounded-xl rounded-bl-none p-4 max-w-[75%]">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message Input - Futuristic Glass Panel */}
        <div className="border-t border-gray-800/50 p-4 relative z-10">
          <div className="flex gap-2 items-center bg-gray-900/50 backdrop-blur-sm rounded-xl px-4 border border-gray-800/50 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all">
            <input
              type="text"
              placeholder="Transmit message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 bg-transparent py-3 outline-none text-gray-200 placeholder-gray-500 text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={loading}
              className="text-gray-400 hover:text-blue-400 disabled:text-gray-600 transition-colors p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
