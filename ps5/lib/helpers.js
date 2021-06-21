module.exports = {
  getAllPrices: async function (page, selector) {
    try {
      await page.waitForSelector(selector)
      return await page.$$eval(selector, (offers) =>
        offers.map((offer) => offer.innerHTML)
      )
    } catch (err) {
      throw new Error(`Could not find elements by selector: ${selector}`)
    }
  },
  getAllOfferElements: async function (page, selector) {
    try {
      await page.waitForSelector(selector)
      return await page.$$(selector)
    } catch (err) {
      throw new Error(`Cannot find elements by selector: ${selector}`)
    }
  }
}
