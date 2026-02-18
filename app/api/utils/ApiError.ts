class ApiError extends Error {
    statusCode: number;
    message: string;
    errors: string;
    data: any[];
    success: boolean;

    constructor(
        statusCode: number,
        message: string = "Something went wrong",
        errors: any[] = [],
        stack: string = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errors = message;
        this.data = errors;
        this.success = statusCode < 400;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;
