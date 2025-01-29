import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import bed from "../../public/assets/hospital-bed.png";
import eme from "../../public/assets/emergency.png";
import "./Emergency.css";
import useEmergencyhook from "../../hook/useEmergencyhook";
import useLoginhook from "../../hook/useLoginhook";
const Emergency = ({ userRole }) => {
  const { Emergency, dispatch } = useEmergencyhook();
  const { User } = useLoginhook();
  const fetchdata = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_URL}/emergency`);
      const data = await response.json();
      console.log(data);
      dispatch({ type: "GET_EMERGENCY", payload: data });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchdata();
  }, [dispatch]);

  const emergencyStatus = Emergency.length;
  const beds = 20 - emergencyStatus;

  const [isEditing, setIsEditing] = useState(false);
  const [currentCaseId, setCurrentCaseId] = useState(null);
  const [newEmergencyCase, setNewEmergencyCase] = useState({
    name: "",
    age: "",
    gender: "",
    status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmergencyCase((prevCase) => ({
      ...prevCase,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (beds <= 0 && !isEditing) {
      alert("No available beds. Cannot add new emergency cases.");
      return;
    }
    if (isEditing) {
      await fetch(`${import.meta.env.VITE_URL}/emergency/${currentCaseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          authorization: `Bearer ${User.token}`,
        },
        body: JSON.stringify(newEmergencyCase),
      });
      dispatch({
        type: "UPDATE_EMERGENCY",
        payload: {
          _id: currentCaseId,
          data: newEmergencyCase,
        },
      });
      console.log(Emergency);
      setIsEditing(false);
      setCurrentCaseId(null);
      // fetchdata();
    } else {
      await fetch(`${import.meta.env.VITE_URL}/emergency`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(newEmergencyCase),
      });
      // const newCase = { id: emergencycases.length + 1, ...newEmergencyCase };
      dispatch({ type: "CREATE_EMERGENCY", payload: newEmergencyCase });
    }
    setNewEmergencyCase({ name: "", age: "", gender: "", status: "" });
  };

  const handleEdit = (id) => {
    const editCase = Emergency.find((cases) => cases._id === id);
    setNewEmergencyCase({
      name: editCase.name,
      age: editCase.age,
      gender: editCase.gender,
      status: editCase.status,
    });
    setIsEditing(true);
    setCurrentCaseId(id);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentCaseId(null);
    setNewEmergencyCase({ name: "", age: "", gender: "", status: "" });
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this case?"
    );
    if (isConfirmed) {
      await fetch(`${import.meta.env.VITE_URL}/emergency/${id}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${User.token}` },
      });

      dispatch({ type: "DELETE_EMERGENCY", payload: id });
    }
  };

  return (
    <div className="eme-container">
      <div className="hero">
        <div className="ite1">
          <img src={bed} alt="Hospital bed" />
          <p id="status">
            <CountUp start={0} end={beds} duration={2.5} />
          </p>
          <p>Available beds</p>
        </div>
        <div className="ite1">
          <img id="img" src={eme} alt="Emergency" />
          <p id="status">
            <CountUp start={0} end={emergencyStatus} duration={2.5} />
          </p>
          <p>Emergency Status</p>
        </div>
      </div>
      <div className="midpage">
        <div className="cases">
          {Emergency
            ? Emergency.map((cases) => (
                <div key={cases._id} className="case">
                  <h5>Name: {cases.name}</h5>
                  <p>Age: {cases.age}</p>
                  <p>Gender: {cases.gender}</p>
                  <h6>Case: {cases.status}</h6>
                  {(userRole === 0 || userRole === 1) && (
                    <button
                      className="card-btn"
                      onClick={() => handleDelete(cases._id)}
                    >
                      Delete
                    </button>
                  )}
                  {(userRole === 0 || userRole === 1) && (
                    <button
                      className="card-btn edit-btn"
                      onClick={() => handleEdit(cases._id)}
                    >
                      Edit
                    </button>
                  )}
                </div>
              ))
            : "No Emergencies"}
        </div>
        <div className="add-form">
          <div className="title">
            <h5>{isEditing ? "Edit Patient" : "Add Patient"}</h5>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={newEmergencyCase.name}
              onChange={handleChange}
              placeholder="Name"
              required
            />
            <input
              type="number"
              name="age"
              value={newEmergencyCase.age}
              onChange={handleChange}
              placeholder="Age"
              required
            />
            <input
              type="text"
              name="gender"
              value={newEmergencyCase.gender}
              onChange={handleChange}
              placeholder="Gender"
              style={{ width: "auto" }}
              required
            />
            <input
              type="text"
              name="status"
              value={newEmergencyCase.status}
              onChange={handleChange}
              placeholder="Status"
              required
            />
            <button type="submit">
              {isEditing ? "Update Patient" : "Add Patient"}
            </button>
            {isEditing && (
              <button
                type="button"
                className="cancel-btn m-3"
                onClick={handleCancelEdit}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Emergency;
