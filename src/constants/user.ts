import { Users } from '@/routes/users/users.entity';

export const userPublicFields: (keyof Users)[] = ['id', 'email'];

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-_])[A-Za-z\d@$!%*?&\-_]{8,20}$/;

export const uuidRegex =
  /b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}/gi;
