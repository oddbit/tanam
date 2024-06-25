export class TanamConfig {
  static get databaseName(): string {
    return process.env.database || "(default)";
  }
}
