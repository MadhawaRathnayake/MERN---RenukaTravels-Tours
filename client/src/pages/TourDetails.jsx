import '../styles/tour-details.css';
import {Container, Row, Col} from 'reactstrap'
import { useParams } from 'react-router-dom';
import tourData from '../assets/data/tours'
import Booking from '../components/Booking/Booking';

 
const TourDetails = () => {

    const {id} = useParams()
    const tour = tourData.find(tour =>tour.id ===id)
    const {photo,title,desc,price,city,distance,maxGroupSize}=tour
    const loading = false;
    const error = false; 
    return (
        <section>
        <Container>
          {
            loading && <h4 className='text-center pt-5'>Loading.....</h4>
          }
          {
            error && <h4 className='text-center pt-5'>{error}</h4>
          }
          {
            !loading && !error && <Row>
            <Col lg='8'>
              <div className="tour__content">
                <img src={photo} alt="tour" />
  
                <div className="tour__info">
                  <h2>{title}</h2>
                  <div className="d-flex align-items-center gap-5">
                    
  
                    <span>
                      <i className='ri-map-pin-user-fill'></i> {city}
                    </span>
                  </div>
                  <div className="tour__extra-details">
                    <span>
                      <i className='ri-map-pin-2-line'></i> {city}
                    </span>
                    <span>
                      <i className='ri-money-dollar-circle-line'></i> ${price}
                    </span>
                    <span>
                      <i className='ri-map-pin-time-line'></i> {distance} Km
                    </span>
                    <span>
                      <i className='ri-group-line'></i> {maxGroupSize} people
                    </span>
                  </div>
                  <h5>Description</h5>
                  <p>{desc}</p>
                </div>
  
                
              </div>
            </Col>
            
            <Col lg='4'>
            <Booking tour={tour}  />
          </Col>

        
          </Row>
          }
        </Container>
      </section>
  )
}

export default TourDetails