import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';

export const getEditorExtensions = () => [
  StarterKit.configure({
    bulletList: false,
    orderedList: false,
    listItem: false,
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'text-blue-500 underline'
    }
  }),
  BulletList.configure({
    HTMLAttributes: {
      class: 'list-disc ml-4'
    }
  }),
  OrderedList.configure({
    HTMLAttributes: {
      class: 'list-decimal ml-4'
    }
  }),
  ListItem,
];