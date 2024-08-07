export {};

// set types of process.env
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      PORT: string;
      DOMAINS: string;
    }
  }
}
