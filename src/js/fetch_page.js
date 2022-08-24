const axios = require('axios').default;

export default async function fetchPage(currentUrl) {
    const response = await axios.get(currentUrl);
    return response;
}