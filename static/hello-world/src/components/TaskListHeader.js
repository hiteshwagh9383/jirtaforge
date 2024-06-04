// TaskListHeader.js
import React from 'react';

const TaskListHeader = ({ headerHeight, dropdownView }) => {
  console.log('dropdownView',dropdownView);
  let headerText = "Epics";
  if (dropdownView === 'teamlead') {
    headerText = "Team Leads";
  } else if (dropdownView === 'projects') {
    headerText = "Clients";}
  // } else if (dropdownView === 'assignees') {
  //   headerText = "Assignees";
  // } else if (dropdownView === 'developer') {
  //   headerText = "Developers";
  // }
  return (
    <div
      style={{
        height: 50,
        fontFamily: "sans-serif",
        fontWeight: "bold",
        paddingLeft: 10,
        margin: 0,
        marginBottom: -1,
        display: "flex",
        alignItems: "center",
        border: "1px solid #dfe1e5"
      }}
    >
      {headerText}
    </div>
  );
};

export default TaskListHeader;
