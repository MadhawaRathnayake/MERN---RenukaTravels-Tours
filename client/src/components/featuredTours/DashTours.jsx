import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashTours() {
  const { currentUser } = useSelector((state) => state.user);
  const [userTours, setUserTours] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [tourIdToDelete, setTourIdToDelete] = useState('');

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch(`/api/tours/gettours`);
        const data = await res.json();
        if (res.ok) {
          setUserTours(data.tours);
          if (data.tours.length < 9) {
            setShowMore(false);
          }
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser && currentUser.isAdmin) {
      fetchTours();
    }
  }, [currentUser]);

  const handleShowMore = async () => {
    const startIndex = userTours.length;
    try {
      const res = await fetch(`/api/tours/gettours?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUserTours((prev) => [...prev, ...data.tours]);
        if (data.tours.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleDeleteTour = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/to urs/deletetour/${tourIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserTours((prev) =>
          prev.filter((tour) => tour._id !== tourIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="lg:mr-32 lg:ml-10 w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 
      scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">

      {/* Title and Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 ">
          ALL <span className="text-[#F4AC20]">TOURS</span>
        </h2>
        <Link to="/dashboard?tab=createtour">
          <Button style={{ backgroundColor: "#F4AC20", borderColor: "#F4AC20" }}>
            Add a tour
          </Button>
        </Link>
      </div>

      {currentUser.isAdmin && userTours.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Tour Photo</Table.HeadCell>
              <Table.HeadCell>Tour Title</Table.HeadCell>
              <Table.HeadCell>Days</Table.HeadCell>
              <Table.HeadCell>Destinations</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            {userTours.map((tour) => (
              <Table.Body key={tour._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{new Date(tour.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/tour/${tour._id}`}>
                      <img 
                        src={tour.photo}
                        alt={tour.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className="font-medium text-gray-900 dark:text-white" to={`/tour/${tour._id}`}>
                      {tour.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    {tour.days} days
                  </Table.Cell>
                  <Table.Cell>
                    {tour.destinations.map((dest, index) => (
                      <span key={dest._id} className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1">
                        {dest.name}
                      </span>
                    ))}
                  </Table.Cell>
                  <Table.Cell>
                    <span onClick={() => {
                      setShowModal(true);
                      setTourIdToDelete(tour._id);
                    }} className="font-medium text-red-500 hover:underline cursor-pointer">
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                      <Link
                        className="text-teal-500 hover:underline"
                        to={`/update-tour/${tour._id}`}
                      >
                        <span>Edit</span>
                      </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no tours yet</p>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this tour?
            </h3>
            <div className='flex justify-center gap-5'>
              <Button color='failure' onClick={handleDeleteTour}>
                Yes, I'm Sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}