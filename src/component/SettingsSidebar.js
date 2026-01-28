import { NavLink } from "react-router-dom";
import {
  MdNotificationsActive,
  MdVerifiedUser,
  MdPeople,
  MdApi,
  MdAccountBalance,
  MdSettings,
} from "react-icons/md";
import { jwtDecode } from "jwt-decode";

const SettingsSidebar = () => {
  const token = localStorage.getItem("usertoken");
  let role = "User";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded?.payLoad?.role || "User";
    } catch (e) {
      console.error("Invalid token");
    }
  }

  const isAdmin = role === "Master Admin" || role === "Dev Admin";
const adminModules = [
  {
    label: "Notifications",
    path: "/notification-setting",
    icon: <MdNotificationsActive />,
  },
  {
    label: "Approvals",
    path: "/approval-setting",
    icon: <MdVerifiedUser />,
  },
];


const merchantModules = [
  {
    label: "Manage Users",
    path: "/manage-user",
    icon: <MdPeople />,
  },
  {
    label: "API Credentials",
    path: "/api-credentials",
    icon: <MdApi />,
  },
  {
    label: "Finance Settings",
    path: "/finance-setting",
    icon: <MdAccountBalance />,
  },
];

  const modulesToShow = isAdmin ? adminModules : merchantModules;

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-50 to-gray-200 h-screen sticky top-0 flex flex-col border-r border-gray-300 shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gray-800 rounded-lg shadow-md">
            <MdSettings className="text-xl text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800 tracking-tight leading-none">Settings</h2>
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Configuration</span>
          </div>
        </div>
    
      </div>

      <nav className="flex-1 px-3 space-y-1">
        <div className="px-3 mb-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Main Menu</p>
        </div>
        
        {modulesToShow.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 
              ${
                isActive
                  ? "bg-gray-800 text-white shadow-lg shadow-gray-400/30 translate-x-1"
                  : "text-gray-600 hover:bg-gray-300/50 hover:text-gray-900"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`text-xl ${isActive ? "text-gray-100" : "text-gray-500 group-hover:text-gray-700"}`}>
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <div className="w-1 h-4 rounded-full bg-gray-400" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-300 bg-gray-200/50">
        <div className="flex items-center gap-2 text-gray-500 hover:text-gray-800 cursor-pointer transition-colors">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[11px] font-medium tracking-wide">System Online</span>
        </div>
      </div>
    </aside>
  );
};

export default SettingsSidebar;