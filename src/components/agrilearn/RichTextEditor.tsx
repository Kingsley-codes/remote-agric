"use client";

import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
  Unlink,
} from "lucide-react";

interface RichTextEditorProps {
  initialContent?: string;
  onChange: (html: string, isEmpty: boolean) => void;
}

const toolbarButton =
  "inline-flex size-8 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-white hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-35";

export default function RichTextEditor({
  initialContent = "",
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
        },
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-72 px-4 py-3 text-sm leading-7 text-slate-700 outline-none [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/35 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h1]:mb-3 [&_h1]:mt-5 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:leading-tight [&_h2]:mb-2 [&_h2]:mt-5 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-xl [&_h3]:font-semibold [&_hr]:my-5 [&_hr]:border-slate-200 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-2 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-slate-900 [&_pre]:p-3 [&_pre]:text-slate-100 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6",
      },
    },
    onUpdate: ({ editor: currentEditor }) =>
      onChange(currentEditor.getHTML(), currentEditor.isEmpty),
  });

  const active = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => ({
      bold: currentEditor?.isActive("bold") ?? false,
      italic: currentEditor?.isActive("italic") ?? false,
      strike: currentEditor?.isActive("strike") ?? false,
      underline: currentEditor?.isActive("underline") ?? false,
      code: currentEditor?.isActive("code") ?? false,
      h1: currentEditor?.isActive("heading", { level: 1 }) ?? false,
      h2: currentEditor?.isActive("heading", { level: 2 }) ?? false,
      h3: currentEditor?.isActive("heading", { level: 3 }) ?? false,
      bulletList: currentEditor?.isActive("bulletList") ?? false,
      orderedList: currentEditor?.isActive("orderedList") ?? false,
      blockquote: currentEditor?.isActive("blockquote") ?? false,
      link: currentEditor?.isActive("link") ?? false,
      canUndo: currentEditor?.can().chain().focus().undo().run() ?? false,
      canRedo: currentEditor?.can().chain().focus().redo().run() ?? false,
    }),
  });

  const buttonClass = (isActive = false) =>
    `${toolbarButton} ${isActive ? "bg-white text-primary shadow-sm ring-1 ring-slate-200" : ""}`;

  function updateLink() {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter a link URL", previousUrl ?? "https://");
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }

  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2">
        <button type="button" title="Heading 1" aria-label="Heading 1" aria-pressed={active?.h1} onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} className={buttonClass(active?.h1)}><Heading1 size={17} /></button>
        <button type="button" title="Heading 2" aria-label="Heading 2" aria-pressed={active?.h2} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={buttonClass(active?.h2)}><Heading2 size={17} /></button>
        <button type="button" title="Heading 3" aria-label="Heading 3" aria-pressed={active?.h3} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} className={buttonClass(active?.h3)}><Heading3 size={17} /></button>
        <span className="mx-1 h-5 w-px bg-slate-200" />
        <button type="button" title="Bold" aria-label="Bold" aria-pressed={active?.bold} onClick={() => editor?.chain().focus().toggleBold().run()} className={buttonClass(active?.bold)}><Bold size={16} /></button>
        <button type="button" title="Italic" aria-label="Italic" aria-pressed={active?.italic} onClick={() => editor?.chain().focus().toggleItalic().run()} className={buttonClass(active?.italic)}><Italic size={16} /></button>
        <button type="button" title="Underline" aria-label="Underline" aria-pressed={active?.underline} onClick={() => editor?.chain().focus().toggleUnderline().run()} className={buttonClass(active?.underline)}><Underline size={16} /></button>
        <button type="button" title="Strikethrough" aria-label="Strikethrough" aria-pressed={active?.strike} onClick={() => editor?.chain().focus().toggleStrike().run()} className={buttonClass(active?.strike)}><Strikethrough size={16} /></button>
        <button type="button" title="Inline code" aria-label="Inline code" aria-pressed={active?.code} onClick={() => editor?.chain().focus().toggleCode().run()} className={buttonClass(active?.code)}><Code size={16} /></button>
        <span className="mx-1 h-5 w-px bg-slate-200" />
        <button type="button" title="Bulleted list" aria-label="Bulleted list" aria-pressed={active?.bulletList} onClick={() => editor?.chain().focus().toggleBulletList().run()} className={buttonClass(active?.bulletList)}><List size={17} /></button>
        <button type="button" title="Numbered list" aria-label="Numbered list" aria-pressed={active?.orderedList} onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={buttonClass(active?.orderedList)}><ListOrdered size={17} /></button>
        <button type="button" title="Blockquote" aria-label="Blockquote" aria-pressed={active?.blockquote} onClick={() => editor?.chain().focus().toggleBlockquote().run()} className={buttonClass(active?.blockquote)}><Quote size={16} /></button>
        <button type="button" title="Horizontal line" aria-label="Horizontal line" onClick={() => editor?.chain().focus().setHorizontalRule().run()} className={buttonClass()}><Minus size={17} /></button>
        <span className="mx-1 h-5 w-px bg-slate-200" />
        <button type="button" title="Add or edit link" aria-label="Add or edit link" aria-pressed={active?.link} onClick={updateLink} className={buttonClass(active?.link)}><Link size={16} /></button>
        <button type="button" title="Remove link" aria-label="Remove link" disabled={!active?.link} onClick={() => editor?.chain().focus().unsetLink().run()} className={buttonClass()}><Unlink size={16} /></button>
        <span className="mx-1 h-5 w-px bg-slate-200" />
        <button type="button" title="Undo" aria-label="Undo" disabled={!active?.canUndo} onClick={() => editor?.chain().focus().undo().run()} className={buttonClass()}><Undo2 size={16} /></button>
        <button type="button" title="Redo" aria-label="Redo" disabled={!active?.canRedo} onClick={() => editor?.chain().focus().redo().run()} className={buttonClass()}><Redo2 size={16} /></button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
