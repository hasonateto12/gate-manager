import {

    useContext,
    useState,

} from "react";

import {

    Outlet,
    Link,
    useNavigate,

} from "react-router-dom";

import {

    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    AppBar,
    Button,
    Stack,
    IconButton,
    Divider,
    useMediaQuery,

} from "@mui/material";


import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LogoutIcon from "@mui/icons-material/Logout";
import FactCheckIcon from "@mui/icons-material/FactCheck";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import MenuIcon from "@mui/icons-material/Menu";

import { useTheme } from "@mui/material/styles";

import { useAuth } from "../context/AuthContext";

import { ColorModeContext } from "../main";


const drawerWidth = 240;


function MainLayout() {

    const navigate = useNavigate();

    const theme = useTheme();

    const colorMode =
        useContext(ColorModeContext);

    const isMobile =
        useMediaQuery(theme.breakpoints.down("md"));

    const [mobileOpen, setMobileOpen] =
        useState(false);

    const { user, logout } = useAuth();


    const handleLogout = () => {

        logout();

        navigate("/");
    };


    const handleDrawerToggle = () => {

        setMobileOpen(!mobileOpen);
    };


    // SIDEBAR CONTENT

    const drawerContent = (

        <Box>

            <Toolbar />

            <Divider />

            <List>

                {/* DASHBOARD */}

                <ListItem disablePadding>

                    <ListItemButton
                        component={Link}
                        to="/dashboard"
                    >

                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>

                        <ListItemText primary="לוח בקרה" />

                    </ListItemButton>

                </ListItem>


                {/* EMPLOYEES */}

                <ListItem disablePadding>

                    <ListItemButton
                        component={Link}
                        to="/employees"
                    >

                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>

                        <ListItemText primary="עובדים" />

                    </ListItemButton>

                </ListItem>


                {/* VEHICLES */}

                <ListItem disablePadding>

                    <ListItemButton
                        component={Link}
                        to="/vehicles"
                    >

                        <ListItemIcon>
                            <DirectionsCarIcon />
                        </ListItemIcon>

                        <ListItemText primary="רכבים" />

                    </ListItemButton>

                </ListItem>


                {/* ENTRY REQUESTS */}

                <ListItem disablePadding>

                    <ListItemButton
                        component={Link}
                        to="/entry-requests"
                    >

                        <ListItemIcon>
                            <AssignmentIcon />
                        </ListItemIcon>

                        <ListItemText primary="בקשות כניסה" />

                    </ListItemButton>

                </ListItem>


                {/* ENTRY LOGS */}

                <ListItem disablePadding>

                    <ListItemButton
                        component={Link}
                        to="/entry-logs"
                    >

                        <ListItemIcon>
                            <FactCheckIcon />
                        </ListItemIcon>

                        <ListItemText primary="לוג כניסות" />

                    </ListItemButton>

                </ListItem>

            </List>

        </Box>
    );


    return (

        <Box sx={{ display: "flex" }}>

            {/* TOP BAR */}

            <AppBar
                position="fixed"
                sx={{
                    zIndex: 1201,
                }}
            >

                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >

                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                    >

                        {

                            isMobile && (

                                <IconButton
                                    color="inherit"
                                    onClick={handleDrawerToggle}
                                >

                                    <MenuIcon />

                                </IconButton>
                            )
                        }

                        <Typography variant="h6">

                            מערכת ניהול שערים

                        </Typography>

                    </Stack>


                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                    >

                        {/* DARK MODE */}

                        <IconButton
                            color="inherit"
                            onClick={colorMode.toggleColorMode}
                        >

                            {

                                theme.palette.mode === "dark"

                                    ?

                                    <LightModeIcon />

                                    :

                                    <DarkModeIcon />
                            }

                        </IconButton>


                        {/* USER INFO */}

                        <Box>

                            <Typography variant="body1">

                                {user?.full_name}

                            </Typography>

                            <Typography variant="body2">

                                {user?.role}

                            </Typography>

                        </Box>


                        {/* LOGOUT */}

                        <Button
                            color="inherit"
                            startIcon={<LogoutIcon />}
                            onClick={handleLogout}
                        >
                            התנתק
                        </Button>

                    </Stack>

                </Toolbar>

            </AppBar>


            {/* MOBILE DRAWER */}

            {

                isMobile ? (

                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true,
                        }}
                        sx={{

                            "& .MuiDrawer-paper": {

                                width: drawerWidth,
                            },
                        }}
                    >

                        {drawerContent}

                    </Drawer>

                ) : (

                    <Drawer
                        variant="permanent"
                        sx={{
                            width: drawerWidth,
                            flexShrink: 0,

                            "& .MuiDrawer-paper": {

                                width: drawerWidth,

                                boxSizing: "border-box",
                            },
                        }}
                    >

                        {drawerContent}

                    </Drawer>
                )
            }


            {/* PAGE CONTENT */}

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                }}
            >

                <Toolbar />

                <Outlet />

            </Box>

        </Box>
    );
}

export default MainLayout;