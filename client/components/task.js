import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const Container = styled.div`
  opacity: ${(props) => (props.isDragging ? ".5" : 1)};
`;

const Task = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {/* snapshot used for styling while soemthing is dragging */}
      {(provided, snapshot) => (
        <Container
          className={`border card-color rounded-md border-black border-solid p-4 mb-4 w-64 border-rounded z-310`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          {task.content}
        </Container>
      )}
    </Draggable>
  );
};

export default Task;
