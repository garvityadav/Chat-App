////////////////////////////////////////
// List of classes and functions:
// - class CommaSeparatedStream
// - const logFileStream
// - const logStream
// - const logger
// - const pinoHttpLogFileStream
////////////////////////////////////////

import pino from "pino";
import { join } from "node:path";
import {
  createWriteStream,
  promises,
  WriteStream,
  existsSync,
  mkdirSync,
} from "fs";
import { Writable } from "stream";
import pinoHttp from "pino-http";

const fsPromises = promises;
// class for comma separated stream
class CommaSeparatedStream extends Writable {
  private fileStream: WriteStream;
  private isFileEmpty = true;
  private filePath: string;

  constructor(filePath: string) {
    super();
    this.filePath = filePath;
    this.fileStream = createWriteStream(filePath, { flags: "a" });
    this.prepareLogFile();
  }
  private async prepareLogFile() {
    try {
      const stats = await fsPromises.stat(this.filePath);
      if (stats.size === 0) {
        this.fileStream.write("[\n");
        this.isFileEmpty = true;
      }
    } catch (err: any) {
      if (err.code === "ENOENT") {
        this.fileStream.write("[\n");
        this.isFileEmpty = true;
      } else {
        console.log("error in creating log file", err);
      }
    }
  }

  _write(
    chunk: any,
    encoding: BufferEncoding,
    callback: (err?: Error | null) => void
  ) {
    try {
      if (!this.isFileEmpty) {
        this.fileStream.write(",\n");
      } else {
        this.isFileEmpty = false;
      }
      this.fileStream.write(chunk, encoding, callback);
    } catch (err) {
      console.error("error in writing log", err);
      callback(err as Error);
    }
  }
  _final(callback: (error?: Error | null) => void): void {
    this.fileStream.write("\n]", callback);
  }
}

// create a log directory
const currentDate = new Date().toISOString().slice(0, 10);
const currentHour = new Date().getHours();
const logDirectory = join(
  __dirname,
  "../../",
  `logsDir/${currentDate}/${currentHour}`
);

try {
  if (!existsSync(logDirectory)) {
    mkdirSync(logDirectory, { recursive: true });
  }
} catch (error) {
  console.error("Error creating log directory:", error);
}

//setup for pino logger
const logFileStream = join(logDirectory, `${process.env.NODE_ENV}.pino.json`);
const logStream = new CommaSeparatedStream(logFileStream);

//setup for pino http logger
const pinoHttpLogFileStream = join(
  logDirectory,
  `${process.env.NODE_ENV}.pino.http.json`
);
const pinoHttpLogStream = new CommaSeparatedStream(pinoHttpLogFileStream);

//setup pino logger
const logger = pino(
  {
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
  },
  pino.multistream([
    {
      stream: logStream,
      level: "info",
    },
    {
      stream: process.stdout,
      level: "debug",
    },
  ])
);

const pinoHttpLogger = pinoHttp(
  {
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
      }),
      res: (res) => ({
        statusCode: res ? res.statusCode : undefined,
      }),
    },
    customLogLevel: (res, err) => {
      if (res && res.statusCode) {
        if (res.statusCode >= 400) {
          return "warn";
        } else if (res.statusCode >= 500 || err) {
          return "error";
        } else if (res.statusCode >= 200) {
          return "info";
        }
      }
      return "info";
    },
  },
  pino.multistream([
    {
      stream: pinoHttpLogStream,
    },
    { stream: process.stdout },
  ])
);
process.on("exit", () => {
  logStream.end();
  pinoHttpLogStream.end();
});
process.on("SIGINT", () => {
  logStream.end();
  pinoHttpLogStream.end();
  process.exit();
});

export { logger, pinoHttpLogger };
