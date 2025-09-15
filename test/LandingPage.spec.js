const { test, expect } = require('@playwright/test');

// Run before every test
test.beforeEach(async ({ page }) => {
  await page.goto('https://indiacryptoresearch.co.in/');
});

test('Search bar works for bitcoin', async ({ page }) => {
  await page.click("input[placeholder='Search for cryptos']");
  await page.waitForSelector('#searchInput');
  await page.fill('#searchInput', 'bitcoin');
  await page.keyboard.press('Enter');
  await page.waitForSelector('#search-crypto');
});

test('Search bar exists on the page', async ({ page }) => {
  await page.waitForSelector("input[placeholder='Search for cryptos']");
});

test('Explore card is clickable and functional', async ({ page }) => {
  await page.click("img.block.mobile\\:hidden"); // escape colon
  await expect(page).toHaveURL(/.*crypto.*/);
});

test('Gain insights container is visible and contains 4 coins', async ({ page }) => {
  const container = page.locator("div.banner_desktop_show__m0rfe");
  
  // Make sure container is visible before working with it
  await expect(container).toBeVisible();

  const coins = container.locator("li");
  const expectedCount = 4;

  // Check the count first
  const actualCount = await coins.count();
  await expect(coins).toHaveCount(expectedCount);

  // Loop safely through the items
  for (let i = 0; i < actualCount; i++) {
    try {
      await coins.nth(i).innerText();
    } catch (err) {
      console.error(`⚠️ Could not read text for Coin ${i + 1}: ${err.message}`);
    }
  }
});

test('Crypto News card is clickable and redirects to correct url', async ({ page }) => {
  await page.waitForSelector("a[href='/news?coins=false']");
  await page.click("a[href='/news?coins=false']");
  await expect(page).toHaveURL(/.*news*./);
})

test('Crypto Events card is clickable and redirects to correct url', async ({ page }) => {
  const card = page.locator("img.block.mobile\\:hidden.rounded-\\[20px\\]"); // Escaped Tailwind-style classes
  await expect(card).toBeVisible();
  // Wait for navigation triggered by click
  await Promise.all([
    page.waitForURL(/.*crypto-events.*/), // Wait for the URL to match
    card.click()
  ]);

  // Final assertion (optional if waitForURL above succeeds)
  await expect(page).toHaveURL(/.*crypto-events.*/);
});


test('Trending Cryptos is visible and contains 4 coins', async ({ page }) => {
  const trendingContainer = page.locator(".banner_trending_container__q_6MW");
  const trendingCoinsCount = 4;

  const heading = trendingContainer.locator("h3");
  const trending = trendingContainer.locator("a");

  await expect(trendingContainer).toBeVisible();
  await expect(heading).toHaveText("TRENDING CRYPTOS");
  await expect(trending).toHaveCount(trendingCoinsCount);
});

test('Trending cryptos to contain coin Logo, Symbol, Percent Change and Price', async ({ page }) => {
  const trendingContainer = page.locator(".banner_trending_container__q_6MW");
  const trendingCoinsCount = 4;

  const trending = trendingContainer.locator("a"); 
  const logo = trending.locator("img"); // escaped selector
  const percentChange = trending.locator(".trendingcard_first_item__6fW82");
  const price = trending.locator(".trendingcard_second_item____jCp");

  await expect(trending).toHaveCount(trendingCoinsCount);

  await expect(logo.first()).toBeVisible();
  await expect(percentChange.first()).toBeVisible();
  await expect(price.first()).toBeVisible();

  const actualCountForTrending = await trending.count();
  for (let i = 0; i < actualCountForTrending; i++) {
    const coinCard = trending.nth(i);
    const coinLogo = coinCard.locator("img");
    const coinPercent = coinCard.locator(".trendingcard_first_item__6fW82");
    const coinPrice = coinCard.locator(".trendingcard_second_item____jCp");

    await expect(coinLogo).toBeVisible();
    await expect(coinPercent).toBeVisible();
    await expect(coinPrice).toBeVisible();

    console.log(`✅ Trending Coin ${i + 1}: ${await coinCard.innerText()}`);
  }
});

test('Check the "View all 900+ cryptos" link is working properly', async ({ page }) => {
  // Locate the parent <p> with the unique class
  const container = page.locator(
    "p[class='explorecrypto_view_crypto__YOAc1 font-DMSans text-md-regular cursor-pointer']"
  );
  // Wait for it to be visible
  await expect(container).toBeVisible();
  // Get the <a> inside the container
  const link = container.locator('a');
  // Wait for it to be visible and click
  await expect(link).toBeVisible();
  await link.click();
  // Verify URL contains "crypto"
  await expect(page).toHaveURL(/.*crypto.*/);
});

test('Reseacrh Score category tabs are clickable', async ({page}) => {
  const researchContainer = page.locator('.researchtabs_tabs_container__HEvCz');
  await expect(researchContainer).toBeVisible();
  const categoryCount = 17;
  const categoryContainer = researchContainer.locator(".researchtabs_tab_item__HHQXL");
  await expect(categoryContainer).toHaveCount(categoryCount);
})

test('Check the Top Gainers and Top Losers is visible and 3 coins are displayed properly', async ({ page }) => {
  await page.waitForSelector('.ExploreCryptos_crypto_cards_container__RRK8S');
  // Top Gainers card
  const TopGainerContainer = page.locator('.ExploreCryptos_crypto_cards__9rnb8')
    .filter({ hasText: 'Top Gainers' });
  await expect(TopGainerContainer).toBeVisible();
  // Top Losers card
  const TopLosersContainer = page.locator('.ExploreCryptos_crypto_cards__9rnb8')
    .filter({ hasText: 'Top Losers' });
  await expect(TopLosersContainer).toBeVisible();

  // Count number of coins inside Top Gainers
  const ExpectedGainersCount = 3; // adjust based on UI expectation
  const ActualGainersCount = await TopGainerContainer.locator('li.ExploreCryptos_card_item__FK0ZV').count();
  expect(ActualGainersCount).toBe(ExpectedGainersCount);

  // Count number of coins inside Top Losers
  const ExpectedLosersCount = 3; // adjust based on UI expectation
  const ActualLosersCount = await TopLosersContainer.locator('li.ExploreCryptos_card_item__FK0ZV').count();
  expect(ActualLosersCount).toBe(ExpectedLosersCount);
});

test('Check the Top Gainers More button functionality', async ({page}) => {
  await page.waitForSelector('.ExploreCryptos_crypto_cards_container__RRK8S');
  // Top Gainers card
  const TopGainerContainer = page.locator('.ExploreCryptos_crypto_cards__9rnb8')
    .filter({ hasText: 'Top Gainers' });
  await expect(TopGainerContainer).toBeVisible();
  
  //Top Gainers Card More button
  const TopGainerMore = TopGainerContainer.locator(".ExploreCryptos_card_header__cVkqG a");
  await TopGainerMore.click();
  await expect(page).toHaveURL(/.*crypto\?page=1&row=20&primaryCategory=top-gainers&secondaryCategory=All&sortby=percent_change_24h&orderby=desc$/);
  
})

test('Check Top Losers More button functionality', async ({page}) => {
  await page.waitForSelector('.ExploreCryptos_crypto_cards_container__RRK8S');
  // Top Losers card
  const TopLosersContainer = page.locator('.ExploreCryptos_crypto_cards__9rnb8')
    .filter({ hasText: 'Top Losers' });
  await expect(TopLosersContainer).toBeVisible();
  // Top Losers Card More button
  const TopLosersMore = TopLosersContainer.locator(".ExploreCryptos_card_header__cVkqG a");
  await TopLosersMore.click();
  await expect(page).toHaveURL(/.*crypto\?page=1&row=20&primaryCategory=top-losers&secondaryCategory=All&sortby=percent_change_24h&orderby=asc$/);
})

test('Research Score tabs show correct top currency', async ({ page }) => {
  const researchContainer = page.locator('.researchtabs_tabs_container__HEvCz');
  const researchScoreTab = page.locator('.researchscore_research_card_container__u5szn');
  await expect(researchContainer).toBeVisible();
  // grab all tab elements
  const tabs = researchContainer.locator('.researchtabs_tab_item__HHQXL');
  const count = await tabs.count();
  for (let i = 0; i < count; i++) {
    const tab = tabs.nth(i);
    const categoryName = await tab.innerText();   // the label we expect to see
    // click the tab
    await tab.click();
    // check the top currency text matches
    const topCurrency = researchScoreTab.locator('.researchscore_top_currency__tF8U2');
    await expect(topCurrency).toHaveText("Top "+categoryName+" Tokens");
    console.log(`✅ ${categoryName} tab verified`);
  }
});

test('Check category-wise content updates from Research Score tab', async ({ page }) => {
  // ⏱️ give this specific test up to 2 minutes
  test.setTimeout(120_000);
  const researchContainer = page.locator('.researchtabs_tabs_container__HEvCz');
  const researchScoreTab  = page.locator('.researchscore_research_card_container__u5szn');
  await expect(researchContainer).toBeVisible();
  const tabs  = researchContainer.locator('.researchtabs_tab_item__HHQXL');
  const count = await tabs.count();

  for (let i = 0; i < count; i++) {
    const tab = researchContainer.locator('.researchtabs_tab_item__HHQXL').nth(i);
    const categoryName = (await tab.innerText()).trim();
    await tab.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);       // shorter pause is usually fine
    await tab.click({ force: true });

    const topCurrency = researchScoreTab.locator('.researchscore_top_currency__tF8U2');
    await expect(topCurrency).toHaveText(`Top ${categoryName} Tokens`);

    const categorySlug = categoryName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');

    const viewAllButton = researchScoreTab.locator('.researchscore_desktop_view_all__Iqi_G');
    await viewAllButton.click();
    await expect(page).toHaveURL(new RegExp(categorySlug, 'i'));
      await page.goBack();
      await expect(researchContainer).toBeVisible();
      await page.waitForTimeout(200);
    }
  }
);

test('Check Top Gainers listed coins are same as listing page coins when Top Gainers filter is activated', async ({ page }) => {
  await page.waitForSelector('.ExploreCryptos_crypto_cards_container__RRK8S');

  const topGainerContainer = page
    .locator('.ExploreCryptos_crypto_cards__9rnb8')
    .filter({ hasText: 'Top Gainers' });
  await expect(topGainerContainer).toBeVisible();

  // names on home Top Gainers card
  const cardNames = await topGainerContainer
    .locator('li.ExploreCryptos_card_item__FK0ZV p.ExploreCryptos_crypto_name__pWSWI')
    .evaluateAll(nodes => nodes.map(p => p.childNodes[0].textContent.trim()));
  console.log('Top-gainer card names →', cardNames);

  // go to full listing
  await topGainerContainer.locator('.ExploreCryptos_card_header__cVkqG a').click();
  await expect(page).toHaveURL(/primaryCategory=top-gainers/);

  // wait for table rows to load
  await page.waitForSelector('tr.border-box div.text-md-bold.mobile\\:text-sm-bold.text-\\[\\#DCDEE2\\].mobile\\:text-wrap.mobile\\:text-start');

  // grab names from listing table
  const listingNames = await page
    .locator('tr.border-box div.text-md-bold.mobile\\:text-sm-bold.text-\\[\\#DCDEE2\\].mobile\\:text-wrap.mobile\\:text-start')
    .allInnerTexts();
    const firstThreeListing = listingNames.slice(0, 3);
  console.log('Listing page names →', firstThreeListing);

  // assert every top-card coin appears in the listing
  cardNames.forEach(name => expect(firstThreeListing).toContain(name));
});

test('Check Top Losers listed coins are same as listing page coins when Top Losers filter is activated', async ({ page }) => {
  await page.waitForSelector('.ExploreCryptos_crypto_cards_container__RRK8S');

  const topGainerContainer = page
    .locator('.ExploreCryptos_crypto_cards__9rnb8')
    .filter({ hasText: 'Top Losers' });
  await expect(topGainerContainer).toBeVisible();

  // names on home Top Losers card
  const cardNames = await topGainerContainer
    .locator('li.ExploreCryptos_card_item__FK0ZV p.ExploreCryptos_crypto_name__pWSWI')
    .evaluateAll(nodes => nodes.map(p => p.childNodes[0].textContent.trim()));
  console.log('Top-losers card names →', cardNames);

  // go to full listing
  await topGainerContainer.locator('.ExploreCryptos_card_header__cVkqG a').click();
  await expect(page).toHaveURL(/primaryCategory=top-losers/);

  // wait for table rows to load
  await page.waitForSelector('tr.border-box div.text-md-bold.mobile\\:text-sm-bold.text-\\[\\#DCDEE2\\].mobile\\:text-wrap.mobile\\:text-start');

  // grab names from listing table
  const listingNames = await page
    .locator('tr.border-box div.text-md-bold.mobile\\:text-sm-bold.text-\\[\\#DCDEE2\\].mobile\\:text-wrap.mobile\\:text-start')
    .allInnerTexts();
    const firstThreeListing = listingNames.slice(0, 3);
  console.log('Listing page names →', firstThreeListing);

  // assert every top-card coin appears in the listing
  cardNames.forEach(name => expect(firstThreeListing).toContain(name));
});

test('Blog section exists or not', async ({ page }) => {
  // Correct combined classes with escaped colon
  const blogSection = page.locator('.blog.pt-14.sm\\:pt-20');

  await expect(blogSection).toBeVisible();
  await expect(blogSection).toHaveText(/BLOGS/i);

  // ✅ All blog titles inside the blog section
  const blogTitles = blogSection.locator('h4.line-clamp-2.text-left.text-lg-regular');

  // 🔑 Count how many blogs there are
  const count = await blogTitles.count();
  console.log(`Total blogs displayed: ${count}`);

  // Loop through each title and print the text
  for (let i = 0; i < count; i++) {
    await expect(blogTitles.nth(i)).toBeVisible();
  }
});

test('Functionality of Blogs in blog section', async ({ page }) => {
  const sectionSelector = '.blog.pt-14.sm\\:pt-20';
  const titleSelector   = 'h4.line-clamp-2.text-left.text-lg-regular';
  const blogSection = page.locator(sectionSelector);
  await expect(blogSection).toBeVisible();
  const total = await blogSection.locator(titleSelector).count();
  console.log(`Total blogs displayed: ${total}`);

  for (let i = 0; i < total; i++) {
    const titles = blogSection.locator(titleSelector);
    const title  = titles.nth(i);
    await expect(title).toBeVisible();
    const text = await title.innerText();

    // slugify and clean up
    const expectedSlug = text
      .toLowerCase()
      .replace(/\s+/g, '-')       // spaces → hyphens
      .replace(/[^\w-]/g, '')     // strip non-word chars
      .replace(/-+/g, '-');       // collapse double hyphens

    await title.click();
    await expect(page).toHaveURL(new RegExp(`/learn/blogs/${expectedSlug}$`, 'i'));

    await page.goBack();
    await page.waitForSelector(sectionSelector);
  }
});
