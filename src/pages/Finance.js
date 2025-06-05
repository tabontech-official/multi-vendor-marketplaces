import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  HiOutlineCheckCircle,
  HiOutlineRefresh,
  HiOutlineXCircle,
} from "react-icons/hi";
import { CiCreditCard1 } from "react-icons/ci";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import UseFetchUserData from "../component/fetchUser";
import { useAuthContext } from "../Hooks/useAuthContext";
import { useNotification } from "../context api/NotificationContext";
import dayjs from "dayjs";
import minMax from "dayjs/plugin/minMax";
import { useNavigate, useNavigation } from "react-router-dom";
dayjs.extend(minMax);
const Finance = () => {
  const { addNotification } = useNotification();
  const { userData } = UseFetchUserData();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [payouts, setPayouts] = useState([]);
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState("");
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

  // const handleSavePayoutDates = async () => {
  //   if (!firstPayoutDate || !secondPayoutDate) {
  //     alert("Please select both payout dates.");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(
  //       "https://multi-vendor-marketplace.vercel.app/order/addPayOutDates",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           firstDate: firstPayoutDate,
  //           secondDate: secondPayoutDate,
  //         }),
  //       }
  //     );

  //     const data = await response.json();

  //     if (response.ok) {
  //       alert("✅ Payout dates saved successfully.");
  //     } else {
  //       alert(`❌ Failed to save: ${data.message}`);
  //     }
  //   } catch (error) {
  //     console.error("Error saving payout dates:", error);
  //     alert("❌ Error while saving payout dates.");
  //   }
  // };

  const handleSavePayoutDates = async () => {
    const payload = {
      graceTime,
      payoutFrequency,
      firstDate: firstPayoutDate,
      secondDate: payoutFrequency === "twice" ? secondPayoutDate : null,
      weeklyDay: payoutFrequency === "weekly" ? weeklyDay : null,
    };

    try {
      const res = await fetch(
        "https://multi-vendor-marketplace.vercel.app/order/addPayOutDates",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        console.error("❌ Save failed:", result);
        alert(result.message || "Failed to save payout config.");
        return;
      }

      alert(result.message || "Saved");
    } catch (err) {
      console.error(" Network error:", err);
      alert("Error saving payout configuration.");
    }
  };

  useEffect(() => {
    const fetchPayoutDates = async () => {
      try {
        const res = await fetch(
          "https://multi-vendor-marketplace.vercel.app/order/getPayoutsDates"
        );
        const data = await res.json();

        if (data.firstDate) setFirstPayoutDate(data.firstDate.slice(0, 10));
        if (data.secondDate) setSecondPayoutDate(data.secondDate.slice(0, 10));
        if (data.payoutFrequency) setPayoutFrequency(data.payoutFrequency);
        if (data.graceTime) setGraceTime(data.graceTime);
        if (data.weeklyDay) setWeeklyDay(data.weeklyDay);
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
          `https://multi-vendor-marketplace.vercel.app/auth/user/${userId}`
        );
        const user = res.data;
        const role = user?.role;

        if (role === "Dev Admin" || role === "Master Admin") return;

        if (!user?.paypalAccount) {
          setPaypalPopup(true);
        }
      } catch (error) {
        console.error("PayPal check failed:", error);
        setPaypalPopup(true); // fallback
      }
    };

    checkPaypalAccount();
  }, []);

  const submitPaypalAccount = async () => {
    const userId = localStorage.getItem("userid");
    if (!paypalAccountInput.trim()) {
      return alert("Please enter your PayPal account.");
    }

    setPaypalLoading(true);
    try {
      const res = await axios.post(
        "https://multi-vendor-marketplace.vercel.app/order/addPaypal",
        {
          merchantId: userId,
          payPal: paypalAccountInput,
        }
      );

      if (res.status === 200) {
        setPaypalPopup(false);
        showToast("success", "PayPal account saved successfully!");
      } else {
        showToast("error", "Failed to save PayPal account.");
      }
    } catch (error) {
      console.error("Error saving PayPal:", error);
      showToast("error", "Something went wrong while saving PayPal account.");
    } finally {
      setPaypalLoading(false);
    }
  };

  useEffect(() => {
    const fetchPayouts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://multi-vendor-marketplace.vercel.app/order/getPayout"
        );
        const data = await res.json();

        const payoutsData = data.payouts || [];
        setPayouts(payoutsData);
      } catch (error) {
        console.error("Failed to fetch payouts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayouts();
  }, []);

  return user ? (
    <main className="w-full p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:justify-between items-start border-gray-200 pb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-1">Finance</h1>

          {/* <div className="w-2/4 max-sm:w-full mt-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="md:w-2/4 p-2 max-sm:w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> */}
        </div>
      </div>
      {/* <div className="flex space-x-4 mt-6 border-b">
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "payouts"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("payouts")}
        >
          Payouts
        </button>

        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "Timelines"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("Timelines")}
        >
          Timelines
        </button>

        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "Due "
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("Due ")}
        >
          Due 
        </button>
      </div> */}
      <div className="flex space-x-4 mt-6 border-b">
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "payouts"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("payouts")}
        >
          Payouts
        </button>

        {(userRole === "Master Admin" || userRole === "Dev Admin") && (
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === "Timelines"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("Timelines")}
          >
            Timelines
          </button>
        )}

        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "Due "
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("Due ")}
        >
          Due
        </button>
      </div>

      <div className="mt-6">
        {activeTab === "payouts" && (
          <div className="p-4">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <HiOutlineRefresh className="animate-spin text-xl text-gray-500" />
                loading...
              </div>
            ) : payouts.length > 0 ? (
              <table className="w-full border-collapse bg-white">
                <thead className="bg-gray-100 text-left text-gray-600 text-sm">
                  <tr>
                    <th className="p-3">Payout Date</th>
                    <th className="p-3">Transaction Dates</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td
                        className="p-3 text-blue-600 cursor-pointer hover:underline"
                        onClick={() =>
                          navigate(
                            `/payout-details?payoutDate=${encodeURIComponent(
                              item.payoutDate
                            )}&status=${item.status}`
                          )
                        }
                      >
                        {item.payoutDate}
                      </td>
                      <td className="p-3">{item.transactionDates}</td>
                      <td className="p-3">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded 
                          ${
                            item.status === "Pending"
                              ? "bg-blue-100 text-blue-700"
                              : item.status === "Deposited"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="p-3 text-right font-medium">
                        {item.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-10 text-gray-500">
                No payouts found.
              </div>
            )}
          </div>
        )}

        {/* 
        {activeTab === "Due " && (
          <div className="p-4">
            <table className="w-full border-collapse bg-white">
              <thead className="bg-gray-100 text-left text-gray-600 text-sm">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Payout Date</th>
                  <th className="p-3">Payout Status</th>
                  <th className="p-3">Order</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-right">Fee</th>
                  <th className="p-3 text-right">Net</th>
                </tr>
              </thead>
              <tbody>
                {payouts.length > 0 ? (
                  payouts.flatMap((payout, i) =>
                    payout.orders.map((order, index) => {
                      const fee = (order.amount * 0.1).toFixed(2);
                      const net = (order.amount - fee).toFixed(2);
                      const formattedDate = new Date(
                        order.createdAt
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      });

                      return (
                        <tr
                          key={`${i}-${index}`}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-3">{formattedDate}</td>
                          <td className="p-3">{payout.payoutDate}</td>
                          <td className="p-3">
                            <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">
                              {payout.status}
                            </span>
                          </td>
                          <td className="p-3 text-blue-600 hover:underline cursor-pointer">
                            #{order.shopifyOrderNo}
                          </td>
                          <td className="p-3 text-right">
                            ${order.amount.toFixed(2)}
                          </td>
                          <td className="p-3 text-right">-${fee}</td>
                          <td className="p-3 text-right font-medium">
                            ${net} AUD
                          </td>
                        </tr>
                      );
                    })
                  )
                ) : (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      No payouts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )} */}
        {activeTab === "Due " && (
          <div className="p-4">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <HiOutlineRefresh className="animate-spin text-xl text-gray-500" />
                loading...
              </div>
            ) : (
              <table className="w-full border-collapse bg-white">
                <thead className="bg-gray-100 text-left text-gray-600 text-sm">
                  <tr>
                    <th className="p-3">Payout Date</th>
                    <th className="p-3">Payout Status</th>
                    <th className="p-3 text-right">Amount</th>
                    <th className="p-3 text-right">Fee</th>
                    <th className="p-3 text-right">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.length > 0 ? (
                    payouts.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td
                          className="p-3 text-blue-600 cursor-pointer hover:underline"
                          onClick={() =>
                            navigate(
                              `/payout-details?payoutDate=${encodeURIComponent(
                                item.payoutDate
                              )}&status=${item.status}`
                            )
                          }
                        >
                          {item.payoutDate}
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded 
                            ${
                              item.status === "Pending"
                                ? "bg-blue-100 text-blue-700"
                                : item.status === "Deposited"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="p-3 text-right">
                          $
                          {item.orders
                            .reduce((sum, o) => sum + o.amount, 0)
                            .toFixed(2)}
                        </td>
                        <td className="p-3 text-right text-red-600">
                          -$
                          {(
                            item.orders.reduce((sum, o) => sum + o.amount, 0) *
                            0.1
                          ).toFixed(2)}
                        </td>
                        <td className="p-3 text-right text-green-700 font-semibold">
                          $
                          {(
                            item.orders.reduce((sum, o) => sum + o.amount, 0) *
                            0.9
                          ).toFixed(2)}{" "}
                          AUD
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-gray-500">
                        No payouts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* {activeTab === "Timelines" && (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Finance Timelines
            </h2>

            <div className="flex flex-col sm:flex-row gap-6 mb-6">
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1">
                  Payout Date 1
                </label>
                <input
                  type="date"
                  className="border px-3 py-2 rounded-md text-sm"
                  value={firstPayoutDate}
                  onChange={(e) => setFirstPayoutDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1">
                  Payout Date 2
                </label>
                <input
                  type="date"
                  className="border px-3 py-2 rounded-md text-sm"
                  value={secondPayoutDate}
                  onChange={(e) => setSecondPayoutDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSavePayoutDates}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Save Payout Dates
              </button>
            </div>
          </div>
        )}*/}
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
                className="border px-3 py-2 rounded-md text-sm w-40"
                value={graceTime}
                onChange={(e) => setGraceTime(Number(e.target.value))}
              />
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

            {/* Weekly Day Selection */}
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

            {/* Payout Date Inputs */}
            {["daily", "once", "twice"].includes(payoutFrequency) && (
              <div className="flex flex-col sm:flex-row gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Payout Date 1
                  </label>
                  <input
                    type="date"
                    value={firstPayoutDate}
                    onChange={(e) => setFirstPayoutDate(e.target.value)}
                    className="border px-3 py-2 rounded-md text-sm"
                  />
                </div>

                {payoutFrequency === "twice" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Payout Date 2
                    </label>
                    <input
                      type="date"
                      value={secondPayoutDate}
                      onChange={(e) => setSecondPayoutDate(e.target.value)}
                      className="border px-3 py-2 rounded-md text-sm"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Save Button */}
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

      {paypalPopup && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative border shadow-xl">
            <button
              onClick={() => setPaypalPopup(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-black"
            >
              ✕
            </button>
            <div className="text-center">
              <div className="text-4xl mb-3 text-blue-600 flex justify-center">
                <CiCreditCard1 />
              </div>
              <h2 className="text-xl font-bold mb-2">Activate Finance</h2>
              <p className="text-sm text-gray-600 mb-4">
                Please enter your eligible PayPal account to activate finance
                payouts.
              </p>
              <input
                type="text"
                value={paypalAccountInput}
                onChange={(e) => setPaypalAccountInput(e.target.value)}
                placeholder="PayPal Account"
                className="w-full px-4 py-2 border rounded-md mb-4"
              />
              <button
                onClick={submitPaypalAccount}
                disabled={paypalLoading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {paypalLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  ) : null;
};

export default Finance;
