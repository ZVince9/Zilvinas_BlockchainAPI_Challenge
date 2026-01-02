//this is running only locally
import {
  Reporter,
  TestCase,
  TestResult,
  FullResult,
} from "@playwright/test/reporter";

class SummaryReporter implements Reporter {
  private summary: any[] = [];

  // This runs after every individual test
  onTestEnd(test: TestCase, result: TestResult) {
    this.summary.push({
      Title: test.title,
      Status: result.status === "passed" ? "✅" : "❌",
      Duration: `${(result.duration / 1000).toFixed(2)}s`,
    });
  }

  // This runs once after all tests finish
  onEnd(result: FullResult) {
    console.log("\n--- 📊 TRANSACTION SUMMARY ---");
    console.table(this.summary);
    console.log(`Overall Result: ${result.status.toUpperCase()}`);
  }
}

export default SummaryReporter;
