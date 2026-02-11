import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  HiOutlineChartBar,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineDownload,
  HiOutlineRefresh,
  HiOutlineTrendingUp,
  HiOutlineUpload,
  HiOutlineXCircle,
} from "react-icons/hi";
import { CiCreditCard1, CiImport } from "react-icons/ci";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import UseFetchUserData from "../component/fetchUser";
import { useAuthContext } from "../Hooks/useAuthContext";
import { useNotification } from "../context api/NotificationContext";
import dayjs from "dayjs";
import minMax from "dayjs/plugin/minMax";
import { useNavigate, useNavigation } from "react-router-dom";
import { FaEdit, FaFileImport } from "react-icons/fa";
dayjs.extend(minMax);
const Finance = () => {
  const { addNotification } = useNotification();
  const { userData } = UseFetchUserData();
  const [commission, setCommission] = useState(0);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [payouts, setPayouts] = useState([]);
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("");

  const [searchVal, setSearchVal] = useState("");
  const [summary, setSummary] = useState({
    available: 0,
    pending: 0,
    due: 0,
    deposited: 0,
  });

  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [paypalPopup, setPaypalPopup] = useState(false);
  const [paypalAccountInput, setPaypalAccountInput] = useState("");
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [graceDays, setGraceDays] = useState(0);
  const [payoutType, setPayoutType] = useState("daily");
  const [activeTab, setActiveTab] = useState("payouts");
  const [graceTime, setGraceTime] = useState(0);
  const [payoutFrequency, setPayoutFrequency] = useState("daily");
  const [weeklyDay, setWeeklyDay] = useState("Monday");
  const [firstPayoutDate, setFirstPayoutDate] = useState("");
  const [secondPayoutDate, setSecondPayoutDate] = useState("");
  const [allPayouts, setAllPayouts] = useState([]);
  const [filteredPayouts, setFilteredPayouts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // fixed page size
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    if (!payouts.length) {
      setSummary({
        available: 0,
        pending: 0,
        due: 0,
        deposited: 0,
      });
      return;
    }

    let pending = 0;
    let due = 0;
    let deposited = 0;

    payouts.forEach((payout) => {
      const status = payout.status?.toLowerCase();

      let payoutTotal = 0;

      // ✅ Merchant API structure
      if (payout.totalAmount !== undefined) {
        payoutTotal = Number(payout.totalAmount);
      }

      // ✅ If amount is string like "$257.30 AUD"
      else if (payout.amount) {
        payoutTotal = parseFloat(payout.amount.replace(/[^0-9.-]+/g, ""));
      }

      // ✅ Admin API structure (fallback)
      else if (payout.orders) {
        payoutTotal = payout.orders.reduce(
          (sum, order) => sum + (order.netAmount || order.amount || 0),
          0,
        );
      }

      if (status === "pending") pending += payoutTotal;
      if (status === "due") due += payoutTotal;
      if (status === "deposited") deposited += payoutTotal;
    });

    setSummary({
      pending,
      due,
      deposited,
      available: pending + due,
    });
  }, [payouts]);

  const handleExport = () => {
    if (activeTab !== "merchant-list") {
      showToast("error", "Export is available only in Merchant List tab");
      return;
    }

    if (!editableMerchants.length) {
      showToast("error", "No data available to export");
      return;
    }

    const headers = ["Name", "Email", "Role", "commission", "merchantId"];

    const rows = editableMerchants.map((user) => [
      `${user.firstName || ""} ${user.lastName || ""}`,
      user.email || "",
      user.role || "",
      user.commissionValue ?? user.comissionRate ?? "",
      user.shopifyId || "", // merchantId
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "merchant_commissions.csv");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("success", "CSV exported successfully!");
  };

  const fetchAllUsers = async () => {
    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");

    if (!apiKey || !apiSecretKey) return;

    setUsersLoading(true);
    try {
      const res = await fetch(
        "https://multi-vendor-marketplace.vercel.app/auth/getAllUsers",
        {
          method: "GET",
          headers: {
            "x-api-key": apiKey,
            "x-api-secret": apiSecretKey,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await res.json();
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setUsersLoading(false);
    }
  };
  useEffect(() => {
    if (activeTab === "merchant-list") {
      fetchAllUsers();
    }
  }, [activeTab]);
  const merchantsOnly = users.filter(
    (user) => user.role?.toLowerCase() === "merchant",
  );

  const handleSavePayoutDates = async () => {
    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");
    const payload = {
      graceTime,
      payoutFrequency,
      commission, // ✅ added
      firstDate: payoutFrequency !== "weekly" ? Number(firstPayoutDate) : null,
      secondDate: payoutFrequency === "twice" ? Number(secondPayoutDate) : null,
      weeklyDay: payoutFrequency === "weekly" ? weeklyDay : null,
    };

    try {
      const res = await fetch(
        "https://multi-vendor-marketplace.vercel.app/order/addPayOutDates",
        {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
            "x-api-secret": apiSecretKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await res.json();

      if (!res.ok) {
        console.error("Save failed:", result);
        showToast("error", "Failed to save payout config..");
        return;
      }

      showToast("success", "saved successfully!");
    } catch (err) {
      console.error(" Network error:", err);
      showToast("error", "Error saving payout configuration..");
    }
  };

  useEffect(() => {
    const fetchPayoutDates = async () => {
      const apiKey = localStorage.getItem("apiKey");
      const apiSecretKey = localStorage.getItem("apiSecretKey");

      if (!apiKey || !apiSecretKey) {
        console.error("Missing API credentials");
        return;
      }

      try {
        const res = await fetch(
          "https://multi-vendor-marketplace.vercel.app/order/getPayoutsDates",
          {
            method: "GET",
            headers: {
              "x-api-key": apiKey,
              "x-api-secret": apiSecretKey,
              "Content-Type": "application/json",
            },
          },
        );

        if (!res.ok) {
          console.error("Failed to fetch payout config:", res.statusText);
          return;
        }

        const data = await res.json();

        if (data.firstDate)
          setFirstPayoutDate(new Date(data.firstDate).getDate());
        if (data.secondDate)
          setSecondPayoutDate(new Date(data.secondDate).getDate());
        if (data.payoutFrequency) setPayoutFrequency(data.payoutFrequency);
        if (data.graceTime !== undefined) setGraceTime(data.graceTime);
        if (data.weeklyDay) setWeeklyDay(data.weeklyDay);
        if (data.commission !== undefined)
          setCommission(Number(data.commission));
      } catch (err) {
        console.error("Error fetching payout dates:", err);
      }
    };

    fetchPayoutDates();
  }, []);

  const isAdmin = () => {
    const token = localStorage.getItem("usertoken");
    if (token) {
      const decoded = jwtDecode(token);
      if (
        (decoded?.payLoad?.isAdmin || decoded?.payLoad?.role === "Dev Admin") &&
        decoded.exp * 1000 > Date.now()
      ) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    if (token) {
      const decoded = jwtDecode(token);
      const role = decoded?.payLoad?.role || "";
      setUserRole(role);
    }
  }, []);
  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };

  useEffect(() => {
    const checkPaypalAccount = async () => {
      const userId = localStorage.getItem("userid");
      if (!userId || isAdmin()) return;

      try {
        const res = await axios.get(
          `https://multi-vendor-marketplace.vercel.app/auth/user/${userId}`,
        );
        const user = res.data;
        const role = user?.role;

        if (role === "Dev Admin" || role === "Master Admin") return;

        if (!user?.paypalAccount) {
          setPaypalPopup(true);
        }
      } catch (error) {
        console.error("PayPal check failed:", error);
        setPaypalPopup(true);
      }
    };

    checkPaypalAccount();
  }, []);
  const [dateFilter, setDateFilter] = useState("All Time");

  useEffect(() => {
    const fetchPayouts = async () => {
      if (!userRole) return;

      setLoading(true);

      try {
        const userId = localStorage.getItem("userid");
        const apiKey = localStorage.getItem("apiKey");
        const apiSecretKey = localStorage.getItem("apiSecretKey");

        if (!apiKey || !apiSecretKey) {
          console.error("Missing API credentials");
          return;
        }

        let url = "";

        if (userRole === "Merchant") {
          if (!userId) {
            console.error("User ID not found in localStorage");
            return;
          }
          url = `https://multi-vendor-marketplace.vercel.app/order/getPayoutByUserId?userId=${userId}&limit=${limit}&page=${page}`;
        } else if (userRole === "Dev Admin" || userRole === "Master Admin") {
          url = `https://multi-vendor-marketplace.vercel.app/order/getPayout?limit=${limit}&page=${page}`;
        } else {
          console.warn("Unhandled role:", userRole);
          return;
        }

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "x-api-key": apiKey,
            "x-api-secret": apiSecretKey,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (data?.payouts?.length) {
          setPayouts(data.payouts);
          setTotalPages(Math.ceil(data.totalCount / limit));
        } else {
          setPayouts([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Failed to fetch payouts:", error);
        setPayouts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayouts();
  }, [userRole, page]);

  const handleSearch = () => {
    let filteredData = [...payouts];

    /* ------------------ STATUS FILTER ------------------ */
    if (statusFilter) {
      filteredData = filteredData.filter((p) => p.status === statusFilter);
    }

    /* ------------------ DATE FILTER ------------------ */
    if (dateFilter && dateFilter !== "All Time") {
      const now = dayjs();

      filteredData = filteredData.filter((p) => {
        const payoutDate = dayjs(p.sortKey);

        if (dateFilter === "Today") {
          return payoutDate.isSame(now, "day");
        }

        if (dateFilter === "Last 7 days") {
          return payoutDate.isAfter(now.subtract(7, "day"));
        }

        if (dateFilter === "Last 30 days") {
          return payoutDate.isAfter(now.subtract(30, "day"));
        }

        if (dateFilter === "This Month") {
          return payoutDate.isSame(now, "month");
        }

        return true;
      });
    }

    /* ------------------ SEARCH FILTER ------------------ */
    if (!searchVal.trim()) {
      setFilteredPayouts(filteredData);
      return;
    }

    const searchTerm = searchVal.trim().toLowerCase();
    const regex = new RegExp(searchTerm, "i");

    const filtered = filteredData
      .map((payout) => {
        const payoutDateRaw = payout.payoutDate || "";
        const payoutDateFormatted = new Date(payoutDateRaw).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          },
        );

        const filteredOrders = payout.orders
          ?.map((order) => {
            const matchingLineItems = order.lineItems?.filter((line) => {
              const nameMatch = regex.test(line.merchantName || "");
              const emailMatch = regex.test(line.merchantEmail || "");
              const refundMatch =
                regex.test("refund") &&
                line.fulfillment_status?.toLowerCase() === "cancelled";
              const statusMatch = regex.test(payout.status || "");
              const payoutDateMatch =
                regex.test(payoutDateRaw) || regex.test(payoutDateFormatted);

              return (
                nameMatch ||
                emailMatch ||
                refundMatch ||
                statusMatch ||
                payoutDateMatch
              );
            });

            return matchingLineItems?.length
              ? { ...order, lineItems: matchingLineItems }
              : null;
          })
          .filter(Boolean);

        return filteredOrders.length
          ? { ...payout, orders: filteredOrders }
          : null;
      })
      .filter(Boolean);

    setFilteredPayouts(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchVal, payouts, statusFilter, dateFilter]);

  const [editableMerchants, setEditableMerchants] = useState([]);
  const [savingId, setSavingId] = useState(null);
  useEffect(() => {
    const merchants = users.filter((u) => u.role?.toLowerCase() === "merchant");

    setEditableMerchants(
      merchants.map((m) => ({
        ...m,
        commissionValue: m.comissionRate ?? "", // ✅ FIX HERE
        isEditable: false,
      })),
    );
  }, [users]);

  const [importModal, setImportModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const handleBulkImport = async () => {
    if (!selectedFile) {
      showToast("error", "Please select a CSV file");
      return;
    }

    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setImportLoading(true);

      const res = await fetch(
        "https://multi-vendor-marketplace.vercel.app/auth/bulk-update-commission",
        {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
            "x-api-secret": apiSecretKey,
          },
          body: formData,
        },
      );

      const data = await res.json();

      if (!res.ok) {
        showToast("error", data?.message || "Bulk update failed");
        return;
      }

      showToast(
        "success",
        `Updated: ${data.modifiedCount} merchants successfully`,
      );

      setImportModal(false);
      setSelectedFile(null);
      fetchAllUsers(); // refresh list
    } catch (error) {
      console.error("Bulk import error:", error);
      showToast("error", "Something went wrong");
    } finally {
      setImportLoading(false);
    }
  };

  const updateMerchantCommission = async (merchantId, commission) => {
    const apiKey = localStorage.getItem("apiKey");
    const apiSecretKey = localStorage.getItem("apiSecretKey");

    try {
      const res = await fetch(
        "https://multi-vendor-marketplace.vercel.app/auth/updateMerchantCommission",
        {
          method: "PUT",
          headers: {
            "x-api-key": apiKey,
            "x-api-secret": apiSecretKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ merchantId, commission }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        showToast("error", data?.message || "Commission update failed");
        throw new Error(data?.message);
      }

      // ✅ SUCCESS TOAST
      showToast("success", "Commission updated successfully!");

      return data;
    } catch (error) {
      console.error("Update commission error:", error);
      showToast("error", "Something went wrong while updating commission");
      throw error;
    }
  };

  return user ? (
    <main className="w-full p-4 md:p-8">
      <div className="flex flex-col gap-4 mb-6">
        {/* Top Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-lg font-semibold">Affiliate Payouts</h1>

          {/* Right: Filters + Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            {(userRole === "Master Admin" || userRole === "Dev Admin") && (
              <div className="relative">
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="appearance-none bg-gray-400 border border-gray-300 hover:bg-gray-500 text-gray-800 px-3 pr-10 h-8 text-sm font-medium rounded-md shadow-sm focus:outline-none"
                >
                  <option value="payouts">Payouts</option>

                  {(userRole === "Master Admin" ||
                    userRole === "Dev Admin") && (
                    <>
                      <option value="Timelines">Timelines & Config</option>
                      <option value="merchant-list">Merchant List</option>
                    </>
                  )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="w-4 h-4 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            )}
            {/* Filter 1 */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-gray-400 border border-gray-300 hover:bg-gray-500 
               text-gray-800 px-3 pr-10 h-8 text-sm font-medium 
               rounded-md shadow-sm focus:outline-none"
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Due">Due</option>
                <option value="Deposited">Deposited</option>
              </select>

              {/* Custom Arrow Icon */}
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg
                  className="w-4 h-4 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Filter 2 */}
            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="appearance-none bg-gray-400 border border-gray-300 hover:bg-gray-500 
               text-gray-800 px-3 pr-10 h-8 text-sm font-medium 
               rounded-md shadow-sm focus:outline-none"
              >
                <option value="Today">Today</option>
                <option value="Last 7 days">Last 7 days</option>
                <option value="Last 30 days">Last 30 days</option>
                <option value="This Month">This Month</option>
                <option value="All Time">All Time</option>
              </select>

              {/* Custom Arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg
                  className="w-4 h-4 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Admin Buttons */}
            {(userRole === "Master Admin" || userRole === "Dev Admin") && (
              <>
                <button
                  onClick={() => setImportModal(true)}
                  className="bg-gray-400 border border-gray-300 hover:bg-gray-500 text-gray-800 px-3 h-8 text-sm font-medium rounded-md flex items-center gap-1.5 shadow-sm"
                >
                  <CiImport className="w-4 h-4" />
                  Import
                </button>

                <button
                  onClick={handleExport}
                  className="bg-gray-400 border border-gray-300 hover:bg-gray-500 text-gray-800 px-3 h-8 text-sm font-medium rounded-md flex items-center gap-1.5 shadow-sm"
                >
                  <FaFileImport className="w-4 h-4" />
                  Export
                </button>
              </>
            )}
          </div>
        </div>

        {/* Summary Cards */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Available Balance</p>
              <div className="bg-green-100 p-2 rounded-lg">
                <HiOutlineCurrencyDollar className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold mt-3">
              ${summary.available.toFixed(2)}
            </h2>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Pending Payouts</p>
              <div className="bg-yellow-100 p-2 rounded-lg">
                <HiOutlineClock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold mt-3">
              ${summary.pending.toFixed(2)}
            </h2>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Due</p>
              <div className="bg-blue-100 p-2 rounded-lg">
                <HiOutlineTrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold mt-3">
              ${summary.due.toFixed(2)}
            </h2>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                {userRole === "Merchant" ? "Total Earned" : "Deposited"}
              </p>
              <div className="bg-purple-100 p-2 rounded-lg">
                <HiOutlineChartBar className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold mt-3">
              ${summary.deposited.toFixed(2)}
            </h2>
          </div>
        </div>
      </div>

      <div className="mt-6">
        {activeTab === "payouts" && (
          <div className="p-4">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <HiOutlineRefresh className="animate-spin text-xl text-gray-500" />
                loading...
              </div>
            ) : filteredPayouts.length > 0 ? (
              <table className="w-full border-collapse bg-white">
                <thead className="bg-gray-100 text-left text-gray-600 text-xs">
                  <tr>
                    <th className="p-3">Payout Date</th>
                    {(userRole === "Master Admin" ||
                      userRole === "Dev Admin") && (
                      <th className="p-3">Merchant Info</th>
                    )}
                    <th className="p-3">Transaction Dates</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Fulfilled</th>
                    <th className="p-3">Unfulfilled</th>

                    {userRole === "Master Admin" || userRole === "Dev Admin" ? (
                      <>
                        <th className="p-3 text-right">Gross</th>
                        <th className="p-3 text-right">Commission %</th>
                        <th className="p-3 text-right">Commission</th>
                        <th className="p-3 text-right">Net</th>
                      </>
                    ) : (
                      <th className="p-3 text-right">Amount</th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {userRole === "Master Admin" || userRole === "Dev Admin"
                    ? [...filteredPayouts]
                        .sort((a, b) => {
                          const order = { pending: 1, due: 2, deposited: 3 };

                          return (
                            order[a.status?.toLowerCase()] -
                            order[b.status?.toLowerCase()]
                          );
                        })
                        .flatMap((payout, index) =>
                          payout.orders.map((order, mIndex) => (
                            <tr
                              key={`${index}-${mIndex}`}
                              className="border-b hover:bg-gray-50"
                            >
                              {/* Payout Date */}
                              <td
                                className="p-3 text-blue-600 cursor-pointer hover:underline"
                                onClick={() => {
                                  const query = new URLSearchParams({
                                    payoutDate: payout.payoutDate,
                                    status: payout.status,
                                    merchantId: order.merchantId,
                                  });
                                  navigate(
                                    `/payout-details?${query.toString()}`,
                                  );
                                }}
                              >
                                {payout.payoutDate}
                              </td>

                              {/* Merchant Info */}
                              <td className="p-3 text-sm text-gray-600">
                                <div>{order.merchantName}</div>
                                <div className="text-xs text-gray-400">
                                  {order.merchantEmail}
                                </div>
                              </td>

                              {/* Transaction Dates */}
                              <td className="p-3">{payout.transactionDates}</td>

                              {/* Status */}
                              <td className="p-3">
                                <span
                                  className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                                    payout.status.toLowerCase() === "pending"
                                      ? "bg-blue-100 text-blue-700"
                                      : payout.status.toLowerCase() === "due"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-green-100 text-green-700"
                                  }`}
                                >
                                  {payout.status}
                                </span>
                              </td>

                              {/* Counts */}
                              <td className="p-3">{order.fulfilledCount}</td>
                              <td className="p-3">{order.unfulfilledCount}</td>

                              {/* 💰 GROSS */}
                              <td className="p-3 text-right font-medium">
                                {order.grossAmount.toFixed(2)} AUD
                              </td>

                              {/* 📊 COMMISSION % */}
                              <td className="p-3 text-right">
                                {order.commissionRate}%
                              </td>

                              {/* 💸 COMMISSION */}
                              <td className="p-3 text-right text-red-600">
                                {order.commissionAmount.toFixed(2)} AUD
                              </td>

                              {/* ✅ NET */}
                              <td className="p-3 text-right font-semibold text-green-700">
                                {order.netAmount.toFixed(2)} AUD
                              </td>
                            </tr>
                          )),
                        )
                    : /* 🔒 MERCHANT VIEW – AS IS (NO CHANGE) */
                      filteredPayouts.map((item, index) => {
                        const merchantId = localStorage.getItem("userid");

                        return (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td
                              className="p-3 text-blue-600 cursor-pointer hover:underline"
                              onClick={() =>
                                navigate(
                                  `/payout-details?payoutDate=${encodeURIComponent(
                                    item.payoutDate,
                                  )}&status=${item.status}&merchantId=${merchantId}`,
                                )
                              }
                            >
                              {item.payoutDate}
                            </td>
                            <td className="p-3">{item.transactionDates}</td>
                            <td className="p-3">
                              <td className="p-3">
                                <span
                                  className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                                    item.orders?.[0]?.status?.toLowerCase() ===
                                    "pending"
                                      ? "bg-blue-100 text-blue-700"
                                      : item.orders?.[0]?.status?.toLowerCase() ===
                                          "due"
                                        ? "bg-red-100 text-yellow-700"
                                        : "bg-green-100 text-green-700"
                                  }`}
                                >
                                  {item.orders?.[0]?.status || item.status}
                                </span>
                              </td>
                            </td>
                            <td className="p-3">{item.totalFulfilled}</td>
                            <td className="p-3">{item.totalUnfulfilled}</td>
                            <td className="p-3 text-right font-medium">
                              {item.amount || "$0.00"}
                            </td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-10 text-gray-500">
                No payouts found.
              </div>
            )}
          </div>
        )}

        {activeTab === "Timelines" && (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Finance Timelines
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Grace Period (in days)
              </label>
              <input
                type="number"
                className="border px-3 py-2 rounded-md text-sm w-40 no-spinner"
                value={graceTime}
                onChange={(e) => setGraceTime(Number(e.target.value))}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Default Commission (%)
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={commission}
                  onChange={(e) => setCommission(Number(e.target.value))}
                  className="border px-3 py-2 rounded-md text-sm w-40 no-spinner"
                  placeholder="e.g. 10"
                />
                <span className="text-sm text-gray-600">%</span>
              </div>

              <p className="text-xs text-gray-500 mt-1">
                Platform fee deducted from merchant payouts
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Payout Frequency
              </label>
              <select
                value={payoutFrequency}
                onChange={(e) => setPayoutFrequency(e.target.value)}
                className="border px-3 py-2 rounded-md text-sm w-60"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="once">Once a Month</option>
                <option value="twice">Twice a Month</option>
              </select>
            </div>

            {payoutFrequency === "weekly" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Day of the Week
                </label>
                <select
                  value={weeklyDay}
                  onChange={(e) => setWeeklyDay(e.target.value)}
                  className="border px-3 py-2 rounded-md text-sm w-60"
                >
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {["daily", "once", "twice"].includes(payoutFrequency) && (
              <div className="flex flex-col sm:flex-row gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Payout Date 1
                  </label>
                  <input
                    type="number"
                    value={firstPayoutDate}
                    onChange={(e) => setFirstPayoutDate(e.target.value)}
                    className="border px-3 py-2 rounded-md text-sm no-spinner"
                  />
                </div>

                {payoutFrequency === "twice" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Payout Date 2
                    </label>
                    <input
                      type="number"
                      value={secondPayoutDate}
                      onChange={(e) => setSecondPayoutDate(e.target.value)}
                      className="border px-3 py-2 rounded-md text-sm no-spinner"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleSavePayoutDates}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Save Payout Dates
              </button>
            </div>
          </div>
        )}
        {activeTab === "merchant-list" && (
          <div className="p-4">
            {usersLoading ? (
              <div className="flex justify-center items-center py-10">
                <HiOutlineRefresh className="animate-spin text-xl text-gray-500 mr-2" />
                Loading users...
              </div>
            ) : users.length > 0 ? (
              <table className="w-full border-collapse bg-white">
                <thead className="bg-gray-100 text-left text-gray-600 text-xs">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Comission ( % )</th>
                    <th className="p-3">Merchant ID</th>
                  </tr>
                </thead>
                <tbody>
                  {editableMerchants.map((user, index) => (
                    <tr
                      key={user._id || index}
                      className="border-b hover:bg-gray-50 text-sm"
                    >
                      <td className="p-3">
                        {user.firstName} {user.lastName}
                      </td>

                      <td className="p-3">{user.email}</td>

                      <td className="p-3">
                        <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
                          {user.role}
                        </span>
                      </td>

                      {/* ✅ COMMISSION COLUMN */}
                      <td className="p-3">
                        <div className="relative w-32 flex items-center">
                          <input
                            type="number"
                            value={user.commissionValue}
                            disabled={!user.isEditable}
                            onChange={(e) => {
                              const updated = [...editableMerchants];
                              updated[index].commissionValue = e.target.value;
                              setEditableMerchants(updated);
                            }}
                            className={`w-full text-sm px-2 py-1 border rounded-md pr-12 ${
                              user.isEditable
                                ? "bg-white border-gray-300"
                                : "bg-gray-100 text-gray-500 cursor-pointer"
                            }`}
                          />

                          <div className="absolute right-2 flex gap-1 items-center">
                            {!user.isEditable ? (
                              <FaEdit
                                className="text-gray-400 cursor-pointer hover:text-blue-600"
                                onClick={() => {
                                  const updated = [...editableMerchants];
                                  updated[index].isEditable = true;
                                  setEditableMerchants(updated);
                                }}
                              />
                            ) : (
                              <>
                                <button
                                  className="text-green-600 text-sm"
                                  disabled={savingId === user._id}
                                  onClick={async () => {
                                    setSavingId(user._id);
                                    try {
                                      await updateMerchantCommission(
                                        user._id,
                                        user.commissionValue,
                                      );
                                      const updated = [...editableMerchants];
                                      updated[index].isEditable = false;
                                      setEditableMerchants(updated);
                                    } catch {
                                      alert("Commission update failed");
                                    }
                                    setSavingId(null);
                                  }}
                                >
                                  {savingId === user._id ? "..." : "✔"}
                                </button>

                                <button
                                  className="text-red-600 text-sm"
                                  onClick={() => {
                                    const updated = [...editableMerchants];
                                    updated[index].isEditable = false;
                                    updated[index].commissionValue =
                                      user.commission;
                                    setEditableMerchants(updated);
                                  }}
                                >
                                  ✖
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-3">{user.shopifyId || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-10 text-gray-500">
                No users found.
              </div>
            )}
          </div>
        )}
      </div>

      {toast.show && (
        <div
          className={`fixed bottom-5 right-5 flex items-center p-4 rounded-lg shadow-lg transition-all ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {toast.type === "success" ? (
            <HiOutlineCheckCircle className="w-6 h-6 mr-2" />
          ) : (
            <HiOutlineXCircle className="w-6 h-6 mr-2" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
      {importModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => {
            setImportModal(false);
            setSelectedFile(null);
          }}
        >
          <div
            className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setImportModal(false);
                setSelectedFile(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-black text-lg"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                <HiOutlineUpload className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">
                  Import Commission Data
                </h2>
                <p className="text-sm text-gray-500">
                  Upload CSV file to bulk update merchant commissions.
                </p>
              </div>
            </div>

            {/* Upload Area */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition">
              <input
                type="file"
                accept=".csv"
                hidden
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />

              <HiOutlineUpload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                Click to select CSV file
              </span>
              <span className="text-xs text-gray-400 mt-1">
                Only .csv files are supported
              </span>
            </label>

            {/* Selected File Preview */}
            {selectedFile && (
              <div className="mt-4 bg-gray-50 border rounded-md p-3 text-sm flex justify-between items-center">
                <span className="truncate">{selectedFile.name}</span>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-red-500 hover:underline text-xs"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setImportModal(false);
                  setSelectedFile(null);
                }}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={handleBulkImport}
                disabled={!selectedFile || importLoading}
                className={`px-4 py-2 text-sm rounded-md text-white ${
                  importLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {importLoading ? "Uploading..." : "Upload File"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  ) : null;
};

export default Finance;
