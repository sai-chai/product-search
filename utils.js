const apiKey = process.env.API_KEY;
const restDBDomain = 'sevenfiftyproducts-b8e9.restdb.io';

/**
 * @async
 * @function restedFetch
 * @param {string} path - path to be queried
 * @param {object} query - serializable object for RestDB query
 * @return {Promise<Response>} - Promise for Fetch API Response object
 */
export async function restedFetch(path, query) {
   return fetch(
      `https://${restDBDomain}/rest${path}?=${JSON.stringify(query)}`,
      {
         headers: { 'x-apikey': apiKey },
      },
   );
}
