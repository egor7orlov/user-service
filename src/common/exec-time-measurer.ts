export class ExecTimeMeasurer {
  private startTime: [number, number];

  private constructor() {
    this.startTime = process.hrtime();
  }

  public static init(): ExecTimeMeasurer {
    return new ExecTimeMeasurer();
  }

  public reset(): void {
    this.startTime = process.hrtime();
  }

  public getExecutionTimeMs(): number {
    const endTime = process.hrtime(this.startTime);

    return endTime[0] * 1000 + endTime[1] / 1000000; // Convert to milliseconds
  }
}
