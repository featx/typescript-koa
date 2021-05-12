class LogAppender {
  type: string;
  filename: string;
  pattern: string;
  alwaysIncludePattern: boolean;
}

class LogCategory {
  appenders: string[]
  level: string
}

export class Config {
  port: string

  path: {
    root: string,
    client: string,
    server: string,
    resources: string,
    views: string
  }

  server: {
    response: {
      headers: {
        origins: string[]
      }
    }
  }

  log4js: {
    cwd: string
    appenders: Map<string, LogAppender>
    categories: Map<string, LogCategory>
  }
}
