import puppeteer, { Browser, Page } from "puppeteer";

class SessionScraping {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async getMyProductsList(): Promise<string[][]> {
    try {
      this.browser = await puppeteer.launch({
        headless: false,
        args: ["--disable-blink-features=AutomationControlled"],
      });

      this.page = await this.browser.newPage();

      await this.page.goto("https://skillcertpro.com/sign-in/", {
        waitUntil: "networkidle2",
        timeout: 30000,
      });

      await this.randomDelay(2000, 4000);

      await this.page.type("#username-1661", "email-here", {
        delay: 100,
      });
      await this.randomDelay(500, 1000);

      await this.page.type("#user_password-1661", "password-here", {
        delay: 100,
      });
      await this.randomDelay(500, 1000);

      await this.page.click("#um-submit-btn");

      await this.page.waitForNavigation({
        waitUntil: "networkidle2",
        timeout: 30000,
      });
      await this.randomDelay(2000, 3000);

      await this.page.goto("https://skillcertpro.com/my-account/courses/", {
        waitUntil: "networkidle2",
        timeout: 30000,
      });

      await this.page.waitForSelector(".order_details tbody tr", {
        timeout: 10000,
      });

      const myProducts: string[][] = await this.page.evaluate(() => {
        const tableRows: HTMLTableRowElement[] = Array.from(
          document.querySelectorAll<HTMLTableRowElement>(
            ".order_details tbody tr"
          )
        );

        return tableRows.map((row: HTMLTableRowElement) => {
          const cells: HTMLTableCellElement[] = Array.from(
            row.querySelectorAll<HTMLTableCellElement>("td")
          );
          return cells.map(
            (cell: HTMLTableCellElement) => cell.textContent?.trim() || ""
          );
        });
      });

      console.log("Products found:", myProducts);
      return myProducts;
    } catch (error) {
      console.error("Error occurred:", error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }

  private randomDelay(min: number, max: number): Promise<void> {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  private async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}

const sessionScraping = new SessionScraping();
sessionScraping
  .getMyProductsList()
  .then((products: string[][]) =>
    console.log("Successfully retrieved products:", products)
  )
  .catch((error: Error) =>
    console.error("Failed to retrieve products:", error)
  );
