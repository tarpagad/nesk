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
    autoSignInAfterReset: true,
    autoSignInAfterSignUp: true,
    autoSignInAfterEmailVerification: true,
    autoSignIn: true,
    disableSignUp: process.env.DISABLE_SIGNUP === "true",
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        input: false, //! critically important : https://www.better-auth.com/docs/concepts/typescript#inferring-types:~:text=By%20default%2C%20additional%20fields%20are%20included%20in%20the%20user%20input%2C%20which%20can%20lead%20to%20security%20vulnerabilities%20if%20not%20handled%20carefully.%20For%20fields%20that%20should%20not%20be%20set%20by%20the%20user%2C%20like%20a%20role%2C%20it%20is%20crucial%20to%20set%20input%3A%20false%20in%20the%20configuration.
      },
    },
  },
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
});
