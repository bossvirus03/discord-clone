import { HttpException } from "@nestjs/common";

export class CustomError extends HttpException {
    code: number;
    message: string;
    constructor(
        message: string,
        code: number,
    ) {
        super(message, code);
        this.message = message;
        this.code = code;
    }
}