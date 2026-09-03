import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DevSpace API",
      version: "1.0.0",
      description: "Backend API for DevSpace — developer tools, content, and admin management.",
    },
    servers: [
      { url: "https://devspace-d8nq.onrender.com", description: "Production" },
      { url: "http://localhost:2000", description: "Local dev" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ContentItem: {
          type: "object",
          properties: {
            _id: { type: "string" },
            slug: { type: "string" },
            type: {
              type: "string",
              enum: [
                "post",
                "series",
                "tip",
                "cheat-sheet",
                "game",
                "tool",
                "hidden-gem",
                "hiring",
                "mcp-skill",
                "stack-breakdown",
                "startup-term",
                "learning-resource",
              ],
            },
            title: { type: "string" },
            description: { type: "string" },
            body: { type: "string" },
            image: { type: "string" },
            images: { type: "array", items: { type: "string" } },
            tags: { type: "array", items: { type: "string" } },
            status: { type: "string", enum: ["draft", "published"] },
            version: { type: "integer" },
            series: { type: "string" },
            publishedAt: { type: "string", format: "date-time" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, "../routes/*.ts"), path.join(__dirname, "../routes/*.js")],
};

export const swaggerSpec = swaggerJSDoc(options);
