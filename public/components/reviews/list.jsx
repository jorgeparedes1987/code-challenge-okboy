import React from 'react';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';

const ReviewsList = (props) => {
  const getBg = (review) => {
    if(review.rate > 3) return 'success';
    if(review.rate <= 3 && review.rate > 2) return 'warning';
    return 'danger';
  };
  const rowsMapped = () => {
    return props.post.reviews.map((review, index) => {
      return (
        <Card key={index}>
          <Card.Body>
            <Card.Title>
              <span style={{marginRight: '1rem'}}>{(review.userId == 0) ? 'annonymous' : "user" }</span><Badge bg={getBg(review)}>{review.rate}</Badge>
            </Card.Title>
          </Card.Body>
        </Card>
      )
    });
  }
  return (
    <React.Fragment>
      {rowsMapped()}
    </React.Fragment>
  )
}
export default ReviewsList;