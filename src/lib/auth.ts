import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { admin } from "better-auth/plugins"
import { magicLink } from "better-auth/plugins";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // Using PostgreSQL as specified in the Prisma schema
    }),
    emailAndPassword: {
        enabled: true,

    },
    socialProviders: {
        microsoft: {
            clientId: process.env.MICROSOFT_CLIENT_ID!,
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET!
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }
    },
    plugins: [
        admin(),
        magicLink({
            sendMagicLink: async ({ email, token, url }, request) => {
                try {
                    await resend.emails.send({
                        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
                        to: email,
                        subject: 'Login to Engel Paradis',
                        html: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                                <h1 style="color: #D87093; text-align: center;">Welcome to Engel Paradis</h1>
                                <p style="margin: 20px 0;">Click the button below to sign in to your account. This link will expire in 5 minutes.You must press the link on same deivce you sent it from</p>
                                <div style="text-align: center; margin: 30px 0;">
                                    <a href="${url}" 
                                       style="background-color: #D87093; 
                                              color: white; 
                                              padding: 12px 24px; 
                                              text-decoration: none; 
                                              border-radius: 4px;
                                              display: inline-block;">
                                        Sign In
                                    </a>
                                </div>
                                <p style="color: #666; font-size: 14px;">If you didn't request this email, you can safely ignore it.</p>
                                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666;">
                                    <p>Engel Paradis AS</p>
                                    <p>Haavard martinsens vei 19, 0978 Oslo</p>
                                </div>
                            </div>
                        `
                    });
                } catch (error) {
                    console.error('Error sending magic link email:', error);
                    throw new Error('Failed to send magic link email');
                }
            },
            expiresIn: 300, // 5 minutes
            disableSignUp: false // Allow new users to sign up via magic link
        })
    ]

});