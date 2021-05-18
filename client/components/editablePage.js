import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import { configWithToken } from "../functions";
import { setCaretToEnd } from "../utils/caretHelpers";
import EditableBlock from "./editableBlock";
const initialBlock = { id: uuid(), html: "", tag: "p" };

const EditablePage = ({ task, setTask, boardColumns, projectId }) => {
  //   console.log("taskMarkdown", task.markdown);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [blocks, setBlocks] = useState();
  const [currentBlockId, setCurrentBlockId] = useState(null);
  const ref = useRef();
  const [previousBlock, setPreviousBlock] = useState();

  //   useEffect(() => {
  //     if (!projectId) return;
  //     dispatch(getBoardColumns(projectId));
  //   }, [projectId]);

  //   console.log(task);
  useEffect(() => {
    if (task && task.markdown) {
      setBlocks(task.markdown);
    } else {
      setBlocks([initialBlock]);
    }
  }, []);
  //   console.log(blocks);
  //   console.log("task", task);

  const updateBlockHandler = (currentBlock) => {
    const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
    // const oldBlock = blocks[index];
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: currentBlock.tag,
      html: currentBlock.html,
      //   imageUrl: currentBlock.imageUrl,
    };
    setBlocks(updatedBlocks);
    // // If the image has been changed, we have to delete the
    // // old image file on the server
    // if (oldBlock.imageUrl && oldBlock.imageUrl !== currentBlock.imageUrl) {
    //   deleteImageOnServer(oldBlock.imageUrl);
    // }
  };

  useEffect(() => {
    ref.current = blocks;
    setPreviousBlock(ref.current);
  });
  //   console.log("blocks", blocks);
  //   console.log("currentBlockId", currentBlockId);
  //   console.log("previousBlock", previousBlock);

  useEffect(() => {
    // If a new block was added, move the caret to it
    if (previousBlock && previousBlock.length + 1 === blocks.length) {
      const nextBlockPosition = blocks.map((b) => b._id).indexOf(currentBlockId) + 1 + 1;
      //   console.log(nextBlockPosition);
      const nextBlock = document.querySelector(`[data-position="${nextBlockPosition}"]`);
      //   console.log("nextBlock", nextBlock);
      if (nextBlock) {
        nextBlock.focus();
      }
    }
    // If a block was deleted, move the caret to the end of the last block
    if (previousBlock && previousBlock.length - 1 === blocks.length) {
      const lastBlockPosition = previousBlock.map((b) => b._id).indexOf(currentBlockId);
      //   console.log(lastBlockPosition);
      const lastBlock = document.querySelector(`[data-position="${lastBlockPosition}"]`);
      if (lastBlock) {
        setCaretToEnd(lastBlock);
      }
    }
  }, [blocks, previousBlock, currentBlockId]);

  const addBlockHandler = (currentBlock) => {
    // console.log("addblock", currentBlock);
    setCurrentBlockId(currentBlock.id);
    const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
    // console.log(blocks);
    const updatedBlocks = [...blocks];
    const newBlock = { _id: uuid(), tag: "p", html: "" };
    updatedBlocks.splice(index + 1, 0, newBlock);
    // console.log(updatedBlocks);
    setBlocks(updatedBlocks);
  };

  const deleteBlockHandler = (currentBlock) => {
    if (blocks.length > 1) {
      //   console.log(currentBlock.id);
      setCurrentBlockId(currentBlock.id);
      //   setCurrentBlockId(currentBlock.id);
      const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
      //   const deletedBlock = blocks[index];
      const updatedBlocks = [...blocks];
      updatedBlocks.splice(index, 1);
      setBlocks(updatedBlocks);
    }
  };
  // useEffect(() => {
  //   if (!blocks || blocks === []) return;
  //   console.log("udpating the db...");
  //   // console.log(blocks);
  //   task.markdown = blocks;
  //   // setTask((prevState) => {
  //   //   return { ...prevState, markdown: blocks };
  //   // });

  //   //update the markdown on the server
  //   const config = configWithToken(userInfo.token);
  //   axios.put(`/api/projects/add-column/${projectId}`, { boardColumns }, config);
  // }, [blocks]);
  // console.log(blocks);
  const persistUpdatesMadeToPage = async (columns) => {
    try {
      if (!projectId || !boardColumns) return;

      const config = configWithToken(userInfo.token);
      await axios.put(`/api/projects/add-column/${projectId}`, { columns }, config);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (blocks && blocks.length !== 0) {
      task.markdown = blocks;
    }
    // console.log("task", task);
    console.log("boardColumns", boardColumns);
    persistUpdatesMadeToPage(boardColumns);
  }, [blocks]);

  return (
    <div>
      {blocks &&
        blocks.map((block, i) => {
          // console.log(block);
          const position = blocks.map((b) => b._id).indexOf(block._id) + 1;
          // console.log(position);
          return (
            <EditableBlock
              key={i}
              id={block._id}
              tag={block.tag}
              position={position}
              html={block.html}
              updatePage={updateBlockHandler}
              addBlock={addBlockHandler}
              deleteBlock={deleteBlockHandler}
              updateBlock={updateBlockHandler}
              task={task}
            />
          );
        })}
    </div>
  );
};

export default EditablePage;
