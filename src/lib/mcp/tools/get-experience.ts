import { defineTool } from "@lovable.dev/mcp-js";
import { experience } from "@/data/site";

export default defineTool({
  name: "get_experience",
  title: "Get experience",
  description:
    "Get the experience timeline published on the DOJ MEDIA site: work, freelance, internships, volunteering, education and certifications.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(experience, null, 2) }],
    structuredContent: { groups: experience },
  }),
});
