import React from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Centercards.css';

function CardComponent() {
  return (
    <div className="container">
      <Row>
        <Col md={4}>
          <Card className="custom-card">
            <Card.Img variant="top" src="cover.webp" />
            <Card.Body>
              <Card.Title>Robust Exam PLanning</Card.Title>
              <Card.Text>Our Digital examination software helps in conducting fair tests and exams without any risks of human error or malpractices like cheating.  </Card.Text> 
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="custom-card">
            <Card.Img variant="top" src="question.jpg" />
            <Card.Body>
              <Card.Title>Secure Questionpaper Creation</Card.Title>
              <Card.Text>Enables replacement of traditional handwritten question papers with digitised question papers that are more secure.  </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="custom-card">
            <Card.Img variant="top" src="watermarkcertificate.jpg" />
            <Card.Body>
              <Card.Title>Reliable and Superior results</Card.Title>
              <Card.Text>Automates the generation, reconciliation, and finalization of marks lists. The solution allows the application of gracing rules, along with moderation, and online publication of results.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Card className="custom-card">
            <Card.Img variant="top" src="hiring.webp" />
            <Card.Body>
              <Card.Title>Hiring the right person</Card.Title>
              <Card.Text>Hire the right cultural fit, with a blend of Assessments designed to find the perfect job fit</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="custom-card">
            <Card.Img variant="top" src="rightcandidate.webp" />
            <Card.Body>
              <Card.Title>Developing the Right Candidate</Card.Title>
              <Card.Text>Identify Gaps for Each Employee to Create a Customized Learning and development Roadmap</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="custom-card">
            <Card.Img variant="top" src="betterleaders.webp" />
            <Card.Body>
              <Card.Title>Making Better Leaders</Card.Title>
              <Card.Text>Groom Employees Today, to create a solid Leadership Pipeline for the Future and to make better leaders.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default CardComponent;
