import puppeteer from "puppeteer";

class OscarWinningFilmsScraper {
  getMoviesPerYear = async (year: number) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(
      `https://www.scrapethissite.com/pages/ajax-javascript/#${year}`
    );

    await page.waitForSelector("loading", { hidden: true });
    await page.waitForSelector("table", { visible: true });

    const scrapedData = await page.evaluate(() => {
      const tableHeader = document.querySelectorAll("table thead tr th");
      const headers = Array.from(tableHeader).map(
        (header) => header.textContent?.trim() || ""
      );

      const tableRows = document.querySelectorAll("table tbody tr");
      const rows = Array.from(tableRows).map((row) => {
        const cells = row.querySelectorAll("td");
        return Array.from(cells).map((cell) => cell.textContent?.trim() || "");
      });

      return { headers, rows };
    });
    await browser.close();
    return scrapedData;
  };

  getAllMovies = async () => {
    let movies: string[][] = [];
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`https://www.scrapethissite.com/pages/ajax-javascript/`);

    const yearLinks = await page.$$(".text-center a");

    for (const link of yearLinks) {
      await link.click();
      await page.waitForSelector("loading", { hidden: true });
      await page.waitForSelector("table", { visible: true });

      const yearMovies = await page.evaluate(() => {
        const tableRows = document.querySelectorAll("table tbody tr");
        return Array.from(tableRows).map((column) => {
          const cells = column.querySelectorAll("td");

          return Array.from(cells).map(
            (cell) => cell.textContent?.trim() || ""
          );
        });
      });

      movies.push(...yearMovies);
    }
    browser.close();
    return movies;
  };
}

const oscarWinningInstance = new OscarWinningFilmsScraper();
oscarWinningInstance.getAllMovies();
