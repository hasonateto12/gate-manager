import {
    useEffect,
    useState,
} from "react";

import {
    Alert,
    Box,
    Button,
    Chip,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";

import {
    checkVehicle,
    createEntryRequest,
} from "../api/vehicleCheckApi";

import api from "../api/axios";

export default function GuardPage() {

    const [plateNumber, setPlateNumber] =
        useState("");

    const [vehicleData, setVehicleData] =
        useState(null);

    const [message, setMessage] =
        useState("");

    const [messageType, setMessageType] =
        useState("info");

    const [notes, setNotes] =
        useState("");

    const [insideVehicles, setInsideVehicles] =
        useState([]);

    // NEW VEHICLE
    const [driverName, setDriverName] =
        useState("");

    const [companyName, setCompanyName] =
        useState("");

    const [vehicleType, setVehicleType] =
        useState("");

    const [newVehicleMode, setNewVehicleMode] =
        useState(false);

    /* =========================
       LOAD INSIDE VEHICLES
    ========================= */
    const loadInsideVehicles = async () => {

        try {

            const response =
                await api.get(
                    "/entry-logs/inside"
                );

            setInsideVehicles(
                response.data
            );

        } catch (error) {

            console.log(error);
        }
    };

    useEffect(() => {

        loadInsideVehicles();

    }, []);

    /* =========================
       CHECK VEHICLE
    ========================= */
    const handleCheckVehicle = async () => {

        try {

            setMessage("");

            setVehicleData(null);

            setNewVehicleMode(false);

            const data =
                await checkVehicle(
                    plateNumber
                );

            // NOT EXISTS
            if (!data.exists) {

                setMessage(
                    "הרכב לא קיים במערכת"
                );

                setMessageType(
                    "warning"
                );

                setNewVehicleMode(true);

                return;
            }

            setVehicleData(
                data.vehicle
            );

            if (
                data.vehicle.status ===
                "approved"
            ) {

                setMessage(
                    "הרכב מאושר לכניסה"
                );

                setMessageType(
                    "success"
                );
            }

            else {

                setMessage(
                    "הרכב חסום"
                );

                setMessageType(
                    "error"
                );
            }

        } catch (error) {

            console.log(error);

            setMessage(
                "שגיאה בבדיקת רכב"
            );

            setMessageType(
                "error"
            );
        }
    };

    /* =========================
       CREATE ENTRY
    ========================= */
    const handleVehicleEntry =
        async () => {

            try {

                await api.post(
                    "/entry-logs",
                    {
                        vehicle_id:
                        vehicleData.id,

                        notes,
                    }
                );

                setMessage(
                    "הרכב נכנס למפעל"
                );

                setMessageType(
                    "success"
                );

                setNotes("");

                setPlateNumber("");

                setVehicleData(null);

                loadInsideVehicles();

            } catch (error) {

                console.log(error);

                setMessage(
                    "שגיאה ביצירת כניסה"
                );

                setMessageType(
                    "error"
                );
            }
        };

    /* =========================
       VEHICLE EXIT
    ========================= */
    const handleVehicleExit =
        async (logId) => {

            try {

                await api.put(
                    `/entry-logs/${logId}/exit`
                );

                setMessage(
                    "הרכב יצא מהמפעל"
                );

                setMessageType(
                    "success"
                );

                loadInsideVehicles();

            } catch (error) {

                console.log(error);

                setMessage(
                    "שגיאה ביציאת רכב"
                );

                setMessageType(
                    "error"
                );
            }
        };

    /* =========================
       CREATE NEW REQUEST
    ========================= */
    const handleCreateRequest =
        async () => {

            try {

                await createEntryRequest({
                    plate_number: plateNumber,
                    driver_name: driverName,
                    company_name: companyName,
                    vehicle_type: vehicleType,
                    notes,
                });

                setMessage(
                    "בקשה נשלחה למנהל"
                );

                setMessageType(
                    "success"
                );

                setNewVehicleMode(false);

                setDriverName("");

                setCompanyName("");

                setVehicleType("");

                setNotes("");

                setPlateNumber("");

                loadInsideVehicles();

            } catch (error) {

                console.log(error);

                setMessage(
                    "שגיאה בשליחת בקשה"
                );

                setMessageType(
                    "error"
                );
            }
        };




    return (

        <Box sx={{ p: 4 }}>

            <Typography
                variant="h4"
                fontWeight="bold"
                mb={4}
            >
                מערכת שומרים 🔐
            </Typography>

            <Paper
                sx={{
                    p: 4,
                    borderRadius: 3,
                    mb: 4,
                }}
            >

                <Typography
                    variant="h6"
                    mb={3}
                >
                    בדיקת רכב
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        mb: 3,
                    }}
                >

                    <TextField
                        fullWidth
                        label="מספר רכב"
                        value={plateNumber}
                        onChange={(e) =>
                            setPlateNumber(
                                e.target.value
                            )
                        }
                    />

                    <Button
                        variant="contained"
                        onClick={
                            handleCheckVehicle
                        }
                    >
                        בדוק
                    </Button>

                </Box>

                {

                    message && (

                        <Alert
                            severity={
                                messageType
                            }
                            sx={{ mb: 3 }}
                        >
                            {message}
                        </Alert>
                    )
                }

                {/* APPROVED VEHICLE */}

                {

                    vehicleData && (

                        <Paper
                            variant="outlined"
                            sx={{
                                p: 3,
                                mt: 2,
                            }}
                        >

                            <Typography>
                                <strong>
                                    מספר רכב:
                                </strong>

                                {" "}

                                {
                                    vehicleData.plate_number
                                }
                            </Typography>

                            <Typography>
                                <strong>
                                    נהג:
                                </strong>

                                {" "}

                                {
                                    vehicleData.driver_name
                                }
                            </Typography>

                            <Typography>
                                <strong>
                                    חברה:
                                </strong>

                                {" "}

                                {
                                    vehicleData.company_name
                                }
                            </Typography>

                            <Typography
                                sx={{ mt: 2 }}
                            >
                                <strong>
                                    סטטוס:
                                </strong>
                            </Typography>

                            <Chip
                                label="מאושר"
                                color="success"
                                sx={{ mt: 1 }}
                            />

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="מטרת כניסה"
                                value={notes}
                                onChange={(e) =>
                                    setNotes(
                                        e.target.value
                                    )
                                }
                                sx={{ mt: 3 }}
                            />

                            <Button
                                variant="contained"
                                color="success"
                                sx={{ mt: 3 }}
                                onClick={
                                    handleVehicleEntry
                                }
                            >
                                כניסה למפעל
                            </Button>

                        </Paper>
                    )
                }

                {/* NEW VEHICLE REQUEST */}

                {

                    newVehicleMode && (

                        <Paper
                            sx={{
                                p: 3,
                                mt: 3,
                                backgroundColor:
                                    "#fff8e1",
                            }}
                        >

                            <Typography
                                variant="h6"
                                mb={3}
                            >
                                רכב חדש - בקשת אישור
                            </Typography>


                            <TextField
                                select
                                fullWidth
                                label="סוג רכב"
                                value={vehicleType}
                                onChange={(e) =>
                                    setVehicleType(e.target.value)
                                }
                                sx={{ mb: 2 }}
                            >
                                <MenuItem value="רכב פרטי">
                                    רכב פרטי
                                </MenuItem>

                                <MenuItem value="משאית">
                                    משאית
                                </MenuItem>

                                <MenuItem value="טנדר">
                                    טנדר
                                </MenuItem>

                                <MenuItem value="אופנוע">
                                    אופנוע
                                </MenuItem>

                            </TextField>

                            <TextField
                                fullWidth
                                label="שם נהג"
                                value={driverName}
                                onChange={(e) =>
                                    setDriverName(
                                        e.target.value
                                    )
                                }
                                sx={{ mb: 2 }}
                            />

                            <TextField
                                fullWidth
                                label="חברה"
                                value={companyName}
                                onChange={(e) =>
                                    setCompanyName(
                                        e.target.value
                                    )
                                }
                                sx={{ mb: 2 }}
                            />

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="מטרת כניסה"
                                value={notes}
                                onChange={(e) =>
                                    setNotes(
                                        e.target.value
                                    )
                                }
                                sx={{ mb: 2 }}
                            />

                            <Button
                                variant="contained"
                                color="warning"
                                onClick={
                                    handleCreateRequest
                                }
                            >
                                שלח בקשת אישור
                            </Button>

                        </Paper>
                    )
                }

            </Paper>

            {/* INSIDE VEHICLES */}

            <Paper
                sx={{
                    p: 3,
                    borderRadius: 3,
                }}
            >

                <Typography
                    variant="h5"
                    mb={3}
                    fontWeight="bold"
                >
                    רכבים בתוך המפעל
                </Typography>

                <TableContainer>

                    <Table>

                        <TableHead>

                            <TableRow>

                                <TableCell>
                                    מספר רכב
                                </TableCell>

                                <TableCell>
                                    סוג רכב
                                </TableCell>

                                <TableCell>
                                    נהג
                                </TableCell>

                                <TableCell>
                                    חברה
                                </TableCell>

                                <TableCell>
                                    שעת כניסה
                                </TableCell>

                                <TableCell>
                                    הערות
                                </TableCell>

                                <TableCell>
                                    פעולות
                                </TableCell>

                            </TableRow>

                        </TableHead>

                        <TableBody>

                            {

                                insideVehicles.map(
                                    (vehicle) => (

                                        <TableRow
                                            key={
                                                vehicle.id
                                            }
                                        >

                                            <TableCell>
                                                {
                                                    vehicle.plate_number
                                                }
                                            </TableCell>

                                            <TableCell>
                                                {vehicle.vehicle_type || "-"}
                                            </TableCell>

                                            <TableCell>
                                                {
                                                    vehicle.driver_name
                                                }
                                            </TableCell>

                                            <TableCell>
                                                {
                                                    vehicle.company_name
                                                }
                                            </TableCell>

                                            <TableCell>
                                                {
                                                    new Date(
                                                        vehicle.entry_time
                                                    ).toLocaleString()
                                                }
                                            </TableCell>

                                            <TableCell>
                                                {
                                                    vehicle.notes
                                                }
                                            </TableCell>

                                            <TableCell>

                                                <Button
                                                    variant="contained"
                                                    color="warning"
                                                    onClick={() =>
                                                        handleVehicleExit(
                                                            vehicle.id
                                                        )
                                                    }
                                                >
                                                    יציאה
                                                </Button>

                                            </TableCell>

                                        </TableRow>
                                    ))
                            }

                        </TableBody>

                    </Table>

                </TableContainer>

            </Paper>

        </Box>
    );
}