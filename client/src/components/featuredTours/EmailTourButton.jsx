/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';
import TourPDFDocument from './TourPdfDoc';
import { BASE_URL } from '../../utils/config';

const EmailTourButton = ({ tour, destinationList, bookingData }) => {
  const [isSending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [destinationNames, setDestinationNames] = useState([]);

  // Set up the global reference to receive destination names from TimelineComponent
  useEffect(() => {
    window.setSelectedDestinationNames = (names) => {
      setDestinationNames(names);
    };

    // Cleanup function
    return () => {
      delete window.setSelectedDestinationNames;
    };
  }, []);

  // Map booking data to match the schema structure
  const mapBookingDataToSchema = (bookingData, tour) => {
    if (!bookingData) return null;
    
    // Get destination IDs from the tour
    const destinationIds = tour?.destinations || [];
    
    const arrivalDate = new Date(bookingData.bookAt);
    const numberOfDays = parseInt(tour.days || 0, 10);
    const departureDate = new Date(arrivalDate);
    departureDate.setDate(arrivalDate.getDate() + numberOfDays);

    return {
      // Required fields with fallbacks to prevent schema validation errors
      userId: bookingData.userId || "guest-user",
      userName: bookingData.fullName || bookingData.name || "Guest User",
      arrivalDate: bookingData.bookAt || new Date(),
      departureDate: departureDate || new Date(),
      numberOfPeople: parseInt(bookingData.numberOfPeople || bookingData.totalPeople || "1", 10),
      accommodationType: bookingData.accommodationType || "Not specified",
      vehicleType: bookingData.vehicleType || "Not specified",
      mobileNumber: bookingData.mobileNumber || bookingData.phone || "Not provided",
      email: bookingData.email || "Not provided",
      
      // Optional fields
      arrivalTime: bookingData.arrivalTime || "",
      numberOfAdults: parseInt(bookingData.numberOfAdults || bookingData.adults || "0", 10),
      numberOfChildren: parseInt(bookingData.numberOfChildren || bookingData.children || "0", 10),
      dateComments: bookingData.dateComments || bookingData.comments || "",
      // Use actual destination names instead of IDs
      selectedDestinations: destinationNames.length > 0 ? destinationNames : 
        destinationIds.map(id => {
          const dest = destinationList.find(d => d._id === (typeof id === 'object' ? id._id : id));
          return dest ? dest.destinationName : 'Unknown Destination';
        }),
      additionalLocations: bookingData.additionalLocations || "",
      mealPlan: bookingData.mealPlan || "Not specified",
      accommodationPreference: bookingData.accommodationPreference || "",
      numberOfVehicles: parseInt(bookingData.numberOfVehicles || "1", 10),
      transportPreference: bookingData.transportPreference || "",
      comType: bookingData.comType || "email",
      whatsappNumber: bookingData.whatsappNumber || bookingData.mobileNumber || "",
      status: "pending"
    };
  };

  const generatePdfBase64 = async (pdfDoc) => {
    try {
      const pdfBlob = await pdf(pdfDoc).toBlob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result.split(',')[1];
          resolve(base64data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(pdfBlob);
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('Failed to generate PDF');
    }
  };

  const handleSendEmail = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    
    const userEmail = bookingData?.email || '';
    
    if (!userEmail) {
      setErrorMessage('Email address is required');
      return;
    }

    try {
      setSending(true);

      // 1. Map booking data to schema structure
      const mappedBookingData = mapBookingDataToSchema(bookingData, tour);
      
      if (!mappedBookingData) {
        throw new Error('Invalid booking data');
      }

      // 2. Create booking in the backend
      const bookingRes = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mappedBookingData),
      });

      const bookingResData = await bookingRes.json();

      if (!bookingRes.ok) {
        throw new Error(bookingResData.message || 'Booking failed');
      }

      // 3. Generate PDF
      const pdfDoc = (
        <TourPDFDocument 
          tour={tour} 
          destinationList={destinationList} 
          bookingData={mappedBookingData} 
        />
      );

      const base64data = await generatePdfBase64(pdfDoc);

      // 4. Send email
      const response = await fetch(`${BASE_URL}/tours/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          tour,
          destinationList,
          bookingData: mappedBookingData,
          pdfBuffer: base64data,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Server error occurred during email sending');
      }

      setSuccessMessage('Booking created and tour details sent to your email successfully!');
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      {errorMessage && (
        <p className="text-red-500 mb-2">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-green-500 mb-2">{successMessage}</p>
      )}
      <button
        onClick={handleSendEmail}
        className="bg-amber-400 hover:bg-amber-500 text-white px-4 py-2 rounded-md mr-2"
        disabled={isSending}
      >
        {isSending ? 'Sending...' : 'Submit'}
      </button>
    </div>
  );
};

export default EmailTourButton;