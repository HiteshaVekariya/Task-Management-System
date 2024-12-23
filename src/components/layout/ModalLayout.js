import React from "react";

// Reusable Modal Component
const Modal = ({ isOpen, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 max-w-full">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </div>
        {/* Modal Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;