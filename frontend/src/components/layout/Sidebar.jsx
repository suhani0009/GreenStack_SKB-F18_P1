import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/emissions", label: "Emissions" },
  { to: "/suppliers", label: "Suppliers" },
  { to: "/reports", label: "Reports" },
  { to: "/scenario", label: "Scenario" },
  { to: "/settings", label: "Settings" },
  { to: "/chat", label: "Chat" },
];

function Sidebar({ open, onClose }) {
  return (
    <>
      {open ? <button className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={onClose} /> : null}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-80 transform border-r border-white/50 bg-ink px-6 py-8 text-white transition duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-lime">GreenStack</p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight">ESG command center for carbon teams.</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Centralize emissions, suppliers, reporting, and scenario planning in one workspace.
          </p>
        </div>

        <nav className="mt-8 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive ? "bg-lime text-ink" : "text-slate-200 hover:bg-white/8"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
