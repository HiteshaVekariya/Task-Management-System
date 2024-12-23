import React from 'react';
import { TaskProvider } from './context/TaskContext';
import TaskTable from './components/TaskTable';
function App() {
  return (
    <TaskProvider>
      <div className="bg-[#F3F7FF] h-screen"> 
        <h1 className='flex justify-between items-center z-30 py-[18px] xl:px-[34px] px-[15px] border-b border-[#E4E4E4] bg-[#F3F7FF] text-[20px] font-medium'>Task List</h1>
        <TaskTable />
      </div>
    </TaskProvider>
  );
}

export default App;
