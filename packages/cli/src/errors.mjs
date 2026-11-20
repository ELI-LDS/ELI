export class CliError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

export function ensure(condition, code, message, details) {
  if (!condition) throw new CliError(code, message, details);
}
