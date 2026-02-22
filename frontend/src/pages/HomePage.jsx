import AddTask from "@/components/AddTask";
import DateTimeFilter from "@/components/DateTimeFilter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import StatsAndFilters from "@/components/StatsAndFilter";
import TaskList from "@/components/TaskList";
import TaskListPagination from "@/components/TaskListPagination";
import React, { useEffect, useState } from "react";
// import axios from "axios";
import { toast } from "sonner";
import api from "@/lib/axios";
import { visibleTaskLimit } from "@/lib/data";

const HomePage = () =>{
  const [taskBuffer, setTaskBuffer] = useState([]);
  const [activeTaskCount, setActiveTaskCount] = useState(0);
  const [completeTaskCount, setCompleteTaskCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [dateQuery, setdateQuery] = useState("today");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchTasks();
    }, [dateQuery]);


  useEffect(() => {
    setPage(1);
  }, [filter, dateQuery]);

  //logic
  const fetchTasks = async () => {
    try{
      const res = await api.get(`/tasks?filter=${dateQuery}`);
      setTaskBuffer(res.data.tasks);
      setActiveTaskCount(res.data.activeCount);
      setCompleteTaskCount(res.data.completeCount);
    }catch(error){
      console.error("Lỗi xảy ra khi truy xuất tasks: ", error);
      toast.error("Lỗi xảy ra khi truy xuất tasks.");
    }
  };

  // biến 
  const filteredTasks = taskBuffer.filter((task)  => {
    switch(filter){
      case "active":
        return task.status === "active";
      case "completed":
        return task.status === "complete";
      default:
        return true;
     }
  });
 
  const visibleTasks = filteredTasks.slice(
    (page - 1) * visibleTaskLimit,
    page * visibleTaskLimit
  );

    
  const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit);

  const handleTaskChanged = () => {
    fetchTasks();
  };

  const handleNext = () => {
    if(page < totalPages){
      setPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if(page > 1){
      setPage((prev) => prev - 1);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  
  if(visibleTasks.length === 0){
    handlePrev();
  }

  return(

        <div className="min-h-screen w-full relative">
  {/* Aurora Dream Vivid Bloom */}
    <div
    className="absolute inset-0 z-0"
    style={{
      background: `
        radial-gradient(ellipse 80% 60% at 70% 20%, rgba(175, 109, 255, 0.85), transparent 68%),
        radial-gradient(ellipse 70% 60% at 20% 80%, rgba(255, 100, 180, 0.75), transparent 68%),
        radial-gradient(ellipse 60% 50% at 60% 65%, rgba(255, 235, 170, 0.98), transparent 68%),
        radial-gradient(ellipse 65% 40% at 50% 60%, rgba(120, 190, 255, 0.3), transparent 68%),
        linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
      `,
    }}
  />
  {/* Your content goes here */}
    <div className="container pt-8 mx-auto relative z-10">
            <div className="w-full max-w-2xl p-6 mx-auto space-y-6">
                {/* Đầu trang */}
                <Header/>
                
                {/* Tạo nhiệm vụ với AddTask */}
                <AddTask 
                handleNewTaskAdded={handleTaskChanged}
                />

                {/* Thống kê và bộ lọc*/}
                <StatsAndFilters 
                  filter={filter}
                  setFilter={setFilter}
                  activeTasksCount={activeTaskCount}
                  completedTasksCount={completeTaskCount}
                />

                {/* Danh sách nhiệm vụ */}
                <TaskList 
                filteredTasks={visibleTasks}
                filter={filter} 
                handleTaskChanged={handleTaskChanged}
                />

                {/* Phân trang và lọc theo Date */}
                <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                <TaskListPagination
                  handleNext ={handleNext}
                  handlePrev={handlePrev}
                  handlePageChange={handlePageChange}
                  page={page}
                  totalPages={totalPages}
                />
                    <DateTimeFilter 
                    dateQuery={dateQuery} 
                    setdateQuery={setdateQuery}
                    />

                </div>

                {/* Chân trang */}
                <Footer
                  activeTaskCount={activeTaskCount}
                  completedTaskCount={completeTaskCount}

                />
                {/* */}


            </div>     
        </div>
</div>
        
    );
};
export default HomePage;
