import * as cheerio from "cheerio";
import axios from "axios";

class TeamStatsScraper {
  teamName: string;

  constructor(teamName: string) {
    this.teamName = teamName;
  }

  getTeamStats = async () => {
    const url = `https://www.scrapethissite.com/pages/forms/?q=${this.teamName}&per_page=100`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const data: string[][] = [];
    const headerRow: string[] = [];
    let bodyRow: string[] = [];

    const searchRows = $("table").find("tr");

    searchRows.map((index, element) => {
      if (index === 0) {
        const headerColumns = $(element).find("th");

        headerColumns.map((i, el) => {
          headerRow.push($(el).text().trim());
        });
        data.push(headerRow);
      } else {
        bodyRow = [];
        const bodyColumns = $(element).find("td");
        bodyColumns.map((i, el) => {
          bodyRow.push($(el).text().trim());
        });
        data.push(bodyRow);
      }
    });

    console.log(data);
  };

  getAllStats = async (maxDepth: number) => {
    let depth = 0;
    let data: string[][] = [];

    while (maxDepth > depth) {
      const url = `https://www.scrapethissite.com/pages/forms/?page_num=${
        depth + 1
      }&per_page=100`;
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      const rows = $(".table tbody").find("tr");
      rows.map((index, element) => {
        let row: string[] = [];
        const children = $(element).children();

        if (depth > 0 && index === 0) return;

        children.map((i, col) => {
          row.push($(col).text().trim());
        });

        data.push(row);
      });
      depth += 1;
    }
    console.log(data.length)
    return data;
  };
}

const teamScrapper = new TeamStatsScraper("Boston");
teamScrapper.getAllStats(3);
