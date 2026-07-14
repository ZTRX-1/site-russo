import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold, Italic, List, ListOrdered, Heading2, Heading3, Quote,
  Link2, ImageIcon, Undo, Redo, Code,
} from "lucide-react";

interface Props {
  value: string;
  onChange: (html: string) => void;
}

export function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline" } }),
      Image,
      Placeholder.configure({ placeholder: "Escreva o conteúdo do post..." }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none min-h-[400px] rounded-md border border-border bg-background p-4 outline-none focus:border-primary prose-headings:font-display prose-h2:text-2xl prose-h3:text-xl prose-a:text-primary",
      },
    },
    immediatelyRender: false,
  });

  if (!editor) return <div className="h-96 animate-pulse rounded-md bg-muted" />;

  const Btn = ({ onClick, active, label, children }: any) => (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded transition ${
        active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-1 rounded-md border border-border bg-card p-1">
        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} label="Negrito"><Bold className="h-4 w-4" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} label="Itálico"><Italic className="h-4 w-4" /></Btn>
        <div className="mx-1 h-6 w-px bg-border" />
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} label="Título 2"><Heading2 className="h-4 w-4" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} label="Título 3"><Heading3 className="h-4 w-4" /></Btn>
        <div className="mx-1 h-6 w-px bg-border" />
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} label="Lista"><List className="h-4 w-4" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} label="Lista numerada"><ListOrdered className="h-4 w-4" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} label="Citação"><Quote className="h-4 w-4" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} label="Código"><Code className="h-4 w-4" /></Btn>
        <div className="mx-1 h-6 w-px bg-border" />
        <Btn
          onClick={() => {
            const url = window.prompt("URL do link:");
            if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }}
          active={editor.isActive("link")} label="Link"
        ><Link2 className="h-4 w-4" /></Btn>
        <Btn
          onClick={() => {
            const url = window.prompt("URL da imagem:");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
          label="Imagem"
        ><ImageIcon className="h-4 w-4" /></Btn>
        <div className="mx-1 h-6 w-px bg-border" />
        <Btn onClick={() => editor.chain().focus().undo().run()} label="Desfazer"><Undo className="h-4 w-4" /></Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()} label="Refazer"><Redo className="h-4 w-4" /></Btn>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}