import React, { useEffect } from "react";
import { useNotification } from "../context api/NotificationContext";
const Notification = () => {
  const { notifications, fetchNotifications } = useNotification();

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="bg-[#eaf5f3] min-h-screen py-12">
      <div className=" px-10 py-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Changelog
        </h2>
        <h1 className="text-3xl font-bold text-gray-900 mb-10">
          What’s New at App?
        </h1>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative border-l border-gray-300 ml-6">
          {notifications.map((note, index) => (
            <div key={note._id || index} className="relative mb-10 pl-6">
              <span className="absolute -left-[13px] top-1.5 w-6 h-6 border-4 border-white bg-gray-300 rounded-full z-10 shadow-sm"></span>

              <p className="text-xs font-bold text-gray-700 uppercase mb-1">
                {new Date(note.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })}
              </p>

              <h3 className="text-base font-semibold text-blue-800 hover:underline cursor-pointer">
                {note.title || note.message}
              </h3>

              {note.description && (
                <p className="text-sm text-gray-700 mt-1">{note.description}</p>
              )}

              <div className="flex space-x-2 mt-2">
                <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {note.source || "Feature"}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {`${note.firstName} ${note.lastName}` || "Admin"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notification;
