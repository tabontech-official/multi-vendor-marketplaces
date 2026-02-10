
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { MdNotificationsActive, MdEmail, MdClose, MdAdd, MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import SettingsSidebar from "../component/SettingsSidebar";
import axios from "axios";

const NotificationSettings = () => {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);
  const [staffEmail, setStaffEmail] = useState("");
  const [emailList, setEmailList] = useState(["admin-audit@store.com"]);
const API_BASE_URL = "http://localhost:5000/notificationSettings";

  // Updated state for Approval Workflows
  const [settings, setSettings] = useState({
    userRegistrationApproval: true,
    productListingApproval: true,
    systemAlerts: false,
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
    const userId = localStorage.getItem("userid")

    if (role === "Dev Admin" || role === "Master Admin") {
      setAllowed(true);

      // 🔥 GET notification settings
      axios
        .get(`${API_BASE_URL}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
       .then((res) => {
  const data = res.data;

  setSettings({
    userRegistrationApproval: data.approvals?.userRegistrationApproval ?? true,
    productListingApproval: data.approvals?.productListingApproval ?? true,
    systemAlerts: data.approvals?.systemAlerts ?? false,
  });

  setEmailList(data.recipientEmails || []);
})

        .catch((err) => {
          console.error("Failed to load notification settings", err);
        });

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

  const handleAddEmail = (e) => {
    e.preventDefault();
    if (staffEmail && !emailList.includes(staffEmail)) {
      setEmailList([...emailList, staffEmail]);
      setStaffEmail("");
    }
  };

  const removeEmail = (emailToRemove) => {
    setEmailList(emailList.filter((email) => email !== emailToRemove));
  };

const handleSave = async () => {
  try {
    const token = localStorage.getItem("usertoken");
    const decoded = jwtDecode(token);
    const userId = localStorage.getItem("userid")

    const finalData = {
      ...settings,
      recipientEmails: emailList,
    };

    await axios.post(
      `${API_BASE_URL}`,
      finalData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("✅ Notification settings saved successfully!");
  } catch (error) {
    console.error("Save failed:", error);
    alert("❌ Failed to save notification settings");
  }
};


  return (
    <div className="flex min-h-screen bg-[#f1f1f1] font-sans text-[#303030]">
      <SettingsSidebar />

      <div className="flex-1 pb-20">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#f1f1f1] px-8 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-200 rounded">
              <MdArrowBack className="text-xl text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Notification Settings</h1>
          </div>
          <button
            onClick={handleSave}
            className="bg-[#18181b] hover:bg-gray-900 text-white px-4 py-2 rounded-md font-semibold text-sm transition shadow-sm"
          >
            Save
          </button>
        </div>

        <div className="max-w-[1000px] mx-auto mt-8 px-8 space-y-10">
          
          {/* Section 1: Approval Workflows */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <h2 className="text-base font-semibold text-gray-900">Approval Workflows</h2>
              <p className="text-sm text-gray-500 mt-1">
                Control which events trigger a notification email to the admin and staff.
              </p>
            </div>
            <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-100">
                <ToggleItem
                  label="New user registration"
                  desc="Notify when a new user signs up and requires account approval."
                  enabled={settings.userRegistrationApproval}
                  onChange={() => toggle("userRegistrationApproval")}
                />
                <ToggleItem
                  label="Product approval"
                  desc="Notify when a vendor or staff member submits a new product for review."
                  enabled={settings.productListingApproval}
                  onChange={() => toggle("productListingApproval")}
                />
                <ToggleItem
                  label="General system alerts"
                  desc="Receive notifications regarding system updates and security logs."
                  enabled={settings.systemAlerts}
                  onChange={() => toggle("systemAlerts")}
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Section 2: Recipient List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <h2 className="text-base font-semibold text-gray-900">Staff Recipients</h2>
              <p className="text-sm text-gray-500 mt-1">
                Add staff emails to ensure approval requests are CC'd to the right team members.
              </p>
            </div>
            <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <form onSubmit={handleAddEmail} className="flex gap-2 mb-6">
                <input
                  type="email"
                  placeholder="staff@yourstore.com"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-[#008060] focus:ring-1 focus:ring-[#008060] outline-none transition"
                />
                <button
                  type="submit"
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-sm font-semibold transition"
                >
                  Add email
                </button>
              </form>

              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Notification List</h3>
                {emailList.map((email) => (
                  <div key={email} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-700">{email}</span>
                    <button 
                      onClick={() => removeEmail(email)}
                      className="text-gray-400 hover:text-red-600 p-1"
                    >
                      <MdClose size={18} />
                    </button>
                  </div>
                ))}
                {emailList.length === 0 && (
                  <p className="text-sm text-gray-400 italic">No additional staff emails configured.</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
             <button
              onClick={handleSave}
              className="bg-[#18181b] hover:bg-gray-900 text-white px-6 py-2 rounded-md font-semibold text-sm transition shadow-sm"
            >
              Save
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
    <div className="flex items-start justify-between p-5 hover:bg-gray-50 transition-colors cursor-pointer" onClick={onChange}>
      <div className="pr-4">
        <h3 className="text-sm font-medium text-gray-900">{label}</h3>
        <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
      </div>

      <button
        type="button"
        className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out outline-none
          ${enabled ? "bg-[#18181b]" : "bg-gray-300"}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out
            ${enabled ? "translate-x-5" : "translate-x-1"}`}
        />
      </button>
    </div>
  );
};