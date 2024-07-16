import { Editor, BubbleMenu as TiptapBubbleMenu } from "@tiptap/react";
// import styles from "./BubbleMenu.module.css";
import { useState } from 'react';
import "./styles/bubble-menu.scss";

interface BubbleMenuProps {
  editor: Editor;
}

export default function BubbleMenu({editor}: BubbleMenuProps) {
  const baseStyleButton = "flex group items-center justify-center text-sm font-semibold rounded-md whitespace-nowrap h-8 gap-1 min-w-[2rem] px-2 w-auto"
  const baseStyleDropdownItem = "block w-full px-4 py-2 text-left text-sm text-gray-700"

  const [dropdownFormat, setDropdownFormat] = useState(false);

  const toggleDropdownFormat = () => {
    setDropdownFormat(!dropdownFormat);
  }

  return editor ? (
    <TiptapBubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
      <div className="bubble-menu relative inline-flex h-full leading-none gap-0.5 flex-row p-1 items-center bg-white rounded-lg dark:bg-black shadow-sm border border-neutral-200 dark:border-neutral-800">
        <button type="button" className={baseStyleButton} id="menu-button" aria-expanded="true" aria-haspopup="true" onClick={toggleDropdownFormat}>
          Paragraph
          <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
          </svg>
        </button>

        <span className="separator" />
        
        <button className={editor.isActive('bold') ? `${baseStyleButton} is-active` : baseStyleButton} onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
        <button className={editor.isActive('italic') ? `${baseStyleButton} is-active` : baseStyleButton} onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
        <button className={editor.isActive('underline') ? `${baseStyleButton} is-active` : baseStyleButton} onClick={() => editor.chain().focus().toggleUnderline().run()}>Underline</button>
        <button className={editor.isActive('strike') ? `${baseStyleButton} is-active` : baseStyleButton} onClick={() => editor.chain().focus().toggleStrike().run()}>Strike</button>
        <button className={editor.isActive('codeBlock') ? `${baseStyleButton} is-active` : baseStyleButton} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>Code Block</button>

        {dropdownFormat && (
          <div className="absolute top-8 z-10 mt-2 w-56 origin-top rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
            <div className="py-1" role="none">
              <div className="mt-2">
                <div className="text-[.65rem] font-semibold mb-1 uppercase text-neutral-500 dark:text-neutral-400 px-1.5">
                  Hierarchy
                </div>
              </div>
            </div>

            <div className="py-1" role="none">
              <button className={editor.isActive('bold') ? `${baseStyleDropdownItem} is-active` : baseStyleDropdownItem} onClick={() => {
                editor.chain().focus().toggleBold().run()
                toggleDropdownFormat()
              }}>Bold</button>
              <button className={editor.isActive('italic') ? `${baseStyleDropdownItem} is-active` : baseStyleDropdownItem} onClick={() => {
                editor.chain().focus().toggleItalic().run()
                toggleDropdownFormat()
              }}>Italic</button>
              <button className={editor.isActive('underline') ? `${baseStyleDropdownItem} is-active` : baseStyleDropdownItem} onClick={() => {
                editor.chain().focus().toggleUnderline().run()
                toggleDropdownFormat()
              }}>Underline</button>
            </div>
          </div>
        )}
      </div>
    </TiptapBubbleMenu>
  ) : (
    <></>
  );
}
