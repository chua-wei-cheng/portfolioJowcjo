import { Builder, By, Key, until, WebDriver } from 'selenium-webdriver'
import { Options } from 'selenium-webdriver/chrome'

describe('Portfolio Website', () => {
  let driver: WebDriver

  beforeAll(async () => {
    const options = new Options()
    options.addArguments('--headless')
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build()
  })

  afterAll(async () => {
    await driver.quit()
  })

  it('should load the home page', async () => {
    await driver.get('http://localhost:3000')
    const title = await driver.getTitle()
    expect(title).toContain('Professional Portfolio')
  })

  it('should navigate to projects page', async () => {
    await driver.get('http://localhost:3000')
    const projectsLink = await driver.findElement(By.linkText('Projects'))
    await projectsLink.click()
    await driver.wait(until.urlContains('/projects'), 5000)
    const heading = await driver.findElement(By.css('h1')).getText()
    expect(heading).toBe('Projects')
  })

  it('should toggle theme', async () => {
    await driver.get('http://localhost:3000')
    const themeToggle = await driver.findElement(By.css('button[aria-label="Toggle theme"]'))
    await themeToggle.click()
    
    // Check if the theme has changed
    const body = await driver.findElement(By.css('body'))
    const isDarkMode = await body.getAttribute('class').then(classes => classes.includes('dark'))
    expect(isDarkMode).toBe(true)
  })

  it('should display login form', async () => {
    await driver.get('http://localhost:3000/login')
    const emailInput = await driver.findElement(By.id('email'))
    const passwordInput = await driver.findElement(By.id('password'))
    const loginButton = await driver.findElement(By.css('button[type="submit"]'))

    expect(await emailInput.isDisplayed()).toBe(true)
    expect(await passwordInput.isDisplayed()).toBe(true)
    expect(await loginButton.isDisplayed()).toBe(true)
  })
})

