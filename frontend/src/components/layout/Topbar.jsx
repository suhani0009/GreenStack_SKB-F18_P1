import { useAuth } from "../../context/AuthContext";

function Topbar({ onMenuClick }) {
  const { user, company, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 px-4 py-4 backdrop-blur sm:px-6 lg:px-10">
      <div className="panel-surface flex items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-3">
          <button className="btn-secondary lg:hidden" onClick={onMenuClick}>
            Menu
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Live Workspace</p>
            <h2 className="text-lg font-semibold">{company?.name || "GreenStack"}</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-2xl bg-mist px-4 py-3 text-right sm:block">
            <p className="text-sm font-semibold text-ink">{user?.name || "Team Member"}</p>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{user?.email}</p>
          </div>
          <button className="btn-primary" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
