// types/auditLog.ts
export interface AuditLog {
  _id: string;
  action:
    | "CREATE"
    | "UPDATE"
    | "DELETE"
    | "STATUS_CHANGE"
    | "FUNDING_UPDATE"
    | "YIELD_MARKED"
    | "LOGIN"
    | "LOGOUT";
  entityType:
    | "FARMER"
    | "PRODUCT"
    | "ORDER"
    | "USER"
    | "PAYMENT"
    | "WITHDRAWAL"
    | "ADMIN";
  entityId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: "ADMIN" | "SUPER_ADMIN" | "FARMER" | "BUYER";
  changes: {
    before?: Record<string, any>;
    after?: Record<string, any>;
    field?: string;
    oldValue?: any;
    newValue?: any;
  };
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  details?: string;
}

export interface AuditLogFilters {
  startDate?: string;
  endDate?: string;
  action?: string;
  entityType?: string;
  userId?: string;
  search?: string;
}

export interface AuditLogStats {
  totalLogs: number;
  todayLogs: number;
  weekLogs: number;
  monthLogs: number;
  yearLogs: number;
  actionStats: Array<{ _id: string; count: number }>;
  entityStats: Array<{ _id: string; count: number }>;
}
