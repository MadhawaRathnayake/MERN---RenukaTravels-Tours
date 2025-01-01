import { Row, Col } from 'reactstrap';
import TourCard from '../shared/TourCard';
import { useEffect, useState } from "react";

const FeaturedTourList = () => {
  const [userTours, setUserTours] = useState([]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch(`/api/tours/gettours`);
        const data = await res.json();
        if (res.ok) {
          setUserTours(data.tours);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchTours();
  }, []);
//console.log(userTours);
  return (
    <Row>
      {userTours?.map((tour) => (
        <Col lg="3" md="6" sm="6" className="mb-4" key={tour._id}>
          <TourCard tour={tour} />
        </Col>
      ))}
    </Row>
    
  );
};

export default FeaturedTourList;
