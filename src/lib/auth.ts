import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // Using PostgreSQL as specified in the Prisma schema
    }),
    emailAndPassword: {  
        enabled: true
    },
    // You can add social providers here if needed
    // socialProviders: { 
    //    github: { 
    //     clientId: process.env.GITHUB_CLIENT_ID, 
    //     clientSecret: process.env.GITHUB_CLIENT_SECRET, 
    //    } 
    // }, 
}); 