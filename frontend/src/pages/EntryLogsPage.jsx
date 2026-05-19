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

import jsPDF from "jspdf";

import html2canvas from "html2canvas";


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


    // EXPORT PDF

    const handleExportPDF = async () => {

        const input =
            document.getElementById("logs-table");

        const canvas =
            await html2canvas(input);

        const imgData =
            canvas.toDataURL("image/png");

        const pdf =
            new jsPDF("l", "mm", "a4");

        const pdfWidth =
            pdf.internal.pageSize.getWidth();

        const pdfHeight =
            (canvas.height * pdfWidth)
            / canvas.width;

        pdf.addImage(

            imgData,

            "PNG",

            0,

            0,

            pdfWidth,

            pdfHeight
        );

        pdf.save("entry_logs_report.pdf");


        setSnackbar({

            open: true,

            message: "PDF נוצר בהצלחה",
        });
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

            {/* HEADER */}

            <Typography
                variant="h4"
                fontWeight="bold"
                mb={4}
            >
                לוג כניסות
            </Typography>


            {/* SEARCH */}

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


            {/* PDF BUTTON */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    mb: 3,
                }}
            >

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleExportPDF}
                >
                    ייצוא PDF
                </Button>

            </Box>


            {/* TABLE */}

            <TableContainer
                component={Paper}
                id="logs-table"
            >

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

export default EntryLogsPage;