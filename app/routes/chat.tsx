import { useEffect, useState, useRef } from "react";
import { useLoaderData, useNavigate, useParams, Link } from "@remix-run/react";
import { getUserSession } from "../utils/session.server";
import type { LoaderFunction } from "@remix-run/node";
import { Search, Grid, FileSpreadsheet, File, ChartLine, FileCode, MenuIcon } from "lucide-react";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserSession(request);
  return { user, isAuthenticated: !!user, apiKey: process.env.OPENROUTER_API_KEY };
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
      if (appLauncherRef.current && !appLauncherRef.current.contains(event.target as Node)) {
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
    { id: "2", title: "Tech Discussion - March 24" },
    { id: "3", title: "Random Talk - March 23" },
  ];

  const selectedChatId = params.chatId || chatHistory[0].id;

  const [chats, setChats] = useState<Record<string, Array<{ sender: string; text: string }>>>({
    "1": [{ sender: "assistant", text: "Welcome to your March 25 chat!" }],
    "2": [{ sender: "assistant", text: "This is your Tech Discussion!" }],
    "3": [{ sender: "assistant", text: "Let's chat about random things!" }],
  });

  const fetchAIResponse = async (messagesHistory: Array<{ sender: string; text: string }>) => {
    if (!apiKey) {
      console.error("API key is missing");
      return "Error: API key is missing!";
    }

    try {
      const formattedMessages = messagesHistory.map(msg => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: formattedMessages,
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || "No valid response from AI.";
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return "Sorry, something went wrong.";
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };

    setChats(prevChats => ({
      ...prevChats,
      [selectedChatId]: [...(prevChats[selectedChatId] || []), userMessage],
    }));

    setInput("");
    setLoading(true);

    const updatedMessages = [...(chats[selectedChatId] || []), userMessage];
    const aiResponse = await fetchAIResponse(updatedMessages);

    setChats(prevChats => ({
      ...prevChats,
      [selectedChatId]: [...(prevChats[selectedChatId] || []), { sender: "assistant", text: aiResponse }],
    }));

    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className={`bg-gradient-to-r from-slate-500 to-slate-800 p-4 shadow-md transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16 overflow-hidden"}`}>
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md hover:bg-gray-700">
            <MenuIcon size={sidebarOpen ? 24 : 20} />
          </button>

          {sidebarOpen && (
            <div className={`relative transition-all duration-300 ${searchActive ? "w-48" : "w-10"}`}>
              <button
                onClick={() => setSearchActive(!searchActive)}
                className="absolute left-2 top-2 text-gray-400"
              >
                <Search size={20} />
              </button>
              {searchActive && (
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 p-2 bg-gray-700 border border-white-600 rounded-md text-white w-full"
                />
              )}
            </div>
          )}
        </div>

        {/* Chat History */}
        {sidebarOpen && (
          <ul className="space-y-2">
            {chatHistory.map(chat => (
              <li
                key={chat.id}
                className={`p-2 rounded-md cursor-pointer ${
                  selectedChatId === chat.id ? "bg-white text-black" : "bg-gray-700"
                } hover:bg-gray-600`}
                onClick={() => navigate(`/chat/${chat.id}`)}
              >
                {chat.title}
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gradient-to-r from-slate-900 to-slate-700 rounded-lg p-4 h-[90vh] overflow-hidden">
        <header className="text-center text-xl font-bold text-[#c026d3] mb-4 flex justify-between items-center">
          <span>AI Chat Assistant</span>
          
          <button
            onClick={() => setAppLauncherOpen(!isAppLauncherOpen)}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
          >
            <Grid size={24} className="text-white" />
          </button>
        </header>

        {/* App Launcher */}
        {isAppLauncherOpen && (
          <div
            ref={appLauncherRef}
            className="absolute top-32 right-20 bg-gradient-to-r from-slate-300 to-indigo-600 rounded-lg p-4 w-72 h-96 overflow-y-auto grid grid-cols-3 gap-4 z-10 scrollbar-hide"
          >
            {[
              { image: "knowlege-base.jpg", label: "Knowledge Base", link: "/sheets/new" },
              { image: "knowledge-graph.png", label: "Knowledge Graph", link: "/sheets/new" },
              { image: "files.jpg", label: "Files", link: "/files" },
              { image: "workbook.jpg", label: "Workbook", link: "/workbook" },
              { image: "sequence.jpg", label: "Sequences", link: "/sequence" },
              { image: "contacts.jpg", label: "Contacts", link: "/scripts" },
              { image: "settings.jpg", label: "Settings", link: "/settings" },
              { image: "scripts.jpg", label: "Script Files", link: "/scripts" },
              { image: "my-sheet.jpg", label: "My Sheets", link: "/my-sheet.jpg" },

            ].map((app, index) => (
              <Link
                key={index}
                to={app.link}
                className="flex flex-col items-center p-4 bg-tra text-black rounded-lg shadow-lg 
                ring-2 ring-transparent hover:ring-[#e879f9] transition cursor-pointer"
              >
                <img
                  src={`/images/${app.image}`}
                  className="w-16 h-16 object-cover"
                  alt={app.label}
                />
                <span className="text-sm mt-2">{app.label}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-auto flex flex-col gap-3 p-2">
          {(chats[selectedChatId] || []).map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`p-2 rounded-lg max-w-[80%] ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && <p className="text-gray-400">Assistant is typing...</p>}
        </div>

        {/* Message Input */}
        <div className="flex gap-2 items-center rounded-md border-t border-gray-700 p-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 bg-gray-700 text-white rounded-md p-2"
          />
          <button
            onClick={handleSendMessage}
            disabled={loading}
            className="bg-blue-600 p-2 rounded-md disabled:bg-gray-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}