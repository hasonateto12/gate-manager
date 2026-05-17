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
    Stack,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,

} from "@mui/material";


function EntryRequestsPage() {

    const [requests, setRequests] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [snackbar, setSnackbar] = useState({

        open: false,
        message: "",
    });


    // REJECT DIALOG

    const [openRejectDialog, setOpenRejectDialog] =
        useState(false);

    const [selectedRequest, setSelectedRequest] =
        useState(null);

    const [rejectionReason, setRejectionReason] =
        useState("");


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


    // STATUS CHIP

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


    // APPROVE

    const handleApprove = async (requestId) => {

        try {

            await api.put(

                `/entry-requests/${requestId}/status`,

                {
                    status: "approved",
                }
            );

            await fetchRequests();

            setSnackbar({

                open: true,
                message: "הבקשה אושרה",
            });

        } catch (error) {

            console.error(error);

            setSnackbar({

                open: true,
                message: "שגיאה באישור בקשה",
            });
        }
    };


    // REJECT

    const handleOpenRejectDialog = (request) => {

        setSelectedRequest(request);

        setOpenRejectDialog(true);
    };


    const handleReject = async () => {

        try {

            await api.put(

                `/entry-requests/${selectedRequest.id}/status`,

                {
                    status: "rejected",

                    rejection_reason:
                    rejectionReason,
                }
            );

            await fetchRequests();

            setSnackbar({

                open: true,
                message: "הבקשה נדחתה",
            });

            setOpenRejectDialog(false);

            setRejectionReason("");

        } catch (error) {

            console.error(error);

            setSnackbar({

                open: true,
                message: "שגיאה בדחיית בקשה",
            });
        }
    };


    // SEARCH

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

                            <TableCell>
                                פעולות
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


                                <TableCell>

                                    {

                                        request.status === "pending" && (

                                            <Stack
                                                direction="row"
                                                spacing={1}
                                            >

                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    onClick={() =>
                                                        handleApprove(
                                                            request.id
                                                        )
                                                    }
                                                >
                                                    אשר
                                                </Button>


                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    onClick={() =>
                                                        handleOpenRejectDialog(
                                                            request
                                                        )
                                                    }
                                                >
                                                    דחה
                                                </Button>

                                            </Stack>
                                        )
                                    }

                                </TableCell>

                            </TableRow>
                        ))}

                    </TableBody>

                </Table>

            </TableContainer>


            {/* REJECT DIALOG */}

            <Dialog
                open={openRejectDialog}
                onClose={() =>
                    setOpenRejectDialog(false)
                }
                fullWidth
            >

                <DialogTitle>

                    דחיית בקשה

                </DialogTitle>


                <DialogContent>

                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                        label="סיבת דחייה"
                        value={rejectionReason}
                        onChange={(e) =>
                            setRejectionReason(
                                e.target.value
                            )
                        }
                    />

                </DialogContent>


                <DialogActions>

                    <Button
                        onClick={() =>
                            setOpenRejectDialog(false)
                        }
                    >
                        ביטול
                    </Button>


                    <Button
                        color="error"
                        variant="contained"
                        onClick={handleReject}
                    >
                        דחה בקשה
                    </Button>

                </DialogActions>

            </Dialog>


            {/* SNACKBAR */}

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

export default EntryRequestsPage;