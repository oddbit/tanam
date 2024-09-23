"use client";
import {Editor} from "@tiptap/react";
import "./styles/floating-menu.scss";

interface FloatingMenuProps {
  editor: Editor;
}

export default function FloatingMenu({editor}: FloatingMenuProps) {
  const baseStyleDropdownItem = "block w-full px-4 py-2 text-left text-sm text-gray-700";

  return editor ? (
    <div className="floating-menu relative hidden">
      <div
        className="absolute top-8 z-10 mt-2 w-56 origin-top rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex={-1}
      >
        <div className="py-1" role="none">
          <div className="mt-2">
            <div className="text-[.65rem] font-semibold mb-1 uppercase text-neutral-500 dark:text-neutral-400 px-1.5">
              Hierarchy
            </div>
          </div>
        </div>

        <div className="py-1" role="none">
          <button
            className={editor.isActive("paragraph") ? `${baseStyleDropdownItem} is-active` : baseStyleDropdownItem}
            onClick={() => {
              editor.commands.setParagraph();
            }}
          >
            Paragraph
          </button>

          <button
            className={
              editor.isActive("heading", {level: 1}) ? `${baseStyleDropdownItem} is-active` : baseStyleDropdownItem
            }
            onClick={() => {
              editor.chain().focus().toggleHeading({level: 1}).run();
            }}
          >
            Heading 1
          </button>

          <button
            className={
              editor.isActive("heading", {level: 2}) ? `${baseStyleDropdownItem} is-active` : baseStyleDropdownItem
            }
            onClick={() => {
              editor.chain().focus().toggleHeading({level: 2}).run();
            }}
          >
            Heading 2
          </button>

          <button
            className={
              editor.isActive("heading", {level: 3}) ? `${baseStyleDropdownItem} is-active` : baseStyleDropdownItem
            }
            onClick={() => {
              editor.chain().focus().toggleHeading({level: 3}).run();
            }}
          >
            Heading 3
          </button>
        </div>

        <div className="py-1" role="none">
          <div className="mt-2">
            <div className="text-[.65rem] font-semibold mb-1 uppercase text-neutral-500 dark:text-neutral-400 px-1.5">
              List
            </div>
          </div>
        </div>

        <div className="py-1" role="none">
          <button
            className={editor.isActive("bulletList") ? `${baseStyleDropdownItem} is-active` : baseStyleDropdownItem}
            onClick={() => {
              editor.chain().focus().toggleBulletList().run();
            }}
          >
            Bullet List
          </button>

          <button
            className={editor.isActive("orderedList") ? `${baseStyleDropdownItem} is-active` : baseStyleDropdownItem}
            onClick={() => {
              editor.chain().focus().toggleOrderedList().run();
            }}
          >
            Numbered List
          </button>
        </div>
      </div>
    </div>
  ) : null;
}
