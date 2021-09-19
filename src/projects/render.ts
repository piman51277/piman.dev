import { ProjectConfig } from './ProjectConfig';
import fs from 'fs';
import { Request, Response } from 'express';

export function renderProject(dirname:string, config:ProjectConfig){

	//get main project file
	const mainPath = `./projects/${dirname}/${config.main}`;
	const mainFile = fs.readFileSync(mainPath, 'utf8');

	//repath script tags within main file
	const editedMainFile = mainFile.replace(/<script src="/g,`<script src="/assets/projects/${dirname}/` )

	//return handler
	return (req:Request, res:Response) => {
		res.render('project', {
			layout: 'main',
			contents: editedMainFile	
		})
	}
}