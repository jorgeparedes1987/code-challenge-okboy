import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PostsList from '../components/posts/list';

const Posts = () => {
  return(
    <Container style={{ marginTop: '5rem' }}>
      <Row>
        <Col>
          <PostsList />
        </Col>
      </Row>
    </Container>
  )
}

export default Posts;