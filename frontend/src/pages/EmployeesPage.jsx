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

} from "@mui/material";


function EmployeesPage() {

    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


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

                        </TableRow>

                    </TableHead>


                    <TableBody>

                        {employees.map((employee) => (

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

                            </TableRow>
                        ))}

                    </TableBody>

                </Table>

            </TableContainer>

        </Box>
    );
}

export default EmployeesPage;