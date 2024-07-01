export class TanamConfig {
  static get projectId(): string {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT;

    if (!projectId) {
      throw new Error("Could not find project ID in any variable");
    }

    return projectId;
  }

  static get cloudFunctionRegion(): string {
    return "us-central1";
  }

  /**
   * Get flag for whether the functions are running in emulator or not.
   * This can be derived by checking the existence of any emulator provided
   * variables.
   */
  static get isEmulated(): boolean {
    return !!process.env.FIREBASE_EMULATOR_HUB;
  }

  static get databaseName(): string {
    return process.env.database || "(default)";
  }
}
