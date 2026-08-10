import { defineTool } from "@lovable.dev/mcp-js";
import { profile, contact } from "@/data/site";

export default defineTool({
  name: "get_profile",
  title: "Get profile",
  description:
    "Get Opeyemi John Daramola's (DOJ MEDIA) public profile: name, title, tagline, intro, bio, location, interests, goals, strengths and public contact details.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const data = { profile, contact };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: data,
    };
  },
});
