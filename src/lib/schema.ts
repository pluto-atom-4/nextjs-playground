import { z } from 'zod';

// Zod Validation Schemas for User Input
export const userSchema = z.object({
  name: z.string(),
  age: z.number().min(0),
});


