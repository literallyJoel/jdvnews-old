export const fetchArticles = async (feeds) => {

  const response = await fetch('/rss/parse-feeds', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ feeds })
  });

  const data = await response.json();
  return data;
}

export const getSummary = async (token, parsedFeeds) => {

  //I want to limit to 20 headlines to limit API costs, but I also want to make sure the summary has a good range of headlines from multiple rss feeds, so this function selects 20 at random
  const arraySplitter = (titles) => {
    const ret = [];

    // Loop through the inputArray and randomly select 20 unique items
    while (ret.length < 20 && titles.length > 0) {
      const randomIndex = Math.floor(Math.random() * titles.length);
      const randomItem = titles[randomIndex];

      if (!ret.includes(randomItem)) {
        ret.push(randomItem);
      }

      // Remove the item from the inputArray 
      titles.splice(randomIndex, 1);
    }

    return ret;
  }
  const titles = [];

  parsedFeeds.map((parsedFeed) => {
    parsedFeed.items.map((newsItem) => {
      titles.push(newsItem.title);
    })
  })

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  }

  const summary = await fetch('/openai/getSummary', {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ titles: arraySplitter(titles) })
  });
  console.log("LETSGOO")
  const data = await summary.text();
  return data;
}
export const getFeeds = async (token, feedID) => {
  const headers = {
    Authorization: `Bearer ${token}`
  };

  var request = feedID ? `/rss/getRSS?id=${feedID}` : "/rss/getRSS"
  const resp = await fetch(request, { headers });
  const data = resp.json();
  return data;

}

export const deleteFeed = async (token, feedID) => {
  const headers = {
    Authorization: `Bearer ${token}`
  };

  const resp = await fetch(`/rss/removeRSS?id=${feedID}`, { headers });

  if (!resp.ok) {
    console.error("Error removing feed");
    return -1;
  }

  return 1;
}