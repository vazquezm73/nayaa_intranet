import { LogOut, User as UserIcon, ChevronLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const MainLayout = ({ children, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/dashboard";

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans">
      {/* HEADER OSCURO */}
      <header
        style={{ backgroundColor: "#0f172a" }}
        className="text-white shadow-xl h-16 flex items-center justify-between px-6 sticky top-0 z-50"
      >
        <div className="flex items-center gap-4">
          {!isHome && (
            <button
              onClick={() => navigate(-1)}
              className="mr-2 p-1 hover:bg-slate-700 rounded-full transition-colors"
            >
              <ChevronLeft size={24} className="text-brand-accent" />
            </button>
          )}
          <div className="p-1 rounded">
            <img src="/logo-nayaa.png" alt="Nayaa" className="h-7 w-auto" />
          </div>
          <h1 className="text-xs font-bold tracking-tighter uppercase text-slate-400 hidden sm:block">
            Intranet <span className="text-white">Nayaa</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-slate-300">
            Admin Staff
          </span>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* TITULO DE PAGINA CON CONTRASTE */}
      {title && (
        <div className="bg-white border-b border-slate-200 px-8 py-6">
          <div className="max-w-7xl mx-auto uppercase tracking-tight">
            <h2 className="text-2xl font-black text-slate-800 italic">
              {title}
            </h2>
          </div>
        </div>
      )}

      <main className="p-6 flex-1 w-full max-w-7xl mx-auto">{children}</main>
    </div>
  );
};
export default MainLayout;
