import {NodeViewContent, NodeViewWrapper} from "@tiptap/react";
import "./styles/code-block.scss";

interface CodeBlockProps {
  node: {
    attrs: {
      language: string;
    };
  };
  updateAttributes: (attrs: {language: string}) => void;
  extension: {
    options: {
      lowlight: {
        listLanguages: () => string[];
      };
    };
  };
}

export default function CodeBlock({
  node: {
    attrs: {language: defaultLanguage},
  },
  updateAttributes,
  extension,
}: CodeBlockProps) {
  return (
    <NodeViewWrapper className="code-block">
      <select
        contentEditable={false}
        defaultValue={defaultLanguage}
        onChange={(event) => updateAttributes({language: event.target.value})}
      >
        <option value="null">auto</option>
        <option disabled>—</option>
        {extension.options.lowlight.listLanguages().map((lang, index) => (
          <option key={index} value={lang}>
            {lang}
          </option>
        ))}
      </select>
      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
}
