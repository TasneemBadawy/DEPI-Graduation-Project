import { useState } from "react";
import Navbar from "./components/Navbar";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";

function App() {
  // ستايت بسيطة عشان نبدل بين الشاشتين طالما مفيش راوتر كامل للمشروع لسه
  const [currentScreen, setCurrentScreen] = useState("register"); // الديفولت ريجستر

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* بنباصي الـ setScreen للناف بار عشان الأزرار تبدل الشاشات */}
      <Navbar currentScreen={currentScreen} setScreen={setCurrentScreen} />
      
      <main className="transition-all duration-200">
        {currentScreen === "login" ? (
          <Login setScreen={setCurrentScreen} />
        ) : (
          <Register setScreen={setCurrentScreen} />
        )}
      </main>
    </div>
  );
}

export default App;