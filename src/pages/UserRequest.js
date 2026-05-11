import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  RiArrowLeftLine,
  RiInformationLine,
  RiLoader4Line,
  RiCalendarLine,
  RiHashtag,
  RiShoppingBag3Line,
  RiUser3Line,
} from "react-icons/ri";

const RequestDetails = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`https://multi-vendor-marketplace.vercel.app/order/getCancellationRequestsByUserId/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRequest(data.data);
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans">
      {/* --- Header Section --- */}
      <div className=" ">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="space-y-1">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm font-bold uppercase tracking-widest mb-2"
            >
              <RiArrowLeftLine size={18} /> Back to Requests
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Request Details
            </h1>
            <p className="text-sm text-gray-500 font-medium italic">
              Reviewing products under Order #{request?.orderNo || "..."}
            </p>
          </div>

          {/* Quick Merchant Info Badge */}
          {request?.merchant && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 min-w-[280px]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <RiUser3Line size={22} />
                </div>

                <div className="flex-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Merchant Information
                  </p>

                  <h3 className="text-base font-bold text-gray-900 leading-none">
                    {request.merchant.name || "N/A"}
                  </h3>

                  <div className="mt-3 space-y-1">
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold text-gray-800">
                        Seller Name:
                      </span>{" "}
                      {request.merchant.sellerName || "N/A"}
                    </p>

                    <p className="text-xs text-gray-600">
                      <span className="font-semibold text-gray-800">
                        Username:
                      </span>{" "}
                      {request.merchant.userName || "N/A"}
                    </p>

                    <p className="text-xs text-gray-600 break-all">
                      <span className="font-semibold text-gray-800">
                        Email:
                      </span>{" "}
                      {request.merchant.email || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-24 text-gray-400 gap-3 bg-white rounded-2xl border border-gray-200">
            <RiLoader4Line className="animate-spin text-blue-500" size={40} />
            <p className="text-sm font-medium">Fetching details...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* --- Main Info Card --- */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <RiInformationLine className="text-blue-500" size={18} />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  General Information
                </span>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                    Reason for Cancellation
                  </p>
                  <p className="text-sm font-semibold text-gray-800 leading-relaxed bg-red-50/50 p-3 rounded-xl border border-red-100">
                    "{request?.request || "No specific reason provided."}"
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                    Submission Date
                  </p>
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <RiCalendarLine size={16} className="text-gray-400" />
                    {new Date(request?.createdAt).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <div
                  onClick={() => {
                    const linkedOrderId = request?.orderId;
                    const userId = request?.userId || state?.userId;

                    if (!linkedOrderId || !userId) {
                      console.error("Missing linked order data", {
                        linkedOrderId,
                        userId,
                        request,
                        state,
                      });
                      return;
                    }

                    navigate(`/order/${linkedOrderId}/${userId}`, {
                      state: {
                        userId,
                        orderId: linkedOrderId,
                        orderNo: request?.orderNo,
                        requestId: request?._id,
                        fullName: state?.fullName,
                        email: state?.email,
                      },
                    });
                  }}
                >
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                    Linked Order
                  </p>

                  <div className="flex items-center gap-2 text-sm font-bold text-blue-600 cursor-pointer underline bg-blue-50 px-3 py-1.5 rounded-lg w-fit">
                    <RiHashtag size={16} />
                    {request?.orderNo || request?.orderId}
                  </div>
                </div>
              </div>
            </div>

            {/* --- Products Table --- */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <RiShoppingBag3Line className="text-emerald-500" size={18} />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Included Products
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/30">
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase">
                        #
                      </th>
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase">
                        Product Description
                      </th>
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase text-right">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {Array.isArray(request?.productNames) &&
                      request.productNames.map((product, i) => (
                        <tr
                          key={i}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-6 py-5 text-sm font-mono text-gray-400">
                            {String(i + 1).padStart(2, "0")}
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-sm font-semibold text-gray-800">
                              {product}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-600 border border-orange-100 uppercase tracking-tight">
                              Pending Review
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Total Items: {request?.productNames?.length || 0}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestDetails;
