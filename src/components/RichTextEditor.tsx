"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import "./RichTextEditor.css";

// Dynamically import ReactQuill with SSR disabled to avoid Next.js hydration issues
// Quill manipulates the DOM directly and doesn't work well with server-side rendering
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Type your message here...",
  className = "",
}: RichTextEditorProps) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "color",
    "background",
    "link",
  ];

  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-white [&_.ql-container]:dark:bg-gray-800 [&_.ql-toolbar]:dark:bg-gray-700 dark:bg-gray-800 [&_.ql-editor]:dark:text-white"
      />
    </div>
  );
}
