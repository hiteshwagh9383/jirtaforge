import { invoke } from '@forge/bridge';

import React, { useEffect, useState, useRef } from 'react';
import { Gantt, ViewMode } from 'gantt-task-react';
import { initTasks, expandAllTasks, collapseAllTasks,organizeByTeamLead,organizeByKey } from './helper/helper';
import { ViewSwitcher } from './components/ViewSwitcher';
import TaskListHeader from './components/TaskListHeader';
import TaskListTable from './components/TaskListTable';
import TooltipContent from './components/TooltipContent';
import './style.css';
import './App.css';

const App = () => {
  const [view, setView] = useState(ViewMode.Day);
  const [tasks, setTasks] = useState([]);
  const [isChecked, setIsChecked] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyTasks, setShowOnlyTasks] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const ganttRef = useRef();
  const containerRef = useRef();
  const [dropdownView, setDropdownView] = useState('teamlead');
  const [viewDate, setViewDate] = useState(new Date());
  const tooltipRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let updatedTasks = [];
        if (dropdownView === 'teamlead') {
          //const organizedTasks = await organizeByTeamLead();
          const organizedTasks = await organizeByKey('teamLead');
          console.log("Organized tasks by teamlead:", organizedTasks);
          updatedTasks = organizedTasks;
        } else if (dropdownView === 'developer') {
          const organizedTasks = await organizeByKey('developer');
          console.log("Organized tasks by developer:", organizedTasks);
          updatedTasks = organizedTasks;
        } else if (dropdownView === 'assignees') {
          const organizedTasks = await organizeByKey('name');
          console.log("Organized tasks by tester:", organizedTasks);
          updatedTasks = organizedTasks;
        } 
        else {
          const fetchedTasks = await initTasks();
          console.log("Fetched tasks:", fetchedTasks);
          updatedTasks = fetchedTasks;
        }
        setTasks(updatedTasks);
      } catch (error) {
        console.error('Error fetching and setting tasks:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [dropdownView]);

  useEffect(() => {
    const resizeContainer = () => {
      if (containerRef.current) {
        containerRef.current.style.height = `${window.innerHeight - 100}px`;
      }
    };

    window.addEventListener('resize', resizeContainer);
    resizeContainer();

    return () => {
      window.removeEventListener('resize', resizeContainer);
    };
  }, []);

  useEffect(() => {
    if (ganttRef.current && ganttRef.current.updateSize) {
      ganttRef.current.updateSize();
      ganttRef.current.scrollToDate(viewDate);
    }
  }, [tasks]);
 
  const handleExpandAll = () => {
    try {
      setTasks(expandAllTasks(tasks));
    } catch (error) {
      console.error("Error expanding all tasks:", error);
    }
  };
  let columnWidth = 50;
  if (view === ViewMode.Month) {
    columnWidth = 200;
  } else if (view === ViewMode.Week) {
    columnWidth = 150;
  } else if (view === ViewMode.Year) {
    columnWidth = 300;
  }

  const handleCollapseAll = () => {
    try {
      setTasks(prevTasks => {
        const collapsedTasks = collapseAllTasks(prevTasks);
        console.log("Collapsed tasks:", collapsedTasks);
        return collapsedTasks;
      });
    } catch (error) {
      console.error("Error collapsing all tasks:", error);
    }
  };
  const handleSelect = (task, isSelected) => {
    console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
  };

  const handleExpanderClick = (task) => {
    try {
      setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
      console.log("On expander click Id:" + task.id);
    } catch (error) {
      console.error("Error handling expander click:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleShowOnlyTasksChange = () => {
    setShowOnlyTasks(!showOnlyTasks);
  };

  const isValidTask = (task) => {
    return task && task.start && task.end && task.name;
  };

  const filteredTasks = tasks
    .filter(task => {
      try {
        return task.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (!showOnlyTasks || task.type !== "project");
      } catch (error) {
        console.error("Error filtering tasks:", error);
        return false;
      }
    })
    .filter(isValidTask);

  console.log("Filtered tasks:", filteredTasks);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading tasks: {error.message}</div>;
  }

  return (
    <div className="AppContainer">
    <div>
                <ViewSwitcher
                  onViewModeChange={(viewMode) => setView(viewMode)}
                  
                  onViewListChange={setIsChecked}
                  isChecked={isChecked}
                  onExpandAll={handleExpandAll}
                  onCollapseAll={handleCollapseAll}
                  showOnlyTasks={showOnlyTasks}
                  onShowOnlyTasksChange={handleShowOnlyTasksChange}
                  searchTerm={searchTerm}
                  onSearchChange={handleSearch}
                  dropdownView={dropdownView}
                  onDropdownChange={(e) => setDropdownView(e.target.value)}
                  
                />
                <h3>Timeline :</h3>
                <div className="gantt-container" ref={containerRef} onClick={() => {
                  if (tooltipRef.current) {
                    tooltipRef.current.focus();
                  }
                }}>
                  {filteredTasks.length > 0 ? (
                    <Gantt
                      tasks={filteredTasks}
                      viewMode={view}
                      viewDate={viewDate} 
                      onSelect={handleSelect}
                      projectBackgroundColor="blue"
                      onExpanderClick={handleExpanderClick}
                      listCellWidth={isChecked ? "155px" : ""}
                      ganttHeight="100%"
                      ref={ganttRef}
                      columnWidth={columnWidth}
                      TooltipContent={TooltipContent}
                      TaskListHeader={() => <TaskListHeader dropdownView={dropdownView} />}
                      TaskListTable={TaskListTable}
                      tooltipRef={tooltipRef} 
                    />
                  ) : (
                    <p>No matching tasks found.</p>
                  )}
                </div>
                </div>
    </div>
  );
};

export default App;



/*
// before shifting the dropdownn in viewswitcher
import { invoke } from '@forge/bridge';

import React, { useEffect, useState, useRef } from 'react';
import { Gantt, ViewMode } from 'gantt-task-react';
import { initTasks, expandAllTasks, collapseAllTasks,organizeByTeamLead } from './helper/helper';
import { ViewSwitcher } from './components/ViewSwitcher';
import TaskListHeader from './components/TaskListHeader';
import TaskListTable from './components/TaskListTable';
import TooltipContent from './components/TooltipContent';
import './style.css';
import './App.css';

const App = () => {
  const [view, setView] = useState(ViewMode.Day);
  const [tasks, setTasks] = useState([]);
  const [isChecked, setIsChecked] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyTasks, setShowOnlyTasks] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const ganttRef = useRef();
  const containerRef = useRef();
  const [dropdownView, setDropdownView] = useState('teamlead');



  useEffect(() => {
    const fetchData = async () => {
      try {
        let updatedTasks = [];
        if (dropdownView === 'teamlead') {
          const organizedTasks = await organizeByTeamLead();
          console.log("Organized tasks by teamlead:", organizedTasks);
          updatedTasks = organizedTasks;
        } else {
          const fetchedTasks = await initTasks();
          console.log("Fetched tasks:", fetchedTasks);
          updatedTasks = fetchedTasks;
        }
        setTasks(updatedTasks);
      } catch (error) {
        console.error('Error fetching and setting tasks:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [dropdownView]);

  useEffect(() => {
    const resizeContainer = () => {
      if (containerRef.current) {
        containerRef.current.style.height = `${window.innerHeight - 100}px`;
      }
    };

    window.addEventListener('resize', resizeContainer);
    resizeContainer();

    return () => {
      window.removeEventListener('resize', resizeContainer);
    };
  }, []);

  useEffect(() => {
    if (ganttRef.current && ganttRef.current.updateSize) {
      ganttRef.current.updateSize();
    }
  }, [tasks]);

  const handleExpandAll = () => {
    try {
      setTasks(expandAllTasks(tasks));
    } catch (error) {
      console.error("Error expanding all tasks:", error);
    }
  };
  let columnWidth = 50;
  if (view === ViewMode.Month) {
    columnWidth = 250;
  } else if (view === ViewMode.Week) {
    columnWidth = 200;
  }

  const handleCollapseAll = () => {
    try {
      setTasks(prevTasks => {
        const collapsedTasks = collapseAllTasks(prevTasks);
        console.log("Collapsed tasks:", collapsedTasks);
        return collapsedTasks;
      });
    } catch (error) {
      console.error("Error collapsing all tasks:", error);
    }
  };
  const handleSelect = (task, isSelected) => {
    console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
  };

  const handleExpanderClick = (task) => {
    try {
      setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
      console.log("On expander click Id:" + task.id);
    } catch (error) {
      console.error("Error handling expander click:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleShowOnlyTasksChange = () => {
    setShowOnlyTasks(!showOnlyTasks);
  };

  const isValidTask = (task) => {
    return task && task.start && task.end && task.name;
  };

  const filteredTasks = tasks
    .filter(task => {
      try {
        return task.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (!showOnlyTasks || task.type !== "project");
      } catch (error) {
        console.error("Error filtering tasks:", error);
        return false;
      }
    })
    .filter(isValidTask);

  console.log("Filtered tasks:", filteredTasks);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading tasks: {error.message}</div>;
  }

  return (
    <div className="AppContainer">
    <select value={dropdownView} onChange={(e) => setDropdownView(e.target.value)}>
                <option value="projects">Projects</option>
                <option value="assignees">Assignees</option>
                <option value="developer">Developer</option>
                <option value="teamlead">Teamlead</option>
    </select>
    <div>
                <ViewSwitcher
                  onViewModeChange={(viewMode) => setView(viewMode)}
                  onViewListChange={setIsChecked}
                  isChecked={isChecked}
                  onExpandAll={handleExpandAll}
                  onCollapseAll={handleCollapseAll}
                  showOnlyTasks={showOnlyTasks}
                  onShowOnlyTasksChange={handleShowOnlyTasksChange}
                  searchTerm={searchTerm}
                  onSearchChange={handleSearch}
                />
                <h3>Timeline :</h3>
                <div className="gantt-container" ref={containerRef}>
                  {filteredTasks.length > 0 ? (
                    <Gantt
                      tasks={filteredTasks}
                      viewMode={view}
                      onSelect={handleSelect}
                      projectBackgroundColor="blue"
                      onExpanderClick={handleExpanderClick}
                      listCellWidth={isChecked ? "155px" : ""}
                      ganttHeight="100%"
                      ref={ganttRef}
                      columnWidth={columnWidth}
                      TooltipContent={TooltipContent}
                      TaskListHeader={TaskListHeader}
                      TaskListTable={TaskListTable}
                    />
                  ) : (
                    <p>No matching tasks found.</p>
                  )}
                </div>
                </div>
    </div>
  );
};

export default App;

*/

/*
// before adding devliper functiolty in dropdown
import { invoke } from '@forge/bridge';

import React, { useEffect, useState, useRef } from 'react';
import { Gantt, ViewMode } from 'gantt-task-react';
import { initTasks, expandAllTasks, collapseAllTasks,organizeByDeveloper } from './helper/helper';
import { ViewSwitcher } from './components/ViewSwitcher';
import TaskListHeader from './components/TaskListHeader';
import TaskListTable from './components/TaskListTable';
import TooltipContent from './components/TooltipContent';
import './style.css';
import './App.css';

const App = () => {
  const [view, setView] = useState(ViewMode.Day);
  const [tasks, setTasks] = useState([]);
  const [isChecked, setIsChecked] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyTasks, setShowOnlyTasks] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const ganttRef = useRef();
  const containerRef = useRef();
  const [dropdownView, setDropdownView] = useState('projects');
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await initTasks();
        console.log("Fetched tasks:", fetchedTasks);
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Error fetching and setting tasks:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);


  useEffect(() => {
    const resizeContainer = () => {
      if (containerRef.current) {
        containerRef.current.style.height = `${window.innerHeight - 100}px`;
      }
    };

    window.addEventListener('resize', resizeContainer);
    resizeContainer();

    return () => {
      window.removeEventListener('resize', resizeContainer);
    };
  }, []);

  useEffect(() => {
    if (ganttRef.current && ganttRef.current.updateSize) {
      ganttRef.current.updateSize();
    }
  }, [tasks]);

  const handleExpandAll = () => {
    try {
      setTasks(expandAllTasks(tasks));
    } catch (error) {
      console.error("Error expanding all tasks:", error);
    }
  };
  let columnWidth = 50;
  if (view === ViewMode.Month) {
    columnWidth = 250;
  } else if (view === ViewMode.Week) {
    columnWidth = 200;
  }
  const handleCollapseAll = () => {
    try {
      console.log("------------",tasks);
      const developers = organizeByDeveloper(tasks);
      console.log("From main ",developers);
      setTasks(collapseAllTasks(tasks));
    } catch (error) {
      console.error("Error collapsing all tasks:", error);
    }
  };

  const handleSelect = (task, isSelected) => {
    console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
  };

  const handleExpanderClick = (task) => {
    try {
      setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
      console.log("On expander click Id:" + task.id);
    } catch (error) {
      console.error("Error handling expander click:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleShowOnlyTasksChange = () => {
    setShowOnlyTasks(!showOnlyTasks);
  };

  const isValidTask = (task) => {
    return task && task.start && task.end && task.name;
  };

  const filteredTasks = tasks
    .filter(task => {
      try {
        return task.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (!showOnlyTasks || task.type !== "project");
      } catch (error) {
        console.error("Error filtering tasks:", error);
        return false;
      }
    })
    .filter(isValidTask);

  console.log("Filtered tasks:", filteredTasks);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading tasks: {error.message}</div>;
  }

  return (
    <div className="AppContainer">
    <select value={dropdownView} onChange={(e) => setDropdownView(e.target.value)}>
                <option value="projects">Projects</option>
                <option value="assignees">Assignees</option>
                <option value="developer">Developer</option>
                <option value="teamlead">Teamlead</option>
    </select>
    {dropdownView === 'projects' ? (
                <div>
                <ViewSwitcher
                  onViewModeChange={(viewMode) => setView(viewMode)}
                  onViewListChange={setIsChecked}
                  isChecked={isChecked}
                  onExpandAll={handleExpandAll}
                  onCollapseAll={handleCollapseAll}
                  showOnlyTasks={showOnlyTasks}
                  onShowOnlyTasksChange={handleShowOnlyTasksChange}
                  searchTerm={searchTerm}
                  onSearchChange={handleSearch}
                />
                <h3>Timeline :</h3>
                <div className="gantt-container" ref={containerRef}>
                  {filteredTasks.length > 0 ? (
                    <Gantt
                      tasks={filteredTasks}
                      viewMode={view}
                      onSelect={handleSelect}
                      projectBackgroundColor="blue"
                      onExpanderClick={handleExpanderClick}
                      listCellWidth={isChecked ? "155px" : ""}
                      ganttHeight="100%"
                      ref={ganttRef}
                      columnWidth={columnWidth}
                      TooltipContent={TooltipContent}
                      TaskListHeader={TaskListHeader}
                      TaskListTable={TaskListTable}
                    />
                  ) : (
                    <p>No matching tasks found.</p>
                  )}
                </div>
                </div>
            ) : dropdownView === 'assignees' ?(
                <h1>Assine</h1>
            ): dropdownView === 'developer' ?(
                
                <h1>Dev</h1>
            ):(
                <h1>TEallead</h1>
            )}
            
      
      
    </div>
  );
};

export default App;

*/
/*

// working before dropdwon
import React, { useEffect, useState, useRef } from 'react';
import { Gantt, ViewMode } from 'gantt-task-react';
import { initTasks, expandAllTasks, collapseAllTasks } from './helper/helper';
import { ViewSwitcher } from './components/ViewSwitcher';
import TaskListHeader from './components/TaskListHeader';
import TaskListTable from './components/TaskListTable';
import TooltipContent from './components/TooltipContent';
import './style.css';
import './App.css';

const App = () => {
  const [view, setView] = useState(ViewMode.Day);
  const [tasks, setTasks] = useState([]);
  const [isChecked, setIsChecked] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyTasks, setShowOnlyTasks] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const ganttRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await initTasks();
        console.log("Fetched tasks:", fetchedTasks);
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Error fetching and setting tasks:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    const resizeContainer = () => {
      if (containerRef.current) {
        containerRef.current.style.height = `${window.innerHeight - 100}px`;
      }
    };

    window.addEventListener('resize', resizeContainer);
    resizeContainer();

    return () => {
      window.removeEventListener('resize', resizeContainer);
    };
  }, []);

  useEffect(() => {
    if (ganttRef.current && ganttRef.current.updateSize) {
      ganttRef.current.updateSize();
    }
  }, [tasks]);

  const handleExpandAll = () => {
    try {
      setTasks(expandAllTasks(tasks));
    } catch (error) {
      console.error("Error expanding all tasks:", error);
    }
  };

  const handleCollapseAll = () => {
    try {
      setTasks(collapseAllTasks(tasks));
    } catch (error) {
      console.error("Error collapsing all tasks:", error);
    }
  };

  const handleSelect = (task, isSelected) => {
    console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
  };

  const handleExpanderClick = (task) => {
    try {
      setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
      console.log("On expander click Id:" + task.id);
    } catch (error) {
      console.error("Error handling expander click:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleShowOnlyTasksChange = () => {
    setShowOnlyTasks(!showOnlyTasks);
  };

  const isValidTask = (task) => {
    return task && task.start && task.end && task.name;
  };

  const filteredTasks = tasks
    .filter(task => {
      try {
        return task.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (!showOnlyTasks || task.type !== "project");
      } catch (error) {
        console.error("Error filtering tasks:", error);
        return false;
      }
    })
    .filter(isValidTask);

  console.log("Filtered tasks:", filteredTasks);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading tasks: {error.message}</div>;
  }

  return (
    <div className="AppContainer">
      <ViewSwitcher
        onViewModeChange={(viewMode) => setView(viewMode)}
        onViewListChange={setIsChecked}
        isChecked={isChecked}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        showOnlyTasks={showOnlyTasks}
        onShowOnlyTasksChange={handleShowOnlyTasksChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
      />
      <h3>Timeline :</h3>
      <div className="gantt-container" ref={containerRef}>
        {filteredTasks.length > 0 ? (
          <Gantt
            tasks={filteredTasks}
            viewMode={view}
            onSelect={handleSelect}
            projectBackgroundColor="blue"
            onExpanderClick={handleExpanderClick}
            listCellWidth={isChecked ? "155px" : ""}
            ganttHeight="100%"
            ref={ganttRef}
            columnWidth={50}
            TooltipContent={TooltipContent}
            TaskListHeader={TaskListHeader}
            TaskListTable={TaskListTable}
          />
        ) : (
          <p>No matching tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default App;


*/
/*
import { Gantt, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { initTasks, expandAllTasks, collapseAllTasks } from './helper/helper';
import { ViewSwitcher } from './components/ViewSwitcher';
import './style.css';
import TaskListHeader from './components/TaskListHeader';
import TaskListTable from './components/TaskListTable';
import TooltipContent from './components/TooltipContent';

import "gantt-task-react/dist/index.css";
import "./App.css";


const App = () => {

  const [view, setView] = useState(ViewMode.Day);
  const [tasks, setTasks] = useState(initTasks());
  const [isChecked, setIsChecked] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyTasks, setShowOnlyTasks] = useState(false);
  const ganttRef = useRef();

  const containerRef = useRef();

  useEffect(() => {
    console.log("In aap.js taks",tasks);
    try {
      if (ganttRef.current && ganttRef.current.updateSize) {
        ganttRef.current.updateSize();
      }
    } catch (error) {
      console.error("Error updating Gantt size:", error);
    }
  }, [tasks]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        containerRef.current.style.height = `${window.innerHeight - 100}px`;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  let columnWidth = 50;
  if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }

  const handleExpandAll = () => {
    try {
      setTasks(expandAllTasks(tasks));
    } catch (error) {
      console.error("Error expanding all tasks:", error);
    }
  };

  const handleCollapseAll = () => {
    try {
      setTasks(collapseAllTasks(tasks));
    } catch (error) {
      console.error("Error collapsing all tasks:", error);
    }
  };

  const handleSelect = (task, isSelected) => {
    console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
  };

  const handleExpanderClick = (task) => {
    try {
      setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
      console.log("On expander click Id:" + task.id);
    } catch (error) {
      console.error("Error handling expander click:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleShowOnlyTasksChange = () => {
    setShowOnlyTasks(!showOnlyTasks);
  };

  const isValidTask = (task) => {
    return task && task.start && task.end && task.name;
  };

  

  const filteredTasks = tasks
    .filter((task) => {
      //  console.log('tasks',tasks);
      try {
        return task.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (!showOnlyTasks || task.type !== "project");
      } catch (error) {
        console.error("Error filtering tasks:", error);
        return false;
      }
    })
    .filter(isValidTask);

  return (
    <div className="AppContainer">
      <div>
        {tasks}
      </div>
      <ViewSwitcher
        onViewModeChange={(viewMode) => setView(viewMode)}
        onViewListChange={setIsChecked}
        isChecked={isChecked}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        showOnlyTasks={showOnlyTasks}
        onShowOnlyTasksChange={handleShowOnlyTasksChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
      />
       <h3>Timeline :</h3>
      <div className="gantt-container" ref={containerRef}>
        {filteredTasks.length > 0 ? (
          <Gantt
            tasks={filteredTasks}
            viewMode={view}
            onSelect={handleSelect}
            projectBackgroundColor="blue"
            onExpanderClick={handleExpanderClick}
            listCellWidth={isChecked ? "155px" : ""}
            ganttHeight="100%"
            columnWidth={columnWidth}
            ref={ganttRef}
            TooltipContent={TooltipContent}
            TaskListHeader={TaskListHeader}
            TaskListTable={(props) => (
              <TaskListTable {...props}  />
            )}
          />
        ) : (
          <p>No matching tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default App;
*/