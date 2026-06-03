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
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Snackbar,
    Stack,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

function EmployeesPage() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
    });

    const [openAddDialog, setOpenAddDialog] = useState(false);

    const [addForm, setAddForm] = useState({
        full_name: "",
        phone: "",
        department: "",
    });

    const [openEditDialog, setOpenEditDialog] = useState(false);

    const [editForm, setEditForm] = useState({
        full_name: "",
        phone: "",
        department: "",
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);

            const response = await api.get("/employees");

            setEmployees(response.data);
        } catch (error) {
            console.error(error);
            setError("שגיאה בטעינת עובדים");
        } finally {
            setLoading(false);
        }
    };

    const handleAddChange = (e) => {
        setAddForm({
            ...addForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleAddEmployee = async () => {
        try {
            await api.post("/employees", addForm);

            await fetchEmployees();

            setSnackbar({
                open: true,
                message: "העובד נוסף בהצלחה",
            });

            setOpenAddDialog(false);

            setAddForm({
                full_name: "",
                phone: "",
                department: "",
            });
        } catch (error) {
            console.error(error);

            setSnackbar({
                open: true,
                message: "שגיאה בהוספת עובד",
            });
        }
    };

    const handleDeleteClick = (employee) => {
        setSelectedEmployee(employee);
        setOpenDialog(true);
    };

    const handleDeleteEmployee = async () => {
        try {
            await api.delete(
                `/employees/${selectedEmployee.id}`
            );

            setEmployees((prev) =>
                prev.filter(
                    (employee) =>
                        employee.id !== selectedEmployee.id
                )
            );

            setSnackbar({
                open: true,
                message: "העובד נמחק בהצלחה",
            });
        } catch (error) {
            console.error(error);

            setSnackbar({
                open: true,
                message: "שגיאה במחיקת עובד",
            });
        }

        setOpenDialog(false);
    };

    const handleEditClick = (employee) => {
        setSelectedEmployee(employee);

        setEditForm({
            full_name: employee.full_name || "",
            phone: employee.phone || "",
            department: employee.department || "",
        });

        setOpenEditDialog(true);
    };

    const handleEditChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdateEmployee = async () => {
        try {
            await api.put(
                `/employees/${selectedEmployee.id}`,
                editForm
            );

            await fetchEmployees();

            setSnackbar({
                open: true,
                message: "העובד עודכן בהצלחה",
            });

            setOpenEditDialog(false);
        } catch (error) {
            console.error(error);

            setSnackbar({
                open: true,
                message: "שגיאה בעדכון עובד",
            });
        }
    };

    const filteredEmployees = employees.filter((employee) => {
        const fullName =
            employee.full_name?.toLowerCase() || "";

        const phone =
            employee.phone?.toLowerCase() || "";

        const department =
            employee.department?.toLowerCase() || "";

        return (
            fullName.includes(search.toLowerCase()) ||
            phone.includes(search.toLowerCase()) ||
            department.includes(search.toLowerCase())
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
                    עובדים
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
                    הוסף עובד
                </Button>
            </Box>

            <TextField
                fullWidth
                label="חיפוש עובד"
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
                                שם מלא
                            </TableCell>

                            <TableCell>
                                טלפון
                            </TableCell>

                            <TableCell>
                                מחלקה
                            </TableCell>

                            <TableCell>
                                פעולות
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filteredEmployees.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell>
                                    {employee.id}
                                </TableCell>

                                <TableCell>
                                    {employee.full_name}
                                </TableCell>

                                <TableCell>
                                    {employee.phone}
                                </TableCell>

                                <TableCell>
                                    {employee.department}
                                </TableCell>

                                <TableCell>
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                    >
                                        <IconButton
                                            color="primary"
                                            onClick={() =>
                                                handleEditClick(
                                                    employee
                                                )
                                            }
                                        >
                                            <EditIcon />
                                        </IconButton>

                                        <IconButton
                                            color="error"
                                            onClick={() =>
                                                handleDeleteClick(
                                                    employee
                                                )
                                            }
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
                onClose={() =>
                    setOpenAddDialog(false)
                }
                fullWidth
            >
                <DialogTitle>
                    הוספת עובד
                </DialogTitle>

                <DialogContent>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="שם מלא"
                        name="full_name"
                        value={addForm.full_name}
                        onChange={handleAddChange}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="טלפון"
                        name="phone"
                        value={addForm.phone}
                        onChange={handleAddChange}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="מחלקה"
                        name="department"
                        value={addForm.department}
                        onChange={handleAddChange}
                    />
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
                        onClick={handleAddEmployee}
                    >
                        הוסף
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openDialog}
                onClose={() =>
                    setOpenDialog(false)
                }
            >
                <DialogTitle>
                    מחיקת עובד
                </DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        האם למחוק את העובד{" "}
                        {selectedEmployee?.full_name}?
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() =>
                            setOpenDialog(false)
                        }
                    >
                        ביטול
                    </Button>

                    <Button
                        color="error"
                        onClick={handleDeleteEmployee}
                    >
                        מחק
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openEditDialog}
                onClose={() =>
                    setOpenEditDialog(false)
                }
                fullWidth
            >
                <DialogTitle>
                    עריכת עובד
                </DialogTitle>

                <DialogContent>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="שם מלא"
                        name="full_name"
                        value={editForm.full_name}
                        onChange={handleEditChange}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="טלפון"
                        name="phone"
                        value={editForm.phone}
                        onChange={handleEditChange}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="מחלקה"
                        name="department"
                        value={editForm.department}
                        onChange={handleEditChange}
                    />
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() =>
                            setOpenEditDialog(false)
                        }
                    >
                        ביטול
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleUpdateEmployee}
                    >
                        שמור
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

export default EmployeesPage;