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


function EntryLogsPage() {

    const [logs, setLogs] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");


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

                            </TableRow>
                        ))}

                    </TableBody>

                </Table>

            </TableContainer>

        </Box>
    );
}

export default EntryLogsPage;