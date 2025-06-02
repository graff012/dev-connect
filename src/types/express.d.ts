import { Request } from 'express';

declare module 'express' {
  interface Request {
    userId?: string;
  }
}

// I am telling to Express now: "Hey, buddy, every Request now will have a optional userId column"
