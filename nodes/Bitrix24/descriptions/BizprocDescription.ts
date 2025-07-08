import { INodeProperties } from "n8n-workflow";

// Bizproc operations
const operationField: INodeProperties = {
  displayName: "Operation",
  name: "operation",
  type: "options",
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ["bizproc"],
    },
  },
  options: [
    {
      name: "Start Workflow",
      value: "startWorkflow",
      description: "Start a business process workflow (bizproc.workflow.start)",
      action: "Start a business process workflow",
    },
    {
      name: "Get Task",
      value: "getTask",
      description: "Get workflow task (bizproc.task.get)",
      action: "Get workflow task",
    },
    {
      name: "Get Tasks",
      value: "getTasks",
      description: "Get workflow tasks (bizproc.task.list)",
      action: "Get workflow tasks",
    },
    {
      name: "Complete Task",
      value: "completeTask",
      description: "Complete workflow task (bizproc.task.complete)",
      action: "Complete workflow task",
    },
    {
      name: "Get Workflow",
      value: "getWorkflow",
      description: "Get workflow information (bizproc.workflow.instances)",
      action: "Get workflow information",
    },
    {
      name: "Get Workflows",
      value: "getWorkflows",
      description: "Get workflows (bizproc.workflow.instances)",
      action: "Get workflows",
    },
    {
      name: "Kill Workflow",
      value: "killWorkflow",
      description: "Terminate a workflow (bizproc.workflow.kill)",
      action: "Terminate a workflow",
    },
    {
      name: "Get Templates",
      value: "getTemplates",
      description: "Get workflow templates (bizproc.workflow.template.list)",
      action: "Get workflow templates",
    },
  ],
  default: "getWorkflows",
};

// Template ID field
const templateIdField: INodeProperties = {
  displayName: "Template ID",
  name: "templateId",
  type: "string",
  required: true,
  default: "",
  displayOptions: {
    show: {
      resource: ["bizproc"],
      operation: ["startWorkflow"],
    },
  },
  description: "ID of the workflow template",
};

// Workflow ID field
const workflowIdField: INodeProperties = {
  displayName: "Workflow ID",
  name: "workflowId",
  type: "string",
  required: true,
  default: "",
  displayOptions: {
    show: {
      resource: ["bizproc"],
      operation: ["getWorkflow"],
    },
  },
  description: "ID of the workflow",
};

// Task ID field
const taskIdField: INodeProperties = {
  displayName: "Task ID",
  name: "taskId",
  type: "string",
  required: true,
  default: "",
  displayOptions: {
    show: {
      resource: ["bizproc"],
      operation: ["getTask", "completeTask"],
    },
  },
  description: "ID of the task",
};

// Document ID field
const documentIdField: INodeProperties = {
  displayName: "Document ID",
  name: "documentId",
  type: "string",
  required: true,
  default: "",
  displayOptions: {
    show: {
      resource: ["bizproc"],
      operation: ["startWorkflow"],
    },
  },
  description: "ID of the document to start workflow for",
};

// Parameters field
const parametersField: INodeProperties = {
  displayName: "Parameters",
  name: "parameters",
  type: "json",
  default: "{}",
  displayOptions: {
    show: {
      resource: ["bizproc"],
      operation: ["startWorkflow", "completeTask"],
    },
  },
  description: "Workflow parameters in JSON format",
};

// Options collection
const optionsCollection: INodeProperties = {
  displayName: "Options",
  name: "options",
  type: "collection",
  placeholder: "Add Option",
  default: {},
  displayOptions: {
    show: {
      resource: ["bizproc"],
      operation: ["getTasks", "getWorkflows"],
    },
  },
  options: [
    {
      displayName: "Filter",
      name: "filter",
      type: "json",
      default: "{}",
      description: "Filter criteria in JSON format",
    },
    {
      displayName: "Order",
      name: "order",
      type: "json",
      default: "{}",
      description: "Sort order in JSON format",
    },
    {
      displayName: "Start",
      name: "start",
      type: "number",
      default: 0,
      description: "The record number to start the selection from",
    },
    {
      displayName: "Access Token",
      name: "accessToken",
      type: "string",
      default: "",
      description: "Access token for authentication",
    },
  ],
};

export const bizprocOperations = [
  {
    name: "Start Workflow",
    value: "startWorkflow",
    description: "Start a business process workflow (bizproc.workflow.start)",
    action: "Start a business process workflow",
  },
  {
    name: "Get Task",
    value: "getTask",
    description: "Get workflow task (bizproc.task.get)",
    action: "Get workflow task",
  },
  {
    name: "Get Tasks",
    value: "getTasks",
    description: "Get workflow tasks (bizproc.task.list)",
    action: "Get workflow tasks",
  },
  {
    name: "Complete Task",
    value: "completeTask",
    description: "Complete workflow task (bizproc.task.complete)",
    action: "Complete workflow task",
  },
  {
    name: "Get Workflow",
    value: "getWorkflow",
    description: "Get workflow information (bizproc.workflow.instances)",
    action: "Get workflow information",
  },
  {
    name: "Get Workflows",
    value: "getWorkflows",
    description: "Get workflows (bizproc.workflow.instances)",
    action: "Get workflows",
  },
  {
    name: "Kill Workflow",
    value: "killWorkflow",
    description: "Terminate a workflow (bizproc.workflow.kill)",
    action: "Terminate a workflow",
  },
  {
    name: "Get Templates",
    value: "getTemplates",
    description: "Get workflow templates (bizproc.workflow.template.list)",
    action: "Get workflow templates",
  },
];

export const bizprocFields: INodeProperties[] = [
  operationField,
  templateIdField,
  workflowIdField,
  taskIdField,
  documentIdField,
  parametersField,
  optionsCollection,
];
