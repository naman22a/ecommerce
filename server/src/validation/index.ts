import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const exceptionFactory = (errors: ValidationError[] = []) => {
    const newErrors = errors.map((error) => {
        const validationErrors = [];
        for (let err in error.constraints) {
            validationErrors.push(error.constraints[err]);
        }
        return {
            field: error.property,
            message: validationErrors[0],
        };
    });
    return new BadRequestException({
        ok: false,
        errors: newErrors,
    });
};
