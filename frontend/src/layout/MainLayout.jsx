import { Outlet, Link, useNavigate } from "react-router-dom";

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

} from "@mui/material";


import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LogoutIcon from "@mui/icons-material/Logout";
import FactCheckIcon from "@mui/icons-material/FactCheck";

import { useAuth } from "../context/AuthContext";


const drawerWidth = 240;


function MainLayout() {

    const navigate = useNavigate();

    const { user, logout } = useAuth();


    const handleLogout = () => {

        logout();

        navigate("/");
    };


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

                    <Typography variant="h6">

                        מערכת ניהול שערים

                    </Typography>


                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                    >

                        <Box>

                            <Typography variant="body1">

                                {user?.full_name}

                            </Typography>

                            <Typography variant="body2">

                                {user?.role}

                            </Typography>

                        </Box>


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


            {/* SIDEBAR */}

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

                <Toolbar />

                <Box sx={{ overflow: "auto" }}>

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

            </Drawer>


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