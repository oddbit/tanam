"use client";
import Loader from "@/components/common/Loader";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Italic from "@tiptap/extension-italic";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {Suspense, useCallback, useEffect} from "react";
import BubbleMenu from "./BubbleMenu";
import FloatingMenu from "./FloatingMenu";

const DEFAULT_DEBOUNCE = 2000;

interface TiptapEditorProps {
  key: string;
  disabled?: boolean;
  value?: string;
  debounce?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Implements a debounce function.
 *
 * @param {T} func The function to debounce.
 * @param {number} wait The time to wait before executing the function.
 * @returns
 */
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default function TiptapEditor(props: TiptapEditorProps) {
  const debouncedOnChange = useCallback(
    debounce((content: string) => {
      console.log("debouncedOnChange", content);
      if (!props.onChange) return;
      props.onChange({
        target: {
          value: content,
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }, props.debounce ?? DEFAULT_DEBOUNCE),
    [props.onChange],
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Document,
      Paragraph,
      Text,
      Heading.configure({levels: [1, 2, 3]}),
      Bold,
      Italic,
      BulletList,
      OrderedList,
      ListItem,
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
      <EditorContent editor={editor} />
      {editor && (
        <>
          <FloatingMenu editor={editor} />
          <BubbleMenu editor={editor} />
        </>
      )}
    </Suspense>
  );
}
