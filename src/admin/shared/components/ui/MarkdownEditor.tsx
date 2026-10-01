import React, { useState } from 'react';
import { Box, Tab, Tabs, TextField, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';
// Remark plugin to convert "->" into a Unicode right arrow
import { visit } from 'unist-util-visit';
const remarkArrow = () => (tree) => {
  visit(tree, 'text', (node) => {
    if (typeof node.value === 'string') {
      node.value = node.value.replace(/->/g, '→');
    }
  });
};

// Utility to convert various arrow notations to Unicode arrows
const convertArrows = (text: string): string => {
  return text
    .replace(/->/g, '→')
    .replace(/<-/g, '←')
    .replace(/\^/g, '↑')
    .replace(/v/g, '↓');
};

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }) => {
    const [tab, setTab] = useState(0);
    const [openGuide, setOpenGuide] = useState(false);

    return (
        <Paper variant="outlined" sx={{ overflow: 'hidden', borderRadius: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50', display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 2 }}>
                <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="markdown editor tabs">
                    <Tab label="Viết (Write)" sx={{ textTransform: 'none', fontWeight: 600 }} />
                    <Tab label="Xem trước (Preview)" sx={{ textTransform: 'none', fontWeight: 600 }} />
                </Tabs>
                <Button 
                    startIcon={<HelpOutlineIcon />}
                    size="small"
                    onClick={() => setOpenGuide(true)}
                    sx={{ textTransform: 'none', color: 'text.secondary' }}
                >
                    Hướng dẫn Markdown
                </Button>
            </Box>
            
            <Box sx={{ minHeight: 400 }}>
                {tab === 0 ? (
                    <TextField
                        fullWidth
                        multiline
                        minRows={15}
                        value={value}
                        onChange={(e) => onChange(convertArrows(e.target.value))}
                        placeholder="Nhập nội dung Markdown tại đây... (Dùng # cho tiêu đề, ** cho chữ đậm, ``` cho code block)"
                        sx={{
                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                            fontFamily: 'monospace',
                            fontSize: '0.9rem'
                        }}
                    />
                ) : (
                    <Box p={3} className="markdown-preview" sx={{ 
                        maxHeight: 600, 
                        overflowY: 'auto',
                        '& .markdown-body': { color: 'inherit' }
                    }}>
                        <div className="prose max-w-none">
                            {(() => {
                              const previewValue = convertArrows(value);
                              return (
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  rehypePlugins={[rehypeRaw, rehypeHighlight]}
                                >
                                  {previewValue || "*Chưa có nội dung xem trước*"}
                                </ReactMarkdown>
                              );
                            })()}
                        </div>
                    </Box>
                )}
            </Box>

            <Dialog open={openGuide} onClose={() => setOpenGuide(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Hướng dẫn viết Markdown</DialogTitle>
                <DialogContent dividers>
                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'grey.100' }}>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Cú pháp</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Mô tả</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Kết quả</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell><code># Tiêu đề 1</code><br/><code>## Tiêu đề 2</code><br/><code>### Tiêu đề 3</code></TableCell>
                                    <TableCell>Tạo các cấp độ tiêu đề khác nhau</TableCell>
                                    <TableCell><strong>Tiêu đề 1</strong><br/>Tiêu đề 2</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><code>**Chữ đậm**</code></TableCell>
                                    <TableCell>In đậm văn bản</TableCell>
                                    <TableCell><strong>Chữ đậm</strong></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><code>*Chữ nghiêng*</code></TableCell>
                                    <TableCell>In nghiêng văn bản</TableCell>
                                    <TableCell><em>Chữ nghiêng</em></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><code>[Tên link](https://link.com)</code></TableCell>
                                    <TableCell>Tạo liên kết (Link)</TableCell>
                                    <TableCell><a href="#" onClick={(e)=>e.preventDefault()}>Tên link</a></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><code>![Mô tả ảnh](https://link.com/anh.jpg)</code></TableCell>
                                    <TableCell>Chèn hình ảnh</TableCell>
                                    <TableCell>Hình ảnh</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><code>- Mục 1</code><br/><code>- Mục 2</code></TableCell>
                                    <TableCell>Danh sách không thứ tự</TableCell>
                                    <TableCell>• Mục 1<br/>• Mục 2</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><code>1. Mục 1</code><br/><code>2. Mục 2</code></TableCell>
                                    <TableCell>Danh sách có thứ tự</TableCell>
                                    <TableCell>1. Mục 1<br/>2. Mục 2</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><code>&gt; Trích dẫn</code></TableCell>
                                    <TableCell>Tạo khối trích dẫn (Blockquote)</TableCell>
                                    <TableCell sx={{ borderLeft: '3px solid #ccc', pl: 1, color: 'text.secondary' }}>Trích dẫn</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><code>&amp;rarr; hoặc -&gt;</code></TableCell>
                                    <TableCell>Mũi tên phải</TableCell>
                                    <TableCell>→</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><code>`code inline`</code></TableCell>
                                    <TableCell>Đoạn mã trên 1 dòng</TableCell>
                                    <TableCell><code style={{ backgroundColor: '#f5f5f5', padding: '2px 4px', borderRadius: '4px' }}>code inline</code></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><code>```javascript</code><br/><code>const a = 1;</code><br/><code>```</code></TableCell>
                                    <TableCell>Khối mã (Code block)</TableCell>
                                    <TableCell><code style={{ backgroundColor: '#f5f5f5', padding: '4px', borderRadius: '4px', display: 'block' }}>const a = 1;</code></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenGuide(false)} color="primary">
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};
