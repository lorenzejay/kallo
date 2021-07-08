declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      NODE_ENV: "Development" | "Production";
      PG_USER: string;
      PG_PASSWORD: string;
      PG_HOST: string;
      PG_PORT: number;
      PG_DATABASE: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
