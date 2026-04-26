import { Prisma } from '../../../generated/prisma/client';
import { GraphQLError } from 'graphql';

export function toEmail(mail: string): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(mail)) {
        throw new GraphQLError(`Invalid email format: '${mail}'`, {
            extensions: {
                http: { status: 400 },
                code: 'BAD_USER_INPUT'
            }
        });
    }

    return mail.toLowerCase();
}

export function toBool(value: any): boolean {
    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        if (normalized === 'true' || normalized === '1') return true;
        if (normalized === 'false' || normalized === '0') return false;
    }

    // tego chyba nie potrzebujemy
    // if (value === 1) return true;
    // if (value === 0) return false;

    throw new GraphQLError(`Invalid boolean format: '${value}'`, {
        extensions: {
            http: { status: 400 },
            code: 'BAD_USER_INPUT'
        }
    });
}

export function toInt(value: any): number {
    const parsed = Number(value);

    if (isNaN(parsed) || !Number.isInteger(parsed)) {
        throw new GraphQLError(`Invalid integer format: '${value}'`, {
            extensions: {
                http: { status: 400 },
                code: 'BAD_USER_INPUT'
            }
        });
    }

    return parsed;
}
