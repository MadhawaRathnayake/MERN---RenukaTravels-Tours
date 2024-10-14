import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashVehicles() {
  const { currentUser } = useSelector((state) => state.user);
  const [userVehicles, setUserVehicles] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [vehicleIdToDelete, setVehicleIdToDelete] = useState('');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch(`/api/vehicles/getvehicles`);
        const data = await res.json();
        if (res.ok) {
          setUserVehicles(data.vehicles);
          if (data.vehicles.length < 9) {
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
      fetchVehicles();
    }
  }, [currentUser]);

  const handleShowMore = async () => {
    const startIndex = userVehicles.length;
    try {
      const res = await fetch(`/api/vehicles/getvehicles?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUserVehicles((prev) => [...prev, ...data.vehicles]);
        if (data.vehicles.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleDeleteVehicle = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/vehicles/deletevehicle/${vehicleIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserVehicles((prev) =>
          prev.filter((vehicle) => vehicle._id !== vehicleIdToDelete)
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
          ALL <span className="text-[#F4AC20]">VEHICLES</span>
        </h2>
        <Link to="/dashboard?tab=createvehicle">
          <Button style={{ backgroundColor: "#F4AC20", borderColor: "#F4AC20" }}>
            Add a vehicle
          </Button>
        </Link>
      </div>

      {currentUser.isAdmin && userVehicles.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Vehicle Image</Table.HeadCell>
              <Table.HeadCell>Vehicle Title</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              
            </Table.Head>
            {userVehicles.map((vehicle) => (
              <Table.Body key={vehicle._id} className="devide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{new Date(vehicle.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/vehicles`}>
                      <img 
                        src={vehicle.image}
                        alt={vehicle.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className="font-medium text-gray-900 dark:text-white" to={`/vehicles`}>
                      {vehicle.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <span onClick={() => {
                      setShowModal(true);
                      setVehicleIdToDelete(vehicle._id);
                    }} className="font-medium text-red-500 hover:underline cursor-pointer">
                      Delete
                    </span>
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
        <p>You have no vehicles yet</p>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this vehicle?
            </h3>
            <div className='flex justify-center gap-5'>
              <Button color='failure' onClick={handleDeleteVehicle}>
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
