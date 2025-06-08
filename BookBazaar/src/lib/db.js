import { PrismaClient } from "../generated/prisma/index.js";

const GlobalForPrisma = globalThis ;

export const db = GlobalForPrisma.prisma || new PrismaClient()

if(process.env.NODE_ENV !== "production") GlobalForPrisma.prisma = db



/* 
    What this does:
✅ Checks if globalThis.prisma already exists.

✅ If not, creates a new PrismaClient().

✅ In non-production (development), it stores the instance on globalThis so next time it doesn't create a new one.

🌐 Why globalThis?

-> globalThis is a global object available across modules.

-> It survives hot reloads in dev environments like Vite or Next.js.

-> So it’s a safe place to store your Prisma instance once and reuse it.


*/