const puppeteer = require('puppeteer')
const { getAllOfferElements, getAllPrices } = require('./lib/helpers')

describe('PlayStation 5', () => {
  let browser
  let page
  let offers
  let bestOffer
  let index
  let offersObj
  const threshold = 3000
  before(async function () {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 0,
      devtools: false
    })
    page = await browser.newPage()
    await page.setDefaultTimeout(10000)
    await page.setDefaultNavigationTimeout(20000)
    await page.setViewport({ width: 1920, height: 1080 })
  })

  after(async function () {
    browser.close()
  })

  it('Get all offers', async function () {
    await page.goto('https://www.ceneo.pl/86467784', {
      waitUntil: 'networkidle2'
    })
    offersObj = await getAllOfferElements(
      page,
      '.product-offers__list .product-offer__container'
    )
    offers = await getAllPrices(
      page,
      '.product-offers__list .product-offer__container .price .value'
    )
  })

  it('Pick best offer', async function () {
    offers = offers.map((offer) => {
      const str = offer.replace(/\s/g, '')
      return parseInt(str)
    })
    bestOffer = Math.min(...offers)
    index = offers.findIndex((el) => el === bestOffer)
  })

  it('Compare best offer to threshold', async function () {
    if (bestOffer <= threshold) {
      await offersObj[index].click('.button--primary')
      await page.waitForTimeout(10000)
    } else {
      console.log('CIĄGLE ZA DROGO')
    }
  })
})
