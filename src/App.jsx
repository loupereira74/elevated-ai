import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BellRinging,
  Briefcase,
  Buildings,
  CalendarCheck,
  CaretDown,
  CheckCircle,
  ClipboardText,
  CloudCheck,
  FileText,
  Funnel,
  GearSix,
  HouseLine,
  Image,
  ListBullets,
  MagnifyingGlass,
  Microphone,
  Monitor,
  NotePencil,
  Pause,
  Play,
  Plus,
  ShoppingCart,
  Sparkle,
  Stack,
  Storefront,
  Truck,
  VideoCamera,
  Warning,
  X,
} from "@phosphor-icons/react";
import elevatedAiLogo from "./assets/elevated-ai-logo.png";
import beverageImage from "./assets/beverage-retail-capture.webp";
import meetingImage from "./assets/customer-meeting.webp";
import pharmaImage from "./assets/pharma-field-rep.webp";
import homeHeroImage from "./assets/hero-home-ai-assistant.webp";
import fieldMemoryHeroImage from "./assets/hero-field-memory.webp";
import fieldServiceHeroImage from "./assets/hero-field-service.webp";
import retailHeroImage from "./assets/hero-retail-distribution.webp";
import builtEnvironmentHeroImage from "./assets/hero-built-environment.webp";
import clientServicesHeroImage from "./assets/hero-client-services.webp";
import regulatedHeroImage from "./assets/hero-regulated-field-teams.webp";
import pilotProgramHeroImage from "./assets/hero-pilot-program.webp";
import voiceCommandsHeroImage from "./assets/hero-voice-commands.webp";
import integrationsHeroImage from "./assets/hero-integrations.webp";
import serviceElectricalImage from "./assets/field-service-electrical-panel.webp";
import serviceHvacImage from "./assets/field-service-hvac-rooftop.webp";
import serviceRestorationImage from "./assets/field-service-restoration-moisture.webp";
import securityGovernanceImage from "./assets/security-governance-review.webp";
import pilotWorkshopImage from "./assets/pilot-automation-workshop.webp";
import { isSupabaseConfigured, submitPilotRequest } from "./supabaseClient";

const industries = [
  { label: "Beverage", icon: Truck },
  { label: "Retail", icon: ShoppingCart },
  { label: "Pharma", icon: ClipboardText },
  { label: "Software", icon: Monitor },
  { label: "Property", icon: HouseLine },
  { label: "Service", icon: GearSix },
];

const captureModes = [
  { label: "Voice", detail: "Talk naturally. We transcribe.", icon: Microphone },
  { label: "Photos", detail: "Document what you see.", icon: Image },
  { label: "Videos", detail: "Show the full context.", icon: VideoCamera },
  { label: "Documents", detail: "Upload or snap any document.", icon: FileText },
  { label: "Notes", detail: "Capture details, asks, and ideas.", icon: NotePencil },
];

const extractedColumns = [
  {
    title: "Tasks",
    icon: CheckCircle,
    color: "green",
    items: ["Follow up with store manager", "Replace cooler gasket", "Send updated planogram"],
  },
  {
    title: "Opportunities",
    icon: Sparkle,
    color: "teal",
    items: ["Expand endcap placement", "Add additional SKUs", "Increase next order"],
  },
  {
    title: "Risks",
    icon: Warning,
    color: "amber",
    items: ["Cooler not holding temperature", "Competitor promo detected", "Low stock risk"],
  },
  {
    title: "Notes",
    icon: NotePencil,
    color: "blue",
    items: ["Manager open to new placement", "Planogram reset in progress", "Customer prefers morning delivery"],
  },
  {
    title: "Assets",
    icon: Stack,
    color: "gray",
    items: ["Walk-in Cooler #7", "Store #1234", "Acme Products"],
  },
];

const integrations = ["Salesforce", "Dynamics 365", "ServiceNow", "HubSpot", "Email & Calendar", "50+ more"];

const updates = [
  { title: "Walk-in cooler issue", meta: "Store #1234 - Chicago, IL", tag: "High risk", tone: "risk" },
  { title: "Endcap expansion opportunity", meta: "Store #5676 - Dallas, TX", tag: "High impact", tone: "win" },
  { title: "Planogram reset completed", meta: "Store #4321 - Atlanta, GA", tag: "On track", tone: "ok" },
];

const searchResults = [
  {
    title: "Walk-in cooler issue",
    meta: "Store #1234 - Chicago, IL - May 16, 9:12 AM",
    tag: "Risk",
    media: [beverageImage, meetingImage],
  },
  {
    title: "Endcap expansion opportunity",
    meta: "Store #5676 - Dallas, TX - May 16, 8:45 AM",
    tag: "Opportunity",
    media: [beverageImage, pharmaImage],
  },
  {
    title: "Pharma inventory follow-up",
    meta: "Account #4421 - Boston, MA - May 16, 8:30 AM",
    tag: "Task",
    media: [pharmaImage, meetingImage],
  },
];

const beforeAfter = [
  ["Before", "People finish the real work, then lose time typing updates into systems later."],
  ["After", "The AI assistant extracts the details and drafts the updates automatically."],
];

const workflowSteps = [
  {
    title: "Say what happened or what you need",
    text: "Teams use voice capture and voice commands from the job, visit, meeting, or desk.",
    icon: Microphone,
  },
  {
    title: "AI understands the work",
    text: "Elevated AI identifies intent, tasks, risks, reminders, opportunities, people, materials, and context.",
    icon: Sparkle,
  },
  {
    title: "APIs and automation do the admin",
    text: "The assistant drafts emails, tasks, records, schedules, invoices, summaries, and system updates for review.",
    icon: CloudCheck,
  },
];

const voiceCommands = [
  ["Send invoice", "Send the Smith invoice to the client for review.", "Drafts email, attaches invoice, logs activity"],
  ["Check schedule", "What is on my schedule next?", "Reads calendar and returns the next appointment"],
  ["Email photos", "Email Sarah the inspection photos and summary.", "Finds media, drafts message, prepares send"],
  ["Create follow-up", "Remind me to call the customer Friday.", "Creates task and links it to the account"],
  ["Start quote", "Create a generator quote from this job note.", "Drafts opportunity and quote request"],
  ["Update system", "Update the work order and notify the office.", "Prepares system update and internal alert"],
];

const automationSteps = [
  ["1", "Voice intent", "The employee says what happened or what they need done."],
  ["2", "AI draft", "Elevated AI extracts intent, context, attachments, and required fields."],
  ["3", "Human review", "The user approves, edits, routes, or rejects the drafted action."],
  ["4", "API execution", "Connected systems receive the email, task, record, invoice, schedule, or update."],
];

const firstAutomations = [
  {
    title: "Capture updates",
    command: "Replaced the panel. Customer wants a generator quote.",
    outcome: "Drafts the job note, quote opportunity, follow-up task, and searchable customer history.",
    systems: ["CRM", "Work order", "Company memory"],
    icon: NotePencil,
  },
  {
    title: "Trigger follow-ups",
    command: "Email Sarah the photos and remind me Friday.",
    outcome: "Prepares the email, attaches the right media, creates the reminder, and logs the activity.",
    systems: ["Email", "Calendar", "Task system"],
    icon: CalendarCheck,
  },
  {
    title: "Move work into systems",
    command: "Send the invoice and update the account.",
    outcome: "Drafts the invoice message, records the customer update, and routes everything for review.",
    systems: ["ERP", "CRM", "Accounting"],
    icon: CloudCheck,
  },
];

const pilotOutcomes = [
  ["Admin hours reduced", "Track the manual follow-up, note entry, and system update work that no longer needs to be typed from scratch."],
  ["Follow-ups captured", "Count reminders, emails, tasks, and customer asks that would otherwise live in someone's head or inbox."],
  ["Records completed", "Measure customer, job, project, ticket, and account records drafted or updated from natural work capture."],
  ["Emails and tasks drafted", "See how much routine communication and assignment work is prepared for review."],
  ["Photos and videos attached", "Confirm proof, site context, documents, and media are connected to the right customer or work item."],
  ["Review accuracy", "Compare drafted actions against approved edits so the pilot gets safer and sharper each week."],
];

const systemStripItems = [
  "CRM",
  "Email & calendar",
  "Field service",
  "Project tools",
  "Ticketing",
  "ERP",
  "Knowledge base",
];

const guardrails = [
  ["Human approval", "Choose which actions need review before an email is sent, an invoice is shared, or a system is updated."],
  ["Allowed automations", "Admins define which voice commands are enabled by role, team, system, and workflow."],
  ["Scoped API access", "Each connected CRM, calendar, inbox, ERP, or field-service tool uses customer-scoped credentials."],
  ["Audit history", "Every capture, draft, edit, approval, rejection, and sync is recorded for review."],
  ["Role permissions", "Limit who can view, approve, automate, search, or export sensitive company memory."],
  ["Private instance", "Each company operates in its own isolated workspace with no cross-company memory sharing."],
];

const securityPrinciples = [
  {
    title: "Private company instance",
    text: "Each customer has an isolated workspace for company memory, users, roles, integrations, automation policies, and audit history.",
    icon: Buildings,
  },
  {
    title: "Human-controlled execution",
    text: "Sensitive actions can be drafted first, then approved, edited, routed, or rejected before they touch an external system.",
    icon: CheckCircle,
  },
  {
    title: "Scoped integrations",
    text: "API credentials for CRM, email, calendar, ERP, accounting, and field-service systems stay scoped to the customer workspace.",
    icon: CloudCheck,
  },
];

const securityControls = [
  ["No cross-company memory", "One customer's knowledge is not used to answer another customer's questions."],
  ["Role-based permissions", "Control who can capture, search, approve, automate, export, or administer workspace data."],
  ["Admin automation policies", "Define which voice commands are allowed, blocked, or approval-gated by workflow."],
  ["Audit logs", "Track captures, AI drafts, edits, approvals, rejections, syncs, and system destinations."],
  ["Data retention controls", "Set practical retention rules for captured notes, media, transcripts, and structured memory."],
  ["Integration boundaries", "Limit each connected system to the actions and data needed for the approved workflow."],
];

const securityWorkflow = [
  ["Capture", "Employee speaks, snaps a photo, records video, or issues a voice command."],
  ["Draft", "Elevated AI extracts intent, context, attachments, and system-ready fields."],
  ["Approve", "User or manager reviews sensitive actions before anything external happens."],
  ["Sync", "Approved updates move through scoped APIs with an audit trail."],
];

const walkthroughSteps = [
  {
    label: "Speak",
    title: "Worker gives a natural voice command",
    quote: "Email Sarah the inspection photos and invoice.",
    detail: "No form, no menu hunt, no end-of-day admin. The employee says what needs to happen while the job context is still fresh.",
    output: ["Voice captured", "Current job detected", "Sarah matched to contact"],
    icon: Microphone,
  },
  {
    label: "Understand",
    title: "Elevated AI identifies intent and context",
    quote: "Intent: send customer email with job media and invoice.",
    detail: "The assistant connects the command to the right customer, job, files, invoice, and recent notes before preparing the action.",
    output: ["Inspection photos found", "Invoice attached", "Job summary generated"],
    icon: Sparkle,
  },
  {
    label: "Draft",
    title: "The tedious work is prepared automatically",
    quote: "Draft email to Sarah Martinez with photos, invoice, and summary.",
    detail: "Elevated AI drafts the email, gathers attachments, prepares the system update, and creates any follow-up tasks needed.",
    output: ["Email drafted", "Attachments ready", "CRM note prepared"],
    icon: NotePencil,
  },
  {
    label: "Review",
    title: "The user stays in control",
    quote: "Review, edit, approve, or cancel before anything sends.",
    detail: "External actions are reviewable before sync. Teams can require manager, finance, or admin approval for sensitive workflows.",
    output: ["Approve email", "Edit summary", "Route to finance"],
    icon: CheckCircle,
  },
  {
    label: "Sync",
    title: "APIs update the systems and log the action",
    quote: "Email sent. Task created. Account updated. Audit logged.",
    detail: "Approved actions move through scoped integrations into email, CRM, calendars, invoices, work orders, and company memory.",
    output: ["Email sent", "Task created", "Audit trail saved"],
    icon: CloudCheck,
  },
];

const trustControls = [
  ["Dedicated company workspace", "Each customer gets an isolated workspace for memory, users, roles, integrations, and settings."],
  ["No cross-company memory", "Company knowledge is not shared across customer workspaces or used to answer another company's questions."],
  ["Human approval", "Review AI-drafted updates before anything syncs to a live system."],
  ["Role-based access", "Limit who can view customer, project, team, and sensitive memory."],
  ["Isolated integrations", "CRM, email, calendar, field-service, and project-tool credentials stay scoped to one company workspace."],
  ["Audit trail", "See what was captured, extracted, approved, edited, and sent."],
];

const appDemoScreens = [
  {
    id: "capture",
    label: "Capture",
    title: "Capture what happened in the moment",
    text: "Tap the mic, add photos or video, and leave the job, meeting, or store visit without typing the same update later.",
    icon: Microphone,
  },
  {
    id: "extract",
    label: "AI extraction",
    title: "AI turns messy input into structured work",
    text: "The assistant identifies tasks, risks, opportunities, notes, materials, people, and updates from the captured context.",
    icon: Sparkle,
  },
  {
    id: "commands",
    label: "Commands",
    title: "Ask the assistant to do the next step",
    text: "Send invoices, check schedules, draft emails, create follow-ups, start quotes, update systems, and ask company memory through natural voice commands.",
    icon: CalendarCheck,
  },
  {
    id: "approve",
    label: "Approval",
    title: "Review updates before anything syncs",
    text: "Managers or admins approve, edit, route, or reject AI-drafted updates before they touch live systems.",
    icon: CheckCircle,
  },
  {
    id: "digest",
    label: "Digest",
    title: "Leaders see what happened today",
    text: "Daily intelligence summarizes new risks, missed follow-ups, quote opportunities, customer asks, and team activity.",
    icon: BellRinging,
  },
  {
    id: "search",
    label: "Search",
    title: "Ask the company memory what it knows",
    text: "Search across people, customers, projects, jobs, photos, notes, and follow-ups without knowing where the update lives.",
    icon: MagnifyingGlass,
  },
];

const sampleNotes = [
  {
    label: "Beverage rep",
    image: beverageImage,
    quote: "Store manager wants to expand the endcap next month. Cooler #7 door gasket is torn and Pepsi is running a two-for-one promo across the aisle.",
    items: [
      ["Opportunity", "Endcap expansion for June reset", "High impact"],
      ["Task", "Replace cooler #7 door gasket", "Due Friday"],
      ["Risk", "Competitor promo may reduce velocity", "Medium"],
      ["CRM note", "Manager prefers morning deliveries", "Saved"],
    ],
  },
  {
    label: "Software AE",
    image: meetingImage,
    quote: "CFO asked about SOC 2, wants procurement looped in, and said renewal risk is low if we can show dashboard adoption by team.",
    items: [
      ["Opportunity", "Expansion into finance team", "High impact"],
      ["Task", "Send SOC 2 packet to procurement", "Today"],
      ["Risk", "Renewal depends on adoption proof", "Medium"],
      ["Account note", "CFO cares about team-level dashboard usage", "Saved"],
    ],
  },
  {
    label: "Pharma field team",
    image: pharmaImage,
    quote: "Clinic needs updated educational materials, inventory is low in cabinet B, and Dr. Ramos asked for a follow-up before next Thursday.",
    items: [
      ["Task", "Send updated clinic materials", "Tomorrow"],
      ["Risk", "Inventory low in cabinet B", "Attention"],
      ["Reminder", "Follow up with Dr. Ramos", "Next week"],
      ["Account note", "Clinic prefers concise patient handouts", "Saved"],
    ],
  },
];

const fieldSalesSamples = [
  {
    label: "Store visit",
    image: beverageImage,
    quote: "Buyer wants two new SKUs in the cold case next month. Competitor is discounting lime seltzer, and the store manager asked for a Friday follow-up.",
    items: [
      ["Opportunity", "Two-SKU cold case expansion", "$18k pipeline"],
      ["Task", "Follow up with store manager", "Friday"],
      ["Risk", "Competitor promo on lime seltzer", "Attention"],
      ["CRM note", "Buyer prefers Friday morning check-ins", "Saved"],
    ],
  },
  {
    label: "Account meeting",
    image: meetingImage,
    quote: "CFO likes the expansion plan but needs procurement in the loop. Renewal looks solid if we show adoption by region before the QBR.",
    items: [
      ["Opportunity", "Regional expansion package", "$42k pipeline"],
      ["Task", "Send procurement package", "Today"],
      ["Risk", "Renewal depends on adoption proof", "Medium"],
      ["CRM note", "CFO wants usage by region", "Saved"],
    ],
  },
  {
    label: "Territory check",
    image: pharmaImage,
    quote: "Dr. Ramos requested updated materials, office manager said inventory is low, and the rep should revisit before next Thursday.",
    items: [
      ["Task", "Send updated materials", "Tomorrow"],
      ["Risk", "Inventory low at account", "Attention"],
      ["Reminder", "Revisit before next Thursday", "Scheduled"],
      ["CRM note", "Office wants concise leave-behinds", "Saved"],
    ],
  },
];

const fieldServiceSamples = [
  {
    label: "Electrical job",
    image: serviceElectricalImage,
    quote: "Replaced 200 amp panel at Smith residence. Customer wants a generator quote. Permit inspection is needed next week, and the existing meter socket is showing corrosion.",
    items: [
      ["Work order note", "200 amp panel replaced", "Ready"],
      ["Opportunity", "Generator quote requested", "Drafted"],
      ["Task", "Schedule permit inspection", "Next week"],
      ["Risk", "Meter socket corrosion", "Review"],
    ],
  },
  {
    label: "HVAC visit",
    image: serviceHvacImage,
    quote: "Replaced capacitor on rooftop unit three. Customer mentioned the west office still runs warm, filter rack is bent, and they want a maintenance plan quote before Friday.",
    items: [
      ["Job note", "Capacitor replaced on RTU-3", "Saved"],
      ["Task", "Inspect west office airflow", "Open"],
      ["Opportunity", "Maintenance plan quote", "Friday"],
      ["Risk", "Bent filter rack", "Flagged"],
    ],
  },
  {
    label: "Restoration check",
    image: serviceRestorationImage,
    quote: "Moisture reading is still elevated behind the baseboard. Uploaded wall cavity video, customer asked about cabinet replacement timing, and adjuster needs photos by tomorrow.",
    items: [
      ["Evidence", "Wall cavity video uploaded", "Attached"],
      ["Task", "Send photos to adjuster", "Tomorrow"],
      ["Customer ask", "Cabinet timing requested", "Logged"],
      ["Risk", "Moisture still elevated", "Attention"],
    ],
  },
];

const fieldServiceAutomations = [
  {
    title: "Send invoice and photos",
    command: "Send the invoice and inspection photos to the customer.",
    outcome: "Elevated AI drafts the customer email, attaches the right job photos and invoice, and logs the communication.",
    systems: ["Email", "Invoice", "Job record"],
    icon: FileText,
  },
  {
    title: "Create quote follow-up",
    command: "Customer wants a generator quote. Follow up Friday.",
    outcome: "Elevated AI drafts the quote opportunity, creates the follow-up task, and adds the customer request to account history.",
    systems: ["CRM", "Calendar", "Quote queue"],
    icon: CalendarCheck,
  },
  {
    title: "Update work order",
    command: "Update the work order and schedule the permit inspection.",
    outcome: "Elevated AI prepares the job closeout note, schedules the inspection task, and routes the update for office review.",
    systems: ["FSM", "Dispatch", "Work order"],
    icon: CloudCheck,
  },
];

const fieldServicePilotGets = [
  "5-10 technician pilot",
  "3 mapped automations",
  "Voice/photo/video capture",
  "Office approval queue",
  "Job record completion scorecard",
  "Quote follow-up tracking",
  "Admin time savings review",
];

const fieldServicePilotNeeds = [
  "One crew or region",
  "Sample work-order fields",
  "Common job types",
  "Approval owner",
  "Primary systems used",
  "30-minute weekly check-in",
];

const tradeExamples = [
  {
    title: "Electrical",
    job: "Panel replacement",
    items: ["Generator quote", "Permit inspection", "Corrosion risk", "Customer email"],
    command: "Replaced the panel. Schedule inspection and start a generator quote.",
    icon: GearSix,
  },
  {
    title: "HVAC",
    job: "Rooftop unit repair",
    items: ["Warm zone follow-up", "Maintenance quote", "Filter rack issue", "Parts note"],
    command: "Capacitor is replaced. Follow up on west office airflow Friday.",
    icon: CloudCheck,
  },
  {
    title: "Plumbing",
    job: "Water heater install",
    items: ["Customer approval", "Parts needed", "Leak follow-up", "Invoice draft"],
    command: "Water heater is installed. Send invoice and create a leak check reminder.",
    icon: ClipboardText,
  },
  {
    title: "Roofing / restoration",
    job: "Moisture mitigation",
    items: ["Adjuster photos", "Cabinet timing", "Moisture risk", "Video evidence"],
    command: "Moisture is still elevated. Send photos to adjuster and flag the risk.",
    icon: HouseLine,
  },
  {
    title: "Property maintenance",
    job: "Unit turnover",
    items: ["Resident request", "Vendor follow-up", "Inspection checklist", "Access notes"],
    command: "Turnover walkthrough complete. Create vendor tasks and update the checklist.",
    icon: Buildings,
  },
];

const fieldSalesPainOptions = ["Stale CRM", "Missed follow-ups", "Rep admin", "Manager visibility"];
const generalPainOptions = ["Missed follow-ups", "Manual admin", "Lost details", "Poor visibility"];
const leadEmail = "hello@elevatedai.com";

function trackEvent(name, properties = {}) {
  if (typeof window === "undefined") return;
  const event = {
    event: name,
    page: window.location.pathname,
    ...properties,
  };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
  if (import.meta.env.DEV) {
    console.info("[analytics]", event);
  }
}

const useCaseClusters = [
  {
    title: "Revenue Teams",
    summary: "Reps talk after customer visits. Elevated AI drafts CRM notes, follow-ups, emails, and account updates.",
    outcome: "Reduce CRM admin and missed follow-ups.",
    examples: ["Field Sales", "Customer Success", "Sales Engineers", "Solutions Consultants"],
    href: "/field-sales",
    action: "Explore revenue teams",
  },
  {
    title: "Retail, Restaurants & Multi-Unit Operations",
    summary: "Store, restaurant, and district teams capture visits, audits, issues, photos, and follow-ups while automation routes tasks and field intelligence.",
    outcome: "Capture store issues, audits, and field intel.",
    examples: ["QSR / franchise operators", "Retail execution", "Beverage / CPG reps", "Multi-unit operations"],
    href: "/retail-distribution",
    action: "Explore multi-unit teams",
  },
  {
    title: "Field Service & Trades",
    summary: "Technicians talk through the job. Elevated AI drafts work-order notes, quote follow-ups, and proof updates.",
    outcome: "Turn job notes, photos, and commands into office-ready work.",
    examples: ["Electrical contractors", "HVAC companies", "Plumbing companies", "Roofing / restoration"],
    href: "/field-service",
    action: "Explore service teams",
  },
  {
    title: "Built Environment",
    summary: "Architects, engineers, and site teams capture observations, inspections, decisions, and project actions from the field.",
    outcome: "Preserve site decisions, risks, and project actions.",
    examples: ["Architects", "Engineers", "Property maintenance", "Construction services"],
    href: "/built-environment",
    action: "Explore project teams",
  },
  {
    title: "Client Services",
    summary: "Advisors and client teams turn meetings into follow-ups, emails, risks, client history, and firm memory.",
    outcome: "Convert client conversations into follow-through and firm memory.",
    examples: ["Accountants", "Attorneys", "Consultants", "Financial advisors"],
    href: "/client-services",
    action: "Explore client teams",
  },
  {
    title: "Healthcare & Regulated Field Teams",
    summary: "Regulated teams document visits, requests, inventory risks, and sensitive follow-ups with approval controls.",
    outcome: "Document sensitive work with review and audit controls.",
    examples: ["Pharma Field Teams", "Medical device reps", "Home health", "Compliance auditors"],
    href: "/regulated-field-teams",
    action: "Explore regulated teams",
  },
];

const useCasePages = {
  "/retail-distribution": {
    eyebrow: "For QSR, franchise, retail, beverage, CPG, and multi-unit operators",
    title: "Store and restaurant visits turn into follow-ups, field intel, and system updates.",
    description: "Elevated AI helps district managers, field teams, and store operators capture location conditions, audits, maintenance issues, staffing concerns, photos, videos, and follow-ups while automation drafts the tasks and updates leaders need.",
    heroImage: retailHeroImage,
    examples: [
      ["QSR / franchise operators", "Capture visit recaps, food-safety checks, staffing concerns, maintenance needs, and follow-ups."],
      ["Retail execution", "Capture shelf gaps, display compliance, planogram notes, and store manager asks."],
      ["Beverage / CPG reps", "Turn cooler issues, new placement requests, and competitor promos into tasks and account updates."],
      ["Multi-unit operations", "Turn district visits, store audits, photos, and operational issues into tasks and manager visibility."],
    ],
    automations: [
      { title: "Send store recap", command: "Send the store recap and photos to the manager.", outcome: "Drafts the recap, attaches visit photos, and logs the account note.", systems: ["Email", "CRM", "Photo proof"], icon: Storefront },
      { title: "Create shelf task", command: "Create a task to fix the cooler gasket Friday.", outcome: "Creates the task, links it to the store, and adds the issue to the visit summary.", systems: ["Task system", "Store record", "Digest"], icon: CheckCircle },
      { title: "Flag competitor promo", command: "Competitor is running a discount across the aisle.", outcome: "Flags the risk, updates the account, and adds it to the manager digest.", systems: ["CRM", "Digest", "Risk log"], icon: Warning },
    ],
    gets: ["Store visit capture", "Photo/video proof", "Task and issue extraction", "Competitive intel digest", "Manager review queue", "Pilot scorecard"],
    needs: ["One territory or rep team", "Sample visit fields", "Primary CRM/task system", "Approval owner", "Photo proof examples", "Weekly review"],
  },
  "/built-environment": {
    eyebrow: "For architects, engineers, construction, and property teams",
    title: "Site observations become project actions and searchable memory.",
    description: "Elevated AI helps project teams capture site notes, inspection findings, photos, videos, risks, decisions, and follow-ups without waiting for someone to type the update later.",
    heroImage: builtEnvironmentHeroImage,
    examples: [
      ["Architects", "Capture site observations, client decisions, punch items, and design follow-ups."],
      ["Engineers", "Document inspection notes, field conditions, risks, and project actions."],
      ["Construction services", "Turn walkthroughs, photos, and trade coordination notes into tasks and project updates."],
    ],
    automations: [
      { title: "Create punch item", command: "Create a punch item for the west stair handrail.", outcome: "Drafts the task, attaches photos, and routes it to the project owner.", systems: ["Project tool", "Photo proof", "Task list"], icon: ClipboardText },
      { title: "Send site recap", command: "Send today's site recap to the project team.", outcome: "Drafts the recap, includes open risks, and adds decisions to project memory.", systems: ["Email", "Project memory", "Digest"], icon: FileText },
      { title: "Flag field risk", command: "Access issue may delay inspection next week.", outcome: "Creates a risk entry, schedules follow-up, and surfaces it in the manager digest.", systems: ["Risk log", "Calendar", "PM tool"], icon: Warning },
    ],
    gets: ["Site voice capture", "Photo/video evidence", "Project action extraction", "Risk and decision log", "Approval workflow", "30-day pilot review"],
    needs: ["One project or site team", "Sample project fields", "Primary PM system", "Approval owner", "Common inspection types", "Weekly check-in"],
  },
  "/client-services": {
    eyebrow: "For accountants, attorneys, consultants, and advisors",
    title: "Client conversations become follow-ups, emails, risks, and firm memory.",
    description: "Elevated AI helps client-facing teams capture meeting details, action items, client requests, deadlines, risks, and emails while keeping review controls in place.",
    heroImage: clientServicesHeroImage,
    examples: [
      ["Accountants", "Capture client requests, document needs, deadlines, and follow-up emails."],
      ["Attorneys", "Draft matter notes, client follow-ups, task lists, and reviewable summaries."],
      ["Consultants and advisors", "Turn meetings into next steps, risks, recap emails, and searchable client history."],
    ],
    automations: [
      { title: "Draft client recap", command: "Send the client a recap with the three next steps.", outcome: "Drafts the email, adds tasks, and saves the meeting summary for review.", systems: ["Email", "Task system", "Client record"], icon: Briefcase },
      { title: "Create document request", command: "Ask the client for the missing payroll reports.", outcome: "Drafts the request, creates a follow-up, and tracks the outstanding item.", systems: ["Email", "Client portal", "Task list"], icon: FileText },
      { title: "Log client risk", command: "Renewal risk is high if we miss the Friday deadline.", outcome: "Flags the risk, schedules the deadline, and includes it in the team digest.", systems: ["CRM", "Calendar", "Digest"], icon: Warning },
    ],
    gets: ["Meeting capture", "Reviewable email drafts", "Task extraction", "Client memory", "Permission controls", "Compliance review"],
    needs: ["One client team", "Sample client workflows", "Primary email/task system", "Approval owner", "Sensitive data rules", "Weekly review"],
  },
  "/regulated-field-teams": {
    eyebrow: "For pharma, medical device, home health, and compliance teams",
    title: "Regulated field work gets captured with review and control.",
    description: "Elevated AI helps regulated teams document visits, material requests, inventory concerns, sensitive follow-ups, and account observations with approval policies and audit history.",
    heroImage: regulatedHeroImage,
    examples: [
      ["Pharma field teams", "Capture clinic requests, material needs, inventory notes, and account follow-ups."],
      ["Medical device reps", "Document case support, product questions, training needs, and follow-up tasks."],
      ["Compliance auditors", "Turn observations, photos, findings, and corrective actions into reviewable records."],
    ],
    automations: [
      { title: "Send approved materials", command: "Send the clinic the updated patient education materials.", outcome: "Drafts the request, routes for approval, and logs the account update.", systems: ["Email", "Approval queue", "Account record"], icon: ClipboardText },
      { title: "Create inventory follow-up", command: "Inventory is low in cabinet B. Follow up next week.", outcome: "Creates a task, flags the account, and includes the issue in the field digest.", systems: ["Task system", "Digest", "Account record"], icon: CheckCircle },
      { title: "Log observation", command: "Document this observation for compliance review.", outcome: "Creates a reviewable note, attaches evidence, and preserves an audit trail.", systems: ["Knowledge base", "Audit log", "Review queue"], icon: FileText },
    ],
    gets: ["Visit capture", "Approval-gated drafts", "Sensitive follow-up tracking", "Audit trail", "Role permissions", "Compliance review"],
    needs: ["One field team", "Approval policy owner", "Primary account system", "Sensitive data rules", "Common visit types", "Weekly review"],
  },
};

function Logo() {
  return (
    <a className="logo" href="/" aria-label="Elevated AI home">
      <img src={elevatedAiLogo} alt="Elevated AI" />
    </a>
  );
}

function SiteHeader({ source = "site" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pilotHref = source === "pilot" ? "#pilot-form" : `/pilot?source=${source}-header`;
  const mobilePilotHref = source === "pilot" ? "#pilot-form" : `/pilot?source=${source}-mobile`;

  return (
    <>
      <header className="siteHeader">
        <Logo />
        <button className="menuButton" type="button" aria-label="Open navigation" onClick={() => setMenuOpen(true)}>
          <ListBullets size={24} />
        </button>
        <nav className="desktopNav" aria-label="Primary navigation">
          <a href="/#use-cases">Use cases</a>
          <a href="/app-demo">App demo</a>
          <a href="/security">Security</a>
        </nav>
        <div className="headerActions">
          <a className="button primary" href={pilotHref}>Request pilot</a>
        </div>
      </header>

      {menuOpen && (
        <div className="mobileMenu">
          <button type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)}><X size={22} /></button>
          <a onClick={() => setMenuOpen(false)} href="/#use-cases">Use cases</a>
          <a onClick={() => setMenuOpen(false)} href="/app-demo">App demo</a>
          <a onClick={() => setMenuOpen(false)} href="/security">Security</a>
          <a onClick={() => setMenuOpen(false)} href={mobilePilotHref}>Request pilot</a>
        </div>
      )}
    </>
  );
}

const footerUseCases = [
  ["Field Sales", "/field-sales"],
  ["Field Service", "/field-service"],
  ["Retail & Multi-Unit", "/retail-distribution"],
  ["Built Environment", "/built-environment"],
  ["Client Services", "/client-services"],
  ["Regulated Field Teams", "/regulated-field-teams"],
];

function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div className="footerBrand">
        <Logo />
        <p>Voice capture and voice commands for teams that want less manual data entry and better organizational memory.</p>
        <span>hello@elevatedai.com</span>
      </div>
      <nav className="footerNav" aria-label="Footer navigation">
        <div>
          <strong>Product</strong>
          <a href="/#use-cases">Use cases</a>
          <a href="/voice-commands">Voice commands</a>
          <a href="/integrations">Integrations</a>
          <a href="/pilot-program">30-day pilot</a>
          <a href="/app-demo">App demo</a>
          <a href="/security">Security</a>
          <a href="/pilot">Request pilot</a>
        </div>
        <div>
          <strong>Use cases</strong>
          {footerUseCases.map(([label, href]) => (
            <a href={href} key={href}>{label}</a>
          ))}
        </div>
        <div>
          <strong>Pilot</strong>
          <a href="/pilot-program">Pilot program</a>
          <a href="/pilot-brief">Pilot sales brief</a>
          <a href="/pilot#pilot-form">Map first automations</a>
          <a href="/field-service-brief">Field-service brief</a>
          <a href="/pilot?source=footer">Start a 30-day pilot</a>
        </div>
      </nav>
      <div className="footerBottom">
        <span>Copyright 2026 Elevated AI. All rights reserved.</span>
        <span>Private company workspaces. Human review before system updates.</span>
      </div>
    </footer>
  );
}

function MobileCapture({ activeMode, setActiveMode }) {
  const mode = captureModes.find((item) => item.label === activeMode) ?? captureModes[0];
  const ModeIcon = mode.icon;

  return (
    <section className="phone" aria-label="Mobile capture preview">
      <div className="phoneTop">
        <span>9:41</span>
        <span>On site</span>
      </div>
      <div className="phoneHeader">
        <div>
          <strong>Acme Corp</strong>
          <span>Store visit</span>
        </div>
        <button className="tinyButton" type="button">Sync</button>
      </div>
      <label className="inputLabel" htmlFor="job">What are you working on?</label>
      <input id="job" className="phoneInput" defaultValue="Walk-in cooler inspection" />
      <div className="modeGrid" role="tablist" aria-label="Capture modes">
        {captureModes.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const selected = activeMode === item.label;
          return (
            <button
              className={`modeButton ${selected ? "selected" : ""}`}
              key={item.label}
              onClick={() => setActiveMode(item.label)}
              type="button"
              role="tab"
              aria-selected={selected}
            >
              <Icon size={18} weight={selected ? "fill" : "regular"} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
      <div className="recordingPanel">
        <div className="recordingMeta">
          <span>Recording...</span>
          <span>00:24</span>
        </div>
        <div className="waveform" aria-hidden="true">
          {Array.from({ length: 28 }).map((_, index) => (
            <span key={index} style={{ height: `${12 + (index % 7) * 5}px` }} />
          ))}
        </div>
        <button className="recordButton" type="button" aria-label={`Pause ${activeMode} capture`}>
          {activeMode === "Videos" ? <Play size={18} weight="fill" /> : <Pause size={18} weight="fill" />}
        </button>
      </div>
      <div className="extracting">
        <span><Plus size={14} /> AI extracting...</span>
        <ModeIcon size={18} weight="fill" />
      </div>
      <div className="phoneRows">
        <div><span>Issue</span><strong>Door gasket torn</strong></div>
        <div><span>Action</span><strong>Replace gasket</strong></div>
        <div><span>Priority</span><strong className="redText">High</strong></div>
        <div><span>Asset</span><strong>Walk-in Cooler #7</strong></div>
      </div>
      <button className="linkButton" type="button">View all extractions</button>
      <nav className="phoneNav" aria-label="App preview navigation">
        <button className="active" type="button"><Microphone size={17} />Capture</button>
        <button type="button"><CalendarCheck size={17} />Digest</button>
        <button type="button"><MagnifyingGlass size={17} />Search</button>
        <button type="button"><ListBullets size={17} />More</button>
      </nav>
    </section>
  );
}

function SectionHeader({ number, title, kicker }) {
  return (
    <header className="sectionHeader">
      <h2>{number ? <span>{number}. </span> : null}{title}</h2>
      <p>{kicker}</p>
    </header>
  );
}

function ExtractionDemo({ activeSample, setActiveSample }) {
  const sample = sampleNotes[activeSample];

  return (
    <section className="contentSection demoSection" id="solutions">
      <div className="beforeAfter">
        {beforeAfter.map(([label, text]) => (
          <article key={label}>
            <span>{label}</span>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <div className="demoShell">
        <div className="demoCopy">
          <span className="eyebrow">Interactive sample</span>
          <h2>Talk naturally. Skip the data entry.</h2>
          <p>Click a sample field note and watch Elevated AI turn a messy conversation into structured tasks, updates, risks, and searchable memory.</p>
          <div className="sampleTabs" role="tablist" aria-label="Sample field notes">
            {sampleNotes.map((item, index) => (
              <button
                aria-selected={activeSample === index}
                className={activeSample === index ? "selected" : ""}
                key={item.label}
                onClick={() => setActiveSample(index)}
                role="tab"
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="notePanel">
          <img src={sample.image} alt="" />
          <div>
            <strong>Field note</strong>
            <p>{sample.quote}</p>
          </div>
        </div>
        <div className="structuredPanel">
          <div className="panelTop">
            <strong><Sparkle size={18} weight="fill" /> AI extraction</strong>
            <span>Work-ready</span>
          </div>
          {sample.items.map(([type, title, status]) => (
            <div className="structuredRow" key={`${type}-${title}`}>
              <span>{type}</span>
              <strong>{title}</strong>
              <b>{status}</b>
            </div>
          ))}
          <button type="button">
            <CloudCheck size={17} />
            Create tasks and updates
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}

function FieldSalesPilotSection() {
  const pilotSteps = [
    ["1", "Map the workflow", "We identify the field notes, visit types, CRM fields, and manager reports that matter most."],
    ["2", "Launch with 10-25 reps", "A focused team captures voice, photos, videos, and visit notes from real customer work."],
    ["3", "Review before sync", "Managers can approve, correct, or route extracted tasks, risks, notes, and opportunities."],
    ["4", "Measure what was missed", "The pilot report shows captured follow-ups, risks, opportunities, and stale-account signals."],
  ];

  const pilotIncludes = [
    "CRM workflow mapping",
    "Voice/photo/video capture",
    "Daily manager digest",
    "Opportunity and risk extraction",
    "Approval queue before CRM sync",
    "Pilot success review",
  ];

  return (
    <section className="contentSection pilotSection" id="field-sales-pilot">
      <div className="pilotIntro">
        <span className="eyebrow">30-day pilot</span>
        <h2>Find what your reps are forgetting before you change the whole workflow.</h2>
        <p>Start with a focused team, prove the capture behavior, and measure whether Elevated AI creates cleaner CRM data and better manager visibility.</p>
        <a className="button primary large" href="/pilot?source=field-sales-pilot">Scope a field-sales pilot</a>
      </div>
      <div className="pilotPlan">
        {pilotSteps.map(([number, title, text]) => (
          <article key={title}>
            <span>{number}</span>
            <div>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>
      <aside className="pilotIncludes" aria-label="Pilot includes">
        <strong>What your team gets</strong>
        <div>
          {pilotIncludes.map((item) => (
            <span key={item}><CheckCircle size={16} weight="fill" />{item}</span>
          ))}
        </div>
      </aside>
    </section>
  );
}

function FieldServicePilotSection() {
  const pilotSteps = [
    ["Week 1", "Map workflows and systems", "Pick the first three admin workflows, confirm work-order fields, invoice/photo handoffs, quote follow-ups, and approval rules."],
    ["Week 2", "Launch with 5-10 techs", "A focused crew uses voice notes, photos, videos, and commands on real jobs without changing the whole operation."],
    ["Week 3", "Tune drafts and approvals", "Dispatch, managers, or office admins review drafted job notes, emails, invoices, quotes, and inspection tasks before sync."],
    ["Week 4", "Measure the scorecard", "Review admin time reduced, quote follow-ups captured, job record completeness, invoices/photos sent, and office rework avoided."],
  ];

  const pilotIncludes = [
    "Workflow and system map",
    "5-10 technician launch",
    "Voice/photo/video capture",
    "Approval rules and routing",
    "Office review queue",
    "30-day savings readout",
  ];

  const scorecard = [
    ["Admin hours reduced", "Time saved by avoiding duplicate job notes and end-of-day paperwork."],
    ["Quote follow-ups captured", "Generator, maintenance plan, repair, and upsell requests that become tasks."],
    ["Job records completed", "Work-order notes, photos, videos, risks, materials, and customer asks attached."],
    ["Invoices/photos sent", "Customer emails drafted with the right invoice, media, and job summary."],
    ["Follow-ups created", "Customer callbacks, inspections, adjuster requests, and office tasks scheduled."],
    ["Office rework reduced", "Fewer missing details, unclear notes, and back-and-forth calls after the job."],
  ];

  return (
    <section className="contentSection pilotSection" id="field-service-pilot">
      <div className="pilotIntro">
        <span className="eyebrow">30-day pilot</span>
        <h2>A practical 30-day pilot for one crew or region.</h2>
        <p>Prove three voice-driven automations, keep the office in control, and measure whether Elevated AI reduces admin while improving job history.</p>
        <a className="button primary large" href="/pilot?source=field-service-pilot">Map three trades automations</a>
      </div>
      <div className="pilotPlan">
        {pilotSteps.map(([number, title, text]) => (
          <article key={title}>
            <span>{number}</span>
            <div>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>
      <aside className="pilotIncludes" aria-label="Pilot includes">
        <strong>What your team gets</strong>
        <div>
          {pilotIncludes.map((item) => (
            <span key={item}><CheckCircle size={16} weight="fill" />{item}</span>
          ))}
        </div>
      </aside>
      <div className="pilotScorecard" aria-label="Pilot scorecard">
        <strong>30-day scorecard</strong>
        <div>
          {scorecard.map(([metric, text]) => (
            <article key={metric}>
              <b>{metric}</b>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FieldServiceAutomationsSection() {
  return (
    <section className="contentSection tradeAutomationSection" id="field-service-automations">
      <div className="sectionHeader">
        <span className="eyebrow">First three trades automations</span>
        <h2>Start with the admin work every contractor already knows.</h2>
        <p>Pick the workflows technicians and office teams repeat every day. Elevated AI turns voice commands into draft emails, work-order updates, quote follow-ups, invoices, and scheduled tasks.</p>
      </div>
      <div className="automationCards">
        {fieldServiceAutomations.map(({ title, command, outcome, systems, icon: Icon }) => (
          <article className="automationCard" key={title}>
            <header>
              <span><Icon size={22} weight="fill" /></span>
              <strong>{title}</strong>
            </header>
            <div className="sayLine">
              <small>Tech says</small>
              <p>"{command}"</p>
            </div>
            <div className="doesLine">
              <small>Elevated AI prepares</small>
              <p>{outcome}</p>
            </div>
            <div className="systemChips">
              {systems.map((system) => <span key={system}>{system}</span>)}
            </div>
          </article>
        ))}
      </div>
      <div className="automationCta">
        <div>
          <strong>30-day contractor pilot:</strong>
          <p>Map the first three admin workflows, launch with one crew, and measure paperwork reduced, quote follow-ups captured, and job records completed.</p>
        </div>
        <a className="button primary large" href="/pilot?source=field-service-automations">Map these three automations</a>
      </div>
    </section>
  );
}

function FieldServicePilotSummarySection() {
  return (
    <section className="contentSection pilotSummarySection" id="field-service-summary">
      <div className="pilotSummaryIntro">
        <span className="eyebrow">Forwardable summary</span>
        <h2>Send this to your ops team.</h2>
        <p>A practical 30-day pilot for one crew or region, built around the manual admin work technicians and office teams already repeat every day.</p>
        <a className="button primary large" href="/pilot?source=field-service-summary">Map this pilot</a>
      </div>
      <div className="pilotSummaryLists">
        <article>
          <strong>What your team gets in 30 days</strong>
          <div>
            {fieldServicePilotGets.map((item) => (
              <span key={item}><CheckCircle size={16} weight="fill" />{item}</span>
            ))}
          </div>
        </article>
        <article>
          <strong>What we need from you</strong>
          <div>
            {fieldServicePilotNeeds.map((item) => (
              <span key={item}><CheckCircle size={16} weight="fill" />{item}</span>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function TradeExamplesSection() {
  return (
    <section className="contentSection tradeExamplesSection" id="field-service-trades">
      <div className="sectionHeader">
        <span className="eyebrow">Trade examples</span>
        <h2>Built for the jobs your crews already run.</h2>
        <p>Elevated AI does not need technicians to become software users. It listens to the job context they already say out loud and prepares the updates the office needs.</p>
      </div>
      <div className="tradeExampleGrid">
        {tradeExamples.map(({ title, job, items, command, icon: Icon }) => (
          <article className="tradeExampleCard" key={title}>
            <header>
              <span><Icon size={22} weight="fill" /></span>
              <div>
                <strong>{title}</strong>
                <p>{job}</p>
              </div>
            </header>
            <ul>
              {items.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <div>
              <small>Example command</small>
              <p>"{command}"</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function UseCasesSection() {
  return (
    <section className="contentSection useCasesSection" id="use-cases">
      <SectionHeader title="Built for teams where work happens away from the keyboard" kicker="If important work starts in conversations, site visits, customer meetings, photos, videos, or field notes, Elevated AI can turn it into action." />
      <div className="useCaseGrid">
        {useCaseClusters.map((cluster) => (
          <article className={cluster.href ? "useCaseCard active" : "useCaseCard"} key={cluster.title}>
            <div>
              <strong>{cluster.title}</strong>
              <span className="useCaseOutcome">{cluster.outcome}</span>
              <p>{cluster.summary}</p>
            </div>
            <ul>
              {cluster.examples.map((example) => <li key={example}>{example}</li>)}
            </ul>
            {cluster.href ? (
              <a href={cluster.href}>{cluster.action} <ArrowRight size={16} /></a>
            ) : (
              <span>{cluster.action}</span>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function SystemsStripSection() {
  return (
    <section className="systemsStripSection" aria-label="Systems Elevated AI works with">
      <div>
        <span className="eyebrow">Works with your systems</span>
        <h2>Voice capture becomes useful when it lands in the tools your team already uses.</h2>
      </div>
      <div className="systemsStrip">
        {systemStripItems.map((item) => <span key={item}>{item}</span>)}
      </div>
      <a className="watchLink dark" href="/integrations">See integrations <ArrowRight size={18} /></a>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="contentSection howSection" id="how-it-works">
      <div className="howIntro">
        <span className="eyebrow">How it works</span>
        <h2>Talk to your assistant. Let automation handle the busywork.</h2>
        <p>Elevated AI turns natural voice capture and voice commands into the actions, records, and updates your business systems need.</p>
      </div>
      <div className="howGrid">
        {workflowSteps.map(({ title, text, icon: Icon }, index) => (
          <article className="howCard" key={title}>
            <span>{index + 1}</span>
            <Icon size={24} weight="fill" />
            <strong>{title}</strong>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function CommandModeSection() {
  return (
    <section className="contentSection commandSection" id="commands">
      <div className="commandIntro">
        <span className="eyebrow">Command mode</span>
        <h2>What can I say to Elevated AI?</h2>
        <p>Speak naturally. Elevated AI captures what happened, understands what you want done, and prepares the tedious follow-through through your existing systems.</p>
      </div>
      <div className="commandGrid">
        {voiceCommands.map(([title, command, outcome]) => (
          <article className="commandCard" key={title}>
            <Microphone size={19} weight="fill" />
            <div>
              <strong>{title}</strong>
              <p>"{command}"</p>
              <span>{outcome}</span>
            </div>
          </article>
        ))}
      </div>
      <div className="automationFlow" aria-label="Voice command automation flow">
        {automationSteps.map(([number, title, text]) => (
          <article key={title}>
            <span>{number}</span>
            <div>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>
      <aside className="commandSafety">
        <strong><CheckCircle size={18} weight="fill" /> Review before send</strong>
        <p>Commands that email clients, send invoices, create quotes, schedule work, or update systems are drafted first. The user confirms before anything external happens.</p>
      </aside>
    </section>
  );
}

function FirstAutomationsSection() {
  return (
    <section className="contentSection firstAutomationsSection" id="first-automations">
      <div className="sectionHeader">
        <span className="eyebrow">Pilot path</span>
        <h2>Start with three tedious workflows.</h2>
        <p>Most teams do not need a giant rollout first. Start with the manual work people already complain about, then prove the time savings with real voice commands and connected systems.</p>
      </div>
      <div className="automationCards">
        {firstAutomations.map(({ title, command, outcome, systems, icon: Icon }) => (
          <article className="automationCard" key={title}>
            <header>
              <span><Icon size={22} weight="fill" /></span>
              <strong>{title}</strong>
            </header>
            <div className="sayLine">
              <small>Say</small>
              <p>"{command}"</p>
            </div>
            <div className="doesLine">
              <small>Elevated AI prepares</small>
              <p>{outcome}</p>
            </div>
            <div className="systemChips">
              {systems.map((system) => <span key={system}>{system}</span>)}
            </div>
          </article>
        ))}
      </div>
      <div className="automationCta">
        <div>
          <strong>Good pilot question:</strong>
          <p>Which three manual workflows would save your team the most time if people could simply say what they need?</p>
        </div>
        <div className="automationCtaActions">
          <a className="button primary large" href="/pilot?source=home-first-automations">Map your first three automations</a>
          <a className="watchLink dark" href="/pilot-program">See the 30-day pilot <ArrowRight size={18} /></a>
        </div>
      </div>
    </section>
  );
}

function PilotOutcomesSection() {
  return (
    <section className="contentSection pilotOutcomesSection">
      <div className="sectionHeader">
        <span className="eyebrow">Pilot outcomes we measure</span>
        <h2>Prove the time savings before you scale.</h2>
        <p>A good pilot should produce evidence. Elevated AI tracks the operational work reduced, the follow-ups saved, and the records completed from real voice capture and commands.</p>
      </div>
      <div className="pilotOutcomeGrid">
        {pilotOutcomes.map(([title, text]) => (
          <article key={title}>
            <CheckCircle size={19} weight="fill" />
            <div>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProductWalkthroughSection() {
  const [activeStep, setActiveStep] = useState(0);
  const active = walkthroughSteps[activeStep];
  const ActiveIcon = active.icon;

  return (
    <section className="contentSection walkthroughSection" id="walkthrough">
      <div className="walkthroughCopy">
        <span className="eyebrow">Product walkthrough</span>
        <h2>From voice command to completed work in five visible steps.</h2>
        <p>Show buyers the whole motion: the employee speaks, Elevated AI understands, drafts the tedious work, asks for review, then updates the right systems through APIs.</p>
        <div className="walkthroughTabs" role="tablist" aria-label="Product walkthrough steps">
          {walkthroughSteps.map(({ label, icon: Icon }, index) => (
            <button
              aria-selected={activeStep === index}
              className={activeStep === index ? "selected" : ""}
              key={label}
              onClick={() => setActiveStep(index)}
              role="tab"
              type="button"
            >
              <Icon size={17} weight={activeStep === index ? "fill" : "regular"} />
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="walkthroughStage">
        <div className="walkthroughPhone">
          <div className="walkthroughTop">
            <span>9:41</span>
            <b>Elevated AI</b>
            <small>{active.label}</small>
          </div>
          <div className="walkthroughScreen">
            <div className="walkthroughIcon">
              <ActiveIcon size={34} weight="fill" />
            </div>
            <span>{active.label}</span>
            <strong>{active.title}</strong>
            <p>"{active.quote}"</p>
          </div>
        </div>
        <aside className="walkthroughOutput">
          <span>Step {activeStep + 1} of {walkthroughSteps.length}</span>
          <h3>{active.title}</h3>
          <p>{active.detail}</p>
          <div>
            {active.output.map((item) => (
              <b key={item}><CheckCircle size={16} weight="fill" />{item}</b>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

function AutomationGuardrailsSection() {
  return (
    <section className="contentSection guardrailsSection" id="guardrails">
      <div className="guardrailsIntro">
        <span className="eyebrow">Automation with guardrails</span>
        <h2>Let people move faster without giving automation a blank check.</h2>
        <p>Elevated AI is designed so teams can use voice commands confidently. Admins decide what can be automated, users review sensitive actions, and every system update stays traceable.</p>
        <a className="button primary large" href="/pilot?source=home-guardrails">Map controls for your pilot</a>
      </div>
      <div className="guardrailsGrid">
        {guardrails.map(([title, text]) => (
          <article key={title}>
            <CheckCircle size={19} weight="fill" />
            <div>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>
      <aside className="policyPanel" aria-label="Admin policy preview">
        <div className="policyTop">
          <span>Admin policy</span>
          <strong>Voice actions</strong>
          <b>Controlled</b>
        </div>
        {[
          ["Email client", "Review required"],
          ["Update CRM", "Manager approval"],
          ["Create task", "Auto-draft"],
          ["Send invoice", "Finance approval"],
        ].map(([action, policy]) => (
          <div className="policyRow" key={action}>
            <span>{action}</span>
            <b>{policy}</b>
          </div>
        ))}
      </aside>
    </section>
  );
}

function RoiSection() {
  const [teamSize, setTeamSize] = useState(25);
  const [minutes, setMinutes] = useState(30);
  const weeklyHours = Math.round((teamSize * minutes * 5) / 60);
  const monthlyHours = Math.round(weeklyHours * 4.33);

  return (
    <section className="contentSection roiSection" id="roi">
      <div className="roiCopy">
        <span className="eyebrow">Data-entry math</span>
        <h2>Manual updates are more expensive than they look.</h2>
        <p>Even a small amount of daily admin becomes a large weekly drag once every rep, technician, advisor, or project lead has to do it.</p>
      </div>
      <div className="roiPanel" aria-label="Manual data entry time calculator">
        <div className="roiControls">
          <label>
            <span>People entering updates</span>
            <div className="roiValueLine">
              <strong>{teamSize}</strong>
              <input
                aria-label="People entering updates number"
                max="250"
                min="5"
                onChange={(event) => setTeamSize(Number(event.target.value))}
                type="number"
                value={teamSize}
              />
            </div>
            <input
              aria-label="People entering updates"
              max="250"
              min="5"
              onChange={(event) => setTeamSize(Number(event.target.value))}
              onInput={(event) => setTeamSize(Number(event.currentTarget.value))}
              step="5"
              type="range"
              value={teamSize}
            />
          </label>
          <label>
            <span>Minutes per person per day</span>
            <div className="roiValueLine">
              <strong>{minutes}</strong>
              <input
                aria-label="Minutes per person per day number"
                max="90"
                min="10"
                onChange={(event) => setMinutes(Number(event.target.value))}
                type="number"
                value={minutes}
              />
            </div>
            <input
              aria-label="Minutes per person per day"
              max="90"
              min="10"
              onChange={(event) => setMinutes(Number(event.target.value))}
              onInput={(event) => setMinutes(Number(event.currentTarget.value))}
              step="5"
              type="range"
              value={minutes}
            />
          </label>
        </div>
        <div className="roiResult">
          <span>Potential admin time to reduce</span>
          <strong>{weeklyHours} hours/week</strong>
          <p>That is roughly {monthlyHours} hours every month spent typing, copying, summarizing, and chasing updates.</p>
          <a className="button primary" href="/pilot?source=home-roi">Map this pilot</a>
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="contentSection trustSection" id="trust">
      <div className="trustCopy">
        <span className="eyebrow">Private company instance</span>
        <h2>Every company gets its own isolated AI workspace.</h2>
        <p>Elevated AI keeps each customer's memory, users, integrations, approvals, and audit history separated by organization.</p>
        <div className="trustGrid">
          {trustControls.map(([title, text]) => (
            <article key={title}>
              <CheckCircle size={19} weight="fill" />
              <div>
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <aside className="approvalQueue" aria-label="Approval queue preview">
        <div className="queueTop">
          <div>
            <span>Private workspace</span>
            <strong>Smith Electric Co.</strong>
          </div>
          <b>Isolated</b>
        </div>
        {[
          ["Memory", "Customer and job history", "Company-only"],
          ["Integrations", "Email, calendar, CRM, FSM", "Scoped"],
          ["Permissions", "Admins, managers, field teams", "Role-based"],
          ["Audit", "Approvals, edits, sync history", "Tracked"],
        ].map(([type, title, status]) => (
          <div className="queueRow" key={`${type}-${title}`}>
            <span>{type}</span>
            <strong>{title}</strong>
            <b>{status}</b>
          </div>
        ))}
        <div className="queueActions">
          <a className="button primary" href="/pilot?source=trust-section">Map a 30-day pilot</a>
          <span>No cross-company memory sharing.</span>
        </div>
      </aside>
    </section>
  );
}

function FieldSalesPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMode, setActiveMode] = useState("Voice");
  const [activeSample, setActiveSample] = useState(0);
  const sample = fieldSalesSamples[activeSample];

  return (
    <main id="top" className="fieldSalesPage">
      <SiteHeader source="field-sales" />

      <section className="hero fieldSalesHero" style={{ backgroundImage: `url(${meetingImage})` }}>
        <div className="heroShade" />
        <div className="heroContent">
          <div className="heroCopy">
            <span className="heroEyebrow">For VP Sales, RevOps, and field managers</span>
            <h1>Field reps talk. Follow-ups and CRM updates get drafted.</h1>
            <p>Use voice capture and voice commands to turn every customer visit into CRM notes, follow-up tasks, emails, meeting prep, expansion opportunities, risks, and searchable account memory.</p>
            <div className="heroActions">
              <a className="button primary large" href="/pilot?source=field-sales-hero">Scope a field-sales pilot</a>
              <a className="watchLink" href="#field-sales-proof">Why teams use it <Play size={18} weight="fill" /></a>
            </div>
            <div className="fieldStats" aria-label="Field sales outcomes">
              <span><b>0</b> after-visit admin</span>
              <span><b>100%</b> searchable account memory</span>
              <span><b>Daily</b> manager digest</span>
            </div>
          </div>
          <MobileCapture activeMode={activeMode} setActiveMode={setActiveMode} />
          <aside className="aiCard" aria-label="CRM extracted preview">
            <strong><Sparkle size={17} weight="fill" /> CRM update drafted</strong>
            <div><span>Opportunity</span><b>Cold case expansion</b></div>
            <div><span>Task</span><b>Friday buyer follow-up</b></div>
            <div><span>Risk</span><b className="redText">Competitor discount</b></div>
            <div><span>Account note</span><b>Prefers morning visits</b></div>
            <a href="/app-demo"><CloudCheck size={16} /> See app demo</a>
          </aside>
        </div>
      </section>

      <section className="contentSection" id="field-sales-proof">
        <SectionHeader title="The CRM problem is not your reps. It is the workflow." kicker="Field teams learn valuable things all day. Most of it never makes it into the system cleanly, quickly, or consistently." />
        <div className="painGrid">
          {[
            ["Stale CRM", "Managers forecast and coach from records that lag behind reality."],
            ["Lost follow-ups", "Customer asks get buried in texts, photos, voice memos, and memory."],
            ["Rep resistance", "Manual CRM admin happens after the day is already full."],
            ["No field visibility", "Leaders miss competitive intel, shelf conditions, objections, and risks."],
          ].map(([title, text]) => (
            <article key={title}>
              <Warning size={22} weight="fill" />
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contentSection fieldSalesDemo" id="field-sales-demo">
        <div className="demoShell">
          <div className="demoCopy">
            <span className="eyebrow">Field sales workflow</span>
            <h2>One visit becomes a complete CRM update.</h2>
            <p>Pick a field-sales scenario. Elevated AI turns natural rep notes and commands into the records and next actions RevOps and managers need.</p>
            <div className="sampleTabs" role="tablist" aria-label="Field sales samples">
              {fieldSalesSamples.map((item, index) => (
                <button
                  aria-selected={activeSample === index}
                  className={activeSample === index ? "selected" : ""}
                  key={item.label}
                  onClick={() => setActiveSample(index)}
                  role="tab"
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="notePanel">
            <img src={sample.image} alt="" />
            <div>
              <strong>Rep note</strong>
              <p>{sample.quote}</p>
            </div>
          </div>
          <div className="structuredPanel">
            <div className="panelTop">
              <strong><Sparkle size={18} weight="fill" /> CRM-ready output</strong>
              <span>Ready to sync</span>
            </div>
            {sample.items.map(([type, title, status]) => (
              <div className="structuredRow" key={`${type}-${title}`}>
                <span>{type}</span>
                <strong>{title}</strong>
                <b>{status}</b>
              </div>
            ))}
            <a href="/app-demo">
              <CloudCheck size={17} />
              See app demo
              <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

      <FieldSalesPilotSection />

      <section className="contentSection soft" id="field-sales-digest">
        <SectionHeader title="Managers see the field without chasing updates" kicker="Every morning, leaders get the account intelligence reps captured yesterday." />
        <div className="digestGrid">
          <article className="digestCard">
            <div className="cardTop"><strong>Pipeline from the field</strong><span>This week</span></div>
            <div className="metricRow">
              {[
                ["47", "New opps", "+19%"],
                ["83", "Follow-ups", "+31%"],
                ["22", "Risks found", "+14%"],
                ["12", "Stale accounts", "-28%"],
              ].map(([value, label, trend]) => <div key={label}><b>{value}</b><span>{label}</span><em>{trend}</em></div>)}
            </div>
          </article>
          <article className="digestCard updates">
            <div className="cardTop"><strong>Coaching moments</strong><span>Today</span></div>
            {[
              ["Buyer objection repeated", "3 accounts mentioned procurement delay", "Coach"],
              ["Competitor promo detected", "Southwest territory seeing discount pressure", "Risk"],
              ["Expansion signal", "8 accounts asked for additional SKUs", "Upside"],
            ].map(([title, meta, tag]) => (
              <div className="updateRow" key={title}>
                <img src={tag === "Risk" ? beverageImage : meetingImage} alt="" />
                <div><strong>{title}</strong><span>{meta}</span></div>
                <b className={tag === "Risk" ? "risk" : "win"}>{tag}</b>
              </div>
            ))}
          </article>
          <article className="digestCard">
            <div className="cardTop"><strong>RevOps controls</strong><span>Live</span></div>
            {["CRM field mapping", "Duplicate detection", "Manager approval queue", "Territory summaries", "Account search"].map((row) => (
              <div className="teamRow" key={row}><span>{row}</span><b><CheckCircle size={16} weight="fill" /></b><em>On</em></div>
            ))}
          </article>
        </div>
      </section>

      <section className="contentSection" id="field-sales-crm">
        <SectionHeader title="Built for the tools revenue teams already use" kicker="Elevated AI sits between reps and your systems, using APIs to draft CRM updates, follow-ups, emails, and summaries without adding more admin." />
        <div className="integrationGrid">
          {["Salesforce", "HubSpot", "Dynamics 365", "Outreach", "Gong", "Email & Calendar"].map((name) => (
            <article className="integrationCard" key={name}>
              <Buildings size={28} weight="fill" />
              <strong>{name}</strong>
              <p>Notes, tasks, opportunities, reminders, and account context stay current.</p>
              <span>Revenue-ready</span>
            </article>
          ))}
        </div>
      </section>

      <section className="finalCta">
        <Logo />
        <div>
          <h2>Stop asking reps to do the system's busywork.</h2>
          <p>Give field teams a faster way to capture visits, command next steps, and let automation prepare the updates managers need.</p>
        </div>
        <a className="button primary large" href="/pilot?source=field-sales-footer">Scope a field-sales pilot</a>
        <a className="watchLink dark" href="/">Back to overview <ArrowRight size={18} /></a>
      </section>
      <SiteFooter />
    </main>
  );
}

function FieldServicePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMode, setActiveMode] = useState("Photos");
  const [activeSample, setActiveSample] = useState(0);
  const sample = fieldServiceSamples[activeSample];

  return (
    <main id="top" className="fieldSalesPage fieldServicePage">
      <SiteHeader source="field-service" />

      <section className="hero fieldSalesHero fieldServiceHero" style={{ backgroundImage: `url(${fieldServiceHeroImage})` }}>
        <div className="heroShade" />
        <div className="heroContent">
          <div className="heroCopy">
            <span className="heroEyebrow">For electrical, HVAC, plumbing, roofing, restoration, and maintenance teams</span>
            <h1>Turn technician voice notes into finished admin work.</h1>
            <p>Use voice capture and voice commands to draft job updates, quote follow-ups, invoices, customer emails, inspection tasks, and proof-of-work records.</p>
            <div className="heroActions">
              <a className="button primary large" href="/pilot?source=field-service-hero">Map three trades automations</a>
              <a className="watchLink" href="#field-service-automations">See the first three <Play size={18} weight="fill" /></a>
            </div>
            <div className="fieldStats" aria-label="Field service outcomes">
              <span><b>0</b> duplicate job notes</span>
              <span><b>Photo</b> proof captured</span>
              <span><b>Daily</b> ops digest</span>
            </div>
          </div>
          <MobileCapture activeMode={activeMode} setActiveMode={setActiveMode} />
          <aside className="aiCard" aria-label="Job update preview">
            <strong><Sparkle size={17} weight="fill" /> Job update drafted</strong>
            <div><span>Work note</span><b>Panel replaced</b></div>
            <div><span>Quote</span><b>Generator requested</b></div>
            <div><span>Risk</span><b className="redText">Socket corrosion</b></div>
            <div><span>Proof</span><b>Photos attached</b></div>
            <a href="/app-demo"><CloudCheck size={16} /> See app demo</a>
          </aside>
        </div>
      </section>

      <section className="contentSection" id="field-service-proof">
        <SectionHeader title="The paperwork problem is not your technicians. It is the workflow." kicker="Field teams should be able to speak naturally, command the next step, and let automation prepare the clean updates, proof, and follow-ups." />
        <div className="painGrid">
          {[
            ["After-job paperwork", "Technicians finish the work, then spend extra time typing job notes later."],
            ["Lost customer requests", "Quotes, questions, and follow-ups disappear into texts, calls, and memory."],
            ["Incomplete job history", "Photos, videos, materials, risks, and decisions are scattered across devices."],
            ["Quote leakage", "Upsell requests and repair recommendations are missed before the office can act."],
          ].map(([title, text]) => (
            <article key={title}>
              <Warning size={22} weight="fill" />
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <TradeExamplesSection />

      <FieldServiceAutomationsSection />

      <section className="contentSection fieldSalesDemo" id="field-service-demo">
        <div className="demoShell">
          <div className="demoCopy">
            <span className="eyebrow">Field service workflow</span>
            <h2>One job visit becomes a complete work-order update.</h2>
            <p>Pick a job scenario. Elevated AI turns natural technician notes, photos, videos, and commands into records and actions the office can review.</p>
            <div className="sampleTabs" role="tablist" aria-label="Field service samples">
              {fieldServiceSamples.map((item, index) => (
                <button
                  aria-selected={activeSample === index}
                  className={activeSample === index ? "selected" : ""}
                  key={item.label}
                  onClick={() => setActiveSample(index)}
                  role="tab"
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="notePanel">
            <img src={sample.image} alt="" />
            <div>
              <strong>Technician note</strong>
              <p>{sample.quote}</p>
            </div>
          </div>
          <div className="structuredPanel">
            <div className="panelTop">
              <strong><Sparkle size={18} weight="fill" /> Work-order output</strong>
              <span>Ready to review</span>
            </div>
            {sample.items.map(([type, title, status]) => (
              <div className="structuredRow" key={`${type}-${title}`}>
                <span>{type}</span>
                <strong>{title}</strong>
                <b>{status}</b>
              </div>
            ))}
            <a href="/app-demo">
              <CloudCheck size={17} />
              See app demo
              <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

      <section className="contentSection soft">
        <SectionHeader title="Photos, videos, and voice become proof of work" kicker="Elevated AI keeps visual evidence connected to the job, customer request, risk, and follow-up it supports." />
        <div className="integrationGrid">
          {[
            ["Photo evidence", "Before, after, serial plates, site conditions, damage, and completed work stay attached."],
            ["Video context", "Short walkthroughs preserve the details a written note would miss."],
            ["Customer requests", "Quotes, callbacks, approvals, and questions become follow-up tasks."],
            ["Risk flags", "Safety issues, corrosion, moisture, access problems, and incomplete work get surfaced."],
          ].map(([title, text]) => (
            <article className="integrationCard" key={title}>
              <Image size={28} weight="fill" />
              <strong>{title}</strong>
              <p>{text}</p>
              <span>Captured</span>
            </article>
          ))}
        </div>
      </section>

      <FieldServicePilotSection />

      <FieldServicePilotSummarySection />

      <TrustSection />

      <section className="contentSection" id="field-service-systems">
        <SectionHeader title="Built for the tools service teams already use" kicker="Elevated AI sits between technicians and your systems, using APIs to draft updates and automate admin without adding more field work." />
        <div className="integrationGrid">
          {["ServiceTitan", "Jobber", "Housecall Pro", "ServiceNow", "Salesforce", "Email & Calendar"].map((name) => (
            <article className="integrationCard" key={name}>
              <Buildings size={28} weight="fill" />
              <strong>{name}</strong>
              <p>Job notes, tasks, quote requests, proof, risks, and customer context stay current.</p>
              <span>Service-ready</span>
            </article>
          ))}
        </div>
      </section>

      <section className="finalCta">
        <Logo />
        <div>
          <h2>Stop turning technicians into data-entry staff.</h2>
          <p>Give field teams a faster way to capture job reality, command next steps, and let automation handle the tedious admin.</p>
        </div>
        <a className="button primary large" href="/pilot?source=field-service-footer">Map three trades automations</a>
        <a className="watchLink dark" href="/field-service-brief">Open pilot brief <ArrowRight size={18} /></a>
      </section>
      <SiteFooter />
    </main>
  );
}

function AppDemoPage() {
  const [activeScreen, setActiveScreen] = useState("capture");
  const active = appDemoScreens.find((screen) => screen.id === activeScreen) ?? appDemoScreens[0];
  const ActiveIcon = active.icon;

  return (
    <main className="appDemoPage" id="top">
      <SiteHeader source="app-demo" />

      <section className="appDemoHero">
        <div className="appDemoIntro">
          <span className="eyebrow">Product demo</span>
          <h1>See voice capture and voice commands in action.</h1>
          <p>See Elevated AI capture work naturally, understand what needs to happen, use APIs and automation to draft the next step, and keep company memory searchable.</p>
          <div className="appDemoTabs" role="tablist" aria-label="Product demo screens">
            {appDemoScreens.map(({ id, label, icon: Icon }) => (
              <button
                aria-selected={activeScreen === id}
                className={activeScreen === id ? "selected" : ""}
                key={id}
                onClick={() => setActiveScreen(id)}
                role="tab"
                type="button"
              >
                <Icon size={17} weight={activeScreen === id ? "fill" : "regular"} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="appDemoStage">
          <aside className="demoNarrative">
            <span><ActiveIcon size={20} weight="fill" /> {active.label}</span>
            <h2>{active.title}</h2>
            <p>{active.text}</p>
            <img className="demoNarrativeImage" src={fieldMemoryHeroImage} alt="" />
            <div className="demoNarrativeMeta">
              <strong>What this proves</strong>
              <span>Voice replaces duplicate typing</span>
              <span>Automation drafts tedious tasks</span>
              <span>Human review before sync</span>
            </div>
          </aside>

          <section className="pwaShell" aria-label={`${active.label} app screen`}>
            <div className="pwaTop">
              <span>9:41</span>
              <b>Elevated AI</b>
              <small>{active.label}</small>
            </div>

            {activeScreen === "capture" && (
              <div className="pwaScreen captureScreen">
                <div className="workContext">
                  <span>Current work</span>
                  <strong>Smith residence panel replacement</strong>
                  <p>Electrical service visit</p>
                </div>
                <button className="bigMic" type="button" aria-label="Record voice note">
                  <Microphone size={42} weight="fill" />
                </button>
                <div className="captureActions">
                  <button type="button"><Image size={19} /> Photo</button>
                  <button type="button"><VideoCamera size={19} /> Video</button>
                  <button type="button"><FileText size={19} /> Document</button>
                </div>
                <div className="liveTranscript">
                  <span>Live note</span>
                  <p>Replaced 200 amp panel. Customer wants generator quote. Need permit inspection next week.</p>
                </div>
              </div>
            )}

            {activeScreen === "extract" && (
              <div className="pwaScreen extractScreen">
                {[
                  ["Task", "Schedule permit inspection", "Next week"],
                  ["Opportunity", "Generator quote requested", "Sales"],
                  ["Risk", "Meter socket corrosion", "Review"],
                  ["Job note", "200 amp panel replaced", "Saved"],
                ].map(([type, title, status]) => (
                  <div className="pwaRow" key={title}>
                    <span>{type}</span>
                    <strong>{title}</strong>
                    <b>{status}</b>
                  </div>
                ))}
                <div className="mediaPreview">
                  <img src={serviceElectricalImage} alt="" />
                  <img src={serviceRestorationImage} alt="" />
                </div>
              </div>
            )}

            {activeScreen === "commands" && (
              <div className="pwaScreen commandScreen">
                <div className="voiceCommandBox">
                  <span>Voice command</span>
                  <strong>"Email Sarah the inspection photos and invoice."</strong>
                </div>
                <div className="draftAction">
                  <span>Drafted action</span>
                  <strong>Email to Sarah Martinez</strong>
                  <p>Attached: inspection photos, Smith invoice, job summary.</p>
                </div>
                <div className="draftAction">
                  <span>Schedule answer</span>
                  <strong>Next: Permit inspection at 2:30 PM</strong>
                  <p>Drive time is 18 minutes. Customer prefers morning calls for follow-up.</p>
                </div>
                <button className="confirmSend" type="button"><CheckCircle size={17} weight="fill" /> Review before send</button>
              </div>
            )}

            {activeScreen === "approve" && (
              <div className="pwaScreen approvalScreen">
                {[
                  ["Approve", "Create permit inspection task", "Task"],
                  ["Edit", "Generator quote opportunity", "Opportunity"],
                  ["Review", "Meter socket corrosion concern", "Risk"],
                ].map(([action, title, type]) => (
                  <div className="approvalItem" key={title}>
                    <div>
                      <span>{type}</span>
                      <strong>{title}</strong>
                    </div>
                    <button type="button">{action}</button>
                  </div>
                ))}
                <p className="syncNote"><CheckCircle size={16} weight="fill" /> Nothing syncs until a human approves it.</p>
              </div>
            )}

            {activeScreen === "digest" && (
              <div className="pwaScreen digestScreen">
                <div className="digestHero">
                  <span>Today</span>
                  <strong>18 follow-ups captured</strong>
                  <p>6 risks, 4 quote requests, 8 customer asks</p>
                </div>
                {[
                  ["High risk", "Corrosion concern at Smith residence"],
                  ["Quote", "Generator request from Smith residence"],
                  ["Missed update", "Three jobs missing closeout photos"],
                ].map(([tag, text]) => (
                  <div className="digestLine" key={text}><b>{tag}</b><span>{text}</span></div>
                ))}
              </div>
            )}

            {activeScreen === "search" && (
              <div className="pwaScreen memoryScreen">
                <label>
                  <MagnifyingGlass size={17} />
                  <input readOnly value="What generator requests came in this week?" />
                </label>
                <div className="answerBox">
                  <span>Answer</span>
                  <p>3 generator quote requests were captured this week. Smith residence has panel replacement context and a permit inspection task pending.</p>
                </div>
                <div className="sourceBox">
                  <strong>Sources</strong>
                  <span>Voice note - Smith residence</span>
                  <span>Photo set - Panel replacement</span>
                  <span>Manager digest - Friday</span>
                </div>
              </div>
            )}
          </section>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMode, setActiveMode] = useState("Voice");
  const [activeSample, setActiveSample] = useState(0);
  const [query, setQuery] = useState("");
  const filteredResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return searchResults;
    return searchResults.filter((item) => `${item.title} ${item.meta} ${item.tag}`.toLowerCase().includes(normalized));
  }, [query]);

  return (
    <main id="top">
      <SiteHeader source="home" />

      <section className="hero" style={{ backgroundImage: `url(${homeHeroImage})` }}>
        <div className="heroShade" />
        <div className="heroContent">
          <div className="heroCopy">
            <h1>Talk to your AI assistant. <span>Get work done.</span></h1>
            <p>Elevated AI uses voice capture, voice commands, APIs, and automation to handle data entry, follow-ups, emails, tasks, schedules, updates, and other tedious manual work.</p>
            <div className="heroActions">
              <a className="button primary large" href="/pilot?source=home-hero">Map your first three automations</a>
              <a className="watchLink" href="/app-demo">Try the app demo <Play size={18} weight="fill" /></a>
            </div>
            <div className="heroProofRow" aria-label="Primary benefits">
              <span>Save hours of manual admin</span>
              <span>Command tedious tasks by voice</span>
              <span>Never lose follow-ups</span>
            </div>
            <div className="industryRow" aria-label="Industries">
              <small>Used by teams across industries</small>
              <div>
                {industries.map(({ label, icon: Icon }) => (
                  <span key={label}><Icon size={20} />{label}</span>
                ))}
              </div>
            </div>
          </div>
          <MobileCapture activeMode={activeMode} setActiveMode={setActiveMode} />
          <aside className="aiCard" aria-label="AI extracted preview">
            <strong><Sparkle size={17} weight="fill" /> AI extracted</strong>
            <div><span>Issue</span><b>Door gasket torn</b></div>
            <div><span>Action</span><b>Replace gasket</b></div>
            <div><span>Priority</span><b className="redText">High</b></div>
            <div><span>Asset</span><b>Walk-in Cooler #7</b></div>
            <button type="button"><CloudCheck size={16} /> Draft update</button>
          </aside>
        </div>
      </section>

      <HowItWorksSection />

      <UseCasesSection />

      <SystemsStripSection />

      <CommandModeSection />

      <FirstAutomationsSection />

      <PilotOutcomesSection />

      <ProductWalkthroughSection />

      <AutomationGuardrailsSection />

      <section className="contentSection" id="capture">
        <SectionHeader number="1" title="Capture work and issue commands without typing" kicker="Voice, photos, videos, documents, and notes become structured updates, while voice commands trigger the next task for review." />
        <div className="captureGrid">
          {captureModes.map((item, index) => {
            const Icon = item.icon;
            const active = activeMode === item.label;
            const media = [null, beverageImage, meetingImage, null, null][index];
            return (
              <button
                className={`captureTile ${active ? "active" : ""}`}
                key={item.label}
                type="button"
                onClick={() => setActiveMode(item.label)}
              >
                <header><Icon size={23} weight={active ? "fill" : "regular"} /><strong>{item.label}</strong></header>
                <p>{item.detail}</p>
                {media ? (
                  <img src={media} alt="" />
                ) : (
                  <div className="miniSurface">
                    {item.label === "Voice" && <><span>00:28</span><div className="waveform small">{Array.from({ length: 17 }).map((_, i) => <i key={i} />)}</div></>}
                    {item.label === "Documents" && <><b>Invoice #</b><span>984512</span><b>Total</b><span>$1,240.00</span></>}
                    {item.label === "Notes" && <p>Spoke with store manager. Agreed to expand endcap placement next visit.</p>}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <ExtractionDemo activeSample={activeSample} setActiveSample={setActiveSample} />

      <RoiSection />

      <section className="contentSection soft" id="product">
        <SectionHeader number="2" title="AI turns raw inputs into organized action" kicker="Elevated AI understands what happened, what matters, and what should be created, assigned, updated, sent, scheduled, or remembered." />
        <div className="extractGrid">
          {extractedColumns.map(({ title, icon: Icon, color, items }) => (
            <article className={`extractCard ${color}`} key={title}>
              <header><Icon size={23} weight="fill" /><strong>{title}</strong></header>
              <p>{title === "Tasks" ? "What needs to get done." : title === "Opportunities" ? "What can grow." : title === "Risks" ? "What could go wrong." : title === "Assets" ? "What it's about." : "Important context."}</p>
              <ul>
                {items.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <a href="#search">View all {title.toLowerCase()}</a>
            </article>
          ))}
        </div>
      </section>

      <section className="contentSection" id="systems">
        <SectionHeader number="3" title="APIs move the work into the tools you already use" kicker="No duplicate data entry. The right tasks, notes, summaries, emails, records, and schedules get drafted for the right system." />
        <div className="integrationGrid">
          {integrations.map((name) => (
            <article className="integrationCard" key={name}>
              <Buildings size={28} weight="fill" />
              <strong>{name}</strong>
              <p>{name === "50+ more" ? "Connect your tools and keep data in sync." : "Updates, tasks, notes, and summaries stay up to date."}</p>
              <span>{name === "50+ more" ? "View integrations" : "Connected"}</span>
            </article>
          ))}
        </div>
      </section>

      <TrustSection />

      <section className="contentSection soft" id="digest">
        <SectionHeader number="4" title="Leaders get visibility without chasing updates" kicker="A single source of truth for what's happening away from the desk, generated from the work your team already captured." />
        <div className="digestGrid">
          <article className="digestCard">
            <div className="cardTop"><strong>Daily digest</strong><a href="#search">View full digest</a></div>
            <div className="metricRow">
              {[
                ["128", "Touchpoints", "+18%"],
                ["32", "Tasks created", "+12%"],
                ["24", "Opportunities", "+25%"],
                ["11", "Risks identified", "-8%"],
              ].map(([value, label, trend]) => <div key={label}><b>{value}</b><span>{label}</span><em>{trend}</em></div>)}
            </div>
          </article>
          <article className="digestCard updates">
            <div className="cardTop"><strong>Top updates</strong><span>Today</span></div>
            {updates.map((item) => (
              <div className="updateRow" key={item.title}>
                <img src={item.tone === "risk" ? beverageImage : item.tone === "win" ? meetingImage : pharmaImage} alt="" />
                <div><strong>{item.title}</strong><span>{item.meta}</span></div>
                <b className={item.tone}>{item.tag}</b>
              </div>
            ))}
          </article>
          <article className="digestCard">
            <div className="cardTop"><strong>Activity by team</strong><span>Today</span></div>
            {["Field Sales", "Merchandising", "Customer Success", "Service Operations", "Property Management"].map((team, index) => (
              <div className="teamRow" key={team}><span>{team}</span><b>{[52, 28, 18, 16, 14][index]}</b><em>{index === 3 ? "-5%" : `+${[15, 22, 8, 5, 12][index]}%`}</em></div>
            ))}
          </article>
        </div>
      </section>

      <section className="contentSection" id="search">
        <SectionHeader number="5" title="Search across people, customers, projects, and more" kicker="Find any conversation, note, photo, or insight in seconds." />
        <div className="searchPanel">
          <div className="searchControls">
            <label className="searchBox">
              <MagnifyingGlass size={18} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search anything..." />
            </label>
            <select aria-label="Time range"><option>All time</option><option>Last 7 days</option></select>
            <select aria-label="Team"><option>All teams</option><option>Field Sales</option></select>
            <button type="button"><Funnel size={17} /> Filters</button>
          </div>
          <div className="resultsHeader"><strong>Results ({filteredResults.length})</strong><span>List</span></div>
          {filteredResults.map((item) => (
            <article className="resultRow" key={item.title}>
              <img src={item.media[0]} alt="" />
              <div className="resultText"><strong>{item.title}</strong><span>{item.meta}</span><p>Manager agreed to expand placement next visit.</p></div>
              <div className="mediaStrip">{item.media.map((src) => <img src={src} alt="" key={src} />)}</div>
              <b>{item.tag}</b>
            </article>
          ))}
        </div>
      </section>

      <section className="finalCta" id="demo">
        <Logo />
        <div>
          <h2>Stop paying your best people to do data entry.</h2>
          <p>Elevated AI helps teams save time by turning voice capture and voice commands into organized work your systems can use.</p>
        </div>
        <a className="button primary large" href="/pilot?source=home-footer">Map a 30-day pilot</a>
        <a className="watchLink dark" href="/app-demo">Try the app demo <Play size={18} weight="fill" /></a>
      </section>
      <SiteFooter />
    </main>
  );
}

function SecurityPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main id="top" className="securityPage">
      <SiteHeader source="security" />

      <section className="securityHero visualSecurityHero" style={{ backgroundImage: `linear-gradient(90deg, rgba(10, 15, 12, 0.96) 0%, rgba(10, 15, 12, 0.84) 43%, rgba(10, 15, 12, 0.38) 100%), url(${securityGovernanceImage})` }}>
        <div className="securityHeroCopy">
          <span className="eyebrow">Security & control</span>
          <h1>Automation your team can govern.</h1>
          <p>Elevated AI is built for voice-first work automation with private company instances, human approval, scoped API access, role permissions, and audit history.</p>
          <div className="heroActions">
            <a className="button primary large" href="/pilot?source=security-hero">Map controls for your pilot</a>
            <a className="watchLink" href="/app-demo">See app demo <Play size={18} weight="fill" /></a>
          </div>
        </div>
        <aside className="securitySummary" aria-label="Security summary">
          {["Private workspace per company", "No cross-company memory sharing", "Approval before external actions", "Scoped integrations and audit logs"].map((item) => (
            <span key={item}><CheckCircle size={17} weight="fill" />{item}</span>
          ))}
        </aside>
      </section>

      <section className="contentSection securityPrinciples">
        {securityPrinciples.map(({ title, text, icon: Icon }) => (
          <article key={title}>
            <Icon size={28} weight="fill" />
            <strong>{title}</strong>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section className="contentSection securityControlsSection" id="controls">
        <div className="sectionHeader">
          <span className="eyebrow">Control model</span>
          <h2>Give admins the levers before automation touches real systems.</h2>
          <p>Voice commands should make work faster, not less governed. Elevated AI keeps automation policy, permissions, approvals, and integration scope visible.</p>
        </div>
        <div className="securityControlGrid">
          {securityControls.map(([title, text]) => (
            <article key={title}>
              <CheckCircle size={19} weight="fill" />
              <div>
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="contentSection securityWorkflowSection" id="workflow">
        <div className="securityWorkflowCopy">
          <span className="eyebrow">Execution path</span>
          <h2>From voice command to system update, every step is visible.</h2>
          <p>The point is not unchecked autonomy. The point is to remove tedious manual work while preserving review, policy, and traceability.</p>
        </div>
        <div className="securityWorkflow">
          {securityWorkflow.map(([title, text], index) => (
            <article key={title}>
              <span>{index + 1}</span>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="finalCta">
        <Logo />
        <div>
          <h2>Map the controls around your first automations.</h2>
          <p>Start with the workflows your team wants to automate, then define approval rules, roles, integrations, and audit needs.</p>
        </div>
        <a className="button primary large" href="/pilot?source=security-footer">Map security controls</a>
        <a className="watchLink dark" href="/">Back to overview <ArrowRight size={18} /></a>
      </section>
      <SiteFooter />
    </main>
  );
}

function FieldServiceBriefPage() {
  const briefUpdated = "June 13, 2026";
  const briefShortUrl = "elevatedai.com/trades-pilot";
  const handlePrint = () => {
    trackEvent("field_service_brief_print_clicked");
    window.print();
  };
  const handlePilotClick = () => trackEvent("field_service_brief_pilot_clicked");

  return (
    <main className="briefPage" id="top">
      <SiteHeader source="brief" />

      <section className="briefSheet">
        <div className="briefHero">
          <span className="eyebrow">Forwardable pilot brief</span>
          <h1>30-Day Elevated AI Pilot for Field Service Teams</h1>
          <div className="briefMetaLine">
            <span>Last updated {briefUpdated}</span>
            <span>Suggested short URL: {briefShortUrl}</span>
            <button className="briefPrintButton" type="button" onClick={handlePrint}>Print brief</button>
          </div>
          <p>Use voice capture and voice commands to help technicians turn job notes, photos, videos, customer requests, invoices, quote follow-ups, and work-order updates into reviewed office-ready admin work.</p>
          <div className="briefHeroMedia">
            <img src={serviceElectricalImage} alt="" />
            <div>
              <strong>Example workflow</strong>
              <span>Technician captures proof, voice notes, quote requests, and inspection follow-ups from the job site.</span>
            </div>
          </div>
        </div>

        <div className="briefMetaGrid">
          <article>
            <strong>Who it is for</strong>
            <p>Electrical, HVAC, plumbing, roofing/restoration, and property maintenance teams with technicians who capture job reality away from a keyboard.</p>
          </article>
          <article>
            <strong>Pilot shape</strong>
            <p>One crew or region, 5-10 technicians, three mapped automations, office approval queue, and a 30-day scorecard.</p>
          </article>
        </div>

        <section className="briefBlock">
          <div>
            <span className="eyebrow">First three automations</span>
            <h2>Start where admin pain is already obvious.</h2>
          </div>
          <div className="briefThree">
            {fieldServiceAutomations.map(({ title, command, outcome }) => (
              <article key={title}>
                <strong>{title}</strong>
                <p>"{command}"</p>
                <span>{outcome}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="briefBlock">
          <div>
            <span className="eyebrow">Rollout</span>
            <h2>Week-by-week plan</h2>
          </div>
          <div className="briefTimeline">
            {[
              ["Week 1", "Map workflows and systems", "Confirm work-order fields, invoice/photo handoffs, quote follow-ups, and approval rules."],
              ["Week 2", "Launch with 5-10 techs", "Use voice notes, photos, videos, and commands on real jobs without changing the whole operation."],
              ["Week 3", "Tune drafts and approvals", "Review drafted job notes, emails, invoices, quotes, and inspection tasks before sync."],
              ["Week 4", "Measure the scorecard", "Review admin time reduced, quote follow-ups captured, job records completed, and office rework avoided."],
            ].map(([week, title, text]) => (
              <article key={week}>
                <span>{week}</span>
                <strong>{title}</strong>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="briefBlock briefTwoColumn">
          <article>
            <span className="eyebrow">Scorecard</span>
            <h2>What we measure</h2>
            <div>
              {["Admin hours reduced", "Quote follow-ups captured", "Job records completed", "Invoices/photos sent", "Follow-ups created", "Office rework reduced"].map((item) => (
                <b key={item}><CheckCircle size={15} weight="fill" />{item}</b>
              ))}
            </div>
          </article>
          <article>
            <span className="eyebrow">Inputs</span>
            <h2>What we need from you</h2>
            <div>
              {fieldServicePilotNeeds.map((item) => (
                <b key={item}><CheckCircle size={15} weight="fill" />{item}</b>
              ))}
            </div>
          </article>
        </section>

        <section className="briefCta">
          <div>
            <strong>Ready to scope the pilot?</strong>
            <p>Use the pilot form to share one crew or region, your primary field-service system, and the three admin workflows you want to reduce first.</p>
          </div>
          <a className="button primary large" href="/pilot?source=field-service-brief-cta" onClick={handlePilotClick}>Map this pilot</a>
        </section>
      </section>
      <SiteFooter />
    </main>
  );
}

const pilotBriefAutomations = [
  {
    title: "Capture the work",
    example: "Turn this visit into notes, follow-ups, risks, and customer history.",
    outcome: "Voice, photos, videos, and notes become structured records your team can review.",
  },
  {
    title: "Command the next step",
    example: "Send the recap, create the task, update the system, and remind me Tuesday.",
    outcome: "Elevated AI drafts the action and routes it through the right approval path.",
  },
  {
    title: "Sync approved updates",
    example: "Save the approved notes, email, task, schedule item, and account update.",
    outcome: "APIs move clean information into the business systems your team already uses.",
  },
];

const pilotBriefQuestions = [
  "Where does your team still retype information after calls, visits, jobs, meetings, or inspections?",
  "Which three updates would create the most time savings if AI drafted them automatically?",
  "Which systems need to be updated first: CRM, email, calendar, field service, tickets, ERP, or knowledge base?",
  "Who needs to review or approve AI-drafted work before it is sent or synced?",
  "What evidence matters: photos, videos, documents, customer requests, risks, signatures, or notes?",
  "What does success look like after 30 days: hours saved, follow-ups captured, records completed, or rework reduced?",
];

function PilotBriefPage() {
  const briefUpdated = "June 14, 2026";
  const briefShortUrl = "elevatedai.com/pilot-brief";
  const handlePrint = () => {
    trackEvent("pilot_brief_print_clicked");
    window.print();
  };
  const handlePilotClick = () => trackEvent("pilot_brief_pilot_clicked");

  return (
    <main className="briefPage" id="top">
      <SiteHeader source="pilot-brief" />

      <section className="briefSheet">
        <div className="briefHero">
          <span className="eyebrow">Forwardable pilot brief</span>
          <h1>Elevated AI Pilot Sales Brief</h1>
          <div className="briefMetaLine">
            <span>Last updated {briefUpdated}</span>
            <span>Suggested short URL: {briefShortUrl}</span>
            <button className="briefPrintButton" type="button" onClick={handlePrint}>Print brief</button>
          </div>
          <p>Elevated AI helps teams save time by using voice capture, voice commands, APIs, and automation to reduce manual data entry, draft tedious follow-ups, and preserve company memory.</p>
          <div className="briefHeroMedia">
            <img src={pilotWorkshopImage} alt="" />
            <div>
              <strong>Core promise</strong>
              <span>Your people talk naturally. Elevated AI organizes the work, prepares the next action, and keeps humans in control before systems update.</span>
            </div>
          </div>
        </div>

        <div className="briefMetaGrid">
          <article>
            <strong>Who it is for</strong>
            <p>Field teams, sales teams, operators, client-service teams, regulated reps, and managers who lose time to manual updates after real work happens.</p>
          </article>
          <article>
            <strong>Pilot shape</strong>
            <p>One team or workflow, three mapped automations, connected systems, human review rules, and a 30-day scorecard for time savings and follow-through.</p>
          </article>
        </div>

        <section className="briefBlock">
          <div>
            <span className="eyebrow">Buyer message</span>
            <h2>Stop paying your best people to do data entry.</h2>
          </div>
          <div className="briefThree">
            {pilotBriefAutomations.map(({ title, example, outcome }) => (
              <article key={title}>
                <strong>{title}</strong>
                <p>"{example}"</p>
                <span>{outcome}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="briefBlock">
          <div>
            <span className="eyebrow">30-day pilot</span>
            <h2>Prove value with a small, measured rollout.</h2>
          </div>
          <div className="briefTimeline">
            {pilotProgramSteps.map(([week, title, text]) => (
              <article key={week}>
                <span>{week}</span>
                <strong>{title}</strong>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="briefBlock briefTwoColumn">
          <article>
            <span className="eyebrow">Discovery</span>
            <h2>Questions to ask first</h2>
            <div>
              {pilotBriefQuestions.map((item) => (
                <b key={item}><CheckCircle size={15} weight="fill" />{item}</b>
              ))}
            </div>
          </article>
          <article>
            <span className="eyebrow">Positioning</span>
            <h2>How to explain it</h2>
            <div>
              {[
                "Elevated AI is a voice-first work assistant, not another system employees have to update.",
                "The pilot starts with the most tedious workflows, not a full software replacement.",
                "Company data is separated by customer workspace with scoped integrations and review controls.",
                "Pricing should be scoped by team size, systems, automation complexity, and support needs.",
                "The strongest ROI is less manual admin, fewer missed follow-ups, and better organizational memory.",
              ].map((item) => (
                <b key={item}><CheckCircle size={15} weight="fill" />{item}</b>
              ))}
            </div>
          </article>
        </section>

        <section className="briefCta">
          <div>
            <strong>Ready to map a pilot?</strong>
            <p>Use the pilot form to share the team, systems, and manual work you want Elevated AI to reduce first. We will map the first three automations around your real workflow.</p>
          </div>
          <a className="button primary large" href="/pilot?source=pilot-brief-cta" onClick={handlePilotClick}>Map a pilot</a>
        </section>
      </section>
      <SiteFooter />
    </main>
  );
}

const pilotUseCases = [
  "Field service & trades",
  "Field sales",
  "Retail & distribution",
  "Built environment",
  "Client services",
  "Healthcare & regulated teams",
  "General AI work assistant",
];

const pilotSystems = [
  "Email & calendar",
  "Salesforce",
  "HubSpot",
  "Dynamics 365",
  "ServiceTitan / field-service system",
  "Project management tool",
  "ERP / accounting system",
  "Not sure yet",
  "Other",
];

const initialPilotForm = {
  name: "",
  workEmail: "",
  company: "",
  phone: "",
  team: "",
  useCase: "Field service & trades",
  primarySystem: "Email & calendar",
  manualWork: "",
  teamSize: "11-25",
  preferredContact: "Email",
};

function PilotPage() {
  const [form, setForm] = useState(initialPilotForm);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const sourcePage = typeof window === "undefined"
    ? "/pilot"
    : new URLSearchParams(window.location.search).get("source") || document.referrer || "/pilot";

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!isSupabaseConfigured) {
      setStatus("config");
      return;
    }

    setStatus("submitting");

    const payload = {
      work_email: form.workEmail,
      company: form.company,
      name: form.name,
      phone: form.phone,
      team: form.team,
      use_case: form.useCase,
      primary_system: form.primarySystem,
      manual_work: form.manualWork,
      team_size: form.teamSize,
      preferred_contact: form.preferredContact,
      source_page: sourcePage,
    };

    try {
      await submitPilotRequest(payload);
    } catch (insertError) {
      setStatus("error");
      const message = insertError.message || "Unknown Supabase error";
      setError(
        message.includes("Failed to fetch")
          ? "We could not save this request. Please try again or email hello@elevatedai.com."
          : message
      );
      return;
    }

    trackEvent("pilot_request_submitted", {
      company: form.company,
      useCase: form.useCase,
      primarySystem: form.primarySystem,
      teamSize: form.teamSize,
    });
    setStatus("success");
  };

  return (
    <main className="pilotPage" id="top">
      <SiteHeader source="pilot" />

      <section className="pilotHero" style={{ backgroundImage: `linear-gradient(90deg, rgba(10, 15, 12, 0.96) 0%, rgba(10, 15, 12, 0.86) 42%, rgba(10, 15, 12, 0.42) 100%), url(${pilotWorkshopImage})` }}>
        <div className="pilotHeroCopy">
          <span className="eyebrow">Pilot request</span>
          <h1>Map your first three automations.</h1>
          <p>Tell us where manual data entry is slowing the team down. We will map the capture flow, approval rules, connected systems, and 30-day pilot scorecard.</p>
          <div className="pilotHeroBadges">
            {["Voice capture", "Voice commands", "Human review", "API updates"].map((item) => (
              <span key={item}><CheckCircle size={15} weight="fill" />{item}</span>
            ))}
          </div>
        </div>
        <aside className="pilotPromise">
          <strong>What happens next</strong>
          <ol>
            <li>Pick one team and one painful workflow.</li>
            <li>Identify the systems and approval rules.</li>
            <li>Launch a small pilot with measurable admin-time savings.</li>
          </ol>
        </aside>
      </section>

      <section className="pilotFormSection" id="pilot-form">
        <div className="pilotFormIntro">
          <span className="eyebrow">Start small</span>
          <h2>Share your pilot details</h2>
          <p>Share the team, systems, and manual work you want to reduce first. We will use this to map the first three automations and a practical 30-day pilot.</p>
          <div className="pilotFormHighlights">
            {["One team or workflow", "Three automations", "Human review rules", "Measurable time savings"].map((item) => (
              <span key={item}><CheckCircle size={15} weight="fill" />{item}</span>
            ))}
          </div>
        </div>

        <form className="pilotForm" onSubmit={handleSubmit}>
          <div className="pilotFormGrid">
            <label>
              Work email
              <input name="workEmail" onChange={updateForm} placeholder="you@company.com" required type="email" value={form.workEmail} />
            </label>
            <label>
              Company
              <input name="company" onChange={updateForm} placeholder="Acme Services" required value={form.company} />
            </label>
            <label>
              Name
              <input name="name" onChange={updateForm} placeholder="Your name" value={form.name} />
            </label>
            <label>
              Phone
              <input name="phone" onChange={updateForm} placeholder="Optional" value={form.phone} />
            </label>
            <label>
              Team or department
              <input name="team" onChange={updateForm} placeholder="Field service, sales, operations..." value={form.team} />
            </label>
            <label>
              Team size
              <select name="teamSize" onChange={updateForm} value={form.teamSize}>
                {["1-10", "11-25", "25-100", "100-500", "500+"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>
              Use case
              <select name="useCase" onChange={updateForm} value={form.useCase}>
                {pilotUseCases.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>
              Primary system
              <select name="primarySystem" onChange={updateForm} value={form.primarySystem}>
                {pilotSystems.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>
              Preferred contact
              <select name="preferredContact" onChange={updateForm} value={form.preferredContact}>
                {["Email", "Phone", "Either"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
          </div>
          <label className="pilotTextarea">
            What manual work should Elevated AI reduce first?
            <textarea
              name="manualWork"
              onChange={updateForm}
              placeholder="Example: Techs finish jobs but still have to type work-order notes, send invoice emails, upload photos, and remind the office about quote follow-ups."
              required
              rows="5"
              value={form.manualWork}
            />
          </label>

          {status === "config" && (
            <div className="formNotice warning">
              The form is almost ready. Add the Supabase environment variables locally, then restart the dev server.
            </div>
          )}
          {status === "error" && (
            <div className="formNotice error">
              {error}
            </div>
          )}
          {status === "success" ? (
            <section className="pilotSuccessPanel" aria-live="polite">
              <span><CheckCircle size={28} weight="fill" /></span>
              <div>
                <h3>Pilot request received.</h3>
                <p>We have the workflow details and can map the first three automations around your team, systems, and approval needs.</p>
              </div>
              <div className="pilotSuccessSteps">
                {[
                  ["1", "Review workflow", "We look at the manual work you want to reduce first."],
                  ["2", "Map automations", "We outline capture, review, and API update paths."],
                  ["3", "Scope pilot", "You get a practical 30-day pilot plan and scorecard."],
                ].map(([number, title, text]) => (
                  <article key={number}>
                    <b>{number}</b>
                    <strong>{title}</strong>
                    <p>{text}</p>
                  </article>
                ))}
              </div>
              <div className="pilotSuccessActions">
                <a className="button primary" href="/app-demo">View app demo</a>
                <a className="watchLink dark" href="/pilot-brief">Open pilot sales brief <ArrowRight size={18} /></a>
                <button
                  type="button"
                  onClick={() => {
                    setForm(initialPilotForm);
                    setStatus("idle");
                  }}
                >
                  Submit another request
                </button>
              </div>
            </section>
          ) : (
            <button className="button primary large submitPilot" disabled={status === "submitting"} type="submit">
              {status === "submitting" ? "Sending request..." : "Submit pilot request"}
              <ArrowRight size={17} />
            </button>
          )}
        </form>
      </section>
      <SiteFooter />
    </main>
  );
}

const pilotProgramSteps = [
  ["Week 1", "Map workflows and systems", "Choose one team, identify the first three automations, confirm approval rules, and map required fields in the systems you already use."],
  ["Week 2", "Launch with real users", "Start with a focused group using voice capture, photos, videos, and commands during actual work instead of a demo-only sandbox."],
  ["Week 3", "Tune drafts and approvals", "Review what Elevated AI prepares, adjust wording and field mapping, and tighten the human-review queue before anything syncs."],
  ["Week 4", "Measure the scorecard", "Review admin time reduced, follow-ups captured, records completed, rework avoided, and the expansion path for the next team."],
];

const pilotMetrics = [
  "Admin hours reduced",
  "Follow-ups captured",
  "Records completed",
  "Emails and tasks drafted",
  "Photos and notes attached",
  "Office rework avoided",
];

function PilotProgramPage() {
  return (
    <main className="productPage pilotProgramPage" id="top">
      <SiteHeader source="pilot-program" />

      <section className="productHero" style={{ backgroundImage: `linear-gradient(90deg, rgba(10, 15, 12, 0.96) 0%, rgba(10, 15, 12, 0.84) 46%, rgba(10, 15, 12, 0.34) 100%), url(${pilotProgramHeroImage})` }}>
        <div>
          <span className="eyebrow">30-day pilot</span>
          <h1>Prove three automations before changing the whole operation.</h1>
          <p>Start small with one team, three tedious workflows, human review rules, connected systems, and a scorecard that shows whether Elevated AI is saving real admin time.</p>
          <div className="heroActions">
            <a className="button primary large" href="/pilot?source=pilot-program-hero">Map a pilot</a>
            <a className="watchLink" href="#pilot-plan">See the plan <ArrowRight size={18} /></a>
          </div>
        </div>
        <aside className="productHeroPanel">
          {["One team or workflow", "Three automations", "Human review rules", "Connected systems", "Time-savings scorecard"].map((item) => (
            <span key={item}><CheckCircle size={17} weight="fill" />{item}</span>
          ))}
        </aside>
      </section>

      <section className="contentSection productDetailSection" id="pilot-plan">
        <SectionHeader title="A pilot should feel practical from day one" kicker="The goal is not a vague AI experiment. The goal is a small, measured path from voice capture to reviewed system updates." />
        <div className="productTimeline">
          {pilotProgramSteps.map(([week, title, text]) => (
            <article key={week}>
              <span>{week}</span>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contentSection soft productSplitSection">
        <div>
          <span className="eyebrow">Scorecard</span>
          <h2>Measure the tedious work that disappears.</h2>
          <p>Each pilot should be judged by operational outcomes, not novelty. Elevated AI focuses on fewer manual updates, better capture, cleaner records, and faster follow-through.</p>
          <a className="button primary large" href="/pilot?source=pilot-program-scorecard">Request pilot</a>
        </div>
        <div className="scorecardGrid">
          {pilotMetrics.map((item) => (
            <article key={item}><CheckCircle size={18} weight="fill" /><strong>{item}</strong></article>
          ))}
        </div>
      </section>

      <section className="finalCta">
        <Logo />
        <div>
          <h2>Start with the first three automations.</h2>
          <p>Tell us where manual work slows your team down and we will map a practical 30-day pilot.</p>
        </div>
        <a className="button primary large" href="/pilot?source=pilot-program-footer">Map a pilot</a>
        <a className="watchLink dark" href="/app-demo">See app demo <ArrowRight size={18} /></a>
      </section>
      <SiteFooter />
    </main>
  );
}

const commandExamples = [
  { title: "Send invoice and photos", command: "Send Sarah the invoice and job photos.", outcome: "Drafts the email, attaches the right files, and logs the communication.", icon: FileText },
  { title: "Check my schedule", command: "What is next on my schedule?", outcome: "Summarizes the next appointment, travel context, and customer notes.", icon: CalendarCheck },
  { title: "Create a follow-up", command: "Follow up next Tuesday about the generator quote.", outcome: "Creates the task, links it to the customer, and adds it to the digest.", icon: BellRinging },
  { title: "Update the system", command: "Close out this job and note the corrosion risk.", outcome: "Drafts the work-order update, risk note, and review item.", icon: CloudCheck },
  { title: "Email a recap", command: "Send a recap of the meeting with three next steps.", outcome: "Drafts the message and creates tasks for the owners.", icon: NotePencil },
  { title: "Ask company memory", command: "What did John say about the Smith job?", outcome: "Searches captured notes, photos, and history for the answer.", icon: MagnifyingGlass },
];

function VoiceCommandsPage() {
  return (
    <main className="productPage voiceCommandsPage" id="top">
      <SiteHeader source="voice-commands" />

      <section className="productHero" style={{ backgroundImage: `linear-gradient(90deg, rgba(10, 15, 12, 0.96) 0%, rgba(10, 15, 12, 0.84) 46%, rgba(10, 15, 12, 0.34) 100%), url(${voiceCommandsHeroImage})` }}>
        <div>
          <span className="eyebrow">Voice commands</span>
          <h1>Ask your AI assistant to handle the tedious next step.</h1>
          <p>Elevated AI does more than capture notes. Workers can speak natural commands that draft emails, tasks, invoices, updates, reminders, searches, and summaries for review.</p>
          <div className="heroActions">
            <a className="button primary large" href="/pilot?source=voice-commands-hero">Map command workflows</a>
            <a className="watchLink" href="/app-demo">See app demo <Play size={18} weight="fill" /></a>
          </div>
        </div>
        <aside className="voiceCommandPreview">
          <span>Say</span>
          <strong>"Email the customer the invoice, attach the photos, and remind me to follow up Friday."</strong>
          <p>Elevated AI prepares the email, gathers context, creates the reminder, and waits for review.</p>
        </aside>
      </section>

      <section className="contentSection productDetailSection">
        <SectionHeader title="Commands should sound like work, not software" kicker="People should not memorize fields or workflows. They should say what they need done and review the prepared action before it syncs." />
        <div className="commandExampleGrid">
          {commandExamples.map(({ title, command, outcome, icon: Icon }) => (
            <article className="automationCard" key={title}>
              <header>
                <span><Icon size={22} weight="fill" /></span>
                <strong>{title}</strong>
              </header>
              <div className="sayLine">
                <small>Say</small>
                <p>"{command}"</p>
              </div>
              <div className="doesLine">
                <small>Elevated AI prepares</small>
                <p>{outcome}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="contentSection soft productSplitSection">
        <div>
          <span className="eyebrow">Control</span>
          <h2>Voice commands still need human review.</h2>
          <p>The assistant prepares actions, but sensitive updates can be routed through review rules, role permissions, and audit history before anything is sent or synced.</p>
        </div>
        <div className="productChecklist">
          {["Review before send", "Approval rules by action type", "Scoped API access", "Audit history", "Editable drafts", "Private company memory"].map((item) => (
            <span key={item}><CheckCircle size={17} weight="fill" />{item}</span>
          ))}
        </div>
      </section>

      <section className="finalCta">
        <Logo />
        <div>
          <h2>Turn spoken requests into reviewed action.</h2>
          <p>Start with the commands your team already wishes they could say instead of typing into systems.</p>
        </div>
        <a className="button primary large" href="/pilot?source=voice-commands-footer">Map command workflows</a>
        <a className="watchLink dark" href="/integrations">See integrations <ArrowRight size={18} /></a>
      </section>
      <SiteFooter />
    </main>
  );
}

const integrationGroups = [
  ["CRM", "Accounts, opportunities, notes, tasks, follow-ups, and field intelligence.", ["Salesforce", "HubSpot", "Dynamics 365"]],
  ["Email & calendar", "Draft emails, schedule follow-ups, summarize meetings, and answer schedule questions.", ["Outlook", "Google Workspace", "Microsoft 365"]],
  ["Field service", "Work-order notes, proof photos, quote requests, invoices, and inspection tasks.", ["ServiceTitan", "Jobber", "Housecall Pro"]],
  ["Project tools", "Site observations, tasks, risks, decisions, and project memory.", ["Asana", "Monday", "Procore"]],
  ["Ticketing & support", "Customer requests, issue summaries, escalations, and resolution notes.", ["Zendesk", "ServiceNow", "Jira"]],
  ["Company memory", "Searchable context across customers, projects, visits, photos, videos, and decisions.", ["Knowledge base", "Data warehouse", "Internal search"]],
];

function IntegrationsPage() {
  return (
    <main className="productPage integrationsPage" id="top">
      <SiteHeader source="integrations" />

      <section className="productHero" style={{ backgroundImage: `linear-gradient(90deg, rgba(10, 15, 12, 0.96) 0%, rgba(10, 15, 12, 0.84) 46%, rgba(10, 15, 12, 0.34) 100%), url(${integrationsHeroImage})` }}>
        <div>
          <span className="eyebrow">Integrations</span>
          <h1>APIs move the work into the tools your company already uses.</h1>
          <p>Elevated AI sits between natural work and business software, preparing the records, tasks, emails, reminders, and summaries that usually require manual data entry.</p>
          <div className="heroActions">
            <a className="button primary large" href="/pilot?source=integrations-hero">Map your systems</a>
            <a className="watchLink" href="/security">Review controls <ArrowRight size={18} /></a>
          </div>
        </div>
        <aside className="productHeroPanel">
          {["Draft before sync", "Scoped API access", "Field mapping", "Approval queue", "Audit history"].map((item) => (
            <span key={item}><CheckCircle size={17} weight="fill" />{item}</span>
          ))}
        </aside>
      </section>

      <section className="contentSection productDetailSection">
        <SectionHeader title="Connect where the admin work already goes" kicker="The first pilot does not need every integration. It needs the few systems where your team loses the most time to repeated updates." />
        <div className="integrationGroupGrid">
          {integrationGroups.map(([title, text, systems]) => (
            <article className="integrationGroupCard" key={title}>
              <Buildings size={26} weight="fill" />
              <strong>{title}</strong>
              <p>{text}</p>
              <div>
                {systems.map((system) => <span key={system}>{system}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="contentSection soft productSplitSection">
        <div>
          <span className="eyebrow">Integration path</span>
          <h2>Start with drafts, then automate what proves reliable.</h2>
          <p>Elevated AI can begin by preparing reviewed drafts and structured payloads. Once the workflow is trusted, approved actions can sync through APIs with clear permissions.</p>
        </div>
        <div className="productChecklist">
          {["Map required fields", "Draft update payloads", "Route for approval", "Sync to system", "Log every action", "Report time saved"].map((item) => (
            <span key={item}><CheckCircle size={17} weight="fill" />{item}</span>
          ))}
        </div>
      </section>

      <section className="finalCta">
        <Logo />
        <div>
          <h2>Map the systems behind your first automations.</h2>
          <p>Tell us the tools your team uses today and the manual updates you want Elevated AI to reduce first.</p>
        </div>
        <a className="button primary large" href="/pilot?source=integrations-footer">Map integrations</a>
        <a className="watchLink dark" href="/voice-commands">See voice commands <ArrowRight size={18} /></a>
      </section>
      <SiteFooter />
    </main>
  );
}

function UseCaseLandingPage({ page }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="useCaseLandingPage" id="top">
      <SiteHeader source="use-case" />

      <section className="securityHero useCaseHero" style={{ "--use-case-hero-image": `url(${page.heroImage})` }}>
        <div className="securityHeroCopy">
          <span className="eyebrow">{page.eyebrow}</span>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
          <div className="heroActions">
            <a className="button primary large" href="/pilot?source=use-case-hero">Map a 30-day pilot</a>
            <a className="watchLink" href="#automations">See automations <ArrowRight size={18} /></a>
          </div>
        </div>
        <aside className="securitySummary" aria-label="Use case summary">
          {["Voice capture", "Voice commands", "Human review", "System updates"].map((item) => (
            <span key={item}><CheckCircle size={17} weight="fill" />{item}</span>
          ))}
        </aside>
      </section>

      <section className="contentSection useCaseExamplesSection" id="examples">
        <SectionHeader title="Where Elevated AI fits" kicker="Start with the teams and workflows where important details already live in conversations, photos, meetings, visits, and follow-ups." />
        <div className="useCaseDetailGrid">
          {page.examples.map(([title, text]) => (
            <article key={title}>
              <Briefcase size={24} weight="fill" />
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contentSection tradeAutomationSection" id="automations">
        <div className="sectionHeader">
          <span className="eyebrow">First automations</span>
          <h2>Start with three workflows people already repeat.</h2>
          <p>Each pilot starts with concrete voice commands, review rules, connected systems, and a scorecard for time saved.</p>
        </div>
        <div className="automationCards">
          {page.automations.map(({ title, command, outcome, systems, icon: Icon }) => (
            <article className="automationCard" key={title}>
              <header>
                <span><Icon size={22} weight="fill" /></span>
                <strong>{title}</strong>
              </header>
              <div className="sayLine">
                <small>Say</small>
                <p>"{command}"</p>
              </div>
              <div className="doesLine">
                <small>Elevated AI prepares</small>
                <p>{outcome}</p>
              </div>
              <div className="systemChips">
                {systems.map((system) => <span key={system}>{system}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="contentSection pilotSummarySection" id="pilot">
        <div className="pilotSummaryIntro">
          <span className="eyebrow">30-day pilot</span>
          <h2>Make the first pilot small, measurable, and easy to approve.</h2>
          <p>Map one team, three workflows, approval rules, connected systems, and a scorecard before expanding the program.</p>
          <a className="button primary large" href="/pilot?source=use-case-summary">Map this pilot</a>
        </div>
        <div className="pilotSummaryLists">
          <article>
            <strong>What your team gets</strong>
            <div>
              {page.gets.map((item) => (
                <span key={item}><CheckCircle size={16} weight="fill" />{item}</span>
              ))}
            </div>
          </article>
          <article>
            <strong>What we need from you</strong>
            <div>
              {page.needs.map((item) => (
                <span key={item}><CheckCircle size={16} weight="fill" />{item}</span>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="finalCta">
        <Logo />
        <div>
          <h2>Turn natural work into reviewed system updates.</h2>
          <p>Start with one team and three tedious workflows. Elevated AI can map the capture, approval, and API update path.</p>
        </div>
        <a className="button primary large" href="/pilot?source=use-case-footer">Map a 30-day pilot</a>
        <a className="watchLink dark" href="/">Back to overview <ArrowRight size={18} /></a>
      </section>
      <SiteFooter />
    </main>
  );
}

const defaultMeta = {
  title: "Elevated AI | Voice Capture and Automation for Work",
  description: "Elevated AI helps teams use voice capture, voice commands, APIs, and automation to reduce manual data entry, preserve company memory, and keep business systems updated.",
};

const routeMeta = {
  "/": defaultMeta,
  "/field-sales": {
    title: "Elevated AI for Field Sales",
    description: "Help field reps turn customer visits, voice notes, follow-ups, emails, and account updates into reviewed CRM-ready work.",
  },
  "/field-service": {
    title: "Elevated AI for Field Service Teams",
    description: "Help technicians turn voice notes, photos, videos, invoices, quote follow-ups, and work-order updates into reviewed office-ready admin work.",
  },
  "/field-service-brief": {
    title: "30-Day Field Service Pilot Brief | Elevated AI",
    description: "A forwardable 30-day pilot brief for field service teams using voice capture and automation to reduce admin work.",
  },
  "/pilot-brief": {
    title: "Pilot Sales Brief | Elevated AI",
    description: "A forwardable Elevated AI pilot brief covering the core promise, pilot offer, example automations, security posture, pricing language, and discovery questions.",
  },
  "/app-demo": {
    title: "App Demo | Elevated AI",
    description: "See how Elevated AI turns voice capture and voice commands into structured work, review queues, digests, and searchable company memory.",
  },
  "/security": {
    title: "Security and Control | Elevated AI",
    description: "Elevated AI supports private company workspaces, scoped integrations, human review, permissions, and audit history.",
  },
  "/pilot": {
    title: "Request a Pilot | Elevated AI",
    description: "Share your team, systems, and manual work so Elevated AI can map your first three automations and a practical 30-day pilot.",
  },
  "/pilot-program": {
    title: "30-Day Pilot Program | Elevated AI",
    description: "Start with one team, three automations, human review rules, connected systems, and a scorecard for admin time saved.",
  },
  "/voice-commands": {
    title: "Voice Commands | Elevated AI",
    description: "Use natural voice commands to draft emails, tasks, invoices, follow-ups, schedule answers, system updates, and searchable company memory.",
  },
  "/integrations": {
    title: "Integrations | Elevated AI",
    description: "Connect voice capture and automation to CRM, email, calendar, field service, project, ticketing, ERP, and knowledge systems.",
  },
  "/retail-distribution": {
    title: "Retail and Multi-Unit Operations | Elevated AI",
    description: "Help retail, restaurant, distribution, and multi-unit teams capture store visits, audits, maintenance issues, photos, follow-ups, and field intel.",
  },
  "/built-environment": {
    title: "Built Environment Teams | Elevated AI",
    description: "Help architects, engineers, construction teams, and property teams turn site observations, photos, inspections, and risks into project action.",
  },
  "/client-services": {
    title: "Client Services Teams | Elevated AI",
    description: "Help accountants, attorneys, consultants, advisors, and client teams turn meetings into follow-ups, emails, risks, and firm memory.",
  },
  "/regulated-field-teams": {
    title: "Regulated Field Teams | Elevated AI",
    description: "Help pharma, medical device, home health, and compliance teams capture field work with review controls, audit history, and approval policies.",
  },
};

function setMetaTag(selector, attribute, value) {
  const tag = document.head.querySelector(selector);
  if (tag) tag.setAttribute(attribute, value);
}

function applyRouteMeta(path) {
  const normalizedPath = path || "/";
  const canonicalUrl = `https://elevatedai.com${normalizedPath === "/" ? "/" : normalizedPath}`;
  const pageMeta = routeMeta[path] ?? (useCasePages[path]
    ? {
        title: `${useCasePages[path].eyebrow.replace("For ", "")} | Elevated AI`,
        description: useCasePages[path].description,
      }
    : defaultMeta);

  document.title = pageMeta.title;
  setMetaTag('meta[name="description"]', "content", pageMeta.description);
  setMetaTag('meta[property="og:title"]', "content", pageMeta.title);
  setMetaTag('meta[property="og:description"]', "content", pageMeta.description);
  setMetaTag('meta[property="og:url"]', "content", canonicalUrl);
  setMetaTag('meta[name="twitter:title"]', "content", pageMeta.title);
  setMetaTag('meta[name="twitter:description"]', "content", pageMeta.description);
  setMetaTag('link[rel="canonical"]', "href", canonicalUrl);
}

export function App() {
  const path = window.location.pathname.replace(/\/$/, "");

  useEffect(() => {
    applyRouteMeta(path || "/");
  }, [path]);

  useEffect(() => {
    if (!window.location.hash) return;
    const targetId = decodeURIComponent(window.location.hash.slice(1));
    const timer = window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ block: "start" });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [path]);

  if (path === "/app-demo") {
    return <AppDemoPage />;
  }
  if (path === "/field-sales") {
    return <FieldSalesPage />;
  }
  if (path === "/field-service") {
    return <FieldServicePage />;
  }
  if (path === "/field-service-brief") {
    return <FieldServiceBriefPage />;
  }
  if (path === "/pilot-brief") {
    return <PilotBriefPage />;
  }
  if (path === "/security") {
    return <SecurityPage />;
  }
  if (path === "/pilot") {
    return <PilotPage />;
  }
  if (path === "/pilot-program") {
    return <PilotProgramPage />;
  }
  if (path === "/voice-commands") {
    return <VoiceCommandsPage />;
  }
  if (path === "/integrations") {
    return <IntegrationsPage />;
  }
  if (useCasePages[path]) {
    return <UseCaseLandingPage page={useCasePages[path]} />;
  }
  return <HomePage />;
}
