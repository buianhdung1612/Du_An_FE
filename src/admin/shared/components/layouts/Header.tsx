import AppBar from "@mui/material/AppBar";
import useScrollTrigger from '@mui/material/useScrollTrigger';
import React from "react";
import Container from "@mui/material/Container";
import Box from '@mui/material/Box';
import SettingsIcon from '@mui/icons-material/Settings';
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import MenuIcon from '@mui/icons-material/Menu';
import { PersonalVisionDialog } from "../../../features/personal-vision/components/PersonalVisionDialog";
import { useProductivityStore } from "../../../features/productivity/stores/useProductivityStore";
import LinearProgress from "@mui/material/LinearProgress";

import { useState } from "react";
import { toast } from 'react-toastify';
import { useAuthStore } from "@core/stores/useAuthStore";


import { useNavigate } from "react-router-dom";
import { logout as logoutApi } from "../../../features/authen/api/auth.api";


import Cookies from "js-cookie";
import { prefixAdmin } from "../../constants/routes";
import { NotificationPopover } from "./NotificationPopover";
import { PREMIUM_MENU_STYLE } from "../../constants/menu-styles";
import { useSidebar } from "../../context/sidebar/useSidebar";
import IconButton from "@mui/material/IconButton";

interface Props {
    window?: () => Window;
    children: React.ReactElement<any, any>;
    sx?: any;
}

function ElevationScroll(props: Props) {
    const { children, window, sx: extraSx } = props;

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window() : undefined,
    });

    if (!children) return null;

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
        className: ((children.props && children.props.className) || "") + (trigger ? ' header__admin scrolled' : ' header__admin'),
        sx: {
            ...(children.props && children.props.sx),
            ...extraSx,
            backgroundImage: "none !important",
            backgroundColor: trigger ? "rgba(255, 255, 255, 0.8)" : "transparent",
            backdropFilter: trigger ? "blur(8px)" : "none",
            boxShadow: trigger ? "0 0 2px 0 rgba(145 158 171 / 24%), -20px 20px 40px -4px rgba(145 158 171 / 24%)" : "none",
            transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
    });
}

export const Header = () => {
    const navigate = useNavigate();
    const { user, logout: logoutStore } = useAuthStore();
    const { activePlan } = useProductivityStore();
    const { isMobile, openSidebar } = useSidebar();
    const [anchorElUser, setAnchorElUser] = useState<HTMLButtonElement | null>(null);
    const [anchorElGoals, setAnchorElGoals] = useState<HTMLButtonElement | null>(null);
    const [openVision, setOpenVision] = useState(false);

    const handleOpenUser = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUser = () => {
        setAnchorElUser(null);
    };

    const handleOpenGoals = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElGoals(event.currentTarget);
    };

    const handleCloseGoals = () => {
        setAnchorElGoals(null);
    };

    const handleLogout = async () => {
        try {
            const res = await logoutApi();
            if (res.code === 200) {
                logoutStore();
                Cookies.remove("tokenAdmin");
                toast.success("Đăng xuất thành công!");
                navigate("/admin/auth/login");
            }
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Có lỗi xảy ra khi đăng xuất!");
        }
    };

    const openUser = Boolean(anchorElUser);

    return (
        <>
            <ElevationScroll>
                <AppBar
                    position="sticky"
                    color="inherit"
                    sx={{
                        width: "100%",
                    }}
                >
                    {activePlan && (
                        <Tooltip title={`Tiến độ hiệu suất tuần hiện tại`}>
                            <LinearProgress
                                variant="determinate"
                                value={activePlan.weeklyExecution[0].score}
                                sx={{
                                    height: 2,
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bgcolor: 'transparent',
                                    '& .MuiLinearProgress-bar': {
                                        transition: 'transform 0.4s linear',
                                        bgcolor: activePlan.weeklyExecution[0].score > 85 ? 'success.main' : 'warning.main'
                                    }
                                }}
                            />
                        </Tooltip>
                    )}
                    <Container
                        className="flex items-center justify-between"
                        maxWidth={false}
                        style={{
                            paddingLeft: isMobile ? "12px" : "40px",
                            paddingRight: isMobile ? "12px" : "40px",
                            height: isMobile ? "56px" : "72px"
                        }}
                    >
                        <div className="flex items-center gap-[8px] py-[4px]">
                            {/* Hamburger menu trên mobile */}
                            {isMobile && (
                                <IconButton
                                    onClick={openSidebar}
                                    sx={{ color: '#637381', mr: 0.5 }}
                                >
                                    <MenuIcon />
                                </IconButton>
                            )}
                            <img
                                src="https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/icons/workspaces/logo-1.webp"
                                width={24}
                                height={24}
                                alt="TeddyPet"
                                className="w-[24px] h-[24px] object-cover"
                            />
                            {!isMobile && (
                                <span className="text-[0.875rem] font-[600] text-[#1c252e]">TeddyPet</span>
                            )}
                        </div>
                        <Box className="flex items-center gap-[6px]">
                            {/* Search bar - ẩn trên mobile */}
                            {!isMobile && (
                                <Box className="flex items-center pr-[8px] cursor-pointer bg-[#919eab14] hover:bg-[#919eab29] rounded-[12px] transition-colors duration-150 ease-in-out">
                                    <Box className="p-[8px]">
                                        <svg className="text-[1.25rem] text-[#637381]" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" id="«ro»" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m20.71 19.29l-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8a7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42M5 11a6 6 0 1 1 6 6a6 6 0 0 1-6-6"></path></svg>
                                    </Box>
                                    <span className="h-[1.5rem] min-w-[1.5rem] flex items-center justify-center text-[#1C252E] text-[0.75rem] font-[900] pl-[6px] pr-[6px] rounded-[6px] bg-white box-shadow-[0_1px_2px_0_rgba(145,158,171,0.16)]"><span className="text-[0.4375rem] mt-[1px] mr-[1px]">⌘</span>K</span>
                                </Box>
                            )}

                            <NotificationPopover />

                            {!isMobile && (
                                <Tooltip title="Tiêu điểm mục tiêu 12 tuần">
                                    <Button
                                        onClick={handleOpenGoals}
                                        className="hover:scale-[1.04] hover:bg-admin-hoverIcon transition-all duration-150 ease-in-out"
                                        sx={{
                                            minWidth: 0,
                                            padding: 0,
                                            mx: 1
                                        }}>
                                        <svg className="text-[1.375rem] text-[#637381]" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" color="currentColor"><path d="M14.484 21.012A9.098 9.098 0 0 0 21.012 14.484M13.415 2.553C12.95 2.518 12.479 2.5 12 2.5c-5.247 0-9.5 4.253-9.5 9.5s4.253 9.5 9.5 9.5c.48 0 .949-.018 1.415-.053M22 2v2.5M19.5 4.5H22M2 22l4.5-4.5" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="1" fill="currentColor" /></g></svg>
                                    </Button>
                                </Tooltip>
                            )}

                            {!isMobile && (
                                <Tooltip title="Tầm nhìn cá nhân">
                                    <Button
                                        onClick={() => setOpenVision(true)}
                                        className="hover:scale-[1.04] hover:bg-admin-hoverIcon transition-all duration-150 ease-in-out"
                                        sx={{
                                            minWidth: 0,
                                            padding: 0,
                                            mx: 1
                                        }}>
                                        <LightbulbIcon
                                            sx={{
                                                color: "#637381",
                                                fontSize: "1.375rem",
                                            }}
                                        />
                                    </Button>
                                </Tooltip>
                            )}

                            {!isMobile && (
                                <Button
                                    className="hover:scale-[1.04] hover:bg-admin-hoverIcon transition-all duration-150 ease-in-out"
                                    sx={{
                                        minWidth: 0,
                                        padding: 0,
                                        mx: 1
                                    }}>
                                    <SettingsIcon
                                        sx={{
                                            color: "#637381",
                                            fontSize: "1.375rem",
                                            animation: "spin 10s linear infinite",
                                            "@keyframes spin": {
                                                "0%": { transform: "rotate(0deg)" },
                                                "100%": { transform: "rotate(360deg)" }
                                            }
                                        }}
                                    />
                                </Button>
                            )}

                            <Button
                                onClick={handleOpenUser}
                                sx={{
                                    minWidth: 0,
                                    padding: 0,
                                    borderRadius: '50%',
                                    ml: 1
                                }}
                            >
                                <div className={`relative rounded-full p-[3px] w-[2.5rem] h-[2.5rem] header__avatar ${openUser ? 'active' : ''}`}>
                                    <Avatar className="w-full h-full" src={user?.avatar || "https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/images/mock/avatar/avatar-25.webp"} />
                                </div>
                            </Button>

                            <Popover
                                open={openUser}
                                anchorEl={anchorElUser}
                                onClose={handleCloseUser}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                slotProps={{
                                    paper: {
                                        sx: {
                                            ...PREMIUM_MENU_STYLE,
                                            p: 0,
                                            mt: 1,
                                            ml: 0.75,
                                            width: 200,
                                            '& .MuiMenuItem-root': {
                                                typography: 'body2',
                                                borderRadius: 0.75,
                                            },
                                        },
                                    }
                                }}
                            >
                                <Box sx={{ py: 1.5, px: 2 }}>
                                    <Typography variant="subtitle2" noWrap sx={{ color: '#1C252E', fontWeight: 600 }}>
                                        {user?.fullName || "Admin"}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                                        {user?.email || ""}
                                    </Typography>
                                </Box>

                                <Divider sx={{ borderStyle: 'dashed' }} />

                                <MenuItem onClick={() => { navigate(`/${prefixAdmin}/profile`); handleCloseUser(); }} sx={{ m: 1 }}>
                                    Hồ sơ
                                </MenuItem>

                                <Divider sx={{ borderStyle: 'dashed' }} />

                                <MenuItem onClick={handleLogout} sx={{ m: 1, color: 'error.main', fontWeight: 600 }}>
                                    Đăng xuất
                                </MenuItem>
                            </Popover>
                        </Box>
                    </Container>
                </AppBar>
            </ElevationScroll>

            <PersonalVisionDialog open={openVision} onClose={() => setOpenVision(false)} />

            <Popover
                open={Boolean(anchorElGoals)}
                anchorEl={anchorElGoals}
                onClose={handleCloseGoals}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                slotProps={{
                    paper: {
                        sx: {
                            ...PREMIUM_MENU_STYLE,
                            p: 2, mt: 1.5, width: 280,
                        }
                    }
                }}
            >
                <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, mb: 1, display: 'block' }}>
                    Mục tiêu 12 tuần của tôi
                </Typography>
                <Stack spacing={1}>
                    {activePlan?.goals?.map((goal: any, i: number) => (
                        <Box
                            key={i}
                            onClick={() => { navigate(`/${prefixAdmin}/productivity`); handleCloseGoals(); }}
                            sx={{
                                p: 1.5, borderRadius: '10px',
                                bgcolor: 'rgba(145, 158, 171, 0.08)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                '&:hover': { bgcolor: 'rgba(0, 167, 111, 0.12)', color: 'primary.main' }
                            }}
                        >
                            <Typography variant="body2" fontWeight={700}>{goal.title}</Typography>
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>{goal.tactics?.length || 0} chiến thuật đang thực thi</Typography>
                        </Box>
                    ))}
                    {!activePlan?.goals?.length && <Typography variant="caption">Chưa có kế hoạch hoạt động</Typography>}
                </Stack>
            </Popover>
        </>
    );
}
