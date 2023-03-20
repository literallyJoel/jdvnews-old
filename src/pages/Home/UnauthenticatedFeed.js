import { useEffect, useState } from "react";
import { fetchArticles } from "./RSS";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import "./Home.css"
const UnauthenticatedFeed = () => {
  const feeds = ["http://feeds.bbci.co.uk/news/rss.xml", "https://feeds.skynews.com/feeds/rss/home.xml", "https://rss.nytimes.com/services/xml/rss/nyt/World.xml"]

  const [parsedFeeds, setParsedFeeds] = useState(null);

  useEffect(() => {
    const getFeeds = async () => {
      const data = await fetchArticles(feeds);
      setParsedFeeds(data);
    }
    getFeeds();
  }, [])

  if (parsedFeeds === null) {
    return (
      <>
        Loading...
      </>
    )
  } else {

    console.log(parsedFeeds)
    return (
      <>
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