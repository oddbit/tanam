"use client";
import BubbleMenu from "@/components/Tiptap/BubbleMenu";
import CodeBlock from "@/components/Tiptap/CodeBlock";
import FloatingMenu from "@/components/Tiptap/FloatingMenu";
import Loader from "@/components/common/Loader";
// import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
// import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
// import Italic from "@tiptap/extension-italic";
// import ListItem from "@tiptap/extension-list-item";
// import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
// import Text from "@tiptap/extension-text";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Underline from "@tiptap/extension-underline";
import { EditorContent, ReactNodeViewRenderer as reactNodeViewRenderer, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import { common, createLowlight } from "lowlight";
import { Suspense, useCallback, useEffect } from "react";

import "./styles/tiptap-main.scss";

const DEFAULT_DEBOUNCE = 2000;
const lowlight = createLowlight(common);

interface TiptapEditorProps {
  key: string;
  disabled?: boolean;
  value?: string;
  debounce?: number;
  onChange?: (content: string) => Promise<void>;
}

type DebounceFunction = (...args: any[]) => void;

/**
 * Implements a debounce function.
 *
 * @param {DebounceFunction} func The function to debounce.
 * @param {number} wait The time to wait before executing the function.
 * @return {void}
 */
function debounce<T extends DebounceFunction>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);

export default function TiptapEditor(props: TiptapEditorProps) {
  const debouncedOnChange = useCallback(
    debounce(async (content: string) => {
      if (!props.onChange) {
        return;
      }
      await props.onChange(content);
    }, props.debounce ?? DEFAULT_DEBOUNCE),
    [props.onChange],
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      CodeBlockLowlight.extend({
        addNodeView() {
          return reactNodeViewRenderer(CodeBlock);
        },
      }).configure({lowlight}),
      Paragraph,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      BulletList,
      // Document,
      // Paragraph,
      // Text,
      // Heading.configure({levels: [1, 2, 3]}),
      // Bold,
      // Italic,
      // BulletList,
      // OrderedList,
      // ListItem,
    ],
    editable: !props.disabled,
    content: props.value,
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
      },
    },
    onUpdate: ({editor}) => {
      debouncedOnChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (props.value) {
      editor?.commands.setContent(props.value);
    }
  }, [props.value, editor]);

  return (
    <Suspense fallback={<Loader />}>
      {editor && (
        <>
          <FloatingMenu editor={editor} />
          <BubbleMenu editor={editor} />
        </>
      )}
      <EditorContent editor={editor} />
    </Suspense>
  );
}
