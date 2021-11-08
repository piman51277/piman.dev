import { ProjectConfig} from './ProjectConfig';
import fs from 'fs';
import { Request, Response } from 'express';

type routeHandler = (req: Request, res: Response) => void;

export function renderProject(dirname: string, config: ProjectConfig): routeHandler {

	//get main project file
	const mainPath = `./projects/${dirname}/${config.main}`;
	const mainFile = fs.readFileSync(mainPath, 'utf8');

	//repath source files
	const editedMainFile = mainFile.replace(/src="/g, `src="/assets/projects/${dirname}/`);

	const dependencies= {};

	//get dependancies
	config.dependencies.forEach(dependancy => {
		dependencies[dependancy] = true;
	});

	//return handler
	return (req: Request, res: Response) => {
		res.render('project', {
			layout: 'main',
			contents: editedMainFile,
			project: config,
			dependencies
		});
	};
}