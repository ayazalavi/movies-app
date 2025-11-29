import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
} from '@nestjs/common';
import type { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodSchema<any>) { }

    transform(value: any, _metadata: ArgumentMetadata) {
        const result = this.schema.safeParse(value);
        if (!result.success) {
            // You can shape this however you like
            const formatted = result.error.flatten();
            throw new BadRequestException({
                message: 'Validation failed',
                errors: formatted,
            });
        }
        return result.data;
    }
}
