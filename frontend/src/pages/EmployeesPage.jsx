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

} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";


function EmployeesPage() {

    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [openDialog, setOpenDialog] = useState(false);

    const [selectedEmployee, setSelectedEmployee] =
        useState(null);

    const [snackbar, setSnackbar] = useState({

        open: false,
        message: "",
    });


    useEffect(() => {

        fetchEmployees();

    }, []);


    const fetchEmployees = async () => {

        try {

            setLoading(true);

            const response =
                await api.get("/employees");

            setEmployees(response.data);

        } catch (error) {

            console.error(error);

            setError("שגיאה בטעינת עובדים");

        } finally {

            setLoading(false);
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


    const filteredEmployees = employees.filter((employee) => {

        const fullName =
            employee.full_name?.toLowerCase() || "";

        const email =
            employee.email?.toLowerCase() || "";

        return (

            fullName.includes(search.toLowerCase()) ||

            email.includes(search.toLowerCase())
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

            <Typography
                variant="h4"
                mb={4}
                fontWeight="bold"
            >
                עובדים
            </Typography>


            <TextField
                fullWidth
                label="חיפוש עובד"
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
                                שם מלא
                            </TableCell>

                            <TableCell>
                                אימייל
                            </TableCell>

                            <TableCell>
                                טלפון
                            </TableCell>

                            <TableCell>
                                תפקיד
                            </TableCell>

                            <TableCell>
                                פעולות
                            </TableCell>

                        </TableRow>

                    </TableHead>


                    <TableBody>

                        {filteredEmployees.map((employee) => (

                            <TableRow
                                key={employee.id}
                            >

                                <TableCell>
                                    {employee.id}
                                </TableCell>

                                <TableCell>
                                    {employee.full_name}
                                </TableCell>

                                <TableCell>
                                    {employee.email}
                                </TableCell>

                                <TableCell>
                                    {employee.phone}
                                </TableCell>

                                <TableCell>
                                    {employee.role}
                                </TableCell>

                                <TableCell>

                                    <IconButton
                                        color="error"
                                        onClick={() =>
                                            handleDeleteClick(employee)
                                        }
                                    >

                                        <DeleteIcon />

                                    </IconButton>

                                </TableCell>

                            </TableRow>
                        ))}

                    </TableBody>

                </Table>

            </TableContainer>


            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
            >

                <DialogTitle>

                    מחיקת עובד

                </DialogTitle>


                <DialogContent>

                    <DialogContentText>

                        האם למחוק את העובד
                        {" "}
                        {selectedEmployee?.full_name}
                        ?

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