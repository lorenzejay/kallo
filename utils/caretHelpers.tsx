export const setCaretToEnd = (element: any) => {
  // Create a new range
  const range = document.createRange();
  // Get the selection object
  const selection = window.getSelection();
  if (!selection) return;
  // Select all the content from the contenteditable element
  range.selectNodeContents(element);
  // Collapse it to the end, i.e. putting the cursor to the end
  range.collapse(false);
  // Clear all existing selections
  selection.removeAllRanges();
  // Put the new range in place
  selection.addRange(range);
  // Set the focus to the contenteditable element
  element.focus();
};

export const getCaretCoordinates = () => {
  let x, y;
  const selection = window.getSelection();
  if (!selection) return;
  if (selection.rangeCount !== 0) {
    const range = selection.getRangeAt(0).cloneRange();
    range.collapse(false);
    const rect = range.getClientRects()[0];
    if (rect) {
      x = rect.left;
      y = rect.top;
    }
  }
  return { x, y };
};
