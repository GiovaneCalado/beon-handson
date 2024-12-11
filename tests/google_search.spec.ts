import { test, expect } from '@playwright/test';

const scenarios = [
  {keyword: 'Playwright'},
  {keyword: 'Beon'},
  {keyword: 'Typescript'}
]

scenarios.forEach((scenario) => {
  test(`Verify that search results are displayed on the search for ${scenario.keyword}`, async ({ page }) => {
    await page.goto('https://google.com');
    await page.locator('[name="q"]').fill(scenario.keyword);
    await page.keyboard.press('Enter')
    
    const results = page.locator('#search .g');
    await expect(results.first()).toBeVisible();
    const resultsCount = await results.count();

    let found = false;
    for (let i = 0; i < resultsCount; i++) {
      const text = await results.nth(i).textContent();
      if (text && text.toLowerCase().includes(scenario.keyword.toLowerCase())) {
        found = true;
        break;
      }
    }

    // Valida que a palavra-chave foi encontrada em pelo menos um resultado
    expect(found).toBeTruthy();
  });

});

test(`verify that you are redirected to the correct URL after search`, async ({ page }) => {
  await page.goto('https://google.com');
  await page.locator('[name="q"]').fill('Beon Tech');
  await page.keyboard.press('Enter')

  const firstResultLink = page.locator('h3').first();
  const href = await firstResultLink.locator('..').getAttribute('href')
  console.log(href)
  await firstResultLink.click()
  await expect(page.locator('//*[@id="__next"]/main/div/div[1]/div[1]/div/div[1]/a/img')).toBeVisible();
  expect(page.url()).toBe(href)
});

