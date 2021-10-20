const request = require('request-promise')

const REQ_URL = 'https://www.shelterluv.com/api/v3/available-animals/11886?species=Cat'

exports.fetchCatItems = async () => {
  const data = await request.get(REQ_URL)
  const response = JSON.parse(data)
  return response.animals
    .filter(a => a.weight !== null)
    .map(a => ({ name: a.name, weight: a.weight, url: a.public_url }))
}

exports.fetchCatDetails = async (cat) => {
  const { name, weight, url } = await cat
  return { name, weight, url }
}
