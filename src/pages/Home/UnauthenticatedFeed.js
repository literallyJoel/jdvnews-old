import { useEffect, useState } from "react";
import { fetchArticles } from "./RSS";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import "./Home.css"
const UnauthenticatedFeed = () => {
  //These are the news feeds used for users who aren't logged in.
  const feeds = ["http://feeds.bbci.co.uk/news/rss.xml", "https://feeds.skynews.com/feeds/rss/home.xml", "https://rss.nytimes.com/services/xml/rss/nyt/World.xml"]

  const [parsedFeeds, setParsedFeeds] = useState(null);

  //When the page first loads, it calls the API to parse the feeds.
  useEffect(() => {
    const getFeeds = async () => {
      const data = await fetchArticles(feeds);
      setParsedFeeds(data);
    }
    getFeeds();
  }, [])

  //When the page first loads parsedFeeds will always be null before loading, so we have a lil loading thing.
  //This could be nice and stylised but it usually only shows for less than a second.
  if (parsedFeeds === null) {
    return (
      <>
        Loading...
      </>
    )
  } else {

    //If feeds are loaded, it maps them onto react bootstrap cards that shows the logo of the news provider, the title of the article, the subline, and a button to open the article.
    return (
      <>
        {/*We have two maps here, because the information for individual articles is in parsedFeeds.items, but the images we need are in parsedFeeds */}
        {parsedFeeds.map((feedItem) => (
          <>
            {feedItem.items.map((newsItem) => (
              <Container>
                <Row>
                  <Col>
                    <Card>
                      <Card.Img variant="top" src={feedItem.image.url} />
                      <Card.Body>
                        <Card.Title>{newsItem.title}</Card.Title>
                        <Card.Text>
                          {newsItem.contentsnippet}
                        </Card.Text>
                        <Button variant="primary" onClick={() => window.open(newsItem.link, "_blank")}>View Article</Button>
                      </Card.Body>
                    </Card>
                    </Col>
                </Row>
              </Container>
            ))}
          </>
        ))}
      </>
    )
  }
}

export default UnauthenticatedFeed;