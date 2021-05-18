import { useEffect, useState } from "react";

const MENU_HEIGHT = 150;
const allowedTags = [
  {
    id: "page-title",
    tag: "h1",
    label: "Page Title",
  },
  {
    id: "heading",
    tag: "h2",
    label: "Heading",
  },
  {
    id: "subheading",
    tag: "h3",
    label: "Subheading",
  },
  {
    id: "paragraph",
    tag: "p",
    label: "Paragraph",
  },
  {
    id: "list-item",
    tag: "li",
    label: "List-Item",
  },
];
const SelectMenu = ({ onSelect, close, position }) => {
  const [command, setCommand] = useState("");
  const [items, setItems] = useState(allowedTags);
  const [selectedItem, setSelectedItem] = useState(0);

  const handleKeydown = (e) => {
    console.log(e.key);
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        onSelect(items[selectedItem].tag);
        break;
      case "Backspace":
        if (!command) {
          close();
        }
        setCommand(command.substring(0, command.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        const prevSelected = selectedItem === 0 ? items.length - 1 : selectedItem - 1;
        setSelectedItem(prevSelected);
        break;
      case "ArrowDown":
      case "Tab":
        e.preventDefault();
        const nextSelected = selectedItem === items.length - 1 ? 0 : selectedItem + 1;
        setSelectedItem(nextSelected);
        break;
      default:
        setCommand(command + e.key);
        break;
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  });

  const x = position.x;
  const y = position.y - MENU_HEIGHT;
  const positionAttributes = { top: y, left: x };
  return (
    <div
      className="SelectMenu p-3 w-36 h-auto flex flex-col justify-end z-50 rounded-md absolute top-12 left-12"
      style={positionAttributes}
      style={{ backgroundColor: "#3f4447" }}
    >
      <div>
        {items.map((item, i) => {
          const isSelected = items.indexOf(item) === selectedItem;
          return (
            <div
              key={i}
              className={`text-white ${isSelected ? "Items  p-1 my-0.5 " : null}`}
              role="button"
              tabIndex="0"
              onClick={() => onSelect(item.tag)}
              style={positionAttributes}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectMenu;
