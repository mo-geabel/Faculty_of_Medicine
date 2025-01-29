import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Cal.css";
import { useNavigate } from "react-router-dom";
import useAssistanthook from "../../hook/useAssistanthook";
import useLoginhook from "../../hook/useLoginhook";
const Cal = ({ assistants, userRole, setAssistants }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedShifts, setSelectedShifts] = useState([]);
  const { Assistants, dispatch } = useAssistanthook();
  const { User } = useLoginhook();
  const [newShift, setNewShift] = useState({
    assistantId: null,
    department: "",
    shiftStartTime: new Date(),
    shiftEndTime: new Date(),
  });

  const fetchdata = async () => {
    const response = await fetch(`${import.meta.env.VITE_URL}/assistant`);
    const data = await response.json();
    dispatch({ type: "GET_Assistants", payload: data });
  };
  useEffect(() => {
    fetchdata();
  }, [dispatch]);

  const departments = [
    "Emergency",
    "Pediatrics",
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatric Intensive Care",
    "Pediatric Hematology and Oncology",
  ];

  useEffect(() => {
    setSelectedShifts(filterShiftsByDate(selectedDate));
  }, [Assistants, selectedDate]);

  const filterShiftsByDate = (date) => {
    return Assistants.flatMap((assistant) => assistant.shifts).filter(
      (shift) =>
        new Date(shift.shiftStartTime).toDateString() === date.toDateString()
    );
  };

  const addShift = async (shift) => {
    const { shiftStartTime, shiftEndTime, assistantId, department } = shift;
    const startTime = new Date(shiftStartTime);
    const endTime = new Date(shiftEndTime);

    const body = {
      assistantId,
      department,
      shiftStartTime: startTime,
      shiftEndTime: endTime,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}/assistant/addshift`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${User.token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        console.error("Error: Could not add shift. Server returned an error.");
        return;
      }

      const data = await response.json();

      dispatch({
        type: "ADD_SHIFT",
        payload: {
          _id: data.assistant.assistantId,
          data: {
            department,
            shiftStartTime: startTime,
            shiftEndTime: endTime,
          },
        },
      });

      alert("Shift added successfully.");
      setNewShift({
        assistantId: "",
        department: "",
        shiftStartTime: new Date(),
        shiftEndTime: new Date(),
      });
      fetchdata();
    } catch (error) {
      console.error("Error adding shift:", error);
    }
  };

  const handleAddShift = () => {
    if (
      !newShift.assistantId ||
      !newShift.shiftStartTime ||
      !newShift.department
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const startTime = new Date(newShift.shiftStartTime);
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 24);

    const updatedShift = { ...newShift, shiftEndTime: endTime };

    const overlappingShift = Assistants.some((assistant) =>
      assistant.shifts.some((shift) => {
        const shiftStartDate = new Date(shift.shiftStartTime).setHours(
          0,
          0,
          0,
          0
        );
        const shiftEndDate = new Date(shift.shiftEndTime).setHours(0, 0, 0, 0);
        const newShiftStartDate = new Date(
          updatedShift.shiftStartTime
        ).setHours(0, 0, 0, 0);
        const newShiftEndDate = new Date(updatedShift.shiftEndTime).setHours(
          0,
          0,
          0,
          0
        );

        return (
          shift.department === updatedShift.department &&
          (newShiftStartDate === shiftStartDate ||
            newShiftEndDate === shiftEndDate ||
            (newShiftStartDate <= shiftStartDate &&
              newShiftEndDate >= shiftEndDate))
        );
      })
    );

    if (overlappingShift) {
      alert(
        "Another shift already exists in this department at the selected date."
      );
      return;
    }

    addShift(updatedShift);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setSelectedShifts(filterShiftsByDate(newDate));
  };

  const handleNewShiftChange = (e) => {
    const { name, value } = e.target;
    setNewShift((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleDeleteShift = async (shift) => {
    const { _id, assistantId } = shift;
    console.log(assistantId);

    try {
      // Make the DELETE request with the assistantId in the body
      const response = await fetch(
        `${import.meta.env.VITE_URL}/assistant/deleteshift/${_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${User.token}`,
          },
          body: JSON.stringify({ assistantId }), // Wrap assistantId in an object
        }
      );

      // Check if the response is OK
      if (!response.ok) {
        const errorData = await response.json(); // Parse error message
        console.error("Error deleting shift:", errorData.message);
        return alert("Failed to delete shift. Please try again.");
      }

      const data = await response.json();
      console.log("Shift deleted successfully:", data);

      // Dispatch action to remove the shift
      dispatch({
        type: "DELETE_SHIFT",
        payload: _id,
      });

      alert("Shift deleted successfully.");
      fetchdata();
    } catch (error) {
      console.error("Error deleting shift:", error);
      alert("An unexpected error occurred while deleting the shift.");
    }
  };

  const renderShiftDetails = (shifts) => {
    if (shifts.length > 0) {
      return (
        <div className="shifts">
          {shifts.map((shift, index) => {
            const assistant = Assistants.find(
              (a) => a._id === shift.assistantId
            );
            return (
              <div key={index}>
                <p>Name: {assistant ? assistant.name : "Unknown"}</p>
                <p>Department: {shift.department}</p>
                <p>
                  Shift Start: {new Date(shift.shiftStartTime).toLocaleString()}
                </p>
                <p>
                  Shift End: {new Date(shift.shiftEndTime).toLocaleString()}
                </p>
                {userRole === 0 && (
                  <button
                    onClick={() => handleDeleteShift(shift)}
                    className="D-butt"
                  >
                    Delete Shift
                  </button>
                )}
                <hr />
              </div>
            );
          })}
        </div>
      );
    }
    return <p>No shifts for this date.</p>;
  };

  const tileContent = ({ date }) => {
    const filteredShifts = filterShiftsByDate(date);
    return filteredShifts.length > 0 ? (
      <div className="shift-indicator" style={{ fontWeight: "bold" }}>
        📏 Shifts
      </div>
    ) : null;
  };

  const navigate = useNavigate();

  if (userRole !== 0 && userRole !== 1) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <>
      <div className="calendar_container">
        <div className="calendar_section">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            className="calendar"
            tileContent={tileContent}
          />
          <div className="shifts">
            <h3>Shifts for {selectedDate.toLocaleDateString()}</h3>
            {renderShiftDetails(selectedShifts)}
          </div>
        </div>
      </div>
      {userRole === 0 && (
        <div className="add-shift-form">
          <h3>Add a Shift</h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <label>
              Assistant:
              <select
                value={newShift.assistantId}
                onChange={(e) =>
                  setNewShift({ ...newShift, assistantId: e.target.value })
                }
              >
                <option value="">Select Assistant</option>
                {Assistants.map((assistant) => (
                  <option key={assistant._id} value={assistant._id}>
                    {assistant.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Department:
              <select
                name="department"
                value={newShift.department}
                onChange={handleNewShiftChange}
              >
                <option value="">Select Department</option>
                {departments.map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Shift Start Time:
              <DatePicker
                selected={newShift.shiftStartTime}
                onChange={(date) =>
                  setNewShift({ ...newShift, shiftStartTime: date })
                }
                showTimeSelect
                dateFormat="Pp"
              />
            </label>

            <button type="button" onClick={handleAddShift}>
              Add Shift
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Cal;
