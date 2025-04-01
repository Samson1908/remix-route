import { useEffect, useState, useRef } from "react";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { getUserSession } from "../utils/session.server";
import type { LoaderFunction } from "@remix-run/node";
import { Search, Menu, Grid, FileSpreadsheet, File, ChartLine,FileCode } from "lucide-react";  // Add more icons for apps
 
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserSession(request);
  return { user, isAuthenticated: !!user, apiKey: process.env.OPENROUTER_API_KEY };
};

export default function ChatPage() {
  const { user, isAuthenticated, apiKey } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const params = useParams(); // Get chat ID from the route params

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const [isAppLauncherOpen, setAppLauncherOpen] = useState(false);  // State to manage app launcher visibility
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);

  // Ref for app launcher container to detect click outside
  const appLauncherRef = useRef(null);

  // Close app launcher if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (appLauncherRef.current && !appLauncherRef.current.contains(event.target as Node)) {
        setAppLauncherOpen(false);
      }
    };

    // Add event listener for clicks outside
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Chat history list
  const chatHistory = [
    { id: "1", title: "Chat with AI - March 25" },
    { id: "2", title: "Tech Discussion - March 24" },
    { id: "3", title: "Random Talk - March 23" },
  ];

  const selectedChatId = params.chatId || chatHistory[0].id;

  // State for chat messages
  const [chats, setChats] = useState({
    "1": [{ sender: "assistant", text: "Welcome to your March 25 chat!" }],
    "2": [{ sender: "assistant", text: "This is your Tech Discussion!" }],
    "3": [{ sender: "assistant", text: "Let's chat about random things!" }],
  });

  // Fetch AI response from OpenRouter API
  const fetchAIResponse = async (messagesHistory) => {
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

  // Send message and get AI response
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };

    setChats(prevChats => ({
      ...prevChats,
      [selectedChatId]: [...(prevChats[selectedChatId] || []), userMessage],
    }));

    setInput("");
    setLoading(true);

    // Fetch AI response based on the latest state
    const updatedMessages = [...(chats[selectedChatId] || []), userMessage];
    const aiResponse = await fetchAIResponse(updatedMessages);

    // Update chat with AI response
    setChats(prevChats => ({
      ...prevChats,
      [selectedChatId]: [...(prevChats[selectedChatId] || []), { sender: "assistant", text: aiResponse }],
    }));

    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className={`bg-gradient-to-r from-bg-gradient-to-r from-slate-500 to-slate-800 p-4 shadow-md transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16 overflow-hidden"}`}>
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md hover:bg-gray-700">
            <Menu size={sidebarOpen ? 24 : 20} />
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

      {/* Chat Box */}
      <div className="flex-1 flex flex-col bg-gradient-to-r from-slate-900 to-slate-700 rounded-lg p-4 h-[90vh] overflow-hidden">
        <header className="text-center text-xl font-bold text-[#c026d3] mb-4 flex justify-between items-center">
          <span>AI Chat Assistant</span>
          
          {/* App Launcher Icon */}
          <button
            onClick={() => setAppLauncherOpen(!isAppLauncherOpen)} // Toggle app launcher visibility
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
          >
            <Grid size={24} className="text-white" />
          </button>
        </header>

        {/* App Launcher Container */}
        {isAppLauncherOpen && (
          <div ref={appLauncherRef} className="absolute top-32 right-20 bg-gray-800 rounded-lg p-4 grid grid-cols-2 gap-6 z-10">
            <div className="flex items-center justify-center text-white p-2 rounded-md bg-gray-600 hover:bg-gray-500 cursor-pointer">
              <FileSpreadsheet size={24} />
              <span className="ml-2">My Sheet</span>
            </div>
            <div className="flex items-center justify-center text-white p-2 rounded-md bg-gray-600 hover:bg-gray-500 cursor-pointer">
              <File size={24} />
              <span className="ml-2">WorkBook</span>
            </div>
            <div className="flex items-center justify-center text-white p-2 rounded-md bg-gray-600 hover:bg-gray-500 cursor-pointer">
              <ChartLine size={24} />
              <span className="ml-2">Knowledge Graph</span>
            </div>
            <div className="flex items-center justify-center text-white p-2 rounded-md bg-gray-600 hover:bg-gray-500 cursor-pointer">
              <FileCode size={24} />
              <span className="ml-2">WB Script Files</span>
            </div>
            {/* Add more apps as needed */}
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

        {/* Message Input Box */}
        <div className="flex gap-2 items-center rounded-md border-t border-gray-700 p-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
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
