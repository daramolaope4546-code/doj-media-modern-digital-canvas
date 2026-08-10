import { defineTool } from "@lovable.dev/mcp-js";
import { services } from "@/data/site";

export default defineTool({
  name: "list_services",
  title: "List services",
  description:
    "List the creative services DOJ MEDIA offers (graphics design, web design, video editing, motion design, live streaming and more) with descriptions and highlights.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const items = services.map(({ title, desc, points }) => ({ title, description: desc, highlights: points }));
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { items },
    };
  },
});
