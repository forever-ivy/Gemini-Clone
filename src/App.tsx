import ChatPage from "./components/chatpage";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="w-full h-screen flex absolute inset-0 bg-base-100">
      <Sidebar />
      <ChatPage />
    </div>
  );
}

export default App;
