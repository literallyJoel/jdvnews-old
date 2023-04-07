import { useEffect, useState } from "react";
import { fetchArticles, getFeeds, getSummary } from "../../../helpers/Helper";
import { Card, Pagination, Placeholder, Button, Row, Col, Container } from "react-bootstrap";
import "../Home.css"
import { useKeycloak } from "@react-keycloak/web";

const RSSFeed = () => {
  const { keycloak } = useKeycloak();
  //These are the news feeds used for users who aren't logged in.
  const [feeds, setFeeds] = useState(["http://feeds.bbci.co.uk/news/rss.xml", "https://feeds.skynews.com/feeds/rss/home.xml", "https://rss.nytimes.com/services/xml/rss/nyt/World.xml"]);
  const [parsedFeeds, setParsedFeeds] = useState(null);
  const [summary, setSummary] = useState(null);
  const [pages, setPages] = useState(Array(feeds.length).fill(0));
  const [customFeedsParsed, setCustomFeedsParsed] = useState(false);

  useEffect(() =>{
    async function authFeeds(){
      if(keycloak.authenticated){
        const _feeds = await getFeeds(keycloak.token);
        const _feedURLS = [];
        _feeds.map((feed) => _feedURLS.push(feed.FeedLink));
        //Prevents the application from accidentally calling the summary function before the users custom feeds are shown
        setCustomFeedsParsed(true);
        setFeeds(_feedURLS);
      }
    }

    authFeeds();
    
  }, [keycloak.authenticated])
  //When the page first loads, it calls the API to parse the feeds.
  useEffect(() => {
    const getFeeds = async () => {
      const data = await fetchArticles(feeds);
      setParsedFeeds(data);
    }
    getFeeds();

  }, [feeds])

  const handleClick = (newPage, index) => {
    const _pages = [...pages];
    _pages[index] = newPage;
    setPages(_pages);
  }

  const PaginationBar = ({ cardsPerPage, numberOfItems, index }) => {
    const numberOfPages = Math.ceil(numberOfItems / cardsPerPage);

    const paginationNumbers = Array(numberOfPages).fill(0);
    return (
      <Pagination style={{ justifyContent: "center" }}>

        {pages[index] === 0 ?  (<></>) : (
        <Pagination.First onClick={() => handleClick(0, index)} />
        )}


        <Pagination.Prev disabled={(pages[index] === 0)} onClick={() => handleClick(pages[index] - 1, index)} />
        {numberOfPages < 8 ? (
          <>
            {paginationNumbers.map((x, i) => (
              <Pagination.Item active={i === pages[index]} key={i} onClick={() => handleClick(i, index)}>{i + 1}</Pagination.Item>
            ))}
          </>
        ) : (
          <>
            {paginationNumbers.slice(0, 6).map((x, i) => (

              <Pagination.Item active={i === pages[index]} key={i} onClick={() => handleClick(i, index)}>{i + 1}</Pagination.Item>

            ))}
            <Pagination.Ellipsis />
            <Pagination.Item active={pages[index] === numberOfPages - 1} key={numberOfPages - 1} onClick={() => handleClick(numberOfPages - 1, index)}>{numberOfPages}</Pagination.Item>

          </>
        )}

        {pages[index] === (numberOfPages -1) ? (<></>) : (
          <>
            <Pagination.Next onClick={() => handleClick(pages[index] + 1, index)} />
          </>)
        }

        <Pagination.Last onClick={() => handleClick(numberOfPages - 1, index)} />
      </Pagination>
    )
  }

  const CardPage = ({ parsedFeed, index, cardsPerPage }) => {
    return (
      <Container style={{ marginBottom: "2%" }}>
        <Row xs={1} sm={2} md={3} lg={3} className="g-4">

          {parsedFeed.items.slice(pages[index]*cardsPerPage, (pages[index]*cardsPerPage) + cardsPerPage).map((newsItem) => (

            <Col key={newsItem.guid}>
              <Card id="newsCard">
                <Card.Title>{newsItem.title}</Card.Title>
                <Card.Body>{newsItem.contentSnippet}</Card.Body>

                <Button id="cardButton" onClick={() => window.open(newsItem.link, '_blank').focus()}>
                  Read Article
                </Button>

              </Card>
            </Col>

          ))}
        </Row>
      </Container>
    )


  }


  //Once the feeds are parsed if the user is logged in it'll call the OpenAI API to get the summary
  useEffect(() => {
    const summarise = async () => {
      if(keycloak.authenticated && customFeedsParsed){
        const _summary = await getSummary(keycloak.token, parsedFeeds);
        setSummary(_summary);
      }
      
      
    }

    summarise();
  }, [parsedFeeds]);






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

        {/*Shows the AI overview if the user is logged in. Limited to around 20 headlines per roundup because API cost*/}
        {keycloak.authenticated ? (
          <>
            <Card style={{ textAlign: "center", marginBottom: "2%" }}>
              <Card.Body>
                <Card.Title>Today's News Roundup</Card.Title>
                <Card.Text id="roundupsubheader">Powered by ChatGPT</Card.Text>
                <Card.Text id="roundupsubheader">ChatGPT may sometimes have some innacurate information in its summaries.</Card.Text>
                {summary ? (
                  <Card.Text>{summary}</Card.Text>
                ) : (
                  <Placeholder as={Card.Text} animation="glow">
                    <Placeholder xs={1} /> <Placeholder xs={2} />  <Placeholder xs={4} />  <Placeholder xs={6} />  <Placeholder xs={1} />  <Placeholder xs={3} />
                  </Placeholder>
                )}
              </Card.Body>
            </Card>
          </>
        ) : (<></>)}

        {parsedFeeds.map((parsedFeed, i) => (

          <div key={i} className="newsBlock">
            <img className="newsLogo" src={parsedFeed.image.url} alt={parsedFeed.Title + " Logo"} />
            <PaginationBar cardsPerPage={6} numberOfItems={parsedFeed.items.length} index={i} />
            <CardPage cardsPerPage={6} parsedFeed={parsedFeed} index={i} />
            <PaginationBar cardsPerPage={6} numberOfItems={parsedFeed.items.length} index={i} />
          </div>

        ))}

      </>
    )
  }
}



export default RSSFeed;