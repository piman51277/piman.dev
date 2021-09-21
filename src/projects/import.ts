import fs from 'fs';
import { ProjectConfig } from './ProjectConfig';

const projects: { [name: string]: ProjectConfig } = {};

//discover projects in /projects directory
const directories = fs.readdirSync('./projects');

for (const directory of directories) {
	try {
		const projectCnfg = JSON.parse(fs.readFileSync(`./projects/${directory}/config.json`, 'utf-8'));

		//check if project already exists
		if (projects[projectCnfg.title]) {
			console.error(`Cannot import project at /projects/${directory}! Project ${projectCnfg.title} already exists`);
			continue;
		}

		//check if name is random
		if (projectCnfg.title === 'random' || directory === 'random') {
			console.error(`Cannot import project at /projects/${directory}! 'random' is a reserved name!`);
			continue;
		}

		projects[directory] = projectCnfg;

		console.log(`Imported project at /projects/${directory}`);
	}
	catch (e) {
		console.error(`Cannot import project at /projects/${directory}! Error: ${e}`);
	}
}

export const projectIndex = projects;
