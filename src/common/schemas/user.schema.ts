export const loginInputSchema = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 1 },
  },
};

export const userResponseSchema = {
  type: "object",
  required: ["id", "email"],
  properties: {
    id: { type: "string" },
    email: { type: "string", format: "email" },
  },
};

export const loginResponseSchema = {
  type: "object",
  required: ["email", "id", "accessToken"],
  properties: {
    ...userResponseSchema.properties,
    accessToken: { type: "string" },
  },
};
