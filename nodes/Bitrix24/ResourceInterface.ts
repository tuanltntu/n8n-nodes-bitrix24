export interface IResourceOptions {
	resource: Array<string>;
	operation?: Array<string>;
	crmResource?: Array<string>;
}

export interface INodeParameters {
	resource: string;
	operation?: string;
	crmResource?: string;
	[key: string]: unknown;
}

export interface INodeExecutionData {
	json: { [key: string]: any };
	binary?: { [key: string]: IBinaryData };
}

export interface IBinaryData {
	data: string;
	mimeType: string;
	fileName?: string;
	fileExtension?: string;
	fileSize?: number;
} 