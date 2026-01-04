export interface DashboardMetrics {
    product: {
      total: number;
      delta: number;
    };
    event: {
      total: number;
      delta: number;
    };
    tispushed: {
      total: number;
      delta: number;
    };
    transaction: {
      total: number;
      delta: number;
    };
  }
  export interface ProductContribution {
    gtin: string;
    productDescription: string;
    genericName: string;
    percentage: number;
  }

  export interface TimeCount {
    time: string;  // e.g. "2025-09-25"
    count: number;
  }
  
  export interface SerStats {
    encoding: TimeCount[];
    commission: TimeCount[];
  }
  export interface MoveStats {
    shipping: TimeCount[];
    receiving: TimeCount[];
  }
  
  type Point = 'daily' | 'weekly' | 'monthly' | 'yearly';
  export interface SerStatsRequest {
    email: string;
    point: Point;
    pointcount: number;
  }

  export interface ActivityLog {
    action: string;
    description: string;
    status: number;
    datetime: string; // ISO 8601 timestamp
  }
  export interface QueueLog {
    operationId: string;
    email: string;
    note: string;
    status: 'failed' | 'pending' | 'success'; // adjust union as needed
    retryCount: number;
    emailSent: number; // 0 | 1 if you want to restrict to boolean-like values
    createdAt: string; // or Date if you parse it
    updatedAt: string; // or Date
  }