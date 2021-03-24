import Task from "./task";
import { Droppable, Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const Container = styled.div``;

const Column = ({ column, tasks, index, setData }) => {
  console.log(tasks);
  //   console.log(column);
  const handleAddTaskToCurrentColumn = () => {};
  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <Container
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="border border-solid border-gray-300 flex flex-col min-w-card m-3 h-auto"
          style={{ backgroundColor: "#2F3437", ...provided.draggableProps.style }}
        >
          <h3 {...provided.dragHandleProps} className="text-bold text-xl p-4">
            {column.title}
          </h3>
          <Droppable droppableId={column.id.toString()} type="task">
            {(provided) => (
              <section
                className="tasks p-4 flex-grow rouned-lg"
                ref={provided.innerRef}
                style={{ minHeight: 100 }}
              >
                {tasks.map((task, i) => (
                  <Task key={task.id} task={task} index={i} />
                ))}
                {provided.placeholder}
                <button
                  className="rounded-md border-black border-solid text-gray-300 hover:bg-gray-300 hover:text-gray-700 p-1 w-full text-left"
                  onClick={handleAddTaskToCurrentColumn}
                >
                  + new
                </button>
              </section>
            )}
          </Droppable>
        </Container>
      )}
    </Draggable>
  );
};

export default Column;
