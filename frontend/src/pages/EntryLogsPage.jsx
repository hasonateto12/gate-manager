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
    Button,
    Snackbar,

} from "@mui/material";


function EntryLogsPage() {

    const [logs, setLogs] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [snackbar, setSnackbar] = useState({

        open: false,
        message: "",
    });


    useEffect(() => {

        fetchLogs();

    }, []);


    const fetchLogs = async () => {

        try {

            setLoading(true);

            const response =
                await api.get("/entry-logs");

            setLogs(response.data);

        } catch (error) {

            console.error(error);

            setError("שגיאה בטעינת לוגים");

        } finally {

            setLoading(false);
        }
    };


    // VEHICLE EXIT

    const handleVehicleExit = async (logId) => {

        try {

            await api.put(
                `/entry-logs/${logId}/exit`
            );

            await fetchLogs();

            setSnackbar({

                open: true,
                message: "הרכב יצא בהצלחה",
            });

        } catch (error) {

            console.error(error);

            setSnackbar({

                open: true,
                message: "שגיאה בעדכון יציאה",
            });
        }
    };


    // STATUS CHIP

    const getResultChip = (result) => {

        if (result === "approved") {

            return (
                <Chip
                    label="אושר"
                    color="success"
                />
            );
        }

        if (result === "rejected") {

            return (
                <Chip
                    label="נדחה"
                    color="error"
                />
            );
        }

        return (
            <Chip
                label={result}
            />
        );
    };


    // SEARCH

    const filteredLogs = logs.filter((log) => {

        const plate =
            log.plate_number?.toLowerCase() || "";

        const employee =
            log.full_name?.toLowerCase() || "";

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
                fontWeight="bold"
                mb={4}
            >
                לוג כניסות
            </Typography>


            <TextField
                fullWidth
                label="חיפוש לפי עובד או רכב"
                variant="outlined"
                sx={{ mb: 3 }}
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
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
                                עובד
                            </TableCell>

                            <TableCell>
                                זמן כניסה
                            </TableCell>

                            <TableCell>
                                זמן יציאה
                            </TableCell>

                            <TableCell>
                                הערות
                            </TableCell>

                            <TableCell>
                                תוצאה
                            </TableCell>

                            <TableCell>
                                פעולות
                            </TableCell>

                        </TableRow>

                    </TableHead>


                    <TableBody>

                        {filteredLogs.map((log) => (

                            <TableRow
                                key={log.id}
                            >

                                <TableCell>
                                    {log.id}
                                </TableCell>

                                <TableCell>
                                    {log.plate_number}
                                </TableCell>

                                <TableCell>
                                    {log.full_name}
                                </TableCell>

                                <TableCell>

                                    {

                                        new Date(
                                            log.entry_time
                                        ).toLocaleString("he-IL")
                                    }

                                </TableCell>


                                <TableCell>

                                    {

                                        log.exit_time

                                            ?

                                            new Date(
                                                log.exit_time
                                            ).toLocaleString("he-IL")

                                            :

                                            "-"
                                    }

                                </TableCell>


                                <TableCell>
                                    {log.notes}
                                </TableCell>


                                <TableCell>

                                    {getResultChip(
                                        log.result
                                    )}

                                </TableCell>


                                <TableCell>

                                    {

                                        !log.exit_time && (

                                            <Button
                                                variant="contained"
                                                color="warning"
                                                size="small"
                                                onClick={() =>
                                                    handleVehicleExit(log.id)
                                                }
                                            >
                                                יציאה
                                            </Button>
                                        )
                                    }

                                </TableCell>

                            </TableRow>
                        ))}

                    </TableBody>

                </Table>

            </TableContainer>


            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                message={snackbar.message}
                onClose={() =>
                    setSnackbar({
                        ...snackbar,
                        open: false,
                    })
                }
            />

        </Box>
    );
}

export default EntryLogsPage;