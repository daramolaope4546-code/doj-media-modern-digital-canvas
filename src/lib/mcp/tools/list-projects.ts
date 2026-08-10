import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { projectCategories, projects } from "@/data/site";

export default defineTool({
  name: "list_projects",
  title: "List portfolio projects",
  description:
    "List DOJ MEDIA portfolio projects with title, category, description and image URL. Optionally filter by category.",
  inputSchema: {
    category: z
      .enum(projectCategories as unknown as [string, ...string[]])
      .optional()
      .describe("Filter by category. Use 'All' or omit for every project."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category }) => {
    const items = (!category || category === "All" ? projects : projects.filter((p) => p.category === category)).map(
      ({ title, category: cat, description, image, link }) => ({ title, category: cat, description, image, link }),
    );
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { count: items.length, items },
    };
  },
});
