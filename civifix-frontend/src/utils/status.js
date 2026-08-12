const STATUS_ALIASES = {
  PENDING: "PENDING",
  OPEN: "OPEN",
  ASSIGNED: "ASSIGNED",
  ACCEPTED: "IN_PROGRESS",
  WORKING: "IN_PROGRESS",
  IN_PROGRESS: "IN_PROGRESS",
  FIELD_VISIT: "IN_PROGRESS",
  APPROVAL: "APPROVAL",
  RESOLVED: "RESOLVED",
  CLOSED: "CLOSED",
  REJECTED: "REJECTED",
  REOPENED: "REOPENED",
};

export const normalizeComplaintStatus = (value) => {
  if (value == null || value === "") return "PENDING";

  const normalized = String(value).trim().toUpperCase();

  if (normalized.includes("OPEN")) return "OPEN";
  if (normalized.includes("REOPEN")) return "REOPENED";
  if (normalized.includes("WORK") || normalized.includes("IN_PROGRESS") || normalized.includes("FIELD_VISIT") || normalized.includes("ACCEPTED")) {
    return "IN_PROGRESS";
  }
  if (normalized.includes("APPROVAL")) return "APPROVAL";
  if (normalized.includes("RESOLV")) return "RESOLVED";
  if (normalized.includes("CLOSE")) return "CLOSED";
  if (normalized.includes("REJECT")) return "REJECTED";
  if (normalized.includes("ASSIGN")) return "ASSIGNED";

  return STATUS_ALIASES[normalized] || "PENDING";
};

export const isComplaintActive = (value) => {
  const status = normalizeComplaintStatus(value);
  return ["PENDING", "OPEN", "ASSIGNED", "IN_PROGRESS", "APPROVAL", "REOPENED"].includes(status);
};

export const getComplaintStatusMeta = (value) => {
  const status = normalizeComplaintStatus(value);

  switch (status) {
    case "OPEN":
      return { label: "Pending", color: "#D97706", bg: "#FEF3C7", icon: "clock-outline" };
    case "ASSIGNED":
      return { label: "Assigned", color: "#7C3AED", bg: "#F5F3FF", icon: "account-hard-hat-outline" };
    case "IN_PROGRESS":
      return { label: "In Progress", color: "#0891B2", bg: "#ECFEFF", icon: "progress-wrench" };
    case "APPROVAL":
      return { label: "In Review", color: "#0F766E", bg: "#CCFBF1", icon: "eye-check-outline" };
    case "CLOSED":
    case "RESOLVED":
      return { label: "Resolved", color: "#059669", bg: "#D1FAE5", icon: "check-circle-outline" };
    case "REOPENED":
      return { label: "Reopened", color: "#D97706", bg: "#FEF3C7", icon: "alert-circle-outline" };
    case "REJECTED":
      return { label: "Rejected", color: "#DC2626", bg: "#FFE4E6", icon: "close-circle-outline" };
    case "PENDING":
    default:
      return { label: "Pending", color: "#D97706", bg: "#FEF3C7", icon: "clock-outline" };
  }
};
