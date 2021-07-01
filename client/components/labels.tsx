import axios from "axios";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { GrFormClose } from "react-icons/gr";
import { useSelector } from "react-redux";
import { configWithToken } from "../functions";
import { RootState } from "../redux/store";
import { Tags, Task } from "../types/projectTypes";
import Modal from "./modal";

type LabelsProps = {
  task: Task;
  projectId: string;
  setTask: (x: Task) => void;
};

const Labels = ({ task, projectId, setTask }: LabelsProps) => {
  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { userInfo } = userLogin;
  const projectColumns = useSelector(
    (state: RootState) => state.projectColumns
  );
  const { boardColumns } = projectColumns;
  const [openModal, setOpenModal] = useState(false);
  const [labelName, setLabelName] = useState("");
  const [labelColor, setLabelColor] = useState("");
  const [labels, setLabels] = useState<Tags[]>([]);

  //   console.log("labelColor", labelColor);
  //   console.log("labelName", labelName);
  //   console.log("task", task);
  //   console.log("boardColumns", boardColumns);
  //   console.log("labels", labels);

  useEffect(() => {
    if (!task) return;
    // if(boardColumns.columns.tags)
    setLabels(task.tags);
  }, []);

  const handleAddLabelToTask = async () => {
    if (!task || !boardColumns || labelName === "" || labelColor === "") return;
    // console.log("adding tags");
    const taskTags = task.tags;
    taskTags.push({ labelName, labelColor });
    // console.log("columns", boardColumns);
    if (!userInfo?.token) return;
    const config = configWithToken(userInfo.token);
    await axios.put(
      `/api/projects/add-column/${projectId}`,
      { columns: boardColumns },
      config
    );
    setLabels(taskTags);
    setLabelColor("");
    setLabelName("");
  };
  //   console.log("boardColumns", boardColumns);

  useEffect(() => {
    if (!boardColumns) return;
    if (!projectId) return;

    const columns = boardColumns;
    console.log(columns);
    if (!userInfo?.token) return;
    const config = configWithToken(userInfo.token);
    axios.put(`/api/projects/add-column/${projectId}`, { columns }, config);
  }, [labels, task]);
  console.log(task);
  console.log(setLabels);

  const handleRemoveTask = (label: Tags) => {
    console.log("label", label);
    const labelsCopy = labels;
    const labelsIndex = labels.indexOf(label);
    console.log(labelsIndex);
    if (labelsIndex > -1) {
      labelsCopy.splice(labelsIndex, 1);
      console.log(labelsCopy);
      setTask({ ...task, tags: [...labels] });
      setLabels(labelsCopy);
      //   console.log("tasks", task);
    }
  };
  return (
    <Modal
      modalName="Labels"
      openModal={openModal}
      setOpenModal={setOpenModal}
      contentHeight="auto"
    >
      <>
        <div className="flex flex-col">
          <p>Type a name a select a color: </p>
          <div className="flex items-center">
            <input
              type="text"
              onChange={(e) => setLabelName(e.target.value)}
              value={labelName}
              className="flex-grow bg-gray-200 rounded-sm px-3 py-1 text-black my-3 mr-3"
            />
            <FaPlus
              className={`bg-gray-300 p-1 ${
                labelName === "" || !labelColor
                  ? "disabled:opacity-50"
                  : "bg-blue-500"
              } cursor-pointer rounded-md`}
              size={30}
              onClick={handleAddLabelToTask}
            />
          </div>
          <input
            type="color"
            onChange={(e) => setLabelColor(e.target.value)}
            value={labelColor}
          />
        </div>
        {labels && labels.length > 0 && (
          <div className="flex flex-wrap justify-start w-auto h-auto">
            {labels.map((l, i) => (
              <div
                className="rounded-sm mr-2 my-2 text-sm"
                style={{ background: l.labelColor, padding: "1px 10px" }}
                key={i}
              >
                <div className="flex items-center">
                  <span className="mr-2">{l.labelName}</span>
                  <button onClick={() => handleRemoveTask(l)}>
                    <GrFormClose />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    </Modal>
  );
};

export default Labels;
