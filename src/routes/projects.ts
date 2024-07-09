import { Router } from "express";
import { projects } from "./../projects/index";

export const projectsRouter = Router();

const kebabName = (name: string): string => {
  name = name.replace(/[^a-zA-Z0-9 ]/g, "");
  return name.replace(/ /g, "-").toLowerCase();
};

const enabledProjects = structuredClone(projects).filter(
  (project) => project.meta.enabled
);

//start creating name alias for pretty links
const seenAliases = new Set<string>();
const aliases: Record<string, string> = {};
const aliasInverse: Record<string, string> = {};
for (const project of enabledProjects) {
  let alias = kebabName(project.meta.title);
  let discriminator = 0;

  while (seenAliases.has(alias)) {
    console.warn(`Duplicate alias found: ${alias}`);
    discriminator++;
    alias = `${kebabName(project.meta.title)}-${discriminator}`;
  }

  seenAliases.add(alias);
  aliases[alias] = project.main;
  aliasInverse[project.main] = alias;
}

//create pretty links
for (const [alias, file] of Object.entries(aliases)) {
  projectsRouter.get(`/${alias}`, (req, res) => {
    res.sendFile(file);
  });
}

const displayedProjects = enabledProjects.filter(
  (project) => !project.meta.hidden
);

//insert new link icon pointing to the project
displayedProjects.forEach((project) => {
  if (!project.meta.hasDemo) return;

  const alias = aliasInverse[project.main];
  project.meta.links.push({
    type: "external",
    url: `/projects/${alias}`,
    alt: "Project",
  });
});

projectsRouter.get("/", (req, res) => {
  res.render("projects.njk", {
    projects: displayedProjects,
  });
});
