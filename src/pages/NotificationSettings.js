import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { MdNotificationsActive } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import SettingsSidebar from "../component/SettingsSidebar";

const NotificationSettings = () => {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);

  const [settings, setSettings] = useState({
    aiOrderAlerts: true,
    aiFraudAlerts: true,
    aiLowStockAlerts: false,
    aiPerformanceReports: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const role = decoded?.payLoad?.role;

      if (role === "Dev Admin" || role === "Master Admin") {
        setAllowed(true);
      } else {
        navigate("/unauthorized");
      }
    } catch (err) {
      navigate("/login");
    }
  }, [navigate]);

  if (!allowed) return null;

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    console.log("🔔 AI Notification Settings:", settings);
    alert("Settings saved successfully!");
    // 🔜 API call yahan lagegi
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SettingsSidebar />

      {/* Page Content */}
      <div className="flex-1 p-6">
        <div className="max-w-3xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gray-800 rounded-lg">
              <MdNotificationsActive className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                AI Notification Settings
              </h1>
              <p className="text-sm text-gray-500">
                Configure AI-powered alerts and system notifications
              </p>
            </div>
          </div>

          {/* Settings Card */}
          <div className="bg-white border border-gray-300 rounded-xl shadow-sm divide-y">
            <ToggleItem
              label="AI Order Alerts"
              desc="Get AI alerts for unusual or high-value orders"
              enabled={settings.aiOrderAlerts}
              onChange={() => toggle("aiOrderAlerts")}
            />

            <ToggleItem
              label="AI Fraud Detection Alerts"
              desc="Receive alerts when AI detects suspicious activity"
              enabled={settings.aiFraudAlerts}
              onChange={() => toggle("aiFraudAlerts")}
            />

            <ToggleItem
              label="Low Stock AI Alerts"
              desc="AI predicts low stock before it runs out"
              enabled={settings.aiLowStockAlerts}
              onChange={() => toggle("aiLowStockAlerts")}
            />

            <ToggleItem
              label="AI Performance Reports"
              desc="Weekly AI-generated system performance summary"
              enabled={settings.aiPerformanceReports}
              onChange={() => toggle("aiPerformanceReports")}
            />
          </div>

          {/* Save */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              className="bg-gray-800 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
const ToggleItem = ({ label, desc, enabled, onChange }) => {
  return (
    <div className="flex items-center justify-between p-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-800">{label}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>

      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition
          ${enabled ? "bg-gray-800" : "bg-gray-300"}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition
            ${enabled ? "translate-x-6" : "translate-x-1"}`}
        />
      </button>
    </div>
  );
};
