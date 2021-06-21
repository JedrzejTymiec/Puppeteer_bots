const puppeteer = require('puppeteer')

const BASE_URL = 'https://instagram.com'
const TAG_URL = (tag) => `https://www.instagram.com/explore/tags/${tag}/`

const instagram = {
  browser: null,
  page: null,

  initialize: async () => {
    instagram.browser = await puppeteer.launch({
      headless: false
    })

    instagram.page = await instagram.browser.newPage()
  },
  login: async (username, password) => {
    try {
      await instagram.page.goto(BASE_URL, { waitUntil: 'networkidle2' })

      await instagram.page.click('.aOOlW')

      await instagram.page.waitForTimeout(1000)

      await instagram.page.type("input[name='username']", username, {
        delay: 50
      })
      await instagram.page.type("input[name='password']", password, {
        delay: 50
      })

      await instagram.page.click('.bkEs3')

      await instagram.page.waitForSelector('img[data-testid="user-avatar"]')
      await instagram.page.click('button.aOOlW.HoLwm')
    } catch (err) {
      console.error(err)
    }
  },
  liketags: async (tags = []) => {
    for (let tag of tags) {
      await instagram.page.goto(TAG_URL(tag), { waitUntil: 'networkidle2' })
      const posts = await instagram.page.$$('article > div:nth-child(3) img')

      for (let i = 0; i < 3; i++) {
        const post = posts[i]
        await post.click()
        await instagram.page.waitForSelector('svg[aria-label="Lubię to!"]')

        await instagram.page.click('svg[aria-label="Lubię to!"]')
        await instagram.page.waitForTimeout(1000)
        await instagram.page.click('svg[aria-label="Zamknij"]')
      }
    }
  }
}

module.exports = instagram
