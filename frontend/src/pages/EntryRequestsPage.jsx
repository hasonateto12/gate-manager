import {
    useEffect,
    useState,
} from "react";

import {
    Alert,
    Box,
    Button,
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

import api from "../api/axios";

function EntryRequestsPage() {

    const [requests, setRequests] = useState([]);

    const [message, setMessage] = useState("");

    const [messageType, setMessageType] = useState("success");

    const loadRequests = async () => {
        try {
            const response = await api.get("/entry-requests");
            setRequests(response.data);
        } catch (error) {
            console.log(error);
            setMessage("שגיאה בטעינת בקשות כניסה");
            setMessageType("error");
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const handleApprove = async (id) => {
        try {
            await api.put(`/entry-requests/${id}/approve`);

            setMessage("הבקשה אושרה והרכב נוסף לרכבים המאושרים");
            setMessageType("success");

            loadRequests();
        } catch (error) {
            console.log(error);
            setMessage("שגיאה באישור הבקשה");
            setMessageType("error");
        }
    };

    const handleReject = async (id) => {
        try {
            await api.put(`/entry-requests/${id}/reject`);

            setMessage("הבקשה נדחתה והרכב נחסם");
            setMessageType("warning");

            loadRequests();
        } catch (error) {
            console.log(error);
            setMessage("שגיאה בדחיית הבקשה");
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

            {message && (
                <Alert
                    severity={messageType}
                    sx={{ mb: 3 }}
                >
                    {message}
                </Alert>
            )}

            <TableContainer component={Paper}>

                <Table>

                    <TableHead>
                        <TableRow>
                            <TableCell>מספר רכב</TableCell>
                            <TableCell>שם נהג</TableCell>
                            <TableCell>חברה</TableCell>
                            <TableCell>מטרת כניסה</TableCell>
                            <TableCell>זמן בקשה</TableCell>
                            <TableCell>סטטוס</TableCell>
                            <TableCell>פעולות</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>

                        {requests.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    אין בקשות ממתינות
                                </TableCell>
                            </TableRow>
                        )}

                        {requests.map((request) => (
                            <TableRow key={request.id}>

                                <TableCell>
                                    {request.plate_number}
                                </TableCell>

                                <TableCell>
                                    {request.driver_name}
                                </TableCell>

                                <TableCell>
                                    {request.company_name}
                                </TableCell>

                                <TableCell>
                                    {request.notes}
                                </TableCell>

                                <TableCell>
                                    {request.request_time
                                        ? new Date(request.request_time).toLocaleString()
                                        : "-"}
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
                                        sx={{ ml: 1 }}
                                        onClick={() => handleApprove(request.id)}
                                    >
                                        אשר
                                    </Button>

                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleReject(request.id)}
                                    >
                                        דחה
                                    </Button>
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