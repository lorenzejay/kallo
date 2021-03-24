import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Column from "../components/column";
import { initalData2, dummyColumns } from "../dummyData/initialData";
import { resetServerContext } from "react-beautiful-dnd";
import Layout from "../components/layout";
const KanbanBoard = () => {
  const [winReady, setWinReady] = useState(false);

  //to make sure it wokrs
  useEffect(() => {
    setWinReady(true);
    resetServerContext();
  }, []);
  // resetServerContext();

  const [data, setData] = useState(initalData2);
  console.log(data);
  const [dummyData, setDummyData] = useState(dummyColumns);
  console.log(dummyData);
  const handleOnDragEnd = (result) => {
    console.log(result);
    const { destination, source, draggableId, type } = result;
    if (!destination) {
      return;
    }
    //checks if the item got dtagged to a new location by checking the source index and the desination id
    if (destination.droppableId === source.index && destination.index === source.index) {
      return;
    }
    console.log(result);

    //check if we are reording columns by its type
    if (type === "column") {
      const newColumnOrder = Array.from(data.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      return setData({
        ...data,
        columnOrder: newColumnOrder,
      });
    }

    //if we want to move between different columns
    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];
    console.log("start", start);
    // if we are moving from the same column
    if (start === finish) {
      const newTaskIds = start.taskIds;

      // return console.log("destination", source);
      const moved = newTaskIds.splice(source.index, 1); //from this index we want to remove this one item
      console.log("moved", moved);
      console.log("newTasksIds", newTaskIds);

      newTaskIds.splice(destination.index, 0, moved[0]); //start from destination index, remove nothing, insert dragable id
      console.log(newTaskIds);
      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };
      // console.log(newColumn);

      return setData({
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      });
    }

    //if we are moving from one column to the other column
    const startTaskIds = [...start.taskIds];
    const fromPrevCol = startTaskIds.splice(source.index, 1);

    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };
    const finishTaskIds = [...finish.taskIds];
    finishTaskIds.splice(destination.index, 0, fromPrevCol[0]);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    return setData({
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    });
  };
  // console.log(data);
  return (
    <Layout>
      <main className="text-white w-auto px-3">
        <h2>Kaban Board</h2>
        <div>this is where your board / columns go</div>

        {winReady && (
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId={"all-columns"} direction="horizontal" type="column">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex overflow-x-auto h-auto mb-10"
                >
                  {data.columnOrder.map((columnId, i) => {
                    const column = data.columns[columnId];
                    // const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

                    const tasks = column.taskIds.map((task) => task);

                    // return console.log(tasks);

                    return (
                      <Column
                        setData={setData}
                        data={data}
                        key={column.id}
                        column={column}
                        index={i}
                        tasks={tasks}
                      />
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </main>
    </Layout>
  );
};

export default KanbanBoard;
