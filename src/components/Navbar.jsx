import { cn } from '../lib/utils';
import { Compass } from 'lucide-react';

export default function Navbar({ currentScreen, setScreen }) {
  return (
    <nav className="flex items-center justify-between bg-transparent px-12 h-20 text-white absolute top-0 left-0 w-full z-50">
      
      {/* اللوجو */}
      <div className="flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-sm">
          <Compass className="h-4.5 w-4.5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">Nomade</span>
      </div>

      {/* اللينكات اللي في النص مع تأثير الـ Hover النظيف */}
      <div className="hidden md:flex items-center gap-1">
        {["Guides", "Tours", "Activities", "Testimonials", "About"].map((item) => (
          <button 
            key={item} 
            type="button" 
            className="text-sm font-medium px-4 py-2 rounded-xl text-white/90 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
          >
            {item}
          </button>
        ))}
      </div>

      {/* أزرار الـ Auth */}
      <div className="flex items-center gap-6">
        <button 
          onClick={() => setScreen("login")}
          className={cn(
            "text-sm font-semibold text-white/90 hover:text-white transition-all cursor-pointer",
            currentScreen === 'login' && "underline underline-offset-4 font-bold"
          )}
        >
          Log in
        </button>
        
        <button 
          onClick={() => setScreen("register")}
          className={cn(
            "text-sm font-bold px-5 py-2.5 rounded-xl duration-150 transition-all cursor-pointer shadow-lg bg-nomade-orange text-white hover:brightness-110 active:scale-[0.98]",
            currentScreen === 'register' && "ring-2 ring-white/50"
          )}
        >
          Join Nomade
        </button>
      </div>

    </nav>
  );
}