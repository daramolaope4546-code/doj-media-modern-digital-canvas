import { defineMcp } from "@lovable.dev/mcp-js";
import getProfile from "./tools/get-profile";
import listServices from "./tools/list-services";
import listProjects from "./tools/list-projects";
import listSkills from "./tools/list-skills";
import getExperience from "./tools/get-experience";

export default defineMcp({
  name: "doj-media-modern-digital-canvas",
  title: "DOJ MEDIA: Modern Digital Canvas",
  version: "0.1.0",
  instructions:
    "Public tools for the DOJ MEDIA portfolio of Opeyemi John Daramola. Use `get_profile` for bio and contact details, `list_services` for offered services, `list_projects` for portfolio work (optionally filtered by category), `list_skills` for proficiencies and `get_experience` for the experience timeline.",
  tools: [getProfile, listServices, listProjects, listSkills, getExperience],
});
