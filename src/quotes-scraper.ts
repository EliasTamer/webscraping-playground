import * as cheerio from "cheerio";
import axios from "axios";

interface Quote {
  title: string;
  author: string;
  tags: string[];
}

class QuotesScraper {
  scrapedData: Quote[] = [];

  loadHtml = async (url: string) => {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    return $;
  };

  scrapePages = async () => {
    let pageIndex = 1;
    const quotes: Quote[] = [];

    let url = `https://quotes.toscrape.com/page/${pageIndex}`;
    let $ = await this.loadHtml(url);
    let quotesPerPage = $(".quote");

    while (quotesPerPage.length > 0) {
      quotesPerPage.each((index, element) => {
        const title = $(element).find(".text").text();
        const author = $(element).find(".author").text();
        const tags = $(element).find(".tags .tag");
        const tagValues = tags.toArray().map((el) => $(el).text());

        quotes.push({ title, author, tags: tagValues });
      });

      pageIndex += 1;
      url = `https://quotes.toscrape.com/page/${pageIndex}`;
      $ = await this.loadHtml(url);
      quotesPerPage = $(".quote");
    }

    return quotes;
  };

  scrapeQuotesFromPage = () => {};
}

const scrapper = new QuotesScraper();