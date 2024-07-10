import { Editor, BubbleMenu as TiptapBubbleMenu } from "@tiptap/react";
// import styles from "./BubbleMenu.module.css";
import "./styles/bubble-menu.scss";

interface BubbleMenuProps {
  editor: Editor;
}

export default function BubbleMenu({editor}: BubbleMenuProps) {
  const baseStyleButton = 'flex group items-center justify-center text-sm font-semibold rounded-md whitespace-nowrap h-8 gap-1 min-w-[2rem] px-2 w-auto'

  return editor ? (
    <TiptapBubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
      <div className="bubble-menu inline-flex h-full leading-none gap-0.5 flex-row p-1 items-center bg-white rounded-lg dark:bg-black shadow-sm border border-neutral-200 dark:border-neutral-800">
        <button className={editor.isActive('bold') ? `${baseStyleButton} is-active` : baseStyleButton} onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
        <button className={editor.isActive('italic') ? `${baseStyleButton} is-active` : baseStyleButton} onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
        <button className={editor.isActive('underline') ? `${baseStyleButton} is-active` : baseStyleButton} onClick={() => editor.chain().focus().toggleUnderline().run()}>Underline</button>
        <button className={editor.isActive('strike') ? `${baseStyleButton} is-active` : baseStyleButton} onClick={() => editor.chain().focus().toggleStrike().run()}>Strike</button>
      </div>
    </TiptapBubbleMenu>
  ) : (
    <></>
  );
}
