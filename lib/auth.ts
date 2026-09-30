import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "./db"
import {
    user,
    session,
    account,
    verification
} from "@/db/auth-schema"

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg" ,
        schema: {
            user,
            session,
            account,
            verification
        }
    }),
    emailAndPassword: {
        enabled: true
    },

    session: {
        expiresIn:60*60*24*7,
        updateAge:60*60*24
    },

    baseURL: process.env.BETTER_AUTH_URL,

})