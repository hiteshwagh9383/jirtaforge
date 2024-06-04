import React from "react";

const TaskListTable = ({
  tasks,
  rowWidth,
  rowHeight,
  onExpanderClick,
  handleAddTask,
}) => {
  return (
    <div style={{ border: "1px solid #dfe1e5" }}>
      {tasks.map((item, i) => {
        const isProject = item.type === "project";
        return (
          <div
            key={item.id}
            style={{
              height:30,
              width: rowWidth,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: isProject ? "pointer" : "auto",
              fontFamily: "sans-serif",
              background: i % 2 === 0 ? "#ffffff" : "#f4f5f7",
              padding: 10,
              paddingLeft: isProject ? 10 : 40,
            }}
          >
            <p
              onClick={() => onExpanderClick(item)}
              style={{
                display: "flex",
                alignItems: "center",
                margin: 0,
              }}
            >
              {isProject ? "> " : ""}
              {item.name}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default TaskListTable;
