import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignInAfterVerification: true,
    sendResetPassword: async ({ user, url, token }) => {
      // Log password reset details to console instead of sending email
      console.log(`\n${"=".repeat(80)}`);
      console.log("🔐 PASSWORD RESET REQUEST");
      console.log("=".repeat(80));
      console.log(`📧 Email: ${user.email}`);
      console.log(`👤 Name: ${user.name || "No name"}`);
      console.log(`🔗 Reset URL: ${url}`);
      console.log(`🎫 Token: ${token}`);
      console.log(`${"=".repeat(80)}\n`);
      // Not sending actual email - just logging for development
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
      },
    },
  },
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
});
