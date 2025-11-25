require('dotenv').config(); 
const { test, expect } = require('@playwright/test');

// Run before every test
test.beforeEach(async ({ page }) => {
  const URL=process.env.URL;
  await page.goto(URL);
});
//Test Case 1
test('Search bar works for bitcoin', async ({ page }) => {
  const searchInput = page.locator("input[placeholder='Search for cryptos']");
  const resultSection = page.locator('#search-crypto');

  await searchInput.click();
  await searchInput.fill('bitcoin');
  await page.keyboard.press('Enter');

  await expect(resultSection).toBeVisible();
});
//Test Case 2
test('Search bar exists on the page', async ({ page }) => {
  const searchInput = page.locator("input[placeholder='Search for cryptos']");
  await expect(searchInput).toBeVisible();
});

//Test Case 3
test('Explore card is clickable and functional', async ({ page }) => {
  const exploreCard = page.locator("div.max-w-64 img").first();
  await expect(exploreCard).toBeVisible();
  await exploreCard.click();

  await expect(page).toHaveURL(/.*crypto.*/);
});

//Test Case 4
test('Gain insights container is visible and contains 4 coins', async ({ page }) => {
  const container = page.locator("div.banner_desktop_show__m0rfe");
  await expect(container).toBeVisible();

  const coins = container.locator("li");
  const expectedCount = 4;

  // Assert the number of coins
  await expect(coins).toHaveCount(expectedCount);

  // Use evaluateAll to map texts in one go
  const coinTexts = await coins.evaluateAll(items =>
    items.map(item => item.textContent?.trim())
  );

  // console.log("Coin labels:", coinTexts);
});

//Test Case 5
test('Crypto News card is clickable and redirects to correct url', async ({ page }) => {
  const newsCard = page.locator("a[href='/news?coins=false']");

  await expect(newsCard).toBeVisible();
  await newsCard.click();

  await expect(page).toHaveURL(/\/news(\?|$)/);
});

//Test Case 6
test('Crypto Events card is clickable and redirects to correct url', async ({ page }) => {
  const card = page.getByRole('link', { name: /crypto events discover/i });

  await expect(card).toBeVisible();
  await card.click();

  await expect(page).toHaveURL(/crypto-events/);
});

//Test Case 7
test('Trending Cryptos section is visible and shows 4 coins', async ({ page }) => {
  const trendingSection = page.locator('.banner_trending_container__q_6MW');
  await expect(trendingSection).toBeVisible();
  const heading = trendingSection.getByRole('heading', { name: /trending cryptos/i });
  await expect(heading).toBeVisible();
  const coins = trendingSection.getByRole('link'); // each coin is an anchor
  await expect(coins).toHaveCount(4);
});

//Test Case 8
test('Trending cryptos contain Logo, Symbol, Percent Change and Price', async ({ page }) => {
  const trendingSection = page.locator('.banner_trending_container__q_6MW');
  await expect(trendingSection).toBeVisible();

  const cards = trendingSection.locator('a');
  await expect(cards).toHaveCount(4);

  // Validate that each card has logo, percent, and price by evaluating all at once
  const cardData = await cards.evaluateAll(cardNodes => {
    return cardNodes.map(card => {
      const logo = card.querySelector('img');
      const percent = card.querySelector('.trendingcard_first_item__6fW82');
      const price = card.querySelector('.trendingcard_second_item____jCp');

      return {
        hasLogo: !!logo,
        hasPercent: !!percent,
        hasPrice: !!price,
        text: card.innerText.trim(),
      };
    });
  });

  // Assertion: All of them must have logo, percent & price
  cardData.forEach((card, index) => {
    expect(card.hasLogo, `Coin ${index + 1} missing logo`).toBe(true);
    expect(card.hasPercent, `Coin ${index + 1} missing percent change`).toBe(true);
    expect(card.hasPrice, `Coin ${index + 1} missing price`).toBe(true);

    // console.log(`✅ Trending Coin ${index + 1}: ${card.text}`);
  });
});

//Test Case 9
test('View all 950+ cryptos link navigates to crypto page', async ({ page }) => {
  const viewAll = page.getByRole('link', { name: /view all .* cryptos/i });

  await expect(viewAll).toBeVisible();
  await viewAll.click();

  await expect(page).toHaveURL(/\/crypto/);
});

//Test Case 10
test('Research Score category tabs are clickable', async ({ page }) => {
  const tabsContainer = page.locator('.researchtabs_tabs_container__HEvCz');
  await expect(tabsContainer).toBeVisible();

  // Wait for global overlay to disappear
  const overlay = page.locator(String.raw`.fixed.inset-0.z-\[99999\]`);
  await overlay.waitFor({ state: 'detached' }).catch(() => {});

  const tabs = tabsContainer.locator('.researchtabs_tab_item__HHQXL');
  await expect(tabs).toHaveCount(17);

  const tabNames = await tabs.evaluateAll(nodes =>
    nodes.map(n => n.textContent?.trim())
  );

  for (const name of tabNames) {
    const tab = page.getByText(name, { exact: true });
    await expect(tab).toBeVisible();

    await tab.click({ force: true }); // ☑️ if overlay is flaky
  }
});

//Test Case 11
test('Top Gainers & Top Losers sections show 3 coins each', async ({ page }) => {
  const cards = page.locator('.ExploreCryptos_crypto_cards__9rnb8');

  // Identify the Top Gainers card
  const gainers = cards.filter({ hasText: /top gainers/i });
  await expect(gainers).toBeVisible();

  // Identify the Top Losers card
  const losers = cards.filter({ hasText: /top losers/i });
  await expect(losers).toBeVisible();

  // Each card should have its own <li> list inside
  const gainersCoins = gainers.locator('li');
  const losersCoins  = losers.locator('li');

  await expect(gainersCoins).toHaveCount(3);
  await expect(losersCoins).toHaveCount(3);

  // BONUS: Map each list item's text (optional)
  // const gainersData = await gainersCoins.evaluateAll(nodes =>
  //   nodes.map(n => n.textContent?.trim())
  // );

  // const losersData = await losersCoins.evaluateAll(nodes =>
  //   nodes.map(n => n.textContent?.trim())
  // );

  // console.log('🔥 Top Gainers:', gainersData);
  // console.log('❄️ Top Losers:', losersData);
});

//Test Case 12
test('Top Gainers "More" button works properly', async ({ page }) => {
  // Target the Top Gainers card by visible text — not brittle classnames
  const gainersCard = page
    .locator('.ExploreCryptos_crypto_cards__9rnb8')
    .filter({ hasText: /top gainers/i });
    await expect(gainersCard).toBeVisible();
 
  // Locate the "More" button inside the card
  const moreButton = gainersCard.getByRole('link', { name: /more/i });
  await expect(moreButton).toBeVisible();
  await moreButton.click();

  // Verify redirection URL
  await expect(page).toHaveURL(
    /\/crypto\?page=1&row=20&primaryCategory=top-gainers&secondaryCategory=All&sortby=percent_change_24h&orderby=desc$/
  );
});

//Test Case 13
test('Top Losers "More" button works properly', async ({ page }) => {
  // Find the Top Losers card by visible text
  const losersCard = page
    .locator('.ExploreCryptos_crypto_cards__9rnb8')
    .filter({ hasText: /top losers/i });
    await expect(losersCard).toBeVisible();

  // Find the More button by role instead of CSS
  const moreButton = losersCard.getByRole('link', { name: /more/i });
  await expect(moreButton).toBeVisible();
  await moreButton.click();

  // Confirm navigation goes to the correct place
  await expect(page).toHaveURL(
    /\/crypto\?page=1&row=20&primaryCategory=top-losers&secondaryCategory=All&sortby=percent_change_24h&orderby=asc$/
  );
});

//Test Case 14
test('Research Score tabs show correct top currency', async ({ page }) => {
  const tabsContainer = page.locator('.researchtabs_tabs_container__HEvCz');
  const title         = page.locator('.researchscore_top_currency__tF8U2');

  await expect(tabsContainer).toBeVisible();
  const popup = page.locator('div.animate-popupFadeIn');
  const closeBtn = popup.locator('div.absolute.top-5.right-5');

  const dismissPopupIfVisible = async () => {
    if (await popup.isVisible()) {
      await closeBtn.click({ force: true });
      await popup.waitFor({ state: "detached" });
    }
  };

  // Get tab names FAST
  const tabNames = await tabsContainer
    .locator('.researchtabs_tab_item__HHQXL')
    .evaluateAll(nodes => nodes.map(n => n.textContent.trim()));

  for (const name of tabNames) {

    // Close popup BEFORE clicking any tab
    await dismissPopupIfVisible();

    const tab = tabsContainer.getByText(name, { exact: true });

    // Click + wait for title update
    await Promise.all([
      tab.click({ force: true }),
      title.waitFor({ state: "visible" })
    ]);

    // Dynamic assertion
    await expect(title).toHaveText(`Top ${name} Tokens`);
  }
});

//Test Case 15
test('Check category-wise content updates from Research Score tab', async ({ page }) => {
  test.setTimeout(120_000);

  const tabsContainer    = page.locator('.researchtabs_tabs_container__HEvCz');
  const researchScoreTab = page.locator('.researchscore_research_card_container__u5szn');
  const title            = researchScoreTab.locator('.researchscore_top_currency__tF8U2');

  // ---------- POPUP HANDLER ----------
  const popup     = page.locator('div.animate-popupFadeIn');
  const closeBtn  = popup.locator('div.absolute.top-5.right-5');

  const dismissPopupIfVisible = async () => {
    if (await popup.isVisible()) {
      await closeBtn.click({ force: true });
      await popup.waitFor({ state: 'detached' });
    }
  };

  // Close popup at the very beginning
  await dismissPopupIfVisible();
  // -----------------------------------

  // Wait for section to exist in DOM
  await page.waitForSelector('.researchtabs_tabs_container__HEvCz', { state: 'attached' });

  // Scroll to section
  await tabsContainer.scrollIntoViewIfNeeded();

  // If popup appears again due to scroll/timeout — close again
  await dismissPopupIfVisible();

  // NOW assert visibility
  await expect(tabsContainer).toBeVisible();

  const tabs = tabsContainer.locator('.researchtabs_tab_item__HHQXL');
  const count = await tabs.count();

  for (let i = 0; i < count; i++) {

    // ensure popup hasn't reappeared
    await dismissPopupIfVisible();

    const tab = tabs.nth(i);
    const categoryName = (await tab.innerText()).trim();

    await tab.scrollIntoViewIfNeeded();
    await tab.click({ force: true });

    await expect(title).toHaveText(`Top ${categoryName} Tokens`);

    const slug = categoryName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');

    // click "view all"
    const viewAllButton = researchScoreTab.locator('.researchscore_desktop_view_all__Iqi_G');
    await viewAllButton.click();

    await expect(page).toHaveURL(new RegExp(slug, 'i'));

    await page.goBack();

    // section is out of view; scroll again
    await page.waitForSelector('.researchtabs_tabs_container__HEvCz', { state: 'attached' });

    await tabsContainer.scrollIntoViewIfNeeded();
    await dismissPopupIfVisible();
    await expect(tabsContainer).toBeVisible();
  }
});




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

test('FAQs existence on the page and display number of FAQs', async ({ page }) => {
  const faqSection = page.locator(
    '.flex.flex-col.text-white.pt-\\[120px\\].mobile\\:w-full.mobile\\:pt-\\[80px\\]'
  );
  await expect(faqSection).toBeVisible();

  const title = faqSection.locator(
    '.flex.flex-row.justify-center.font-DMSans.text-display-md-medium.mobile\\:text-xl-medium'
  );
  await expect(title).toHaveText('Frequently Asked Questions');

  const faqItems = faqSection.locator(
    '.rounded-\\[16px\\].bg-\\[\\#121212\\].p-\\[20px\\].animate-motionY.z-20'
  );
  const expectedCount = 9;
  await expect(faqItems).toHaveCount(expectedCount);
  console.log(`Total FAQ cards found: ${await faqItems.count()}`);

});

test('FAQs contain proper Questions and Answers', async ({ page }) => {
  const faqSection = page.locator(
    '.flex.flex-col.text-white.pt-\\[120px\\].mobile\\:w-full.mobile\\:pt-\\[80px\\]'
  );
  await expect(faqSection).toBeVisible();
  // ✅ Grab all FAQ question titles
  const faqTitles = faqSection.locator('div.text-lg-regular');
  const titles = await faqTitles.allInnerTexts();
  await expect(faqTitles).toHaveText(titles);
  // ✅ Grab all FAQ answers using the real class
  const faqAnswers = faqSection.locator('div.landingPageFqa');
  const answers = await faqAnswers.allInnerTexts();
  await expect(faqAnswers).toHaveText(answers);
});

test('Each FAQ clickability', async ({ page }) => {
  // Locator for all FAQ “cards”
  const faqCards = page.locator(
    '.rounded-\\[16px\\].bg-\\[\\#121212\\].p-\\[20px\\].animate-motionY.z-20'
  );
  const total = await faqCards.count();
  console.log(`Found ${total} FAQ cards`);
  for (let i = 0; i < total; i++) {
    const card = faqCards.nth(i);
    // Click the question header to toggle the answer
    await card.click();
    // Wait for the answer inside this card to appear
    const answer = card.locator('div.landingPageFqa'); // adjust if your answer div uses a different class
    await expect(answer).toBeVisible();
  }
});