import { useState, useEffect } from 'react';
import CommonSection from '../components/shared/CommonSection';
import '../styles/tour.css';
import { Container, Row, Col } from 'reactstrap';
import TourCard from '../components/shared/TourCard';
import '../styles/global.css';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalTours, setTotalTours] = useState(0);

  // Fetch tours data
  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/tours/gettours?page=${page}`);
        const data = await res.json();
        
        if (res.ok) {
          setTours(data.tours);
          setTotalTours(data.totalTours || 0);
          const pages = Math.ceil((data.totalTours || 0) / 8); // Assuming 8 items per page
          setPageCount(pages);
        } else {
          setError(data.message || 'Failed to fetch tours');
        }
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <>
      <CommonSection title={'All Tours'} />
      <section>
        <Container>
          <Row>
            {/* You can add search/filter functionality here */}
          </Row>
        </Container>
      </section>
      <section className="pt-0">
        <Container>
          {loading && <h4 className="text-center pt-5">Loading.....</h4>}
          {error && <h4 className="text-center pt-5">{error}</h4>}
          {!loading && !error && (
            <Row>
              {tours?.map(tour => (
                <Col lg="3" md="6" sm="6" className="mb-4" key={tour._id}>
                  <TourCard tour={tour} />
                </Col>
              ))}

              <Col lg="12">
                <div className="pagination d-flex align-items-center justify-content-center mt-4 gap-3">
                  {[...Array(pageCount).keys()].map(number => (
                    <span
                      key={number}
                      onClick={() => setPage(number)}
                      className={page === number ? "active__page" : ""}
                    >
                      {number + 1}
                    </span>
                  ))}
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </section>
    </>
  );
};

export default Tours;