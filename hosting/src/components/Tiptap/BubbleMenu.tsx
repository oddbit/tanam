import { Editor, BubbleMenu as TiptapBubbleMenu } from "@tiptap/react";
// import styles from "./BubbleMenu.module.css";
import { FloatingDropdown } from '@/components/FloatingDropdown';
import { useRef } from 'react';
import { Instance as TippyInstance, Props as TippyProps } from "tippy.js";
import "./styles/bubble-menu.scss";

// Extend the HTMLButtonElement interface to include _tippy
declare global {
  interface HTMLButtonElement {
    _tippy?: TippyInstance<TippyProps>;
  }
}

interface BubbleMenuProps {
  editor: Editor;
}

export default function BubbleMenu({editor}: BubbleMenuProps) {
  const baseStyleButton = 'flex group items-center justify-center text-sm font-semibold rounded-md whitespace-nowrap h-8 gap-1 min-w-[2rem] px-2 w-auto'

  const formatButtonRef = useRef<HTMLButtonElement>(null);
  const alignButtonRef = useRef<HTMLButtonElement>(null);

  const handleButtonClick = (buttonRef: React.RefObject<HTMLButtonElement>) => {
    console.info('here handleButtonClick :: ', buttonRef)
    
    if (formatButtonRef.current?._tippy && alignButtonRef.current?._tippy) {
      if (buttonRef === formatButtonRef) {
        alignButtonRef.current._tippy.hide();
      } else if (buttonRef === alignButtonRef) {
        formatButtonRef.current._tippy.hide();
      }

      buttonRef.current?._tippy?.show();
    }
  };

  return editor ? (
    <TiptapBubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
      <div className="bubble-menu inline-flex h-full leading-none gap-0.5 flex-row p-1 items-center bg-white rounded-lg dark:bg-black shadow-sm border border-neutral-200 dark:border-neutral-800">
        <button
          ref={formatButtonRef}
          onClick={() => handleButtonClick(formatButtonRef)}
          className={baseStyleButton}
        >
          Format
        </button>

        <FloatingDropdown 
          buttonRef={formatButtonRef}
          content={(
            <div className="bg-white p-2 rounded shadow-md space-y-1">
              <button
                className="text-gray-700 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                onClick={() => {
                  editor.chain().focus().toggleBold().run();
                  formatButtonRef.current?._tippy?.hide();
                }}
              >
                Bold
              </button>
              <button
                className="text-gray-700 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                onClick={() => {
                  editor.chain().focus().toggleItalic().run();
                  formatButtonRef.current?._tippy?.hide();
                }}
              >
                Italic
              </button>
              <button
                className="text-gray-700 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                onClick={() => {
                  editor.chain().focus().toggleUnderline().run();
                  formatButtonRef.current?._tippy?.hide();
                }}
              >
                Underline
              </button>
            </div>
          )}
        />

        <span className="separator" />
        
        <button className={editor.isActive('bold') ? `${baseStyleButton} is-active` : baseStyleButton} onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
        <button className={editor.isActive('italic') ? `${baseStyleButton} is-active` : baseStyleButton} onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
        <button className={editor.isActive('underline') ? `${baseStyleButton} is-active` : baseStyleButton} onClick={() => editor.chain().focus().toggleUnderline().run()}>Underline</button>
        <button className={editor.isActive('strike') ? `${baseStyleButton} is-active` : baseStyleButton} onClick={() => editor.chain().focus().toggleStrike().run()}>Strike</button>
        <button className={editor.isActive('codeBlock') ? `${baseStyleButton} is-active` : baseStyleButton} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>Code Block</button>
      </div>
    </TiptapBubbleMenu>
  ) : (
    <></>
  );
}
