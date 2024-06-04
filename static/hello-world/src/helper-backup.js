import { fetchAllProjectsWithEpics } from './api'; // Import the function for fetching data from Jira

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
              tester: '',
            });
          }
         // console.log('acc',acc);
        });
        
        return acc;
    }, []);
    console.log("Before Tasks:", tasks);
    tasks = setProjectDates(tasks);

    console.log("Tasks:", tasks);
    return tasks;
  } catch (error) {
    console.error('Error fetching and replacing data:', error);
    return []; // Return an empty array in case of error
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
              children: []
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
        }
      });
    });
    console.log('teamLeadMap',teamLeadMap);

    const tasks = []; 
    for (const key in teamLeadMap) {
      const element = teamLeadMap[key];
      let teamLeadStart = new Date(292277026596, 11, 31); // Initialize teamLeadStart with maximum date
      let teamLeadEnd = new Date(1, 0); // Initialize teamLeadEnd with minimum date
      
      // Check if element.epics exists and is an array before iterating over it
      if (Array.isArray(element.epics)) {
        // Iterate over each epic for the current team lead
        element.epics.forEach(epic => {
          if (epic.start < teamLeadStart) {
            teamLeadStart = epic.start;
          }
          if (epic.end > teamLeadEnd) {
            teamLeadEnd = epic.end;
          }
        });
    
        // Update overall start and end dates based on the current team lead's epics
        if (teamLeadStart < start) {
          start = teamLeadStart;
        }
        if (teamLeadEnd > end) {
          end = teamLeadEnd;
        }
      }

     // console.log("start",teamLeadStart.toISOString());
     // console.log("emd",teamLeadEnd.toISOString());
      tasks.push({
        start: null,//teamLeadStart.toISOString(),
        end: null,//teamLeadEnd.toISOString(),
        name: teamLeadMap[key].teamLead,
        id: teamLeadMap[key].teamLead,
        type: 'project',
        hideChildren: false
      });
      tasks.push(...teamLeadMap[key].children);
    }

    console.log("Tasks of lead: ", tasks);
    const tasksCopy = [...tasks];
    const modifiedTasks = setProjectDates1(tasksCopy);
    tasks.splice(0, tasks.length, ...modifiedTasks);

    console.log("Tasks:", tasks);
    return tasks;

  } catch (error) {
    console.error('Error fetching and replacing data:', error);
    return []; 
  }
}

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

  // Step 1: Populate projectMap with start and end dates for each project
  tasks.forEach(task => {
    if (task.type === 'task') {
      console.log("A");
      if (!projectMap[task.project]) {
        console.log("b");
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

  // Step 2: Update project tasks with project start and end dates
  tasks.forEach(task => {
    if (task.type === 'project' && projectMap[task.id]) {
      task.start = projectMap[task.id].start;
      task.end = projectMap[task.id].end;
    }
  });

  console.log("Tasks after updating project dates:", tasks);

  return tasks;
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
