import axios from 'axios';

  const JIRA_BASE_URL = 'https://hiteshwagh9383.atlassian.net';
  const JIRA_EMAIL ='hiteshwagh9383@gmail.com';
  const JIRA_API_TOKEN =  'ATATT3xFfGF0rQT7Momon4OpOiICs1Vc_y_QDDlv8F6FaEpFu4cIcKKaYSjiWiHS3acXsszwo2TKuRA07PfjalT9LmEM8R0pT8rx_vBy2DmA4BDXYm5UYKy-WoVB7LrPSxhJVSGzYyxbrLgGmZmTLX-xINLiH84Zi4syHkY4r1OtAugQDovOoG8=02ADA572';

  const jiraAxios = axios.create({
    baseURL: JIRA_BASE_URL,
    headers: {
      'Authorization': `Basic ${btoa(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`)}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });
  
  export const getJiraEpics = async (projectKey) => {
    try {
      const response = await jiraAxios.get(`/rest/api/3/search?jql=project=${projectKey} AND issuetype=Epic`);
      return response.data.issues;
    } catch (error) {
      console.error('Error fetching Jira epics:', error);
      throw error;
    }
  };