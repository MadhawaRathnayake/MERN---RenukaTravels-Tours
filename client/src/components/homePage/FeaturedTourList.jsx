import tourData from '../../assets/data/tours';
import { Row, Col } from 'reactstrap';
import TourCard from '../shared/TourCard';

const FeaturedTourList = () => {
  return (
    <Row>
      {tourData?.map((tour) => (
        <Col lg="3" md="6" sm="6" className="mb-4" key={tour.id}>
          <TourCard tour={tour} />
        </Col>
      ))}
    </Row>
  );
};

export default FeaturedTourList;
