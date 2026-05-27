import {
    useEffect,
    useState,
} from "react";

import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    Alert,
} from "@mui/material";

import api from "../api/axios";

function EntryRequestsPage() {

    const [requests, setRequests] = useState([]);

    const [message, setMessage] = useState("");

    const [messageType, setMessageType] =
        useState("success");

    /* =========================
       LOAD REQUESTS
    ========================= */
    const loadRequests = async () => {

        try {

            const response =
                await api.get(
                    "/entry-requests"
                );

            setRequests(response.data);

        } catch (error) {

            console.log(error);

            setMessage(
                "שגיאה בטעינת בקשות"
            );

            setMessageType("error");
        }
    };

    useEffect(() => {

        loadRequests();

    }, []);

    /* =========================
       APPROVE
    ========================= */
    const handleApprove = async (id) => {

        try {

            await api.put(
                `/entry-requests/${id}/approve`
            );

            setMessage(
                "בקשה אושרה בהצלחה"
            );

            setMessageType("success");

            loadRequests();

        } catch (error) {

            console.log(error);

            setMessage(
                "שגיאה באישור בקשה"
            );

            setMessageType("error");
        }
    };

    /* =========================
       REJECT
    ========================= */
    const handleReject = async (id) => {

        try {

            await api.put(
                `/entry-requests/${id}/reject`
            );

            setMessage(
                "בקשה נדחתה"
            );

            setMessageType("warning");

            loadRequests();

        } catch (error) {

            console.log(error);

            setMessage(
                "שגיאה בדחיית בקשה"
            );

            setMessageType("error");
        }
    };

    return (

        <Box sx={{ p: 4 }}>

            <Typography
                variant="h4"
                fontWeight="bold"
                mb={4}
            >
                בקשות כניסה
            </Typography>

            {

                message && (

                    <Alert
                        severity={messageType}
                        sx={{ mb: 3 }}
                    >
                        {message}
                    </Alert>
                )
            }

            <TableContainer
                component={Paper}
            >

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>
                                מספר רכב
                            </TableCell>

                            <TableCell>
                                נהג
                            </TableCell>

                            <TableCell>
                                חברה
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

                        {

                            requests.map((request) => (

                                <TableRow
                                    key={request.id}
                                >

                                    <TableCell>
                                        {
                                            request.plate_number
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {
                                            request.driver_name
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {
                                            request.company_name
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {
                                            request.notes
                                        }
                                    </TableCell>

                                    <TableCell>

                                        <Chip
                                            label="ממתין"
                                            color="warning"
                                        />

                                    </TableCell>

                                    <TableCell>

                                        <Button
                                            variant="contained"
                                            color="success"
                                            sx={{ mr: 1 }}
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
                                            onClick={() =>
                                                handleReject(
                                                    request.id
                                                )
                                            }
                                        >
                                            דחה
                                        </Button>

                                    </TableCell>

                                </TableRow>
                            ))
                        }

                    </TableBody>

                </Table>

            </TableContainer>

        </Box>
    );
}

export default EntryRequestsPage;