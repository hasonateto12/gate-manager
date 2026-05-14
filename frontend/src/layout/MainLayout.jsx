import { Outlet, Link } from "react-router-dom";

import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Box,
} from "@mui/material";

function MainLayout() {

    return (
        <Box>

            <AppBar position="static">
                <Toolbar>

                    <Typography
                        variant="h6"
                        sx={{ flexGrow: 1 }}
                    >
                        Gate Manager
                    </Typography>

                    <Button
                        color="inherit"
                        component={Link}
                        to="/dashboard"
                    >
                        Dashboard
                    </Button>

                    <Button
                        color="inherit"
                        component={Link}
                        to="/employees"
                    >
                        Employees
                    </Button>

                    <Button
                        color="inherit"
                        component={Link}
                        to="/vehicles"
                    >
                        Vehicles
                    </Button>

                </Toolbar>
            </AppBar>

            <Container sx={{ mt: 4 }}>
                <Outlet />
            </Container>

        </Box>
    );
}

export default MainLayout;