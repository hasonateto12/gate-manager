import {

    useEffect,
    useState,

} from "react";

import api from "../api/axios";

import {

    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Alert,
    Box,
    TextField,
    Chip,

} from "@mui/material";


function VehiclesPage() {

    const [vehicles, setVehicles] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");


    useEffect(() => {

        fetchVehicles();

    }, []);


    const fetchVehicles = async () => {

        try {

            setLoading(true);

            const response =
                await api.get("/vehicles");

            setVehicles(response.data);

        } catch (error) {

            console.error(error);

            setError("שגיאה בטעינת רכבים");

        } finally {

            setLoading(false);
        }
    };


    const filteredVehicles = vehicles.filter((vehicle) => {

        const plate =
            vehicle.plate_number?.toLowerCase() || "";

        const employee =
            vehicle.employee_name?.toLowerCase() || "";

        return (

            plate.includes(search.toLowerCase()) ||

            employee.includes(search.toLowerCase())
        );
    });


    // LOADING

    if (loading) {

        return (

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 5,
                }}
            >

                <CircularProgress />

            </Box>
        );
    }


    // ERROR

    if (error) {

        return (

            <Alert severity="error">

                {error}

            </Alert>
        );
    }


    return (

        <Box>

            <Typography
                variant="h4"
                mb={4}
                fontWeight="bold"
            >
                רכבים
            </Typography>


            <TextField
                fullWidth
                label="חיפוש רכב"
                variant="outlined"
                sx={{ mb: 3 }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />


            <TableContainer component={Paper}>

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>
                                מזהה
                            </TableCell>

                            <TableCell>
                                מספר רכב
                            </TableCell>

                            <TableCell>
                                סוג רכב
                            </TableCell>

                            <TableCell>
                                צבע
                            </TableCell>

                            <TableCell>
                                עובד
                            </TableCell>

                            <TableCell>
                                סטטוס
                            </TableCell>

                        </TableRow>

                    </TableHead>


                    <TableBody>

                        {filteredVehicles.map((vehicle) => (

                            <TableRow
                                key={vehicle.id}
                            >

                                <TableCell>
                                    {vehicle.id}
                                </TableCell>

                                <TableCell>
                                    {vehicle.plate_number}
                                </TableCell>

                                <TableCell>
                                    {vehicle.vehicle_type}
                                </TableCell>

                                <TableCell>
                                    {vehicle.color}
                                </TableCell>

                                <TableCell>
                                    {vehicle.employee_name || "-"}
                                </TableCell>

                                <TableCell>

                                    {

                                        vehicle.status === "approved"

                                            ? (

                                                <Chip
                                                    label="מאושר"
                                                    color="success"
                                                />
                                            )

                                            : vehicle.status === "pending"

                                                ? (

                                                    <Chip
                                                        label="ממתין"
                                                        color="warning"
                                                    />
                                                )

                                                : vehicle.status === "rejected"

                                                    ? (

                                                        <Chip
                                                            label="נדחה"
                                                            color="error"
                                                        />
                                                    )

                                                    : (

                                                        <Chip
                                                            label={vehicle.status}
                                                        />
                                                    )
                                    }

                                </TableCell>

                            </TableRow>
                        ))}

                    </TableBody>

                </Table>

            </TableContainer>

        </Box>
    );
}

export default VehiclesPage;