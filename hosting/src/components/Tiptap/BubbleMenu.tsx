import { Editor, BubbleMenu as TiptapBubbleMenu } from "@tiptap/react";
// import styles from "./BubbleMenu.module.css";
import "./bubble-menu.scss";

interface BubbleMenuProps {
  editor: Editor;
}

export default function BubbleMenu({editor}: BubbleMenuProps) {
  return editor ? (
    <TiptapBubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
      <div className="bubble-menu">
        <button onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
      </div>
    </TiptapBubbleMenu>
  ) : (
    <></>
  );
}
