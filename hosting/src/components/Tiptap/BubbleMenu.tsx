import {Editor} from "@tiptap/react";
import styles from "./BubbleMenu.module.css";

interface BubbleMenuProps {
  editor: Editor;
}

export default function BubbleMenu({editor}: BubbleMenuProps) {
  return editor ? (
    <div className={styles.bubbleMenu}>
      <button onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
    </div>
  ) : (
    <></>
  );
}
