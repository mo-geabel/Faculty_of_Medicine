import React, { useState, useEffect } from "react";
import Hero from "./Hero";
import "./Assistant.css";
import assistant_photo from "../../public/assets/assistant_hero.jpg";
import Pop from "./Pop";
import a_logo from "../../public/assets/a_logo.png";
import AssistantForm from "./AssistantForm";
import { Link } from "react-router-dom";
import useAssistanthook from "../../hook/useAssistanthook";
import useLoginhook from "../../hook/useLoginhook";

const Assistant = ({ userRole, setAssistants }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [morningShifts, setMorningShifts] = useState([]);
  const [nightShifts, setNightShifts] = useState([]);
  const [currentAssistant, setCurrentAssistant] = useState(null);
  const { Assistants, dispatch } = useAssistanthook();
  const { User } = useLoginhook();

  // Load assistants from localStorage on component mount
  // useEffect(() => {
  //   const savedAssistants = JSON.parse(localStorage.getItem("assistants"));
  //   if (savedAssistants) {
  //     setAssistants(savedAssistants);
  //   }
  // }, [setAssistants]);

  // // Save assistants to localStorage whenever they change
  // useEffect(() => {
  //   if (assistants.length > 0) {
  //     localStorage.setItem("assistants", JSON.stringify(assistants));
  //   }
  // }, [assistants]);

  const fetchdata = async () => {
    const response = await fetch(`${import.meta.env.VITE_URL}/assistant`);
    const data = await response.json();
    console.log(data);
    dispatch({ type: "GET_Assistants", payload: data });
  };
  useEffect(() => {
    fetchdata();
  }, [dispatch]);

  const openModal = (assistant) => {
    setSelectedAssistant(assistant);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAssistant(null);
  };

  const Delete = async (id) => {
    const response = await fetch(
      `${import.meta.env.VITE_URL}/assistant/${id}`,
      {
        method: "DELETE",
        headers: { authorization: `Bearer ${User.token}` },
      }
    );
    if (!response) {
      return console.log("there is an err in deleting");
    }

    dispatch({ type: "DELETE_Assistants", payload: id });
    fetchdata();
  };

  const handleDelete = (assistantId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this assistant?"
    );
    if (isConfirmed) {
      // Call the delete function and remove the assistant by ID
      Delete(assistantId);
    }
  };
  const handleEdit = (id) => {
    const assistant = Assistants.find((assistant) => assistant._id === id);
    setCurrentAssistant(assistant); // Set the current assistant to edit
  };
  const addAssistant = async (newAssistant) => {
    const response = await fetch(`${import.meta.env.VITE_URL}/assistant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        authorization: `Bearer ${User.token}`,
      },
      body: JSON.stringify(newAssistant),
    });
    const data = await response.json();
    console.log(data);

    dispatch({ type: "CREATE_Assistants", payload: newAssistant });
    // setAssistants((prevAssistants) => [
    //   ...prevAssistants,
    //   {
    //     id: prevAssistants.length + 1,
    //     img: a_logo,
    //     shifts: [], // Initialize shifts as an empty array
    //     ...newAssistant,
    //   },
    // ]);
  };

  const handleCancelEdit = () => {
    setCurrentAssistant(null); // Reset the form state and go back to "Add Assistant"
  };
  const filteredAssistants = Array.isArray(Assistants)
    ? Assistants.filter((assistant) =>
        assistant.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const filterShiftsByTime = (shiftType) => {
    const divideShift = (shift) => {
      const startTime = new Date(shift.shiftStartTime);
      const endTime = new Date(shift.shiftEndTime);

      const segments = [];

      // Morning Shift: 6 AM - 6 PM
      const morningStart = new Date(startTime);
      morningStart.setHours(6, 0, 0, 0);
      const morningEnd = new Date(startTime);
      morningEnd.setHours(18, 0, 0, 0);

      if (startTime < morningEnd && morningStart < endTime) {
        segments.push({
          id: `${shift.id}-morning`,
          name: shift.name,
          department: shift.department,
          shiftStartTime: Math.max(startTime, morningStart),
          shiftEndTime: Math.min(endTime, morningEnd),
          type: "morning",
        });
      }

      // Night Shift: 6 PM - 6 AM
      const nightStart = new Date(startTime);
      nightStart.setHours(18, 0, 0, 0);
      const nightEnd = new Date(nightStart);
      nightEnd.setDate(nightStart.getDate() + 1); // Next day 6 AM
      nightEnd.setHours(6, 0, 0, 0);

      if (startTime < nightEnd && nightStart < endTime) {
        segments.push({
          id: `${shift.id}-night`,
          name: shift.name,
          department: shift.department,
          shiftStartTime: Math.max(startTime, nightStart),
          shiftEndTime: Math.min(endTime, nightEnd),
          type: "night",
        });
      }

      return segments;
    };

    const isMorningShift = (segment) => segment.type === "morning";

    const allSegments = Array.isArray(Assistants)
      ? Assistants.flatMap(divideShift)
      : [];

    return shiftType === "morning"
      ? allSegments.filter(isMorningShift)
      : allSegments.filter((segment) => !isMorningShift(segment));
  };

  useEffect(() => {
    setMorningShifts(filterShiftsByTime("morning"));
    setNightShifts(filterShiftsByTime("night"));
  }, [Assistants]);

  const handleDateChange = (newDate, shiftType) => {
    setDate(newDate);
    const selectedShifts =
      shiftType === "morning" ? morningShifts : nightShifts;
    const shiftsForDate = selectedShifts.filter(
      (shift) =>
        new Date(shift.shiftStartTime).toDateString() === newDate.toDateString()
    );
    shiftType === "morning"
      ? setMorningShifts(shiftsForDate)
      : setNightShifts(shiftsForDate);
  };
  const updateAssistant = async (updatedAssistant) => {
    const response = await fetch(
      `${import.meta.env.VITE_URL}/assistant/${currentAssistant._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          authorization: `Bearer ${User.token}`,
        },
        body: JSON.stringify(updatedAssistant),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      return console.log(data.error);
    }
    dispatch({ type: "UPDATE_Assistants", payload: updatedAssistant });

    fetchdata();

    setCurrentAssistant(null); // Reset after editing
  };
  const scrollToSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Hero
        photo={assistant_photo}
        title="Meet Our Pediatric Assistants"
        txt_btn="Assistant Directory"
        onclick={scrollToSection}
      />
      <div className="general">
        <div className="assistant-container">
          <div className="assistant">
            <div className="assistant-title">
              <p>Here are our assistants</p>
            </div>
            <div className="assistant-list">
              {filteredAssistants
                ? filteredAssistants.map((assistant) => (
                    <div key={assistant._id} className="assistant-card">
                      <img src={a_logo} alt={assistant.name} />
                      <p>Name: {assistant.name}</p>
                      <div className="car-button">
                        <button onClick={() => openModal(assistant)}>
                          View Details
                        </button>
                        {userRole === 0 && (
                          <>
                            <button onClick={() => handleEdit(assistant._id)}>
                              Edit
                            </button>
                            <button onClick={() => handleDelete(assistant._id)}>
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                : "No Assistant is Created"}
            </div>
            <Pop
              isOpen={isModalOpen}
              onClose={closeModal}
              assistant={selectedAssistant}
            />
          </div>

          <div className="L-bar">
            <div className="search">
              <div className="search-title">
                <p>Search</p>
              </div>
              <input
                type="text"
                placeholder="Search assistants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {(userRole === 0 || userRole === 1) && (
              <div className="LC">
                <Link id="L-Calendar" to="/calendar">
                  Calendar
                </Link>
              </div>
            )}
            {userRole === 0 && (
              <div className="add-assistant">
                <p>Add Assistant</p>
                <AssistantForm
                  addAssistant={addAssistant}
                  assistant={currentAssistant}
                  updateAssistant={updateAssistant}
                  handleCancelEdit={handleCancelEdit} // Pass the cancel function
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Assistant;
