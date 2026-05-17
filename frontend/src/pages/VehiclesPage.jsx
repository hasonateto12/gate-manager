import { useEffect, useState } from "react";

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
    DialogContentText,
    DialogActions,
    Snackbar,
    MenuItem,
    Stack,
    IconButton,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function VehiclesPage() {
    const [vehicles, setVehicles] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const [selectedVehicle, setSelectedVehicle] = useState(null);

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

    const [editForm, setEditForm] = useState({
        plate_number: "",
        vehicle_type: "",
        color: "",
        employee_id: "",
        status: "",
    });

    useEffect(() => {
        fetchVehicles();
        fetchEmployees();
    }, []);

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const response = await api.get("/vehicles");
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
            const response = await api.get("/employees");
            setEmployees(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddChange = (e) => {
        setAddForm({
            ...addForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleAddVehicle = async () => {
        try {
            await api.post("/vehicles", addForm);
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

    const handleEditClick = (vehicle) => {
        setSelectedVehicle(vehicle);

        setEditForm({
            plate_number: vehicle.plate_number || "",
            vehicle_type: vehicle.vehicle_type || "",
            color: vehicle.color || "",
            employee_id: vehicle.employee_id || "",
            status: vehicle.status || "pending",
        });

        setOpenEditDialog(true);
    };

    const handleEditChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdateVehicle = async () => {
        try {
            await api.put(`/vehicles/${selectedVehicle.id}`, editForm);
            await fetchVehicles();

            setSnackbar({
                open: true,
                message: "הרכב עודכן בהצלחה",
            });

            setOpenEditDialog(false);
        } catch (error) {
            console.error(error);

            setSnackbar({
                open: true,
                message: "שגיאה בעדכון רכב",
            });
        }
    };

    const handleDeleteClick = (vehicle) => {
        setSelectedVehicle(vehicle);
        setOpenDeleteDialog(true);
    };

    const handleDeleteVehicle = async () => {
        try {
            await api.delete(`/vehicles/${selectedVehicle.id}`);
            await fetchVehicles();

            setSnackbar({
                open: true,
                message: "הרכב נמחק בהצלחה",
            });

            setOpenDeleteDialog(false);
        } catch (error) {
            console.error(error);

            setSnackbar({
                open: true,
                message: "שגיאה במחיקת רכב",
            });
        }
    };

    const getStatusChip = (status) => {
        if (status === "approved") {
            return <Chip label="מאושר" color="success" />;
        }

        if (status === "pending") {
            return <Chip label="ממתין" color="warning" />;
        }

        if (status === "rejected") {
            return <Chip label="נדחה" color="error" />;
        }

        return <Chip label={status || "לא ידוע"} />;
    };

    const filteredVehicles = vehicles.filter((vehicle) => {
        const plate = vehicle.plate_number?.toLowerCase() || "";
        const employee = vehicle.employee_name?.toLowerCase() || "";

        return (
            plate.includes(search.toLowerCase()) ||
            employee.includes(search.toLowerCase())
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
        return <Alert severity="error">{error}</Alert>;
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
                <Typography variant="h4" fontWeight="bold">
                    רכבים
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenAddDialog(true)}
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
                            <TableCell>מזהה</TableCell>
                            <TableCell>מספר רכב</TableCell>
                            <TableCell>סוג רכב</TableCell>
                            <TableCell>צבע</TableCell>
                            <TableCell>עובד</TableCell>
                            <TableCell>סטטוס</TableCell>
                            <TableCell>פעולות</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filteredVehicles.map((vehicle) => (
                            <TableRow key={vehicle.id}>
                                <TableCell>{vehicle.id}</TableCell>
                                <TableCell>{vehicle.plate_number}</TableCell>
                                <TableCell>{vehicle.vehicle_type}</TableCell>
                                <TableCell>{vehicle.color}</TableCell>
                                <TableCell>{vehicle.employee_name || "-"}</TableCell>
                                <TableCell>{getStatusChip(vehicle.status)}</TableCell>

                                <TableCell>
                                    <Stack direction="row" spacing={1}>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleEditClick(vehicle)}
                                        >
                                            <EditIcon />
                                        </IconButton>

                                        <IconButton
                                            color="error"
                                            onClick={() => handleDeleteClick(vehicle)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                fullWidth
            >
                <DialogTitle>הוספת רכב</DialogTitle>

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
                            <MenuItem key={employee.id} value={employee.id}>
                                {employee.full_name}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpenAddDialog(false)}>
                        ביטול
                    </Button>

                    <Button variant="contained" onClick={handleAddVehicle}>
                        הוסף
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                fullWidth
            >
                <DialogTitle>עריכת רכב</DialogTitle>

                <DialogContent>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="מספר רכב"
                        name="plate_number"
                        value={editForm.plate_number}
                        onChange={handleEditChange}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="סוג רכב"
                        name="vehicle_type"
                        value={editForm.vehicle_type}
                        onChange={handleEditChange}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="צבע"
                        name="color"
                        value={editForm.color}
                        onChange={handleEditChange}
                    />

                    <TextField
                        select
                        fullWidth
                        margin="normal"
                        label="עובד"
                        name="employee_id"
                        value={editForm.employee_id}
                        onChange={handleEditChange}
                    >
                        {employees.map((employee) => (
                            <MenuItem key={employee.id} value={employee.id}>
                                {employee.full_name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        fullWidth
                        margin="normal"
                        label="סטטוס"
                        name="status"
                        value={editForm.status}
                        onChange={handleEditChange}
                    >
                        <MenuItem value="pending">ממתין</MenuItem>
                        <MenuItem value="approved">מאושר</MenuItem>
                        <MenuItem value="rejected">נדחה</MenuItem>
                    </TextField>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>
                        ביטול
                    </Button>

                    <Button variant="contained" onClick={handleUpdateVehicle}>
                        שמור
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
            >
                <DialogTitle>מחיקת רכב</DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        האם למחוק את הרכב {selectedVehicle?.plate_number}?
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>
                        ביטול
                    </Button>

                    <Button color="error" onClick={handleDeleteVehicle}>
                        מחק
                    </Button>
                </DialogActions>
            </Dialog>

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