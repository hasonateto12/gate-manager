import {
    useState,
} from "react";

import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    Alert,
    Chip,
} from "@mui/material";

import {
    checkVehicle,
} from "../api/vehicleCheckApi";

function GuardPage() {

    const [plateNumber, setPlateNumber] = useState("");

    const [vehicleData, setVehicleData] = useState(null);

    const [message, setMessage] = useState("");

    const [messageType, setMessageType] = useState("info");

    /* =========================
       CHECK VEHICLE
    ========================= */
    const handleCheckVehicle = async () => {

        try {

            setMessage("");

            const data = await checkVehicle(
                plateNumber
            );

            // NOT EXISTS
            if (!data.exists) {

                setVehicleData(null);

                setMessage(
                    "הרכב לא קיים במערכת"
                );

                setMessageType("warning");

                return;
            }

            setVehicleData(data.vehicle);

            // APPROVED
            if (
                data.vehicle.status === "approved"
            ) {

                setMessage(
                    "הרכב מאושר לכניסה"
                );

                setMessageType("success");
            }

            // REJECTED
            else {

                setMessage(
                    "הרכב חסום"
                );

                setMessageType("error");
            }

        } catch (error) {

            console.error(error);

            setMessage(
                "שגיאה בבדיקת רכב"
            );

            setMessageType("error");
        }
    };

    return (

        <Box
            sx={{
                p: 4,
            }}
        >

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
                        onClick={handleCheckVehicle}
                    >
                        בדוק
                    </Button>

                </Box>

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

                                {vehicleData.plate_number}
                            </Typography>

                            <Typography>
                                <strong>
                                    נהג:
                                </strong>

                                {" "}

                                {vehicleData.driver_name}
                            </Typography>

                            <Typography>
                                <strong>
                                    חברה:
                                </strong>

                                {" "}

                                {vehicleData.company}
                            </Typography>

                            <Typography
                                sx={{ mt: 2 }}
                            >
                                <strong>
                                    סטטוס:
                                </strong>
                            </Typography>

                            <Chip
                                label={
                                    vehicleData.status
                                    === "approved"
                                        ? "מאושר"
                                        : "חסום"
                                }
                                color={
                                    vehicleData.status
                                    === "approved"
                                        ? "success"
                                        : "error"
                                }
                                sx={{ mt: 1 }}
                            />

                        </Paper>
                    )
                }

            </Paper>

        </Box>
    );
}

export default GuardPage;