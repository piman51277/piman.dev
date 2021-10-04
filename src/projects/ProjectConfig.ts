export type Dependancies = "jquery" | "mathjax" | null;

export interface ProjectConfig {
	title: string;
	description: string;
	main: string;
	created: string;
	dependencies: Dependancies[];
}