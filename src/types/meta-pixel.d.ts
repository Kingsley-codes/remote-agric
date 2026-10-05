export {};

declare global {
  interface Window {
    fbq: (
      command: string,
      eventName: string,
      data?: Record<string, unknown>,
    ) => void;
  }
}
