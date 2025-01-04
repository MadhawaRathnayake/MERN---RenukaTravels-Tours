/* eslint-disable react/no-unescaped-entities */
import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashDestinations() {
  const { currentUser } = useSelector((state) => state.user);
  const [destinationsList, setDestinationsList] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [destinationIdToDelete, setDestinationIdToDelete] = useState(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch(`/api/destination/get-dest`);
        const data = await res.json();
        if (res.ok) {
          setDestinationsList(data.destinations);
          if (data.destinations.length < 10) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchDestinations();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = destinationsList.length;
    try {
      const res = await fetch(
        `/api/destination/get-dest?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setDestinationsList((prev) => [...prev, ...data.destinations]);
        if (data.destinations.length < 10) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletedestination = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/destination/delete-dest/${destinationIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setDestinationsList((prev) =>
          prev.filter(
            (destination) => destination._id !== destinationIdToDelete
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <section className="w-full">
      <div className="w-full flex justify-between items-start mr-3.5 pl-16 my-2">
        <h2 className="text-4xl font-bold text-center text-gray-800">
          All <span className="text-yellow-400">Destinations</span>
        </h2>

        <a href="/create-destination">
          <button className="bg-[#F4AC20] text-white py-2 px-6 rounded-lg hover:bg-[#f49120]">
            Create a new Destination
          </button>
        </a>
      </div>

      <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300">
        {currentUser.isAdmin && destinationsList.length > 0 ? (
          <>
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Destination Image</Table.HeadCell>
                <Table.HeadCell>Destination Name</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
                <Table.HeadCell>Edit</Table.HeadCell>
              </Table.Head>
              {destinationsList.map((destination) => (
                <Table.Body className="divide-y" key={destination._id}>
                  <Table.Row className="bg-white">
                    <Table.Cell>
                      <Link to={`/destinations/${destination.slug}`}>
                        <img
                          src={destination.destImage}
                          alt={destination.destinationName}
                          className="w-20 h-10 object-cover bg-gray-500"
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        className="font-medium text-gray-900"
                        to={`/destinations/${destination.slug}`}
                      >
                        {destination.destinationName}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setDestinationIdToDelete(destination._id);
                        }}
                        className="font-medium text-red-500 hover:underline cursor-pointer"
                      >
                        Delete
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        className="text-teal-500 hover:underline"
                        to={`/update-destination/${destination._id}`}
                      >
                        <span>Edit</span>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
            {showMore && (
              <button
                onClick={handleShowMore}
                className="w-full text-teal-500 self-center text-sm py-7"
              >
                Show more
              </button>
            )}
          </>
        ) : (
          <p>You have no destinations yet!</p>
        )}
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          popup
          size="md"
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
              <h3 className="mb-5 text-lg text-gray-500">
                Are you sure you want to delete this destination?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDeletedestination}>
                  Yes, I'm sure
                </Button>
                <Button color="gray" onClick={() => setShowModal(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </section>
  );
}
