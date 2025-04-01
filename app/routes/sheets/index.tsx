import { useState } from "react"; 
import { Link } from "@remix-run/react";
import { Search, FileText, PlusSquare } from "lucide-react";

export default function SheetsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchActive, setSearchActive] = useState(false);


// export default function SheetsIndex() {
//   return (
   
//   );
// }


    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-6">
            {/* Title */}
            <h1 className="text-2xl font-bold mb-6 self-start">Create and edit spreadsheets with ease</h1>

            {/* Search Bar (Centered Like Google Sheets) */}
            <div className="relative w-full max-w-md">
                <button
                    onClick={() => setSearchActive(!searchActive)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                    <Search size={20} />
                </button>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            {/* Start a New Spreadsheet Section */}
            <section className="mt-8 w-full max-w-lg text-left">
    <h2 className="text-lg text-[#818cf8] font-semibold mb-3">Start a new spreadsheet</h2>
    
    <div className="grid grid-cols-3 gap-4">
        <Link to="/sheets/new" className="flex flex-col items-center p-4 bg-transparent text-white rounded-lg shadow-lg 
            ring-2 ring-transparent hover:ring-[#e879f9] transition">
            <img src="/images/blankSheet.jpg" className="w-16 h-16 object-cover" alt="Blank Spreadsheet"/>
            {/* <PlusSquare size={20} /> */}
            <span className="text-sm">Blank Spreadsheet</span>
        </Link>

        <Link to="/sheets/new" className="flex flex-col items-center p-4 bg-transparent text-white rounded-lg shadow-lg 
            ring-2 ring-transparent hover:ring-[#e879f9] transition">
            <img src="/images/Knowledge graph.png" className="w-16 h-16 object-cover" alt="Blank Spreadsheet"/>
            {/* <PlusSquare size={20} /> */}
            <span className="text-sm">Knowledge graph</span>
        </Link>

        <Link to="/sheets/todo" className="flex flex-col items-center p-4 bg-transparent rounded-lg shadow-lg 
            ring-2 ring-transparent hover:ring-[#e879f9] transition">
            <img src="/images/todo3.png" className="w-16 h-16 object-cover" alt="To-Do List"/>
            {/* <FileText size={20} /> */}
            <span className="text-sm">To-Do List</span>
        </Link>
    </div>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sheets</h1>
      <Link to="/sheets/datagrid" className="text-blue-500 underline">
        Open DataGrid
      </Link>
    </div>
</section>

            {/* Recent Files Section */}
            <section className="mt-10 w-full max-w-lg text-left">
                <h2 className="text-lg text-[#818cf8] font-semibold mb-3">Recent Files</h2>
                <div className="space-y-3">
                    {["Project Budget.xlsx", "Task Planner.xlsx", "Meeting Notes.xlsx"].map((file, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-600 rounded-lg shadow-md hover:bg-gray-500 transition">
                            <FileText size={20} />
                            <span>{file}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}


// [#6d28d9]