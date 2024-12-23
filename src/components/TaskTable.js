import React, { useContext, useState } from 'react';
import { TaskContext } from '../context/TaskContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from './layout/ModalLayout';
import ActionModal from '../pages/ActionModal';
import SkeletonLoader from './SkeletonLoader';

const TaskTable = () => {
  const { tasks, setTasks, loading } = useContext(TaskContext);
  const [modalState, setModalState] = useState({ showModal: false, mode: '', task: null });
  const [formErrors, setFormErrors] = useState({});
  const [pagination, setPagination] = useState({ currentPage: 1, itemsPerPage: 5 });
  const [filters, setFilters] = useState({ status: '', search: '' });

  const validateForm = () => {
    const { title, description, dueDate, status } = modalState.task || {};
    const errors = {};
    if (!title) errors.title = 'Title is required';
    if (!description) errors.description = 'Description is required';
    if (!dueDate) errors.dueDate = 'Due Date is required';
    if (!status) errors.status = 'Status is required';
    return errors;
  };

  const handleTaskChange = (e) => {
    setModalState((prev) => ({
      ...prev,
      task: { ...prev.task, [e.target.name]: e.target.value },
    }));
  };

  const handleTaskSave = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    const updatedTasks = modalState.mode === 'edit'
      ? tasks.map((task) => (task.id === modalState.task.id ? modalState.task : task))
      : [...tasks, { ...modalState.task, id: tasks.length + 1 }];

    setTasks(updatedTasks);
    setModalState({ showModal: false, mode: '', task: null });
    setFormErrors({});

    toast.success(`Task ${modalState.mode === 'edit' ? 'updated' : 'added'} successfully!`);

    try {
      const url = modalState.mode === 'edit' ? '/task.json' : '/task.json';
      const method = modalState.mode === 'edit' ? 'PUT' : 'POST';
      await axios({ url, method, headers: { 'Content-Type': 'application/json' }, data: modalState.task });
    } catch (error) {
      console.error(`Error ${modalState.mode === 'edit' ? 'updating' : 'adding'} the task:`, error);
    }
  };

  const handleTaskDelete = async () => {
    const updatedTasks = tasks.filter((task) => task.id !== modalState.task.id);
    const { currentPage, itemsPerPage } = pagination;
    const currentPageTasks = updatedTasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (currentPageTasks.length === 0 && currentPage > 1) {
      setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }));
    }
    setTasks(updatedTasks);
    setModalState({ showModal: false, mode: '', task: null });
    toast.success('Task deleted successfully!');

    try {
      await axios.delete(`/task/${modalState.task.id}.json`);
    } catch (error) {
      console.error('Error deleting the task:', error);
    }
  };

  const filteredTasks = tasks
    .filter((task) => (filters.status ? task.status === filters.status : true))
    .filter((task) =>
      filters.search
        ? task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.search.toLowerCase())
        : true
    );

  const { currentPage, itemsPerPage } = pagination;
  const currentTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  const handlePageChange = (page) => setPagination((prev) => ({ ...prev, currentPage: page }));

  const openModal = (mode, task = null) => {
    setModalState({ showModal: true, mode, task });
  };

  const closeModal = () => {
    setModalState({ showModal: false, mode: '', task: null });
    setFormErrors({});
  };

  const handleRowClick = (task) => {
    setModalState({ showModal: true, mode: 'view', task });
  };

  return (
    <div className="mx-24">
      <ToastContainer />

      <div className="flex items-center justify-between mb-4 mt-8">
        <div className="w-8/12">
          <input
            type="text"
            className="cursor-pointer border border-[#E4E4E4] rounded-lg px-2 py-1 text-[14px] w-4/12"
            placeholder="Search by title or description..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          />

          <label className="ml-2 text-[14px]">
            Filter by Status:
            <select
              value={filters.status}
              onChange={(e) => { setFilters((prev) => ({ ...prev, status: e.target.value })); setPagination((prev) => ({ ...prev, currentPage: 1 })); }}
              className="w-[170px] cursor-pointer border border-[#E4E4E4] rounded-lg px-2 py-1 text-[14px] ml-2"
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </label>
        </div>

        <button
          className="bg-[#635BFF] rounded-[10px] text-white font-normal text-sm py-3 px-4 shadow-xs shadow-xl"
          onClick={() => openModal('add', { title: '', description: '', dueDate: '', status: '' })}
        >
          Add Task
        </button>
      </div>

      {modalState.showModal && (
        <Modal isOpen={modalState.showModal} onClose={closeModal} title="Task Modal">
          <ActionModal
            modalMode={modalState.mode}
            currentTask={modalState.task}
            formErrors={formErrors}
            handleInputChange={handleTaskChange}
            handleAdd={handleTaskSave}
            handleDelete={handleTaskDelete}
            closeModal={closeModal}
          />
        </Modal>
      )}

      <div className="p-4 rounded-[18px] bg-white">
        {loading ? (
          <SkeletonLoader count={5} rowHeight={50} />
        ) : (
          <table className="rounded-[18px]">
            <thead className="bg-white text-left rounded-[18px]">
              <tr className="px-3 py-2 text-[#808191] font-medium text-left text-sm leading-4 tracking-wider rounded-[18px]">
                <th>Title</th>
                <th>Description</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.length !== 0 ? (
                <>
                  {currentTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="border-b text-sm text-[#010101] cursor-pointer hover:bg-[#F4F7FE]"
                      onClick={() => handleRowClick(task)}

                    >
                      <td>{task.title}</td>
                      <td>{task.description}</td>
                      <td>{task.dueDate}</td>
                      <td>{task.status}</td>
                      <td>
                        <div className="flex">
                          <img
                            src="/images/edit.svg"
                            alt="edit-icon"
                            className="h-4 w-4 mr-4 cursor-pointer"
                            onClick={(e) => { openModal('edit', task); e.stopPropagation() }}
                          />
                          <img
                            src="/images/delete.svg"
                            alt="delete-icon"
                            className="h-4 w-4 cursor-pointer"
                            onClick={(e) => { openModal('delete', task); e.stopPropagation() }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <div class="flex items-center justify-center mt-4">
                  <div class="text-center">
                    <h2 class="text-sm font-semibold text-[#a5a6b5]">
                      Result not matched with any data. No records found.
                    </h2>
                  </div>
                </div>
              )}
            </tbody>
          </table>
        )}

        <div className="my-4 mx-4 flex justify-end text-sm text-[#010101] cursor-pointer h-6">
          <button
            disabled={pagination.currentPage === 1}
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            className="mr-1 bg-[#635BFF] ml-1 text-white flex justify-center items-center px-1 rounded-sm pb-1"
          >
            {'<'}
          </button>
          <span>
            Page {pagination.currentPage} of {totalPages}
          </span>
          <button
            disabled={pagination.currentPage === totalPages}
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            className="bg-[#635BFF] ml-1 text-white flex justify-center items-center px-1 rounded-sm pb-1"
          >
            {'>'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskTable;
