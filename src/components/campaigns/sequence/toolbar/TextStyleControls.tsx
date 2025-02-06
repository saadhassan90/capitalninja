import { Button } from "@/components/ui/button";
import { Type, ChevronDown, Palette } from "lucide-react";
import { Editor } from '@tiptap/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TextStyleControlsProps {
  editor: Editor;
}

const fontSizes = [
  { label: 'Small', value: '14px' },
  { label: 'Normal', value: '16px' },
  { label: 'Large', value: '18px' },
  { label: 'Extra Large', value: '24px' },
];

const colors = [
  { label: 'Black', value: '#000000' },
  { label: 'Gray', value: '#666666' },
  { label: 'Red', value: '#ff0000' },
  { label: 'Blue', value: '#0000ff' },
  { label: 'Green', value: '#008000' },
];

const fontFamilies = [
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Times New Roman', value: 'Times New Roman, serif' },
  { label: 'Courier New', value: 'Courier New, monospace' },
  { label: 'Georgia', value: 'Georgia, serif' },
];

export function TextStyleControls({ editor }: TextStyleControlsProps) {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-2">
            <Type className="h-4 w-4" />
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {fontSizes.map((size) => (
            <DropdownMenuItem 
              key={size.value}
              onClick={() => {
                editor.chain().focus().setMark('textStyle', { fontSize: size.value }).run();
              }}
            >
              {size.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-2">
            <Palette className="h-4 w-4" />
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {colors.map((color) => (
            <DropdownMenuItem 
              key={color.value}
              onClick={() => editor.chain().focus().setColor(color.value).run()}
              className="flex items-center gap-2"
            >
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: color.value }} 
              />
              {color.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-2">
            <span className="font-serif">F</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {fontFamilies.map((font) => (
            <DropdownMenuItem 
              key={font.value}
              onClick={() => {
                editor.chain().focus().setMark('textStyle', { fontFamily: font.value }).run();
              }}
              style={{ fontFamily: font.value }}
            >
              {font.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}