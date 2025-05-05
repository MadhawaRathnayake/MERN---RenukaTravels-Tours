import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TimelineComponent from '../components/shared/timeline';
import FtourBooking from '../components/featuredTours/FtourBook';
import EmailTourButton from '../components/featuredTours/EmailTourButton';
import { PDFDownloadLink } from '@react-pdf/renderer';
import TourPDFDocument from '../components/featuredTours/TourPdfDoc';
import { MdOutlineFileDownload } from "react-icons/md";
const TourDetails = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [destData, setDestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        setLoading(true);
        
        // Fetch tour data
        const tourResponse = await axios.get(`/api/tours/gettour/${id}`);
        setTour(tourResponse.data);
        
        // Fetch destination data
        const destResponse = await axios.get('/api/destination/get-dest');
        setDestData(destResponse.data);
        
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
        setLoading(false);
      }
    };
    
    fetchTourData();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tour]);

  if (loading) return <h4 className="text-center pt-5 text-lg font-semibold">Loading...</h4>;
  if (error) return <h4 className="text-center pt-5 text-lg font-semibold text-red-500">{error}</h4>;
  if (!tour || !destData) return <h4 className="text-center pt-5 text-lg font-semibold">No Tour Data Found</h4>;
  
  const { title, destinations, days, photo, desc } = tour || {};
  const destinationList = destData?.destinations || [];

  return (
    <section className="py-8">
      <div className="container mx-auto">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-8/12">
            <div className="tour__content bg-white shadow-md rounded-md p-6">
              {photo && (
                <img
                  src={photo}
                  alt={title}
                  className="w-full h-80 object-cover rounded-md mb-6"
                />
              )}
              <div className="tour__info">
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <div className="flex flex-wrap gap-4 mb-4">
                  <span className="text-sm font-medium text-gray-600">
                    <strong>Days:</strong> {days}
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    <strong>Destinations:</strong> {destinations?.length || 0}
                  </span>
                </div>
                <h5 className="text-lg font-semibold mb-2">Description</h5>
                <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: desc }}></p>
              </div>
            </div>
            <div className='mt-4'>
              <TimelineComponent dest_ids={destinations} dest_obj={destinationList} />
            </div>
            <div>
            <PDFDownloadLink
                document={<TourPDFDocument tour={tour} destinationList={destinationList} bookingData={''} />}

                fileName={`${tour.title}.pdf`}
              >
                {({ loading }) =>
                  loading ? (
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                      Loading PDF...
                    </button>
                  ) : (
                    <button className="bg-blue-500 text-white ml-4 px-4 py-2 rounded-md inline-flex items-center space-x-2">
                    <span>Tour Details</span>
                    <MdOutlineFileDownload className="w-5 h-5" />
                    </button>

                  )
                }
              </PDFDownloadLink>
            </div>
          </div>
          <div className="w-full lg:w-4/12 mt-6 lg:mt-0">
            <div className="ml-3 p-4 border border-gray-300 rounded-lg bg-white shadow-md">
              <FtourBooking tour={tour} onBookingUpdate={setBookingData} />
              <div className='ml-8 py-2'>
                <p className="text-gray-400 italic">
                  *Don't worry about the details you've entered; you can modify any
                  feature later by discussing it with our service agent. Once you
                  submit the form, we'll receive your inquiry. You can create multiple
                  inquiries. We'll contact you through the provided contact details
                  for further confirmation.
                  You will receive an email with inquiry details.
                </p>
              </div>
              <div className="ml-8 mt-4">
                <EmailTourButton
                  tour={tour}
                  destinationList={destinationList}
                  bookingData={bookingData}
                  userEmail={bookingData?.email} // Assuming email is part of booking data
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourDetails;