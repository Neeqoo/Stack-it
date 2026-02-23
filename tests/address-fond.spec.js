// tests/address-fond.spec.js
const { test, expect } = require('@playwright/test');

const CREDENTIALS = {
  login: 'DEMOWEB',
  password: 'awdrgy'
};

test.describe('Адреса проживающих', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    console.log('>>> Подготовка');
    
    await page.goto('https://demo.app.stack-it.ru/fl/');
    await page.fill('input[id="VInput68"]', CREDENTIALS.login);
    await page.fill('input[id="VInput72"]', CREDENTIALS.password);
    await page.click('button[data-cy="submit-btn"]');
    
    // если вылезло окно про сессию
    try {
      await page.waitForSelector('button[data-cy="btn-yes"]', { timeout: 3000 });
      console.log('окно сессии, жму да');
      await page.click('button[data-cy="btn-yes"]');
      await page.waitForSelector('button[data-cy="btn-yes"]', { state: 'hidden', timeout: 3000 });
    } catch (e) {
      // ну и ладно
    }
    
    await expect(page.locator('span:has-text("Адреса проживающих")')).toBeVisible();
    await page.locator('span:has-text("Адреса проживающих")').click();
    await expect(page.locator('button[data-cy="btn-add"]')).toBeVisible();
  });


  // -----	Диалоговое окно	-----
  
  test('Диалог открывается и закрывается', async ({ page }) => {
    console.log('1. Диалоговое окно');
    
    await page.click('button[data-cy="btn-add"]');
    await page.click('text="Район"');
    
    let dialog = page.locator('[data-cy="stack-dialog"]').first();
    await expect(dialog).toBeVisible();
    
    await expect(dialog.locator('button:has-text("Внести")').first()).toBeVisible();
    await expect(dialog.locator('button[data-cy="btn-cancel"]').first()).toBeVisible();
    
    await page.waitForTimeout(1000);
    await dialog.locator('button[data-cy="btn-cancel"]').first().click();
    await expect(dialog).toBeHidden();
  });


	// -----	добавление уровня «Район» в таблицу	-----
	
  test('Создание района', async ({ page }) => {
    console.log('2. добавление уровня «Район» в таблицу');
    
    let name = 'Район ' + Date.now();
    console.log(name);
    
    await page.click('button[data-cy="btn-add"]');
    await page.click('text="Район"');
    
    let dialog = page.locator('[data-cy="stack-dialog"]').first();
    await expect(dialog).toBeVisible();
    
    let input = dialog.locator('input[type="text"]').first();
    await input.fill(name);
    await dialog.locator('button:has-text("Внести")').first().click();
    
    await page.waitForTimeout(1000);
    let row = page.locator('tr:has-text("' + name + '")');
    await expect(row).toBeVisible();
    
    // удаляем
    await row.locator('input[type="checkbox"]').first().click({ force: true });
    await page.locator('button[data-cy="btn-delete"]').first().click();
    await page.locator('button:has-text("Да")').first().click();
    await expect(row).toBeHidden();
  });


	// -----	Редактирование записи	-----
  test('Редактирование', async ({ page }) => {
    console.log('3. Редактирование записи');
    
    let oldName = 'Район ' + Date.now();
    let newName = oldName + ' new';
    
    // создаем
    await page.click('button[data-cy="btn-add"]');
    await page.click('text="Район"');
    
    let dialog = page.locator('[data-cy="stack-dialog"]').first();
    await expect(dialog).toBeVisible();
    
    let input = dialog.locator('input[type="text"]').first();
    await input.fill(oldName);
    await dialog.locator('button:has-text("Внести")').first().click();
    
    let row = page.locator('tr:has-text("' + oldName + '")');
    await expect(row).toBeVisible();
    
    // редактируем
    await row.locator('button[data-cy="btn-edit"]').first().click();
    
    let editDialog = page.locator('[data-cy="stack-dialog"]').first();
    await expect(editDialog).toBeVisible();
    
    let editInput = editDialog.locator('input[type="text"]').first();
    await editInput.fill(newName);
    await editDialog.locator('.v-card').first().click();
    await page.waitForTimeout(500);
    
    let saveBtn = editDialog.locator('button:has-text("Сохранить")').first();
    await expect(saveBtn).toBeEnabled();
    await saveBtn.click();
    
    await page.waitForTimeout(1000);
    let newRow = page.locator('tr:has-text("' + newName + '")');
    await expect(newRow).toBeVisible();
    
    // чистим
    await newRow.locator('input[type="checkbox"]').first().click({ force: true });
    await page.locator('button[data-cy="btn-delete"]').first().click();
    await page.locator('button:has-text("Да")').first().click();
    await expect(newRow).toBeHidden();
  });

	// -----	Удаление записи		-----
	
  test('Удаление', async ({ page }) => {
    console.log('4. Удаление записи');
    
    let name = 'На удаление ' + Date.now();
    
    await page.click('button[data-cy="btn-add"]');
    await page.click('text="Район"');
    
    let dialog = page.locator('[data-cy="stack-dialog"]').first();
    await expect(dialog).toBeVisible();
    
    let input = dialog.locator('input[type="text"]').first();
    await input.fill(name);
    await dialog.locator('button:has-text("Внести")').first().click();
    
    let row = page.locator('tr:has-text("' + name + '")');
    await expect(row).toBeVisible();
    
    // удаляем
    await row.locator('input[type="checkbox"]').first().click({ force: true });
    await page.locator('button[data-cy="btn-delete"]').first().click();
    await page.locator('button:has-text("Да")').first().click();
    await expect(row).toBeHidden();
  });

	// -----	Обязательное поле (название)		-----

  test('Пустое название', async ({ page }) => {
    console.log('5. Обязательное поле (название)');
    
    await page.click('button[data-cy="btn-add"]');
    await page.click('text="Район"');
    
    let dialog = page.locator('[data-cy="stack-dialog"]').first();
    await expect(dialog).toBeVisible();
    
    let saveBtn = dialog.locator('button:has-text("Внести")').first();
    expect(await saveBtn.isDisabled()).toBeTruthy();
    
    let input = dialog.locator('input[type="text"]').first();
    await input.fill('тест');
    await dialog.locator('.v-card').first().click();
    await page.waitForTimeout(500);
    
    expect(await saveBtn.isEnabled()).toBeTruthy();
    
    await dialog.locator('button[data-cy="btn-cancel"]').first().click();
  });
});