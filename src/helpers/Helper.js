  export const fetchArticles = async (feeds) => {

    const response = await fetch('/parse-feeds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ feeds })
    });

    const data = await response.json();
    return data;
  } 

  export const getSummary = async (token, parsedFeeds) =>{
    const titles = [];

    parsedFeeds.map((parsedFeed) =>{
      parsedFeed.items.map((newsItem) =>{
        titles.push(newsItem.title);
      })
    })
    
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type":  "application/json"
    }

    const summary = await fetch('/getSummary', {
      method: "POST",
      headers: headers,
      body: JSON.stringify({titles: titles})
    });

    const data = await summary.text();
    return data;
  }
  export const getFeeds = async (token, feedID) =>{
    const headers = {
      Authorization: `Bearer ${token}`
    };

    var request = feedID? `/getRSS?id=${feedID}` : "/getRSS"
    const resp = await fetch(request, {headers});
    const data = resp.json();
    return data;

  }

  export const deleteFeed = async(token, feedID) => {
    const headers = {
      Authorization: `Bearer ${token}`
    };

    const resp = await fetch(`/removeRSS?id=${feedID}` , {headers});
    
    if(!resp.ok){
      console.error("Error removing feed");
      return -1;
    }

    return 1;
  }