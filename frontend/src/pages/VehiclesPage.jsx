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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    MenuItem,
    Stack,

} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";


function VehiclesPage() {

    const [vehicles, setVehicles] = useState([]);

    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");


    // ADD STATES

    const [openAddDialog, setOpenAddDialog] =
        useState(false);

    const [snackbar, setSnackbar] = useState({

        open: false,
        message: "",
    });

    const [addForm, setAddForm] = useState({

        plate_number: "",
        vehicle_type: "",
        color: "",
        employee_id: "",
        status: "pending",
    });


    useEffect(() => {

        fetchVehicles();

        fetchEmployees();

    }, []);


    const fetchVehicles = async () => {

        try {

            setLoading(true);

            const response =
                await api.get("/vehicles");

            setVehicles(response.data);

        } catch (error) {

            console.error(error);

            setError("שגיאה בטעינת רכבים");

        } finally {

            setLoading(false);
        }
    };


    const fetchEmployees = async () => {

        try {

            const response =
                await api.get("/employees");

            setEmployees(response.data);

        } catch (error) {

            console.error(error);
        }
    };


    // ADD VEHICLE

    const handleAddChange = (e) => {

        setAddForm({

            ...addForm,

            [e.target.name]: e.target.value,
        });
    };


    const handleAddVehicle = async () => {

        try {

            await api.post(
                "/vehicles",
                addForm
            );

            await fetchVehicles();

            setSnackbar({

                open: true,
                message: "הרכב נוסף בהצלחה",
            });

            setOpenAddDialog(false);

            setAddForm({

                plate_number: "",
                vehicle_type: "",
                color: "",
                employee_id: "",
                status: "pending",
            });

        } catch (error) {

            console.error(error);

            setSnackbar({

                open: true,
                message: "שגיאה בהוספת רכב",
            });
        }
    };


    // SEARCH

    const filteredVehicles = vehicles.filter((vehicle) => {

        const plate =
            vehicle.plate_number?.toLowerCase() || "";

        const employee =
            vehicle.employee_name?.toLowerCase() || "";

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

            <Box
                sx={{

                    display: "flex",

                    justifyContent: "space-between",

                    alignItems: "center",

                    mb: 4,
                }}
            >

                <Typography
                    variant="h4"
                    fontWeight="bold"
                >
                    רכבים
                </Typography>


                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() =>
                        setOpenAddDialog(true)
                    }
                    sx={{
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                    }}
                >
                    הוסף רכב
                </Button>

            </Box>


            <TextField
                fullWidth
                label="חיפוש רכב"
                variant="outlined"
                sx={{ mb: 3 }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                                סוג רכב
                            </TableCell>

                            <TableCell>
                                צבע
                            </TableCell>

                            <TableCell>
                                עובד
                            </TableCell>

                            <TableCell>
                                סטטוס
                            </TableCell>

                        </TableRow>

                    </TableHead>


                    <TableBody>

                        {filteredVehicles.map((vehicle) => (

                            <TableRow
                                key={vehicle.id}
                            >

                                <TableCell>
                                    {vehicle.id}
                                </TableCell>

                                <TableCell>
                                    {vehicle.plate_number}
                                </TableCell>

                                <TableCell>
                                    {vehicle.vehicle_type}
                                </TableCell>

                                <TableCell>
                                    {vehicle.color}
                                </TableCell>

                                <TableCell>
                                    {vehicle.employee_name || "-"}
                                </TableCell>

                                <TableCell>

                                    {

                                        vehicle.status === "approved"

                                            ? (

                                                <Chip
                                                    label="מאושר"
                                                    color="success"
                                                />
                                            )

                                            : vehicle.status === "pending"

                                                ? (

                                                    <Chip
                                                        label="ממתין"
                                                        color="warning"
                                                    />
                                                )

                                                : vehicle.status === "rejected"

                                                    ? (

                                                        <Chip
                                                            label="נדחה"
                                                            color="error"
                                                        />
                                                    )

                                                    : (

                                                        <Chip
                                                            label={vehicle.status}
                                                        />
                                                    )
                                    }

                                </TableCell>

                            </TableRow>
                        ))}

                    </TableBody>

                </Table>

            </TableContainer>


            {/* ADD DIALOG */}

            <Dialog
                open={openAddDialog}
                onClose={() =>
                    setOpenAddDialog(false)
                }
                fullWidth
            >

                <DialogTitle>

                    הוספת רכב

                </DialogTitle>


                <DialogContent>

                    <TextField
                        fullWidth
                        margin="normal"
                        label="מספר רכב"
                        name="plate_number"
                        value={addForm.plate_number}
                        onChange={handleAddChange}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="סוג רכב"
                        name="vehicle_type"
                        value={addForm.vehicle_type}
                        onChange={handleAddChange}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="צבע"
                        name="color"
                        value={addForm.color}
                        onChange={handleAddChange}
                    />

                    <TextField
                        select
                        fullWidth
                        margin="normal"
                        label="עובד"
                        name="employee_id"
                        value={addForm.employee_id}
                        onChange={handleAddChange}
                    >

                        {employees.map((employee) => (

                            <MenuItem
                                key={employee.id}
                                value={employee.id}
                            >

                                {employee.full_name}

                            </MenuItem>
                        ))}

                    </TextField>

                </DialogContent>


                <DialogActions>

                    <Button
                        onClick={() =>
                            setOpenAddDialog(false)
                        }
                    >
                        ביטול
                    </Button>


                    <Button
                        variant="contained"
                        onClick={handleAddVehicle}
                    >
                        הוסף
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

export default VehiclesPage;