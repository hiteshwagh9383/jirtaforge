import React from "react";
import "gantt-task-react/dist/index.css";
import { ViewMode } from "gantt-task-react";
import "./ViewSwitcher.css";

export const ViewSwitcher = ({
  onViewModeChange,
  onViewListChange,
  isChecked,
  onExpandAll,
  onCollapseAll,
  showOnlyTasks,
  onShowOnlyTasksChange,
  searchTerm,
  onSearchChange,
  dropdownView,
  onDropdownChange
}) => {
  return (
    <div className="ViewContainer">
      <select value={dropdownView} onChange={onDropdownChange}>
        <option value="projects">Projects</option>
        <option value="assignees">Assignees</option>
        <option value="developer">Developer</option>
        <option value="teamlead">Teamlead</option>
      </select>
      <button
        className="Button"
        onClick={() => onViewModeChange(ViewMode.Year)}
      >
        Year
      </button>
      <button
        className="Button"
        onClick={() => onViewModeChange(ViewMode.Month)}
      >
        Month
      </button>
      <button
        className="Button"
        onClick={() => onViewModeChange(ViewMode.Week)}
      >
        Week
      </button>
      <button
        className="Button"
        onClick={() => onViewModeChange(ViewMode.Day)}
      >
        Day
      </button>
      <button
        className="Button"
        onClick={onCollapseAll}
        disabled={showOnlyTasks}
      >
        Collapse All
      </button>
      <button
        className="Button"
        onClick={onExpandAll}
        disabled={showOnlyTasks}
      >
        Expand All
      </button>
      <div className="Switch">
        <label className="Switch_Toggle">
          <input
            type="checkbox"
            defaultChecked={isChecked}
            onClick={() => onViewListChange(!isChecked)}
          />
          <span className="Slider" />
        </label>
        Show Epic List
      </div>

      <div className="Switch">
        <label className="Switch_Toggle">
          <input
            type="checkbox"
            checked={showOnlyTasks}
            onChange={onShowOnlyTasksChange}
          />
          <span className="Slider" />
        </label>
        Show Only Epics
      </div>
    
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={onSearchChange}
        className="SearchInput"
      />
    </div>
  );
};
