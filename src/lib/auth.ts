import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db(process.env.DB_NAME as string);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "customer",
        required: false,
        input: true,
      },
      isBlocked: {
        type: "boolean",
        defaultValue: false,
        required: false,
        input: false,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Enforce allowed public registration roles: only 'customer' and 'vendor' are permitted.
          // Disallow self-registration as 'admin' or any unapproved role to prevent privilege escalation.
          const allowedRoles = ["customer", "vendor"];
          const userRole = (user as Record<string, unknown>).role;
          const role =
            typeof userRole === "string" && allowedRoles.includes(userRole)
              ? userRole
              : "customer";

          return {
            data: {
              ...user,
              role,
              isBlocked: false,
            },
          };
        },
      },
      update: {
        before: async (user) => {
          // Prevent privilege escalation or unblocking via client-side updates.
          const sanitized = { ...user } as Record<string, unknown>;
          if (
            sanitized.role &&
            sanitized.role !== "customer" &&
            sanitized.role !== "vendor"
          ) {
            delete sanitized.role;
          }
          delete sanitized.isBlocked;
          return {
            data: sanitized,
          };
        },
      },
    },
  },
});
