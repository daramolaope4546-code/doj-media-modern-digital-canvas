import { defineTool } from "@lovable.dev/mcp-js";
import { skills } from "@/data/site";

export default defineTool({
  name: "list_skills",
  title: "List skills",
  description: "List DOJ MEDIA's creative and technical skills with proficiency levels and the tools used.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(skills, null, 2) }],
    structuredContent: { items: skills },
  }),
});
