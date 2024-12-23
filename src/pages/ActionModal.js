import React from 'react';

const ActionModal = ({
  modalMode,
  currentTask = {},
  formErrors = {},
  handleInputChange,
  handleAdd,
  handleDelete,
  closeModal,
}) => {
  const isAddMode = modalMode === 'add';
  const isEditMode = modalMode === 'edit';
  const isDeleteMode = modalMode === 'delete';
  const isViewMode = modalMode === 'view';


  const handleSubmit = () => {
    if (isAddMode || isEditMode) handleAdd();
    if (isEditMode) handleAdd();
    if (isDeleteMode) handleDelete();
  };

  const renderFormInput = (label, name, type = 'text') => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={currentTask[name] || ''}
        onChange={handleInputChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
      {formErrors[name] && <p className="text-red-500 text-sm">{formErrors[name]}</p>}
    </div>
  );

  const renderForm = () => (
    <>
      {renderFormInput('Title', 'title')}
      {renderFormInput('Description', 'description')}
      {renderFormInput('Due Date', 'dueDate', 'date')}
      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          name="status"
          value={currentTask.status || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="">Select status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        {formErrors.status && <p className="text-red-500 text-sm">{formErrors.status}</p>}
      </div>
    </>
  );

  const renderDeleteConfirmation = () => (
    <div className="text-center">
      <p className="mt-4 text-gray-700">
        Are you sure you want to delete the task <strong>{currentTask.title}</strong>? This action cannot be undone.
      </p>
    </div>
  );

  const renderViewDetailsOfTask = () => (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <p className="mt-4 text-gray-700">
        <span className="font-semibold">Title:</span> <strong>{currentTask.title}</strong>
      </p>
      <p className="mt-4 text-gray-700">
        <span className="font-semibold">Description:</span> <strong>{currentTask.description}</strong>
      </p>
      <p className="mt-4 text-gray-700">
        <span className="font-semibold">Due Date:</span> <strong>{currentTask.dueDate}</strong>
      </p>
      <p className="mt-4 text-gray-700">
        <span className="font-semibold">Status:</span> <strong>{currentTask.status}</strong>
      </p>

      <div className="mt-6">
        <p className="text-center text-gray-600">
          Thank you for reviewing the task details. If you need any further assistance, please don't hesitate to get in touch.
        </p>
      </div>
    </div>
  );


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl text-[#010101] font-medium">
            {isAddMode ? 'Add New Task' : isEditMode ? 'Edit Task' : isViewMode ? 'View Task Details' : 'Confirm Deletion'}
          </h2>
        </div>

        {(isAddMode || isEditMode) && <form className="space-y-4">{renderForm()}</form>}
        {isDeleteMode && renderDeleteConfirmation()}
        {isViewMode && renderViewDetailsOfTask()}

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md shadow"
          >
            Cancel
          </button>
          {!isViewMode && (
            <button
              onClick={handleSubmit}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow ${isDeleteMode ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                }`}
            >
              {isAddMode ? 'Add Task' : isEditMode ? 'Save Changes' : 'Yes'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
