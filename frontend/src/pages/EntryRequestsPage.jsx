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


function EntryRequestsPage() {

    const [requests, setRequests] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");


    useEffect(() => {

        fetchRequests();

    }, []);


    const fetchRequests = async () => {

        try {

            setLoading(true);

            const response =
                await api.get("/entry-requests");

            setRequests(response.data);

        } catch (error) {

            console.error(error);

            setError("שגיאה בטעינת בקשות");

        } finally {

            setLoading(false);
        }
    };


    const getStatusChip = (status) => {

        if (status === "approved") {

            return (
                <Chip
                    label="מאושר"
                    color="success"
                />
            );
        }

        if (status === "pending") {

            return (
                <Chip
                    label="ממתין"
                    color="warning"
                />
            );
        }

        if (status === "rejected") {

            return (
                <Chip
                    label="נדחה"
                    color="error"
                />
            );
        }

        return (
            <Chip
                label={status}
            />
        );
    };


    const filteredRequests = requests.filter((request) => {

        const plate =
            request.plate_number?.toLowerCase() || "";

        const notes =
            request.notes?.toLowerCase() || "";

        return (

            plate.includes(search.toLowerCase()) ||

            notes.includes(search.toLowerCase())
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
                בקשות כניסה
            </Typography>


            <TextField
                fullWidth
                label="חיפוש בקשה"
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
                                תאריך בקשה
                            </TableCell>

                            <TableCell>
                                הערות
                            </TableCell>

                            <TableCell>
                                סטטוס
                            </TableCell>

                        </TableRow>

                    </TableHead>


                    <TableBody>

                        {filteredRequests.map((request) => (

                            <TableRow
                                key={request.id}
                            >

                                <TableCell>
                                    {request.id}
                                </TableCell>

                                <TableCell>
                                    {request.plate_number}
                                </TableCell>

                                <TableCell>

                                    {

                                        new Date(
                                            request.request_time
                                        ).toLocaleString("he-IL")
                                    }

                                </TableCell>

                                <TableCell>
                                    {request.notes}
                                </TableCell>

                                <TableCell>

                                    {getStatusChip(
                                        request.status
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

export default EntryRequestsPage;