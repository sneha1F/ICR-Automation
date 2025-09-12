const puppeteer = require("puppeteer");
const XLSX = require("xlsx");

// === Step 1: Load Excel with slugs ===
const workbook = XLSX.readFile("icr_score.xlsx");
const sheetName = workbook.SheetNames[0];
const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

// === Config ===
const baseURL = "https://coinmarketcap.com/currencies/";
const priceXPath = "//span[@class='sc-65e7f566-0 esyGGG base-text']"; // your XPath

async function checkPrice(url, xpath, page) {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Run XPath inside the browser context
    const price = await page.evaluate((xp) => {
      const result = document.evaluate(
        xp,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );
      return result.singleNodeValue
        ? result.singleNodeValue.textContent.trim()
        : null;
    }, xpath);

    return price || "❌ Not found";
  } catch (err) {
    return "💥 Error: " + err.message;
  }
}

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  for (let row of sheet) {
    const slug = row.slug; // 👈 lowercase, matching your Excel column
    const url = `${baseURL}${slug}/`;

    console.log(`🔍 Checking ${url} ...`);
    const price = await checkPrice(url, priceXPath, page);

    row.FullURL = url;
    row.Price = price;

    console.log(`💰 ${slug} → ${price}`);
  }

  await browser.close();

  // === Save results back to Excel ===
  const newSheet = XLSX.utils.json_to_sheet(sheet);
  const newWorkbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(newWorkbook, newSheet, "Results");
  XLSX.writeFile(newWorkbook, "icr_score_with_prices.xlsx"); // save to new file

  console.log("✅ Done! Results saved in icr_score_with_prices_2.xlsx");
})();
