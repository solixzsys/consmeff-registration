interface AppError {
    message: string;
    code: string;
    status: number;
    details?: unknown;
  }
  
  class AppError extends Error implements AppError {
    constructor(
      public code: string,
      message: string,
      public status: number = 500,
      public details?: unknown
    ) {
      super(message);
      this.name = 'AppError';
    }
  }
  
  class ErrorHandler {
    static handle(error: unknown): never {
      // Convert to standardized error format
      const normalizedError = this.normalizeError(error);
      
      // Log the error
      this.logError(normalizedError);
      
      // Show user feedback if in browser context
      if (typeof window !== 'undefined') {
        this.showUserFeedback(normalizedError);
      }
      
      // Optionally send to error tracking service
      this.trackError(normalizedError);
      
      throw normalizedError;
    }
  
    private static normalizeError(error: unknown): AppError {
      if (error instanceof AppError) {
        return error;
      }
      
      if (error instanceof Error) {
        return new AppError('UNKNOWN_ERROR', error.message, 500, {
          originalError: error,
          stack: error.stack
        });
      }
      
      if (typeof error === 'string') {
        return new AppError('UNKNOWN_ERROR', error);
      }
      
      return new AppError(
        'UNKNOWN_ERROR', 
        'An unknown error occurred',
        500,
        error
      );
    }
  
    private static logError(error: AppError): void {
      console.error(`[${error.code}] ${error.message}`, {
        status: error.status,
        details: error.details
      });
    }
  
    private static showUserFeedback(error: AppError): void {
      // Could use a toast notification system
      alert(`Error: ${error.message}`);
    }
  
    private static trackError(error: AppError): void {
      // Send to Sentry/LogRocket/etc.
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.captureException(error);
      }
    }
  }