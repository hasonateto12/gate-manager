import {

    Grid,
    Paper,
    Typography,
    Box,

} from "@mui/material";

import { useAuth } from "../context/AuthContext";


function DashboardPage() {

    const { user } = useAuth();

    const cards = [

        {
            title: "עובדים",
            value: 24,
        },

        {
            title: "רכבים",
            value: 18,
        },

        {
            title: "בקשות כניסה",
            value: 7,
        },

        {
            title: "כניסות היום",
            value: 32,
        },
    ];


    return (

        <Box>

            <Typography
                variant="h4"
                mb={2}
                fontWeight="bold"
            >
                לוח בקרה
            </Typography>


            <Typography
                variant="h6"
                mb={4}
            >
                שלום {user?.full_name}
            </Typography>


            <Grid
                container
                spacing={3}
            >

                {cards.map((card, index) => (

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                        key={index}
                    >

                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                            }}
                        >

                            <Typography
                                variant="h6"
                                color="text.secondary"
                            >
                                {card.title}
                            </Typography>

                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                mt={2}
                            >
                                {card.value}
                            </Typography>

                        </Paper>

                    </Grid>
                ))}

            </Grid>

        </Box>
    );
}

export default DashboardPage;