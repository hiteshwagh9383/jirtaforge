// TooltipContent.js
import React from 'react';
import './TooltipContent.css';
const TooltipContent = ({ task }) => {

  if (task.type === 'project') {
    return null;
  }
  
  return (
    <div  className="tooltip-content"> 
      <p><strong>Name:</strong> {task.name}</p>
      <p><strong>Lead Name:</strong> {task.teamLead}</p>
      <p><strong>Devloper Name:</strong> {task.developer}</p>
      <p><strong>Tester Name:</strong> {task.tester}</p>
      <p><strong>Start:</strong> {task.start.toLocaleDateString()}</p>
      <p><strong>End:</strong> {task.end.toLocaleDateString()}</p>
    </div>
  );
};

export default TooltipContent;
