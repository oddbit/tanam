import React from "react";
import {Editor} from "@tiptap/react";
import styles from "./FloatingMenu.module.css";

interface FloatingMenuProps {
  editor: Editor;
}

export default function FloatingMenu({editor}: FloatingMenuProps) {
  return editor ? (
    <div className={styles.floatingMenu}>
      <button onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()} className={styles.menuItem}>
        H1
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()} className={styles.menuItem}>
        H2
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({level: 3}).run()} className={styles.menuItem}>
        H3
      </button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={styles.menuItem}>
        Bullet List
      </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={styles.menuItem}>
        Ordered List
      </button>
      <button onClick={() => editor.chain().focus().setParagraph().run()} className={styles.menuItem}>
        Paragraph
      </button>
    </div>
  ) : (
    <> </>
  );
}
