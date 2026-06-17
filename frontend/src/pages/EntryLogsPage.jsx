import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

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
    const [quickFilter, setQuickFilter] = useState("all");
    const theme = useTheme();

    const isMobile =
        useMediaQuery(theme.breakpoints.down("md"));
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

        const today = new Date().toDateString();

        return {
            total: filteredLogs.length,

            inside: filteredLogs.filter(
                (l) => l.current_status === "inside"
            ).length,

            outside: filteredLogs.filter(
                (l) => l.current_status === "outside"
            ).length,

            todayEntries: filteredLogs.filter(
                (l) =>
                    l.entry_time &&
                    new Date(l.entry_time).toDateString() === today
            ).length,
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

    const applyQuickFilter = (type) => {
        const today = new Date();

        setQuickFilter(type);

        if (type === "all") {
            setFromDate("");
            setToDate("");
            return;
        }

        if (type === "today") {
            const date = today.toISOString().split("T")[0];

            setFromDate(date);
            setToDate(date);
        }

        if (type === "week") {
            const start = new Date(today);
            start.setDate(today.getDate() - 7);

            setFromDate(start.toISOString().split("T")[0]);
            setToDate(today.toISOString().split("T")[0]);
        }

        if (type === "month") {
            const start = new Date(today);
            start.setMonth(today.getMonth() - 1);

            setFromDate(start.toISOString().split("T")[0]);
            setToDate(today.toISOString().split("T")[0]);
        }
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
                direction={isMobile ? "column" : "row"}
                justifyContent="space-between"
                alignItems={isMobile ? "stretch" : "center"}
                spacing={2}
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

                <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    justifyContent={isMobile ? "center" : "flex-end"}
                >                    <Button
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
                <Grid item xs={6} md={3}>
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

                <Grid item xs={6} md={3}>
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

                <Grid item xs={6} md={3}>
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


            <Grid item xs={6} md={3}>
                <Card>
                    <CardContent>
                        <Typography color="text.secondary">
                            כניסות היום
                        </Typography>

                        <Typography
                            variant="h5"
                            fontWeight="bold"
                        >
                            {stats.todayEntries}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    סינון וחיפוש
                </Typography>

                <Stack
                    direction={isMobile ? "column" : "row"}
                    spacing={1}
                    mb={2}
                >
                    <Button
                        variant={quickFilter === "today" ? "contained" : "outlined"}
                        onClick={() => applyQuickFilter("today")}
                    >
                        היום
                    </Button>

                    <Button
                        variant={quickFilter === "week" ? "contained" : "outlined"}
                        onClick={() => applyQuickFilter("week")}
                    >
                        השבוע
                    </Button>

                    <Button
                        variant={quickFilter === "month" ? "contained" : "outlined"}
                        onClick={() => applyQuickFilter("month")}
                    >
                        החודש
                    </Button>

                    <Button
                        variant={quickFilter === "all" ? "contained" : "outlined"}
                        onClick={() => applyQuickFilter("all")}
                    >
                        הכל
                    </Button>
                </Stack>

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

                        isMobile ? (

                            <Stack spacing={2}>
                                {filteredLogs.length === 0 ? (

                                    <Alert severity="info">
                                        אין נתונים להצגה
                                    </Alert>

                                ) : (

                                    [...filteredLogs]
                                        .sort(
                                            (a, b) =>
                                                new Date(b.entry_time) -
                                                new Date(a.entry_time)
                                        )
                                        .map((log) => (

                                            <Card
                                                key={log.id}
                                                sx={{
                                                    borderRadius: 3,
                                                    backgroundColor:
                                                        log.current_status === "inside"
                                                            ? "#e8f5e9"
                                                            : "background.paper",
                                                    boxShadow: 3,
                                                }}
                                            >
                                                <CardContent>

                                                    <Stack
                                                        direction="row"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                        mb={2}
                                                    >
                                                        <Typography
                                                            variant="h6"
                                                            fontWeight="bold"
                                                        >
                                                            🚗 {log.plate_number || "-"}
                                                        </Typography>

                                                        {getStatusChip(log.current_status)}
                                                    </Stack>

                                                    <Divider sx={{ mb: 2 }} />

                                                    <Stack spacing={1}>
                                                        <Typography>
                                                            <strong>סוג רכב:</strong>{" "}
                                                            {log.vehicle_type || "-"}
                                                        </Typography>

                                                        <Typography>
                                                            <strong>שם נהג:</strong>{" "}
                                                            {log.driver_name || "-"}
                                                        </Typography>

                                                        <Typography>
                                                            <strong>חברה:</strong>{" "}
                                                            {log.company_name || "-"}
                                                        </Typography>

                                                        <Typography>
                                                            <strong>זמן כניסה:</strong>{" "}
                                                            {formatDateTime(log.entry_time)}
                                                        </Typography>

                                                        <Typography>
                                                            <strong>זמן יציאה:</strong>{" "}
                                                            {formatDateTime(log.exit_time)}
                                                        </Typography>

                                                        <Typography>
                                                            <strong>הערות:</strong>{" "}
                                                            {log.notes || "-"}
                                                        </Typography>
                                                    </Stack>

                                                </CardContent>
                                            </Card>
                                        ))
                                )}
                            </Stack>

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
                        )

                )}
            </Paper>
        </Box>
    );
}

export default EntryLogsPage;