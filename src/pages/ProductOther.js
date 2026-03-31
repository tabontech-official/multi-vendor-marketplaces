import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  Layers,
  Settings2,
  Ruler,
  Truck,
  History,
  FileEdit,
  ChevronRight,
  Loader2,
} from "lucide-react";

const ProductOther = () => {
  const [allowedModules, setAllowedModules] = useState([]);
  const [loading, setLoading] = useState(true);

  const iconMap = {
    "Manage Approval": <CheckCircle className="w-5 h-5 text-emerald-500" />,
    "Manage Categories": <Layers className="w-5 h-5 text-blue-500" />,
    "Manage Options": <Settings2 className="w-5 h-5 text-purple-500" />,
    "Manage Size Charts": <Ruler className="w-5 h-5 text-orange-500" />,
    "Manage Shipping": <Truck className="w-5 h-5 text-indigo-500" />,
    "Status & Logs": <History className="w-5 h-5 text-slate-500" />,
    "Content Management": <FileEdit className="w-5 h-5 text-pink-500" />,
  };

  useEffect(() => {
    const userId = localStorage.getItem("userid");
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUserModules = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/auth/getUserWithModules/${userId}`
        );
        const data = await response.json();
        setAllowedModules(data.modules || []);
      } catch (error) {
        console.error("Error fetching modules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserModules();
  }, []);

  const otherModules = [
    { name: "Manage Approval", displayName: "Approvals", path: "/manage-approvals", desc: "Review and approve product requests" },
    { name: "Manage Categories", displayName: "Categories", path: "/manage-categories", desc: "Organize products into hierarchy" },
    { name: "Manage Options", displayName: "Options", path: "/manage-options", desc: "Configure variants and attributes" },
    { name: "Manage Size Charts", displayName: "Size Charts", path: "/manage-size-chart", desc: "Set dimension standards" },
    { name: "Manage Shipping", displayName: "Shipping Profiles", path: "/manage-shipping", desc: "Manage rates and zones" },
    { name: "Status & Logs", displayName: "Status & Logs", path: "/status-logs", desc: "Monitor system activity" },
    { name: "Content Management", displayName: "Content", path: "/content", desc: "Edit static pages and assets" },
  ];

  const filteredModules = otherModules.filter((item) =>
    allowedModules.includes(item.name)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-500 text-sm">Loading configuration...</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-8">

        {/* Header Section */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            System Configuration
          </h2>
          <p className="text-gray-500 mt-2 max-w-2xl">
            Manage specialized product settings and administrative tools
            available for your account.
          </p>
        </div>

        {/* Modules Grid */}
        {filteredModules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="group bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                      {iconMap[item.name]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.displayName}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-amber-200 rounded-xl p-8 text-center shadow-sm">
            <p className="text-amber-600 font-medium">
              No additional modules available for your account.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Please contact your administrator for access.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductOther;