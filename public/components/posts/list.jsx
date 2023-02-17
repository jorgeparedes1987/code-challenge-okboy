import { useState, useEffect, useCallback } from 'react';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import ReviewsList from '../reviews/list';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [showReviews, setShowReviews] = useState(false);

  const getPosts = async() => {
    setPosts([]);
    const res = await fetch("/api/post/list?page=1");
    if(res.status !== 200){
      throw new Error('Cannot pulling down the posts');
    }
    const content = await res.json();
    setPosts(content);
  };

  const openReviews = () => {
    setShowReviews(true);
  };

  const fetchPosts = useCallback(async() => {
    await getPosts();
  });

  const rowsMapped = () => {
    return posts.map((post, index) => {
      return (
        <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start"
        style={{cursor: 'pointer'}}
        key={index}
        onClick={openReviews}
        >
          <Container>
            <Row>
              <Col sm={9}>
                <div className="ms-2 me-auto">
                <div className="fw-bold">{post.title}</div>
                  {post.content}
                </div>
              </Col>
              <Col sm={3} style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                <Badge bg="primary" pill>
                  {post.reviews.length}
                </Badge>
              </Col>
            </Row>
            <Row style={{marginTop: '1rem'}}>
              <Col sm={12}>
                {showReviews && <ReviewsList post={post} />}
              </Col>
            </Row>
          </Container>
        </ListGroup.Item>
      )
    })
  }
  useEffect(() => {
    fetchPosts();
  }, []);
  
  return (
    <ListGroup as="ol">
      {rowsMapped()}
    </ListGroup>
  );
}

export default PostList;