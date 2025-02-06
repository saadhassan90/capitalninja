import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Link from '@tiptap/extension-link';
import { Extension } from '@tiptap/core';

const FontSize = Extension.create({
  name: 'fontSize',
  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: element => element.style.fontSize,
        renderHTML: attributes => {
          if (!attributes.size) {
            return {};
          }
          return {
            style: `font-size: ${attributes.size}`,
          };
        },
      },
    };
  },
});

const FontFamily = Extension.create({
  name: 'fontFamily',
  addAttributes() {
    return {
      family: {
        default: null,
        parseHTML: element => element.style.fontFamily,
        renderHTML: attributes => {
          if (!attributes.family) {
            return {};
          }
          return {
            style: `font-family: ${attributes.family}`,
          };
        },
      },
    };
  },
});

export const getEditorExtensions = () => [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
  }),
  Underline,
  TextStyle,
  Color,
  FontSize,
  FontFamily,
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