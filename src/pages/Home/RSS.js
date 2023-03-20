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

