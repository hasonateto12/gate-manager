import { Outlet, Link } from "react-router-dom";

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

} from "@mui/material";


import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";


const drawerWidth = 240;


function MainLayout() {

    return (

        <Box sx={{ display: "flex" }}>

            {/* TOP BAR */}

            <AppBar
                position="fixed"
                sx={{
                    zIndex: 1201,
                }}
            >

                <Toolbar>

                    <Typography variant="h6">

                        מערכת ניהול שערים

                    </Typography>

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