import { Key } from "react";

export interface User {
    status: string;
    id: Key | null | undefined;
    _id: string;
    image: string
    name: string;
    email: string;
    phone: number;
    isBlocked: boolean;
  }