import { fetchAllProjectsWithEpics } from './api'; 
let projectsWithEpics1 = null;

export async function getJiraData() {
  if (!projectsWithEpics1) {
    projectsWithEpics1 = await fetchAllProjectsWithEpics();
    console.log("Projects with Epics (cached):", projectsWithEpics1);
  //   let epic_data = projectsWithEpics1[2];
  //   console.log("apic data", epic_data.epicDetails[0].developer);
  //   let arr1 = []

  //   if(var2 == epic_data.epicDetails[0].developer){
  //     console.log(epicdata);
  //     arr1.append(epicdata)
  //   }
  }
  return projectsWithEpics1;
}
export async function initTasks() {
  try {
    const projectsWithEpics = await getJiraData();
    
    console.log("Projects with Epics:", projectsWithEpics);

    if (!Array.isArray(projectsWithEpics)) {
      throw new Error("Invalid data structure: projectsWithEpics is not an array");
    }

    let tasks = projectsWithEpics.reduce((acc, project) => {
        acc.push({
          // Start and end dates will be set later
          start: null,
          end: null,
          name: project.projectName,
          id: project.projectKey,
          type: 'project',
          hideChildren: false,
        });
  
        project.epicDetails.forEach(epic => {
          if (epic.startDate !== 'N/A' && epic.endDate !== 'N/A') {
            const startDate = new Date(epic.startDate);
            const endDate = new Date(epic.endDate);
            // console.log("Start Date:", epic.startDate); // Log start date
            // console.log("End Date:", epic.endDate);
            acc.push({
              start: startDate,
              end: endDate,
              name: epic.name,
              id: epic.key,
              type: 'task',
              project: project.projectKey,
              parent: project.projectKey,
              developer: epic.developer,
              teamLead:epic.teamLead,
              tester: 'Jay',
            });
            
          }
        });
        
        return acc;
    }, []);
    console.log("Before Tasks:", tasks);
    tasks = setProjectDates(tasks);

    console.log("Tasks:", tasks);
    orgbydev();
    return tasks;
  } catch (error) {
    console.error('Error fetching and replacing data:', error);
    return []; 
  }
}

export async function organizeByTeamLead() {
  try {
    const projectsWithEpics = await getJiraData();
    const teamLeadMap = {};

    projectsWithEpics.forEach(project => {
      project.epicDetails.forEach(epic => {
        if (epic.startDate !== 'N/A' && epic.endDate !== 'N/A') {
          const startDate = new Date(epic.startDate);
          const endDate = new Date(epic.endDate);

          if (!teamLeadMap[epic.teamLead]) {
            teamLeadMap[epic.teamLead] = {
              teamLead: epic.teamLead,
              type: 'project',
              children: [],
              start: epic.startDate,
              end: epic.endDate,
              id: epic.teamLead,
              hideChildren: false  
            };
          }

          teamLeadMap[epic.teamLead].children.push({
            start: startDate,
            end: endDate,
            name: epic.name,
            id: epic.key,
            type: 'task',
            project: epic.teamLead,
            parent: epic.teamLead,
            developer: epic.developer,
            teamLead:epic.teamLead,
            tester: 'Jay',
          });

          if (startDate < new Date(teamLeadMap[epic.teamLead].start)) {
            teamLeadMap[epic.teamLead].start = startDate;
          }

          if (endDate > new Date(teamLeadMap[epic.teamLead].end)) {
            teamLeadMap[epic.teamLead].end = endDate;
          }
        }
      });
    });

   

    console.log('teamLeadMap', teamLeadMap);

    const tasks = [];
    for (const key in teamLeadMap) {
      const element = teamLeadMap[key];

      tasks.push({
        start: new Date(element.start),
        end: new Date(element.end),
        name: element.teamLead,
        id: element.teamLead,
        type: 'project',
        hideChildren: element.hideChildren,
      });

      tasks.push(...element.children);
    }

    console.log("Tasks:", tasks);
    return tasks;
  } catch (error) {
    console.error('Error fetching and replacing data:', error);
    return [];
  }
}
/* // fromww new project for backup
export async function initTasks3() {
  try {
    const projectsWithEpics = await getJiraData();
    if (!Array.isArray(projectsWithEpics)) {
      throw new Error("Invalid data structure: projectsWithEpics is not an array");
    }

    const tasks = projectsWithEpics.reduce((acc, project) => {
      let projectStartDate = null;
      let projectEndDate = null;

      const projectTask = {
        start: null,
        end: null,
        name: project.projectName,
        id: project.projectKey,
        type: 'project',
        hideChildren: false,
      };
      acc.push(projectTask);

      project.epicDetails.forEach(epic => {
        if (epic.startDate !== 'N/A' && epic.endDate !== 'N/A') {
          const startDate = new Date(epic.startDate);
          const endDate = new Date(epic.endDate);
          if (!projectStartDate || startDate < projectStartDate) {
            projectStartDate = startDate;
          }
          if (!projectEndDate || endDate > projectEndDate) {
            projectEndDate = endDate;
          }
          acc.push({
            start: startDate,
            end: endDate,
            name: epic.name,
            id: epic.key,
            type: 'task',
            project: project.projectKey,
            parent: project.projectKey,
            developer: epic.developer,
            teamLead: epic.teamLead,
            tester: epic.tester,
          });
        }
      });

      projectTask.start = projectStartDate ? new Date(projectStartDate) : null;
      projectTask.end = projectEndDate ? new Date(projectEndDate) : null;

      return acc;
    }, []);

    return tasks;
  } catch (error) {
    console.error('Error fetching and replacing data:', error);
    return []; 
  }
}


export async function initTasks1() {
  try {
    const projectsWithEpics = await getJiraData();
    if (!Array.isArray(projectsWithEpics)) {
      throw new Error("Invalid data structure: projectsWithEpics is not an array");
    }

    let tasks = projectsWithEpics.reduce((acc, project) => {
        acc.push({
          // Start and end dates will be set later
          start: null,
          end: null,
          name: project.projectName,
          id: project.projectKey,
          type: 'project',
          hideChildren: false,
        });
  
        project.epicDetails.forEach(epic => {
          if (epic.startDate !== 'N/A' && epic.endDate !== 'N/A') {
            const startDate = new Date(epic.startDate);
            const endDate = new Date(epic.endDate);
            acc.push({
              start: startDate,
              end: endDate,
              name: epic.name,
              id: epic.key,
              type: 'task',
              project: project.projectKey,
              parent: project.projectKey,
              developer: epic.developer,
              teamLead:epic.teamLead,
              tester: epic.tester,
            });
          }
        });
        return acc;
    }, []);
 
    tasks = setProjectDates(tasks);
    return tasks;
  } catch (error) {
    console.error('Error fetching and replacing data:', error);
    return []; 
  }
}
*/
export async function organizeByKey(groupByKey) {
  try {
    const projectsWithEpics = await getJiraData();
    const groupMap = {};

    projectsWithEpics.forEach(project => {
      project.epicDetails.forEach(epic => {
        if (epic.startDate !== 'N/A' && epic.endDate !== 'N/A') {
          const startDate = new Date(epic.startDate);
          const endDate = new Date(epic.endDate);
          const groupKey = project[groupByKey] || epic[groupByKey]; // Use either project or epic key

          if (!groupMap[groupKey]) {
            groupMap[groupKey] = {
              groupKey: groupKey,
              type: 'project',
              children: [],
              start: startDate,
              end: endDate,
              id: groupKey,
              hideChildren: false  // Initialize hideChildren
            };
          }

          groupMap[groupKey].children.push({
            start: startDate,
            end: endDate,
            name: epic.name,
            id: epic.key,
            type: 'task',
            project: groupKey,
            parent: groupKey,
            developer: epic.developer,
            teamLead: epic.teamLead,
            tester: 'Jay',
          });

          if (startDate < new Date(groupMap[groupKey].start)) {
            groupMap[groupKey].start = startDate;
          }

          if (endDate > new Date(groupMap[groupKey].end)) {
            groupMap[groupKey].end = endDate;
          }
        }
      });
    });

    console.log('groupMap', groupMap);

    const tasks = [];
    for (const key in groupMap) {
      const element = groupMap[key];

      tasks.push({
        start: new Date(element.start),
        end: new Date(element.end),
        name: element.groupKey,
        id: element.groupKey,
        type: 'project',
        hideChildren: element.hideChildren,
      });

      if (!element.hideChildren) {
        tasks.push(...element.children);
      }
    }

    console.log("Tasks:", tasks);
    return tasks;
  } catch (error) {
    console.error('Error fetching and organizing data:', error);
    return [];
  }
}



function setProjectDates(tasks) {
  const projectMap = {};

  tasks.forEach(task => {
    if (task.type === 'task' && task.project) {
      if (!projectMap[task.project]) {
        projectMap[task.project] = {
          start: task.start,
          end: task.end
        };
      } else {
        if (projectMap[task.project].start > task.start) {
          projectMap[task.project].start = task.start;
        }
        if (projectMap[task.project].end < task.end) {
          projectMap[task.project].end = task.end;
        }
      }
    }
  });

  tasks.forEach(task => {
    if (task.type === 'project' && projectMap[task.id]) {
      task.start = projectMap[task.id].start;
      task.end = projectMap[task.id].end;
    }
  });
  console.log("in date",tasks);
  return tasks;
}

export const expandAllTasks = (tasks) => {
  return tasks.map(task =>
    task.type === "project" ? { ...task, hideChildren: false } : task
  );
};

export const collapseAllTasks = (tasks) => {
  return tasks.map(task =>
    task.type === "project" ? { ...task, hideChildren: true } : task
  );
};


export async function orgbydev(){
  const data = await getJiraData();
    const developerEpicMap = {};

    data.forEach(project => {
      project.epicDetails.forEach(epic => {
         
              if (!developerEpicMap[epic.developer]) {
                  developerEpicMap[epic.developer] = {
                      epics: [],
                      start: epic.startDate,
                      end: epic.endDate
                  };
              }
              developerEpicMap[epic.developer].epics.push({
                  name: epic.name,
                  start: epic.startDate,
                  end: epic.endDate
              });

              
              if (epic.startDate !== 'N/A' && (developerEpicMap[epic.developer].start === 'N/A' || new Date(epic.startDate) < new Date(developerEpicMap[epic.developer].start))) {
                  developerEpicMap[epic.developer].start = epic.startDate;
              }
              if (epic.endDate !== 'N/A' && (developerEpicMap[epic.developer].end === 'N/A' || new Date(epic.endDate) > new Date(developerEpicMap[epic.developer].end))) {
                  developerEpicMap[epic.developer].end = epic.endDate;
              }
          
      });
  });
    console.log(developerEpicMap);
    return developerEpicMap;

}

/*
// working
export async function organizeByTeamLead() {
  try {
    const projectsWithEpics = await getJiraData();
    const teamLeadMap = {};

    projectsWithEpics.forEach(project => {
      project.epicDetails.forEach(epic => {
        if (epic.startDate !== 'N/A' && epic.endDate !== 'N/A') {
          const startDate = new Date(epic.startDate);
          const endDate = new Date(epic.endDate);

          if (!teamLeadMap[epic.teamLead]) {
            teamLeadMap[epic.teamLead] = {
              teamLead: epic.teamLead,
              type: 'project',
              children: [],
              start: epic.startDate,
              end: epic.endDate,
              id:epic.teamLead,
              hideChildren: false
            };
          }

          teamLeadMap[epic.teamLead].children.push({
            start: startDate,
            end: endDate,
            name: epic.name,
            id: epic.key,
            type: 'task',
            project: project.projectKey,
            parent: epic.teamLead,
            developer: epic.developer
          });
          if (startDate < teamLeadMap[epic.teamLead].start) {
            teamLeadMap[epic.teamLead].start = startDate;
          }
          if (endDate > teamLeadMap[epic.teamLead].end) {
            teamLeadMap[epic.teamLead].end = endDate;
          }
        }
      //   if (epic.startDate !== 'N/A' && (teamLeadMap[epic.developer].start === 'N/A' || new Date(epic.startDate) < new Date(teamLeadMap[epic.developer].start))) {
      //     teamLeadMap[epic.developer].start = epic.startDate;
      // }
      // if (epic.endDate !== 'N/A' && (teamLeadMap[epic.developer].end === 'N/A' || new Date(epic.endDate) > new Date(teamLeadMap[epic.developer].end))) {
      //   teamLeadMap[epic.developer].end = epic.endDate;
      // }
      });
    });
    console.log('teamLeadMap',teamLeadMap);

    const tasks = []; 
    for (const key in teamLeadMap) {
      const element = teamLeadMap[key];
  

      tasks.push({
        start: teamLeadMap[key].start,
        end: teamLeadMap[key].end,
        name: teamLeadMap[key].teamLead,
        id: teamLeadMap[key].teamLead,
        type: 'project',
        hideChildren: false,
     
      });
      tasks.push(...teamLeadMap[key].children);
    }

    // console.log("Tasks of lead: ", tasks);
    // const tasksCopy = [...tasks];
    // const modifiedTasks = setProjectDates1(tasksCopy);
    // tasks.splice(0, tasks.length, ...modifiedTasks);

    console.log("Tasks:", tasks);
    return tasks;

  } catch (error) {
    console.error('Error fetching and replacing data:', error);
    return []; 
  }
}
*/

/*
export async function organizeByTeamLead() {
  try {
    const projectsWithEpics = await getJiraData();

    const teamLead = [];

    projectsWithEpics.forEach(project => {
        project.epicDetails.forEach(epic => {
            if (!teamLead[epic.teamLead]) {
              teamLead[epic.teamLead] = [];
            }
            teamLead[epic.teamLead].push({
                projectName: project.projectName,
                key: epic.key,
                name: epic.name,
                startDate: epic.startDate,
                endDate: epic.endDate,
                developer:epic.developer
            });
        });
    });
    console.log("TeamLead: ",teamLead);
    return teamLead;

  } catch (error) {
    console.error('Error fetching and replacing data:', error);
    return []; // Return an empty array in case of error
}
}
*/
/*

export const organizeByDeveloper = async () => {
 
    const projectsWithEpics = await getJiraData();
    const developersWithEpics = {};

    let tasks = projectsWithEpics.reduce((acc, project) => {
      acc.push({
        // Start and end dates will be set later
        start: null,
        end: null,
        name: project.epicDetails.developer,
        id: project.projectKey,
        type: 'developer',
        hideChildren: false,
      });

      project.epicDetails.forEach(epic => {
        if (epic.startDate !== 'N/A' && epic.endDate !== 'N/A') {
          const startDate = new Date(epic.startDate);
          const endDate = new Date(epic.endDate);
          console.log("Start Date:", epic.startDate); // Log start date
          console.log("End Date:", epic.endDate);
          acc.push({
            start: startDate,
            end: endDate,
            name: epic.name,
            id: epic.key,
            type: 'task',
            project: project.projectKey,
            parent: project.projectKey,
            developer: epic.developer,
            tester: '',
          });
        }
        console.log('acc',acc);
      });
      
      return acc;
  }, []);

  tasks = setProjectDates(tasks);

  console.log("Tasks:", tasks);
  
  return tasks;

}



export const organizeByDeveloper1 = (epicData) => {

  if (!Array.isArray(epicData)) {
    console.error("Expected an array for epicData, but received:", typeof epicData);
    return {};
  }
  const developers = {};

  epicData.forEach(epic => {
    const developer = epic.developer; // Assuming 'developer' field exists in your data

    // Skip if developer is undefined
    if (!developer) {
      return;
    }

    if (!developers[developer]) {
      developers[developer] = [];
    }
    developers[developer].push({
      projectName: epic.projectName, // Assuming 'projectName' field exists in your data
      key: epic.id, // Assuming 'id' field represents the epic key
      name: epic.name,
      startDate: epic.start,
      endDate: epic.end,
      type: 'task'
    });
  });
  const result = Object.keys(developers).map(developer => ({
    developer,
    tasks: developers[developer]
  }));

  console.log("Devs ", developers);
  console.log("result ", result);



  return result;
}

*/


function setProjectDates1(tasks) {
  const projectMap = {};

 
  tasks.forEach(task => {
    if (task.type === 'task') {
      if (!projectMap[task.project]) {
        projectMap[task.project] = {
          start: task.start,
          end: task.end
        };
      } else {
        if (projectMap[task.project].start === null || task.start < projectMap[task.project].start) {
          projectMap[task.project].start = task.start;
        }
        if (projectMap[task.project].end === null || task.end > projectMap[task.project].end) {
          projectMap[task.project].end = task.end;
        }
      }
    }
  });

  console.log("Project Map after populating:", projectMap);

  
  tasks.forEach(task => {
    if (task.type === 'project' && projectMap[task.id]) {
      task.start = projectMap[task.id].start;
      task.end = projectMap[task.id].end;
    }
  });

  console.log("Tasks after updating project dates:", tasks);

  return tasks;
}


// export const collapseAllTasks = (tasks) => {
//   const collapsedTasks = tasks.map(task => {
//     if (task.type === 'project') {
//       return { ...task, hideChildren: true };
//     }
//     return task;
//   });
//   console.log("Collapsed tasks:", collapsedTasks);
//   return collapsedTasks;
// };
