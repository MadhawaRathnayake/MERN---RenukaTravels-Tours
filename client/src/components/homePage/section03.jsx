import { Container, Row, Col } from 'reactstrap';
import Subtitle from '../shared/Subtitle';
import '../../styles/section3.css';
import FeaturedTourList from '../homePage/FeaturedTourList';

export default function Section03() {
  return (
    <section>
      <Container>
        <Row>
          <Col lg="12" className="mb-5">
            <Subtitle subtitle={'Explore'} />
            <h2 className="featured__tour-title">Our featured tours</h2>
          </Col>
        </Row>
        <FeaturedTourList />
      </Container>
    </section>
  );
}
