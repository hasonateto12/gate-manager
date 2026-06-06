import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    MenuItem,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import PrintIcon from "@mui/icons-material/Print";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

function EntryLogsPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const fetchLogs = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await api.get("/entry-logs");
            setLogs(res.data || []);
        } catch (err) {
            console.error(err);
            setError("שגיאה בטעינת לוג הכניסות");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const formatDateTime = (value) => {
        if (!value) return "-";
        return new Date(value).toLocaleString("he-IL", {
            dateStyle: "short",
            timeStyle: "short",
        });
    };

    const filteredLogs = useMemo(() => {
        return logs.filter((log) => {
            const text = `${log.plate_number || ""} ${log.driver_name || ""} ${
                log.company_name || ""
            } ${log.vehicle_type || ""} ${log.notes || ""}`.toLowerCase();

            const matchesSearch = text.includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === "all" || log.current_status === statusFilter;

            const entryDate = log.entry_time ? new Date(log.entry_time) : null;

            const matchesFrom =
                !fromDate || (entryDate && entryDate >= new Date(fromDate));

            const matchesTo =
                !toDate ||
                (entryDate &&
                    entryDate <= new Date(new Date(toDate).setHours(23, 59, 59, 999)));

            return matchesSearch && matchesStatus && matchesFrom && matchesTo;
        });
    }, [logs, search, statusFilter, fromDate, toDate]);

    const stats = useMemo(() => {
        return {
            total: filteredLogs.length,
            inside: filteredLogs.filter((l) => l.current_status === "inside").length,
            outside: filteredLogs.filter((l) => l.current_status === "outside").length,
        };
    }, [filteredLogs]);

    const getStatusChip = (status) => {
        if (status === "inside") {
            return <Chip label="בפנים" color="success" size="small" />;
        }

        if (status === "outside") {
            return <Chip label="יצא" color="default" size="small" />;
        }

        return <Chip label={status || "-"} size="small" />;
    };

    const handlePrint = () => {
        window.print();
    };

    const clearFilters = () => {
        setSearch("");
        setStatusFilter("all");
        setFromDate("");
        setToDate("");
    };


    const exportPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Gate Manager - Entry Logs Report", 14, 20);

        doc.setFontSize(11);
        doc.text(
            `Generated: ${new Date().toLocaleString()}`,
            14,
            30
        );

        doc.text(`Total Logs: ${stats.total}`, 14, 40);
        doc.text(`Inside: ${stats.inside}`, 14, 48);
        doc.text(`Outside: ${stats.outside}`, 14, 56);

        autoTable(doc, {
            startY: 70,
            head: [[
                "Plate",
                "Driver",
                "Company",
                "Entry",
                "Exit",
                "Status"
            ]],
            body: filteredLogs.map((log) => [
                log.plate_number || "",
                log.driver_name || "",
                log.company_name || "",
                formatDateTime(log.entry_time),
                formatDateTime(log.exit_time),
                log.current_status || ""
            ]),
        });

        doc.save("entry-logs-report.pdf");
    };



    return (
        <Box>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Box>
                    <Typography variant="h4" fontWeight="bold">
                        לוג כניסות ויציאות
                    </Typography>
                    <Typography color="text.secondary">
                        מעקב מלא אחרי רכבים שנכנסו ויצאו מהמפעל
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={fetchLogs}
                    >
                        רענון
                    </Button>

                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={clearFilters}
                    >
                        איפוס סינון
                    </Button>

                    <Button
                        variant="contained"
                        color="success"
                        onClick={exportPDF}
                    >
                        ייצוא PDF
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<PrintIcon />}
                        onClick={handlePrint}
                    >
                        הדפס / PDF
                    </Button>
                </Stack>
            </Stack>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={2} mb={3}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <DirectionsCarIcon color="primary" />
                                <Box>
                                    <Typography color="text.secondary">סה״כ רשומות</Typography>
                                    <Typography variant="h5" fontWeight="bold">
                                        {stats.total}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <LoginIcon color="success" />
                                <Box>
                                    <Typography color="text.secondary">רכבים בפנים</Typography>
                                    <Typography variant="h5" fontWeight="bold">
                                        {stats.inside}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <LogoutIcon color="action" />
                                <Box>
                                    <Typography color="text.secondary">רכבים שיצאו</Typography>
                                    <Typography variant="h5" fontWeight="bold">
                                        {stats.outside}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    סינון וחיפוש
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="חיפוש לפי מספר רכב / נהג / חברה"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} md={2}>
                        <TextField
                            fullWidth
                            select
                            label="סטטוס"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <MenuItem value="all">הכל</MenuItem>
                            <MenuItem value="inside">בפנים</MenuItem>
                            <MenuItem value="outside">יצא</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            type="date"
                            label="מתאריך"
                            InputLabelProps={{ shrink: true }}
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            type="date"
                            label="עד תאריך"
                            InputLabelProps={{ shrink: true }}
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{ p: 2 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    רשימת כניסות ויציאות
                </Typography>

                <Divider sx={{ mb: 2 }} />

                {loading ? (
                    <Box display="flex" justifyContent="center" p={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>מספר רכב</TableCell>
                                    <TableCell>סוג רכב</TableCell>
                                    <TableCell>שם נהג</TableCell>
                                    <TableCell>חברה</TableCell>
                                    <TableCell>זמן כניסה</TableCell>
                                    <TableCell>זמן יציאה</TableCell>
                                    <TableCell>סטטוס</TableCell>
                                    <TableCell>הערות</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {filteredLogs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            אין נתונים להצגה
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    [...filteredLogs]
                                        .sort(
                                            (a, b) =>
                                                new Date(b.entry_time) -
                                                new Date(a.entry_time)
                                        )
                                        .map((log) => (
                                            <TableRow
                                                key={log.id}
                                                hover
                                                sx={{
                                                    backgroundColor:
                                                        log.current_status === "inside"
                                                            ? "#e8f5e9"
                                                            : "inherit",
                                                }}
                                            >
                                            <TableCell>{log.plate_number || "-"}</TableCell>
                                            <TableCell>{log.vehicle_type || "-"}</TableCell>
                                            <TableCell>{log.driver_name || "-"}</TableCell>
                                            <TableCell>{log.company_name || "-"}</TableCell>
                                            <TableCell>{formatDateTime(log.entry_time)}</TableCell>
                                            <TableCell>{formatDateTime(log.exit_time)}</TableCell>
                                            <TableCell>{getStatusChip(log.current_status)}</TableCell>
                                            <TableCell>{log.notes || "-"}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
        </Box>
    );
}

export default EntryLogsPage;