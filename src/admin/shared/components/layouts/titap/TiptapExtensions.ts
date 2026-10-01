import { TextStyle } from '@tiptap/extension-text-style'
import { StarterKit } from '@tiptap/starter-kit'
import { TextAlign } from '@tiptap/extension-text-align'
import { Link } from '@tiptap/extension-link'
import { Image } from '@tiptap/extension-image'
import { Placeholder } from '@tiptap/extension-placeholder'
import { BubbleMenu } from '@tiptap/extension-bubble-menu'
import { FloatingMenu } from '@tiptap/extension-floating-menu'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { Underline } from '@tiptap/extension-underline'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'
import { TaskList } from '@tiptap/extension-task-list'
import { TaskItem } from '@tiptap/extension-task-item'
import { Youtube } from '@tiptap/extension-youtube'
import { Highlight } from '@tiptap/extension-highlight'
import { Color } from '@tiptap/extension-color'
import { FontFamily } from '@tiptap/extension-font-family'

export const getExtensions = (placeholder?: string) => [
    TextStyle,
    FontFamily,
    Highlight.configure({ multicolor: true }),
    Color,
    StarterKit.configure({
        heading: {
            levels: [1, 2, 3],
        },
    }),
    Underline,
    Subscript,
    Superscript,
    TextAlign.configure({
        types: ['heading', 'paragraph'],
    }),
    Link.extend({
        inclusive: false,
    }).configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
    }),
    Image.configure({
        inline: true,
        allowBase64: true,
    }),
    Table.configure({
        resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    TaskList,
    TaskItem.configure({
        nested: true,
    }),
    Youtube.configure({
        width: 480,
        height: 320,
    }),
    Placeholder.configure({
        placeholder: placeholder || 'Bắt đầu viết...',
    }),
    BubbleMenu,
    FloatingMenu,
]
