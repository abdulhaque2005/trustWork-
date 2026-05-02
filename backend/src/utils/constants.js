module.exports = {
  ROLES: {
    CLIENT: "client",
    FREELANCER: "freelancer",
    ADMIN: "admin",
  },
  PROJECT_STATUS: {
    OPEN: "open",
    IN_PROGRESS: "in-progress",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
    DISPUTED: "disputed",
  },
  MILESTONE_STATUS: {
    PENDING: "pending",
    IN_PROGRESS: "in-progress",
    SUBMITTED: "submitted",
    REVISION: "revision",
    COMPLETED: "completed",
  },
  PAYMENT_STATUS: {
    LOCKED: "locked",
    PENDING: "pending",
    RELEASED: "released",
    DISPUTED: "disputed",
    REFUNDED: "refunded",
  },
  DISPUTE_STATUS: {
    OPEN: "open",
    UNDER_REVIEW: "under-review",
    RESOLVED: "resolved",
    DISMISSED: "dismissed",
  },
};
