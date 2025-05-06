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

    // Create a consistent data object that combines all possible field names
    const formattedData = {
      // Required fields with fallbacks to prevent schema validation errors
      userId: bookingData.userId || "guest-user",
      // Handle both possible name field variants
      userName: bookingData.fullName || bookingData.name || "Guest User",
      fullName: bookingData.fullName || bookingData.name || "Guest User", // Add this for the email template
      name: bookingData.name || bookingData.fullName || "Guest User", // Add this for the email template
      
      // Date fields
      arrivalDate: arrivalDate,
      bookAt: bookingData.bookAt || new Date().toISOString(),
      departureDate: departureDate,
      
      // Contact info
      mobileNumber: bookingData.mobileNumber || bookingData.phone || "Not provided",
      phone: bookingData.phone || bookingData.mobileNumber || "Not provided", // Add for compatibility
      email: bookingData.email || "Not provided",
      
      // Guest info
      numberOfPeople: parseInt(bookingData.numberOfPeople || bookingData.totalPeople || bookingData.guestSize || "1", 10),
      totalPeople: parseInt(bookingData.totalPeople || bookingData.numberOfPeople || bookingData.guestSize || "1", 10),
      guestSize: parseInt(bookingData.guestSize || bookingData.numberOfPeople || bookingData.totalPeople || "1", 10),
      
      // Accommodation
      accommodationType: bookingData.accommodationType || "Not specified",
      vehicleType: bookingData.vehicleType || "Not specified",
      
      // Optional fields
      arrivalTime: bookingData.arrivalTime || "",
      numberOfAdults: parseInt(bookingData.numberOfAdults || bookingData.adults || "0", 10),
      adults: parseInt(bookingData.adults || bookingData.numberOfAdults || "0", 10),
      numberOfChildren: parseInt(bookingData.numberOfChildren || bookingData.children || "0", 10),
      children: parseInt(bookingData.children || bookingData.numberOfChildren || "0", 10),
      dateComments: bookingData.dateComments || bookingData.comments || bookingData.preferences || "",
      comments: bookingData.comments || bookingData.dateComments || bookingData.preferences || "",
      preferences: bookingData.preferences || bookingData.comments || bookingData.dateComments || "",
      
      // Use actual destination names instead of IDs
      selectedDestinations: destinationNames.length > 0 ? destinationNames : 
        destinationIds.map(id => {
          const dest = destinationList.find(d => d._id === (typeof id === 'object' ? id._id : id));
          return dest ? dest.destinationName : 'Unknown Destination';
        }),
      additionalLocations: bookingData.additionalLocations || "",
      mealPlan: bookingData.mealPlan || "Not specified",
      accommodationPreference: bookingData.accommodationPreference || "",
      numberOfVehicles: parseInt(bookingData.numberOfVehicles || bookingData.vehicles || "1", 10),
      vehicles: parseInt(bookingData.vehicles || bookingData.numberOfVehicles || "1", 10),
      transportPreference: bookingData.transportPreference || "",
      comType: bookingData.comType || "email",
      whatsappNumber: bookingData.whatsappNumber || bookingData.mobileNumber || bookingData.phone || "",
      status: "pending",
      bedrooms: parseInt(bookingData.bedrooms || "1", 10)
    };

    return formattedData;
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

  // Check if any required field is empty
  const hasEmptyRequiredFields = (data) => {
    // Check if any required field is missing
    if (
      (!data.fullName && !data.name) ||
      !data.email ||
      !/\S+@\S+\.\S+/.test(data.email) ||
      (!data.phone && !data.mobileNumber) ||
      !data.bookAt ||
      (!data.guestSize && !data.numberOfPeople && !data.totalPeople) ||
      !data.vehicleType ||
      (!data.vehicles && !data.numberOfVehicles) ||
      !data.accommodationType ||
      !data.bedrooms
    ) {
      return true;
    }
    
    return false;
  };

  const handleSendEmail = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    
    // Validate and log booking data to help with debugging
    console.log('Original booking data:', bookingData);
    
    // Check if any required field is empty
    if (hasEmptyRequiredFields(bookingData || {})) {
      setErrorMessage('Please fill all required fields');
      return;
    }

    try {
      setSending(true);

      // 1. Map booking data to schema structure
      const mappedBookingData = mapBookingDataToSchema(bookingData, tour);
      
      if (!mappedBookingData) {
        throw new Error('Invalid booking data');
      }
      
      // Log the mapped data for debugging
      console.log('Mapped booking data:', mappedBookingData);

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

      // 3. Generate PDF with the complete data
      const pdfDoc = (
        <TourPDFDocument 
          tour={tour} 
          destinationList={destinationList} 
          bookingData={mappedBookingData} 
        />
      );

      const base64data = await generatePdfBase64(pdfDoc);

      // 4. Send email with the complete data
      const response = await fetch(`${BASE_URL}/tours/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: mappedBookingData.email,
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
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-500">{errorMessage}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-500">{successMessage}</p>
        </div>
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