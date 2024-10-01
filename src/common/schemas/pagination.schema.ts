export const paginationSchema = {
  type: "object",
  properties: {
    page: { type: "number", default: 0 },
    limit: { type: "number", default: 10 },
  },
};

export function getPaginatedResponseSchema(dataSchema: Record<string, any>) {
  return {
    type: "object",
    properties: {
      total: { type: "number" },
      page: { type: "number" },
      limit: { type: "number" },
      data: dataSchema,
    },
  };
}
