import { Editor, BubbleMenu as TiptapBubbleMenu } from "@tiptap/react";
import { useCallback, useState } from "react";
import "./styles/bubble-menu.scss";

interface BubbleMenuProps {
  editor: Editor;
}

export default function BubbleMenu({editor}: BubbleMenuProps) {
  const baseStyleButton = `
    flex group items-center justify-center border text-sm font-semibold rounded-md disabled:opacity-50 whitespace-nowrap bg-transparent border-transparent text-neutral-500 dark:text-neutral-400 hover:bg-black/5 hover:text-neutral-700 active:bg-black/10 active:text-neutral-800 dark:hover:bg-white/10 dark:hover:text-neutral-300 dark:active:text-neutral-200 h-8 gap-1 min-w-[2rem] px-2 w-auto
  `;
  const baseStyleDropdownItem = "block w-full px-4 py-2 text-left text-sm text-gray-700";

  const [dropdownFormat, setDropdownFormat] = useState(false);

  const toggleDropdownFormat = () => {
    setDropdownFormat(!dropdownFormat);
  };

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink()
        .run()

      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url })
      .run()
  }, [editor])

  return editor ? (
    <TiptapBubbleMenu editor={editor} tippyOptions={{duration: 100}}>
      <div className="bubble-menu relative text-black inline-flex h-full leading-none gap-0.5 flex-row p-1 items-center bg-white rounded-lg dark:bg-black shadow-sm border border-neutral-200 dark:border-neutral-800">
        <div className="text-black inline-flex h-full leading-none gap-0.5 flex-row p-1 items-center bg-white rounded-lg dark:bg-black shadow-sm border border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            className={baseStyleButton}
            id="menu-button"
            aria-expanded="true"
            aria-haspopup="true"
            onClick={toggleDropdownFormat}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" className="w-4 h-4"><path d="M13 4v16"></path><path d="M17 4v16"></path><path d="M19 4H9.5a4.5 4.5 0 0 0 0 9H13"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" className="w-2 h-2"><path d="m6 9 6 6 6-6"></path></svg>
          </button>

          <div className="bg-neutral-200 dark:bg-neutral-800 h-full min-h-[1.5rem] w-[1px] mx-1 first:ml-0 last:mr-0"></div>

          <span>
            <button
              className={editor.isActive("bold") ? `${baseStyleButton} is-active` : baseStyleButton}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" className="w-4 h-4"><path d="M14 12a4 4 0 0 0 0-8H6v8"></path><path d="M15 20a4 4 0 0 0 0-8H6v8Z"></path></svg>
            </button>
          </span>

          <span>
            <button
              className={editor.isActive("italic") ? `${baseStyleButton} is-active` : baseStyleButton}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" className="w-4 h-4"><line x1="19" x2="10" y1="4" y2="4"></line><line x1="14" x2="5" y1="20" y2="20"></line><line x1="15" x2="9" y1="4" y2="20"></line></svg>
            </button>
          </span>

          <span>
            <button
              className={editor.isActive("underline") ? `${baseStyleButton} is-active` : baseStyleButton}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" className="w-4 h-4"><path d="M6 4v6a6 6 0 0 0 12 0V4"></path><line x1="4" x2="20" y1="20" y2="20"></line></svg>
            </button>
          </span>

          <span>
            <button
              className={editor.isActive("strike") ? `${baseStyleButton} is-active` : baseStyleButton}
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" className="w-4 h-4"><path d="M16 4H9a3 3 0 0 0-2.83 4"></path><path d="M14 12a4 4 0 0 1 0 8H6"></path><line x1="4" x2="20" y1="12" y2="12"></line></svg>
            </button>
          </span>
          
          <span>
            <button
              className={editor.isActive("codeBlock") ? `${baseStyleButton} is-active` : baseStyleButton}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" className="w-4 h-4"><path d="m18 16 4-4-4-4"></path><path d="m6 8-4 4 4 4"></path><path d="m14.5 4-5 16"></path></svg>
            </button>
          </span>
          <span>
            <button
              className={editor.isActive("link") ? `${baseStyleButton} is-active` : baseStyleButton}
              onClick={setLink}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" className="w-4 h-4"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
            </button>
          </span>
        </div>

        {dropdownFormat && (
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
                  toggleDropdownFormat();
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
                  toggleDropdownFormat();
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
                  toggleDropdownFormat();
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
                  toggleDropdownFormat();
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
                  toggleDropdownFormat();
                }}
              >
                Bullet List
              </button>

              <button
                className={
                  editor.isActive("orderedList") ? `${baseStyleDropdownItem} is-active` : baseStyleDropdownItem
                }
                onClick={() => {
                  editor.chain().focus().toggleOrderedList().run();
                  toggleDropdownFormat();
                }}
              >
                Numbered List
              </button>
            </div>
          </div>
        )}
      </div>
    </TiptapBubbleMenu>
  ) : (
    <></>
  );
}
