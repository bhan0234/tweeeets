import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: any; // Change `any` to the actual payload type if you have one
}