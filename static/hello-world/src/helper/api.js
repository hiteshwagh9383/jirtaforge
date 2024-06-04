// api.js

import { requestJira } from '@forge/bridge';

export const fetchAllProjectsWithEpics = async () => {
  try {

    const response = await requestJira('/rest/api/3/project');
    const projects = await response.json();
    console.log("Projects:", projects);
    const projectsWithEpics = await Promise.all(
      projects.map(async (project) => {
        try {
        //  const epicsResponse = await requestJira(`/rest/api/3/search?jql=issuetype = Epic AND project = ${project.key}`);
        const epicsResponse = await requestJira(`/rest/api/3/search?jql=project = ${project.key} AND projectType= software AND issuetype= Epic AND statusCategory in ("In Progress")`);

        //  projectType= software AND issuetype= Epic AND statusCategory in ("In Progress") AND fixVersion is not EMPTY
          const epics = await epicsResponse.json();
          console.log(`Epics for project ${project.key}:`, epics);

          if (epics && epics.issues) {
               const epicDetails = epics.issues.map(epic => {
              const startDate = epic.fields.customfield_10015? new Date(epic.fields.customfield_10015): 'N/A';
              const endDate = epic.fields.duedate ? new Date(epic.fields.duedate): 'N/A';
              const assignee = epic.fields.assignee ? epic.fields.assignee.displayName : 'Unassigned';
              const developer=epic.fields.customfield_10034 ? epic.fields.customfield_10034.displayName : 'Unassigned';
              const teamLead=assignee; // fetch later for leamlead, now we are using assigne for it 
              return {
                key: epic.key,
                name: epic.fields.summary,
                startDate: startDate,
                endDate: endDate,
                assignee: assignee,
                teamLead:teamLead,
                developer:developer
              };
            });
            console.log("Epic Details:", epicDetails);
            return {
              projectName: project.name,
              projectKey: project.key,
              epicDetails: epicDetails
            };
          } else {
            console.warn(`No epics found for project '${project.name}'`);
            return {
              projectName: project.name,
              projectKey: project.key,
              epicDetails: []
            };
          }
        } catch (epicsError) {
          console.error(`Error fetching epics for project '${project.name}':`, epicsError);
          return {
            projectName: project.name,
            projectKey: project.key,
            epicDetails: []
          };
        }
      })
    );

    return projectsWithEpics;
  } catch (error) {
    console.error('Error fetching project names with epics:', error);
    return [];
  }
};


