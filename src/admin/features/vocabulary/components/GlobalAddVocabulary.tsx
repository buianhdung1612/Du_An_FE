import { useState } from "react";
import { SpeedDial, SpeedDialAction, SpeedDialIcon, Box } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TranslateIcon from '@mui/icons-material/Translate';

import { VocabularyDialog } from "./VocabularyDialog";
import { PhrasalVerbDialog } from "./PhrasalVerbDialog";
import { VocabularyBulkDialog } from "./VocabularyBulkDialog";
import { VocabularyGroupDialog } from "./VocabularyGroupDialog";

export const GlobalAddVocabulary = () => {
    const [open, setOpen] = useState(false);
    
    // Dialog states
    const [vocabDialogOpen, setVocabDialogOpen] = useState(false);
    const [phrasalVerbDialogOpen, setPhrasalVerbDialogOpen] = useState(false);
    const [groupDialogOpen, setGroupDialogOpen] = useState(false);
    const [bulkDialogOpen, setBulkDialogOpen] = useState(false);

    const handleCloseSpeedDial = () => setOpen(false);
    const handleOpenSpeedDial = () => setOpen(true);

    const actions = [
        { icon: <AddIcon />, name: 'Thêm từ vựng', action: () => { setVocabDialogOpen(true); handleCloseSpeedDial(); } },
        { icon: <AutoFixHighIcon />, name: 'Thêm Phrasal Verb', action: () => { setPhrasalVerbDialogOpen(true); handleCloseSpeedDial(); } },
        { icon: <TranslateIcon />, name: 'Thêm nhóm từ', action: () => { setGroupDialogOpen(true); handleCloseSpeedDial(); } },
        { icon: <AutoAwesomeIcon />, name: 'Thêm hàng loạt (AI)', action: () => { setBulkDialogOpen(true); handleCloseSpeedDial(); } },
    ];

    const handleSuccess = () => {
        // Có thể thêm toast thông báo nếu muốn
    };

    return (
        <>
            <Box sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 9999 }}>
                <SpeedDial
                    ariaLabel="Thêm từ vựng"
                    sx={{ position: 'absolute', bottom: 0, right: 0 }}
                    icon={<SpeedDialIcon />}
                    onClose={handleCloseSpeedDial}
                    onOpen={handleOpenSpeedDial}
                    open={open}
                    FabProps={{
                        sx: {
                            bgcolor: '#1C252E !important',
                            color: '#fff !important',
                            '&:hover': { bgcolor: '#454f5b !important' }
                        }
                    }}
                >
                    {actions.map((action) => (
                        <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            tooltipOpen
                            onClick={action.action}
                            sx={{
                                '& .MuiSpeedDialAction-staticTooltipLabel': {
                                    whiteSpace: 'nowrap',
                                    fontWeight: 600,
                                    borderRadius: '8px',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.08)'
                                }
                            }}
                        />
                    ))}
                </SpeedDial>
            </Box>

            {vocabDialogOpen && (
                <VocabularyDialog
                    open={vocabDialogOpen}
                    onClose={() => setVocabDialogOpen(false)}
                    onSuccess={handleSuccess}
                />
            )}

            {phrasalVerbDialogOpen && (
                <PhrasalVerbDialog
                    open={phrasalVerbDialogOpen}
                    onClose={() => setPhrasalVerbDialogOpen(false)}
                    onSuccess={handleSuccess}
                />
            )}

            {groupDialogOpen && (
                <VocabularyGroupDialog
                    open={groupDialogOpen}
                    onClose={() => setGroupDialogOpen(false)}
                    onSuccess={handleSuccess}
                />
            )}

            {bulkDialogOpen && (
                <VocabularyBulkDialog
                    open={bulkDialogOpen}
                    onClose={() => setBulkDialogOpen(false)}
                    onSuccess={handleSuccess}
                />
            )}
        </>
    );
};
