import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import { Breadcrumb } from "../../../shared/components/ui/Breadcrumb";
import { Title } from "../../../shared/components/ui/Title";
import { prefixAdmin } from "../../../shared/constants/routes";
import { useState } from "react";
import { VocabularyTopicList } from "./sections/VocabularyTopicList";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Stack, FormControl, InputLabel, Select, MenuItem,
    Box, Card, Tabs, Tab
} from "@mui/material";
import {
    useCreateVocabularyTopic,
    useUpdateVocabularyTopic
} from "./hooks/useVocabularyTopic";
import { toast } from "react-toastify";
import { VocabularyDialog } from "../components/VocabularyDialog";

export const VocabularyTopicListPage = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState<any>(null);
    const [formData, setFormData] = useState({ title: "", description: "", status: "active" });

    const [tabStatus, setTabStatus] = useState('all');
    const isTrash = tabStatus === 'trash';

    // Vocabulary Dialog states
    const [vocabDialogOpen, setVocabDialogOpen] = useState(false);
    const [vocabDefaultTopicId, setVocabDefaultTopicId] = useState<string | undefined>(undefined);
    const [selectedVocab, setSelectedVocab] = useState<any>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const createMutation = useCreateVocabularyTopic();
    const updateMutation = useUpdateVocabularyTopic();

    const handleOpenDialog = (topic?: any) => {
        if (topic) {
            setSelectedTopic(topic);
            setFormData({
                title: topic.title,
                description: topic.description || "",
                status: topic.status || "active"
            });
        } else {
            setSelectedTopic(null);
            setFormData({ title: "", description: "", status: "active" });
        }
        setDialogOpen(true);
    };

    const handleEditVocab = (vocab: any) => {
        setSelectedVocab(vocab);
        setVocabDefaultTopicId(vocab.topicId?._id || vocab.topicId);
        setVocabDialogOpen(true);
    };

    const handleAddVocab = (topic: any) => {
        setSelectedVocab(null);
        setVocabDefaultTopicId(topic._id);
        setVocabDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (selectedTopic) {
            updateMutation.mutate({ id: selectedTopic._id, data: formData }, {
                onSuccess: (res: any) => {
                    if (res.success) {
                        toast.success("Cập nhật thành công");
                        setDialogOpen(false);
                    } else {
                        toast.error(res.message);
                    }
                }
            });
        } else {
            createMutation.mutate(formData, {
                onSuccess: (res: any) => {
                    if (res.success) {
                        toast.success("Tạo mới thành công");
                        setDialogOpen(false);
                    } else {
                        toast.error(res.message);
                    }
                }
            });
        }
    };

    return (
        <Box sx={{ pb: 5 }}>
            <div className="mb-[calc(5*var(--spacing))] gap-[calc(2*var(--spacing))] flex flex-col md:flex-row md:items-start md:justify-end">
                <div className="mr-auto">
                    <Title title={"Quản lý Chủ đề"} />
                    <Breadcrumb
                        items={[
                            { label: "Bảng điều khiển", to: "/" },
                            { label: "Kho từ vựng", to: `/${prefixAdmin}/vocabulary/list` },
                            { label: "Chủ đề" }
                        ]}
                    />
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <Button
                        onClick={() => handleOpenDialog()}
                        sx={{
                            background: 'var(--palette-text-primary)',
                            minHeight: "2.25rem",
                            minWidth: "4rem",
                            fontWeight: 700,
                            fontSize: "0.875rem",
                            padding: "6px 12px",
                            borderRadius: "var(--shape-borderRadius)",
                            textTransform: "none",
                            boxShadow: "none",
                            "&:hover": {
                                background: "var(--palette-grey-700)",
                                boxShadow: "var(--customShadows-z8)"
                            }
                        }}
                        variant="contained"
                        startIcon={<AddIcon />}
                    >
                        {"Tạo chủ đề"}
                    </Button>
                </div>
            </div>

            <VocabularyTopicList
                key={refreshKey}
                onEdit={handleOpenDialog}
                onAddVocab={handleAddVocab}
                onEditVocab={handleEditVocab}
            />

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "16px" } }}>
                <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
                    {selectedTopic ? "Chỉnh sửa chủ đề" : "Tạo chủ đề mới"}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1.5 }}>
                        <TextField
                            fullWidth
                            label="Tên chủ đề"
                            variant="outlined"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Mô tả"
                            variant="outlined"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Trạng thái</InputLabel>
                            <Select
                                value={formData.status}
                                label="Trạng thái"
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                            >
                                <MenuItem value="active">Hoạt động</MenuItem>
                                <MenuItem value="inactive">Tạm dừng</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setDialogOpen(false)} sx={{ color: 'text.secondary', fontWeight: 600 }}>Hủy bỏ</Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        loading={createMutation.isPending || updateMutation.isPending}
                        sx={{ bgcolor: 'var(--palette-text-primary)', borderRadius: '8px', fontWeight: 700 }}
                    >
                        Lưu thay đổi
                    </Button>
                </DialogActions>
            </Dialog>

            <VocabularyDialog
                open={vocabDialogOpen}
                onClose={() => { setVocabDialogOpen(false); setSelectedVocab(null); }}
                onSuccess={() => { setRefreshKey(prev => prev + 1); }}
                vocab={selectedVocab}
                defaultTopicId={vocabDefaultTopicId}
            />
        </Box>
    );
};
