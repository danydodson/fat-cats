const opener = require('opener')
const { fetchCatItems, fetchCatDetails } = require('./fetch-cats')
require('colors')

const METRIC = process.argv.includes('--metric')
const GRAMS_PER_OZ = 28.3495

const main = async () => {
  console.log('Accessing Evansville VHS (Cat Department)...')
  const catProfiles = await fetchCatItems()

  if (catProfiles.length === 0) {
    console.log('No cats found. It is a sad day.'.red.bold)
    return
  }

  console.log(`Cat information accessed. ${catProfiles.length} cats found. Beginning weighing process...`)
  const cats = []

  for (const catProfile of catProfiles) {
    const catDetails = await fetchCatDetails(catProfile)
    if (catDetails) {
      console.log('Weighing: %s', catDetails.name.green)
      cats.push(catDetails)
    }
  }

  const highestWeight = Math.max(...cats.map((c) => c.weight))
  const fattestCats = cats.filter((c) => c.weight == highestWeight)
  const names = fattestCats.map((c) => c.name)
  const tie = fattestCats.length > 1

  const introText = `The fattest ${tie ? 'cats are' : 'cat is'}`.yellow

  const nameText = (tie ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0]).green.underline

  const descriptionText = (tie ? 'They each weigh' : 'Weighing').yellow

  const weightText = METRIC ? metricWeightForHumans(highestWeight).yellow : `${fattestCats[0].weight} lbs`.yellow

  const openText = `Opening cat ${tie ? 'profiles' : 'profile'}...`.yellow

  console.log(`${introText} ${nameText}. ${descriptionText} ${weightText}. \n${openText}`)

  setTimeout(() => {
    for (const cat of fattestCats) {
      console.log(`${cat.url.yellow}`)
      opener(`${cat.url}`)
    }
  }, 3000)
}

main()

function metricWeightForHumans(ounces) {
  const grams = GRAMS_PER_OZ * ounces
  const kilos = grams / 1000
  return kilos >= 1 ? `${kilos.toLocaleString('en-US', { maximumFractionDigits: 1 })} kg` : `${grams} g`
}
