import { INodeProperties } from "n8n-workflow";

// Operation field
const operationField: INodeProperties = {
  displayName: "Operation",
  name: "operation",
  type: "options",
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ["calendar"],
    },
  },
  options: [
    {
      name: "Get Events",
      value: "getEvents",
      description: "Get events (calendar.event.get)",
      action: "Get events",
    },
    {
      name: "Get Event",
      value: "getEvent",
      description: "Get event (calendar.event.get)",
      action: "Get event",
    },
    {
      name: "Add Event",
      value: "addEvent",
      description: "Add event (calendar.event.add)",
      action: "Add event",
    },
    {
      name: "Update Event",
      value: "updateEvent",
      description: "Update event (calendar.event.update)",
      action: "Update event",
    },
    {
      name: "Delete Event",
      value: "deleteEvent",
      description: "Delete event (calendar.event.delete)",
      action: "Delete event",
    },
    {
      name: "Get Meeting Status",
      value: "getMeetingStatus",
      description: "Get meeting status (calendar.meeting.status.get)",
      action: "Get meeting status",
    },
    {
      name: "Set Meeting Status",
      value: "setMeetingStatus",
      description: "Set meeting status (calendar.meeting.status.set)",
      action: "Set meeting status",
    },
    {
      name: "Get Accessibility",
      value: "getAccessibility",
      description: "Get accessibility (calendar.accessibility.get)",
      action: "Get accessibility",
    },
    {
      name: "Get Sections",
      value: "getSections",
      description: "Get sections (calendar.section.get)",
      action: "Get sections",
    },
    {
      name: "Add Section",
      value: "addSection",
      description: "Add section (calendar.section.add)",
      action: "Add section",
    },
    {
      name: "Update Section",
      value: "updateSection",
      description: "Update section (calendar.section.update)",
      action: "Update section",
    },
    {
      name: "Delete Section",
      value: "deleteSection",
      description: "Delete section (calendar.section.delete)",
      action: "Delete section",
    },
    {
      name: "Sync Events",
      value: "syncEvents",
      description: "Sync events (calendar.event.sync)",
      action: "Sync events",
    },
  ],
  default: "getEvents",
};

// Type field
const typeField: INodeProperties = {
  displayName: "Type",
  name: "type",
  type: "options",
  options: [
    { name: "User", value: "user" },
    { name: "Group", value: "group" },
    { name: "Company", value: "company_calendar" },
  ],
  default: "user",
  required: true,
  description: "Type of calendar",
  displayOptions: {
    show: {
      resource: ["calendar"],
      operation: [
        "getEvents",
        "getEvent",
        "addEvent",
        "updateEvent",
        "deleteEvent",
        "getMeetingStatus",
        "setMeetingStatus",
        "getAccessibility",
      ],
    },
  },
};

// Owner ID field
const ownerIdField: INodeProperties = {
  displayName: "Owner ID",
  name: "ownerId",
  type: "string",
  required: true,
  default: "",
  description: "ID of the calendar owner",
  displayOptions: {
    show: {
      resource: ["calendar"],
      operation: [
        "getEvents",
        "getEvent",
        "addEvent",
        "updateEvent",
        "deleteEvent",
        "getMeetingStatus",
        "setMeetingStatus",
        "getAccessibility",
      ],
    },
  },
};

// Event ID field
const eventIdField: INodeProperties = {
  displayName: "Event ID",
  name: "eventId",
  type: "string",
  required: true,
  default: "",
  displayOptions: {
    show: {
      resource: ["calendar"],
      operation: [
        "getEvent",
        "updateEvent",
        "deleteEvent",
        "getMeetingStatus",
        "setMeetingStatus",
      ],
    },
  },
  description: "ID of the calendar event",
};

// Section ID field
const sectionIdField: INodeProperties = {
  displayName: "Section ID",
  name: "sectionId",
  type: "string",
  default: "",
  description: "ID of the calendar section",
  displayOptions: {
    show: {
      resource: ["calendar"],
      operation: ["getEvents", "addEvent", "updateSection", "deleteSection"],
    },
  },
};

// From date field
const fromField: INodeProperties = {
  displayName: "From Date",
  name: "from",
  type: "dateTime",
  default: "",
  description: "Start date for events query",
  displayOptions: {
    show: {
      resource: ["calendar"],
      operation: ["getEvents"],
    },
  },
};

// To date field
const toField: INodeProperties = {
  displayName: "To Date",
  name: "to",
  type: "dateTime",
  default: "",
  description: "End date for events query",
  displayOptions: {
    show: {
      resource: ["calendar"],
      operation: ["getEvents"],
    },
  },
};

// Event data field
const eventDataField: INodeProperties = {
  displayName: "Event Data",
  name: "eventData",
  type: "json",
  required: true,
  default: "{}",
  description: "Event data in JSON format",
  displayOptions: {
    show: {
      resource: ["calendar"],
      operation: ["addEvent", "updateEvent"],
    },
  },
};

// Section data field
const sectionDataField: INodeProperties = {
  displayName: "Section Data",
  name: "sectionData",
  type: "json",
  required: true,
  default: "{}",
  description: "Section data in JSON format",
  displayOptions: {
    show: {
      resource: ["calendar"],
      operation: ["addSection", "updateSection"],
    },
  },
};

// Meeting status field
const meetingStatusField: INodeProperties = {
  displayName: "Meeting Status",
  name: "meetingStatus",
  type: "options",
  options: [
    { name: "Accepted", value: "Y" },
    { name: "Declined", value: "N" },
    { name: "Tentative", value: "Q" },
  ],
  default: "Y",
  required: true,
  description: "Meeting status to set",
  displayOptions: {
    show: {
      resource: ["calendar"],
      operation: ["setMeetingStatus"],
    },
  },
};

// From date for accessibility
const fromAccessibilityField: INodeProperties = {
  displayName: "From Date",
  name: "from",
  type: "dateTime",
  required: true,
  default: "",
  description: "Start date for accessibility check",
  displayOptions: {
    show: {
      resource: ["calendar"],
      operation: ["getAccessibility"],
    },
  },
};

// To date for accessibility
const toAccessibilityField: INodeProperties = {
  displayName: "To Date",
  name: "to",
  type: "dateTime",
  required: true,
  default: "",
  description: "End date for accessibility check",
  displayOptions: {
    show: {
      resource: ["calendar"],
      operation: ["getAccessibility"],
    },
  },
};

// Users field for accessibility
const usersField: INodeProperties = {
  displayName: "Users",
  name: "users",
  type: "string",
  default: "",
  description: "Comma-separated list of user IDs to check accessibility",
  displayOptions: {
    show: {
      resource: ["calendar"],
      operation: ["getAccessibility"],
    },
  },
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
      resource: ["calendar"],
    },
  },
  options: [
    {
      displayName: "Access Token",
      name: "accessToken",
      type: "string",
      default: "",
      description: "Use this access token instead of the one from credentials",
    },
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
  ],
};

// Export operations
export const calendarOperations = [
  {
    name: "Get Events",
    value: "getEvents",
    description: "Get events (calendar.event.get)",
    action: "Get events",
  },
  {
    name: "Get Event",
    value: "getEvent",
    description: "Get event (calendar.event.get)",
    action: "Get event",
  },
  {
    name: "Add Event",
    value: "addEvent",
    description: "Add event (calendar.event.add)",
    action: "Add event",
  },
  {
    name: "Update Event",
    value: "updateEvent",
    description: "Update event (calendar.event.update)",
    action: "Update event",
  },
  {
    name: "Delete Event",
    value: "deleteEvent",
    description: "Delete event (calendar.event.delete)",
    action: "Delete event",
  },
  {
    name: "Get Meeting Status",
    value: "getMeetingStatus",
    description: "Get meeting status (calendar.meeting.status.get)",
    action: "Get meeting status",
  },
  {
    name: "Set Meeting Status",
    value: "setMeetingStatus",
    description: "Set meeting status (calendar.meeting.status.set)",
    action: "Set meeting status",
  },
  {
    name: "Get Accessibility",
    value: "getAccessibility",
    description: "Get accessibility (calendar.accessibility.get)",
    action: "Get accessibility",
  },
  {
    name: "Get Sections",
    value: "getSections",
    description: "Get sections (calendar.section.get)",
    action: "Get sections",
  },
  {
    name: "Add Section",
    value: "addSection",
    description: "Add section (calendar.section.add)",
    action: "Add section",
  },
  {
    name: "Update Section",
    value: "updateSection",
    description: "Update section (calendar.section.update)",
    action: "Update section",
  },
  {
    name: "Delete Section",
    value: "deleteSection",
    description: "Delete section (calendar.section.delete)",
    action: "Delete section",
  },
  {
    name: "Sync Events",
    value: "syncEvents",
    description: "Sync events (calendar.event.sync)",
    action: "Sync events",
  },
];

export const calendarFields: INodeProperties[] = [
  operationField,
  typeField,
  ownerIdField,
  eventIdField,
  sectionIdField,
  fromField,
  toField,
  eventDataField,
  sectionDataField,
  meetingStatusField,
  fromAccessibilityField,
  toAccessibilityField,
  usersField,
  optionsCollection,
];
