
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import './Round.css'; 

function ShapeExample() {
  return (
    <Container>
      <Row className="custom-image-row">
        <Col md={4} className="custom-image-col">
          <div className="custom-circle">
            <Image src="customize.png" roundedCircle className="custom-image" />
            <div className="custom-text">Customization</div>
          </div>
        </Col>
        <Col md={4} className="custom-image-col">
          <div className="custom-circle">
            <Image src="reliability.png" roundedCircle className="custom-image" />
            <div className="custom-text">Certification</div>
          </div>
        </Col>
        <Col md={4} className="custom-image-col">
          <div className="custom-circle">
            <Image src="validate.jpg" roundedCircle className="custom-image" />
            <div className="custom-text">Validation</div>
          </div>
        </Col>

      </Row>
    </Container>
  );
}

export default ShapeExample;

