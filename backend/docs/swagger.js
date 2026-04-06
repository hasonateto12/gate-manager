const swaggerDocument = {
    openapi: '3.0.3',
    info: {
        title: 'Gate Manager API',
        version: '1.0.0',
        description:
            'API documentation for Gate Manager (Smart Gate) - Web Only version built with Node.js, Express and MySQL.',
    },
    servers: [
        {
            url: 'http://localhost:5000',
            description: 'Local development server',
        },
    ],
    tags: [
        { name: 'Auth', description: 'Authentication and profile endpoints' },
        { name: 'Employees', description: 'Employee management' },
        { name: 'Vehicles', description: 'Vehicle management' },
        { name: 'Entry Requests', description: 'Entry request management' },
        { name: 'Entry Logs', description: 'Entry log management' },
        { name: 'Dashboard', description: 'Dashboard and search endpoints' },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            ErrorResponse: {
                type: 'object',
                properties: {
                    error: {
                        type: 'string',
                        example: 'Something went wrong',
                    },
                    details: {
                        type: 'string',
                        example: 'Optional technical details',
                    },
                },
            },

            RegisterRequest: {
                type: 'object',
                required: ['full_name', 'username', 'email', 'password'],
                properties: {
                    full_name: {
                        type: 'string',
                        example: 'Saed Hassuna',
                    },
                    username: {
                        type: 'string',
                        example: 'saed12',
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'saed@example.com',
                    },
                    password: {
                        type: 'string',
                        example: '123456',
                    },
                    role: {
                        type: 'string',
                        example: 'user',
                        description: 'Optional. Default can be user based on your server logic.',
                    },
                },
            },

            LoginRequest: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'saed@example.com',
                    },
                    password: {
                        type: 'string',
                        example: '123456',
                    },
                },
            },

            LoginResponse: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                        example: 'Login successful',
                    },
                    token: {
                        type: 'string',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    },
                    user: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer', example: 1 },
                            full_name: { type: 'string', example: 'Saed Hassuna' },
                            username: { type: 'string', example: 'saed12' },
                            email: { type: 'string', example: 'saed@example.com' },
                            role: { type: 'string', example: 'admin' },
                        },
                    },
                },
            },

            ProfileResponse: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    full_name: { type: 'string', example: 'Saed Hassuna' },
                    username: { type: 'string', example: 'saed12' },
                    email: { type: 'string', example: 'saed@example.com' },
                    role: { type: 'string', example: 'admin' },
                    created_at: {
                        type: 'string',
                        format: 'date-time',
                        example: '2026-04-06T10:00:00Z',
                    },
                },
            },

            Employee: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    full_name: { type: 'string', example: 'Ali Omari' },
                    phone: { type: 'string', example: '0501234567' },
                    role: { type: 'string', example: 'Guard' },
                    created_at: {
                        type: 'string',
                        format: 'date-time',
                        example: '2026-04-06T10:00:00Z',
                    },
                },
            },

            EmployeeInput: {
                type: 'object',
                required: ['full_name'],
                properties: {
                    full_name: { type: 'string', example: 'Ali Omari' },
                    phone: { type: 'string', example: '0501234567' },
                    role: { type: 'string', example: 'Guard' },
                },
            },

            Vehicle: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    employee_id: { type: 'integer', example: 3 },
                    plate_number: { type: 'string', example: '12-345-67' },
                    vehicle_type: { type: 'string', example: 'Private' },
                    color: { type: 'string', example: 'White' },
                    employee_name: { type: 'string', example: 'Ali Omari' },
                    created_at: {
                        type: 'string',
                        format: 'date-time',
                        example: '2026-04-06T10:00:00Z',
                    },
                },
            },

            VehicleInput: {
                type: 'object',
                required: ['employee_id', 'plate_number'],
                properties: {
                    employee_id: { type: 'integer', example: 3 },
                    plate_number: { type: 'string', example: '12-345-67' },
                    vehicle_type: { type: 'string', example: 'Private' },
                    color: { type: 'string', example: 'White' },
                },
            },

            EntryRequest: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    employee_id: { type: 'integer', example: 3 },
                    vehicle_id: { type: 'integer', example: 4 },
                    status: { type: 'string', example: 'pending' },
                    notes: { type: 'string', example: 'Morning shift access request' },
                    request_date: {
                        type: 'string',
                        format: 'date-time',
                        example: '2026-04-06T08:00:00Z',
                    },
                },
            },

            EntryRequestInput: {
                type: 'object',
                properties: {
                    employee_id: { type: 'integer', example: 3 },
                    vehicle_id: { type: 'integer', example: 4 },
                    status: { type: 'string', example: 'pending' },
                    notes: { type: 'string', example: 'Morning shift access request' },
                },
            },

            EntryLog: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    employee_id: { type: 'integer', example: 3 },
                    vehicle_id: { type: 'integer', example: 4 },
                    action: { type: 'string', example: 'entry' },
                    log_time: {
                        type: 'string',
                        format: 'date-time',
                        example: '2026-04-06T08:30:00Z',
                    },
                    notes: { type: 'string', example: 'Gate opened successfully' },
                },
            },

            EntryLogInput: {
                type: 'object',
                properties: {
                    employee_id: { type: 'integer', example: 3 },
                    vehicle_id: { type: 'integer', example: 4 },
                    action: { type: 'string', example: 'entry' },
                    notes: { type: 'string', example: 'Gate opened successfully' },
                },
            },

            DashboardResponse: {
                type: 'object',
                properties: {
                    totalEmployees: { type: 'integer', example: 12 },
                    totalVehicles: { type: 'integer', example: 19 },
                    totalEntryRequests: { type: 'integer', example: 8 },
                    totalEntryLogs: { type: 'integer', example: 132 },
                },
            },

            DashboardSearchResponse: {
                type: 'object',
                properties: {
                    employees: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/Employee',
                        },
                    },
                    vehicles: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/Vehicle',
                        },
                    },
                    entry_requests: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/EntryRequest',
                        },
                    },
                    entry_logs: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/EntryLog',
                        },
                    },
                },
            },
        },
    },
    paths: {
        '/api/auth/register': {
            post: {
                tags: ['Auth'],
                summary: 'Register new user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/RegisterRequest',
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'User registered successfully',
                    },
                    400: {
                        description: 'Bad request',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse',
                                },
                            },
                        },
                    },
                    500: {
                        description: 'Server error',
                    },
                },
            },
        },

        '/api/auth/login': {
            post: {
                tags: ['Auth'],
                summary: 'Login and get JWT token',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/LoginRequest',
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Login successful',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/LoginResponse',
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Invalid credentials',
                    },
                    500: {
                        description: 'Server error',
                    },
                },
            },
        },

        '/api/auth/profile': {
            get: {
                tags: ['Auth'],
                summary: 'Get logged-in user profile',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Profile fetched successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ProfileResponse',
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                },
            },
        },

        '/api/employees': {
            get: {
                tags: ['Employees'],
                summary: 'Get all employees',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Employees list',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Employee',
                                    },
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                    },
                },
            },
            post: {
                tags: ['Employees'],
                summary: 'Create new employee',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/EmployeeInput',
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Employee created successfully',
                    },
                    403: {
                        description: 'Forbidden - admin only',
                    },
                    500: {
                        description: 'Server error',
                    },
                },
            },
        },

        '/api/employees/{id}': {
            get: {
                tags: ['Employees'],
                summary: 'Get employee by ID',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'integer',
                        },
                    },
                ],
                responses: {
                    200: {
                        description: 'Employee found',
                    },
                    404: {
                        description: 'Employee not found',
                    },
                },
            },
            put: {
                tags: ['Employees'],
                summary: 'Update employee',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'integer',
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/EmployeeInput',
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Employee updated successfully',
                    },
                    403: {
                        description: 'Forbidden - admin only',
                    },
                    404: {
                        description: 'Employee not found',
                    },
                },
            },
            delete: {
                tags: ['Employees'],
                summary: 'Delete employee',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'integer',
                        },
                    },
                ],
                responses: {
                    200: {
                        description: 'Employee deleted successfully',
                    },
                    403: {
                        description: 'Forbidden - admin only',
                    },
                    404: {
                        description: 'Employee not found',
                    },
                },
            },
        },

        '/api/vehicles': {
            get: {
                tags: ['Vehicles'],
                summary: 'Get all vehicles',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Vehicles list',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Vehicle',
                                    },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ['Vehicles'],
                summary: 'Create new vehicle',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/VehicleInput',
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Vehicle created successfully',
                    },
                    403: {
                        description: 'Forbidden - admin only',
                    },
                },
            },
        },

        '/api/vehicles/{id}': {
            get: {
                tags: ['Vehicles'],
                summary: 'Get vehicle by ID',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'integer',
                        },
                    },
                ],
                responses: {
                    200: {
                        description: 'Vehicle found',
                    },
                    404: {
                        description: 'Vehicle not found',
                    },
                },
            },
            put: {
                tags: ['Vehicles'],
                summary: 'Update vehicle',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'integer',
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/VehicleInput',
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Vehicle updated successfully',
                    },
                    403: {
                        description: 'Forbidden - admin only',
                    },
                    404: {
                        description: 'Vehicle not found',
                    },
                },
            },
            delete: {
                tags: ['Vehicles'],
                summary: 'Delete vehicle',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'integer',
                        },
                    },
                ],
                responses: {
                    200: {
                        description: 'Vehicle deleted successfully',
                    },
                    403: {
                        description: 'Forbidden - admin only',
                    },
                    404: {
                        description: 'Vehicle not found',
                    },
                },
            },
        },

        '/api/entry-requests': {
            get: {
                tags: ['Entry Requests'],
                summary: 'Get all entry requests',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Entry requests list',
                    },
                },
            },
            post: {
                tags: ['Entry Requests'],
                summary: 'Create entry request',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/EntryRequestInput',
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Entry request created successfully',
                    },
                },
            },
        },

        '/api/entry-requests/{id}': {
            get: {
                tags: ['Entry Requests'],
                summary: 'Get entry request by ID',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'integer',
                        },
                    },
                ],
                responses: {
                    200: {
                        description: 'Entry request found',
                    },
                    404: {
                        description: 'Entry request not found',
                    },
                },
            },
            put: {
                tags: ['Entry Requests'],
                summary: 'Update entry request',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'integer',
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/EntryRequestInput',
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Entry request updated successfully',
                    },
                    404: {
                        description: 'Entry request not found',
                    },
                },
            },
            delete: {
                tags: ['Entry Requests'],
                summary: 'Delete entry request',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'integer',
                        },
                    },
                ],
                responses: {
                    200: {
                        description: 'Entry request deleted successfully',
                    },
                    404: {
                        description: 'Entry request not found',
                    },
                },
            },
        },

        '/api/entry-logs': {
            get: {
                tags: ['Entry Logs'],
                summary: 'Get all entry logs',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Entry logs list',
                    },
                },
            },
            post: {
                tags: ['Entry Logs'],
                summary: 'Create entry log',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/EntryLogInput',
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Entry log created successfully',
                    },
                },
            },
        },

        '/api/entry-logs/{id}': {
            get: {
                tags: ['Entry Logs'],
                summary: 'Get entry log by ID',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'integer',
                        },
                    },
                ],
                responses: {
                    200: {
                        description: 'Entry log found',
                    },
                    404: {
                        description: 'Entry log not found',
                    },
                },
            },
            delete: {
                tags: ['Entry Logs'],
                summary: 'Delete entry log',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'integer',
                        },
                    },
                ],
                responses: {
                    200: {
                        description: 'Entry log deleted successfully',
                    },
                    404: {
                        description: 'Entry log not found',
                    },
                },
            },
        },

        '/api/dashboard': {
            get: {
                tags: ['Dashboard'],
                summary: 'Get dashboard summary',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Dashboard data fetched successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/DashboardResponse',
                                },
                            },
                        },
                    },
                },
            },
        },

        '/api/dashboard/search': {
            get: {
                tags: ['Dashboard'],
                summary: 'Search in dashboard data',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'query',
                        name: 'q',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'Search keyword',
                    },
                ],
                responses: {
                    200: {
                        description: 'Search results',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/DashboardSearchResponse',
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};

module.exports = swaggerDocument;