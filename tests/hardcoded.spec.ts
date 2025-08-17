import { test, expect } from '@playwright/test';

test('dashboard test to check the results table functionality', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.locator('div').filter({ hasText: 'Performance ReportPeak Hour Load TestScenario: test-report-dataPeak Hour Load' }).nth(3).click();
  await page.locator('div').filter({ hasText: /^Start Time04:54 PMWed 23 Feb 2022$/ }).first().click();
  await page.locator('div').filter({ hasText: /^Duration1d 1h 33m 30s$/ }).first().click();
  await expect(page.locator('div').filter({ hasText: /^Total Requests310,985$/ }).first()).toBeVisible();
  await page.locator('div').filter({ hasText: /^Requests\/Min4,442$/ }).first().click();
  await expect(page.locator('div').filter({ hasText: /^Requests\/Min4,442$/ }).first()).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Error Rate1\.29%$/ }).first()).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Min3msP5029msP90586msP95779msP991445msP99\.92624msMax5000ms$/ }).first()).toBeVisible();
  await page.getByText('SummaryResponse TimesMetadataRequestsTest SummaryResponse Time Percentiles50th').click();
  await expect(page.getByRole('button', { name: 'Summary' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Test Summary' })).toBeVisible();
  await expect(page.getByText('Response Time Percentiles50th')).toBeVisible();
  await expect(page.getByText('Request StatisticsPassed60Failed14Unavailable180.0%Success')).toBeVisible();
  await expect(page.getByText('Assertion StatisticsPassed204Failed18Unavailable390.7%Pass')).toBeVisible();
  await expect(page.getByRole('main')).toContainText('Assertion Statistics');
  await page.locator('div').filter({ hasText: /^Min:3msMax:5000ms$/ }).first().click();
  await page.getByText('SummaryResponse TimesMetadataRequests').click();
  await page.getByRole('button', { name: 'Requests' }).click();
  await expect(page.getByRole('button', { name: 'Status ▼' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Severity ▼' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Numeric Filter ▼' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Expand All' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Request Results' })).toBeVisible();
  await page.getByRole('button', { name: 'Expand All' }).click();
  await expect(page.getByText('Request DetailsPass/Fail DistributionTotal: 5Rate: 0.09 PER_MINUTEResponse')).toBeVisible();
  await expect(page.locator('tbody')).toMatchAriaSnapshot(`
    - heading "Pass/Fail Distribution" [level=5]
    - text: "/Total: 5 Rate: \\\\d+\\\\.\\\\d+ PER_MINUTE/"
    `);
  await expect(page.locator('tbody')).toMatchAriaSnapshot(`
    - heading "Response Times" [level=5]
    - text: /Performance chart showing response times from \\d+[hmsp]+ to \\d+[hmsp]+\\. Average response time is \\d+[hmsp]+\\. 3 out of 3 requirements are passing\\./
    - img:
      - text: /\\d+% \\d+% \\d+% \\d+% \\d+\\.\\d+% \\d+% Percentile 0 \\d+ \\d+ \\d+ \\d+ \\d+/
      - 'button /Percentile: \\d+% Response Time: \\d+[hmsp]+/'
      - 'button /Percentile: \\d+% Response Time: \\d+[hmsp]+/'
      - 'button /Percentile: \\d+% Response Time: \\d+[hmsp]+/'
      - 'button /Percentile: \\d+% Response Time: \\d+[hmsp]+/'
      - 'button /Percentile: \\d+\\.\\d+% Response Time: \\d+[hmsp]+/'
      - 'button /Percentile: \\d+% Response Time: \\d+[hmsp]+/'
      - 'button /Percentile: \\d+% Requirement: \\d+[hmsp]+ Status: PASS/'
      - 'button /Percentile: \\d+% Requirement: \\d+[hmsp]+ Status: PASS/'
      - 'button /Percentile: \\d+% Requirement: \\d+[hmsp]+ Status: PASS/'
    - text: Response Times Requirements PASS FAIL
    `);
  await expect(page.locator('tbody')).toMatchAriaSnapshot(`
    - heading "Requirements" [level=5]
    - heading "Percentile Requirements" [level=6]
    - text: "/50th: PASS \\\\d+[hmsp]+ \\\\(-\\\\d+[hmsp]+\\\\) 95th: PASS \\\\d+[hmsp]+ \\\\(-\\\\d+[hmsp]+\\\\) 100th: PASS \\\\d+[hmsp]+ \\\\(-\\\\d+[hmsp]+\\\\)/"
    `);
  await expect(page.getByRole('cell', { name: 'Request Details Pass/Fail Distribution Total: 207 Rate: 2.97 PER_MINUTE' }).locator('h4')).toBeVisible();
  await expect(page.getByText('Request DetailsPass/Fail DistributionTotal: 207Rate: 2.97 PER_MINUTEResponse')).toBeVisible();
  await expect(page.locator('tbody')).toMatchAriaSnapshot(`
    - heading "Pass/Fail Distribution" [level=5]
    - text: "/Total: \\\\d+ Rate: \\\\d+\\\\.\\\\d+ PER_MINUTE/"
    `);
  await expect(page.locator('tbody')).toMatchAriaSnapshot(`
    - heading "Response Times" [level=5]
    - text: /Performance chart showing response times from \\d+[hmsp]+ to \\d+[hmsp]+\\. Average response time is \\d+[hmsp]+\\. 3 out of 3 requirements are passing\\./
    - img:
      - text: /\\d+% \\d+% \\d+% \\d+% \\d+\\.\\d+% \\d+% Percentile 0 \\d+ \\d+ \\d+ \\d+ \\d+/
      - 'button /Percentile: \\d+% Response Time: \\d+[hmsp]+/'
      - 'button /Percentile: \\d+% Response Time: \\d+[hmsp]+/'
      - 'button /Percentile: \\d+% Response Time: \\d+[hmsp]+/'
      - 'button /Percentile: \\d+% Response Time: \\d+[hmsp]+/'
      - 'button /Percentile: \\d+\\.\\d+% Response Time: \\d+[hmsp]+/'
      - 'button /Percentile: \\d+% Response Time: \\d+[hmsp]+/'
      - 'button /Percentile: \\d+% Requirement: \\d+[hmsp]+ Status: PASS/'
      - 'button /Percentile: \\d+% Requirement: \\d+[hmsp]+ Status: PASS/'
      - 'button /Percentile: \\d+% Requirement: \\d+[hmsp]+ Status: PASS/'
    - text: Response Times Requirements PASS FAIL
    `);
  await expect(page.locator('tbody')).toMatchAriaSnapshot(`
    - heading "Requirements" [level=5]
    - heading "Percentile Requirements" [level=6]
    - text: "/50th: PASS \\\\d+[hmsp]+ \\\\(-\\\\d+[hmsp]+\\\\) 95th: PASS \\\\d+[hmsp]+ \\\\(-\\\\d+[hmsp]+\\\\) 100th: PASS \\\\d+[hmsp]+ \\\\(-\\\\d+[hmsp]+\\\\)/"
    `);
  await page.getByRole('button', { name: 'Collapse All' }).click();
  await expect(page.getByText('Request ResultsStatus▼')).toBeVisible();
  await expect(page.locator('tbody')).toContainText('▶DELETE /proxy/api/application');
});