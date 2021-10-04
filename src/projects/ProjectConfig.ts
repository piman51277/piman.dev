export type Dependancies = "jquery" | null;

export interface ProjectConfig {
	title: string;
	description: string;
	main: string;
	created: string;
	dependencies: Dependancies[];
}