import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import emergency from "../assets/emergency.png";
import bed from "../assets/hospital-bed.png";
import "./Emergency.css";
import useEmergencyhook from "../hook/useEmergencyhook";
import useLoginhook from "../hook/useLoginhook";
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

  const emergencyStatus = Array.isArray(Emergency) ? Emergency.length : 0;
  const beds = 20 - emergencyStatus;

  const [isEditing, setIsEditing] = useState(false);
  const [currentCaseId, setCurrentCaseId] = useState(null);
  const [newEmergencyCase, setNewEmergencyCase] = useState({
    name: "",
    age: "",
    gender: "",
    status: "",
    department: "Emergency",
  });

  const departmentList = [
    "Pediatric Intensive Care",
    "Pediatric Hematology and Oncology",
    "Emergency",
    "Pediatrics",
    "Cardiology",
    "Neurology",
    "Orthopedics"
  ];

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
    try {
      const response = await fetch(
        isEditing
          ? `${import.meta.env.VITE_URL}/emergency/${currentCaseId}`
          : `${import.meta.env.VITE_URL}/emergency`,
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            authorization: `Bearer ${User?.token}`,
          },
          body: JSON.stringify(newEmergencyCase),
        }
      );

      const savedData = await response.json();

      if (!response.ok) {
        throw new Error(savedData.message || "Operation failed");
      }

      if (isEditing) {
        dispatch({
          type: "UPDATE_EMERGENCY",
          payload: {
            _id: currentCaseId,
            data: savedData,
          },
        });
        setIsEditing(false);
        setCurrentCaseId(null);
      } else {
        dispatch({ type: "CREATE_EMERGENCY", payload: savedData });
      }
      
      // Correct reset to include all required schema fields
      setNewEmergencyCase({ 
        name: "", 
        age: "", 
        gender: "", 
        status: "", 
        department: "Emergency" 
      });
      
    } catch (err) {
      alert("Error: " + err.message);
      console.error(err);
    }
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
    setNewEmergencyCase({ 
      name: "", 
      age: "", 
      gender: "", 
      status: "", 
      department: "Emergency" 
    });
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
    <div className="emergency_dashboard">
      {/* Section 1: Life-Glow Dashboard (Hero) */}
      <section className="dashboard_pulse_hero">
        <div className="pulse_hero_overlay"></div>
        <div className="dashboard_container">
          <div className="pulse_status_grid">
            {/* Status 1: Emergency Pulse */}
            <div className="pulse_board emergency_pulsing">
              <div className="board_label">Executive Emergency Status</div>
              <div className="board_value">
                <CountUp start={0} end={emergencyStatus} duration={2.5} />
              </div>
              <div className="board_desc">Patients in Critical Triage</div>
            </div>

            {/* Status 2: Bed Intelligence */}
            <div className="pulse_board medical_intelligence">
              <div className="board_label">Available Clinical Capacity</div>
              <div className="board_value">
                <CountUp start={0} end={beds} duration={2.5} />
              </div>
              <div className="board_desc">Beds Ready for Admission</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Patient Registry */}
      <section className="case_registry_section section_padding">
        <div className="section_container">
          <div className="registry_header centered">
            <h2 className="section_title">Live Patient Registry</h2>
            <p className="section_subtitle">Verified triage status for ongoing emergency cases</p>
          </div>

          <div className="cases_grid">
            {Array.isArray(Emergency) && Emergency.length > 0 ? (
              Emergency.map((cases) => (
                <div key={cases._id} className="case_glass_card">
                  <div className="card_header">
                    <span className="case_id">CaseID: #{cases._id.slice(-4)}</span>
                    <span className="case_badge">Critical Response</span>
                  </div>
                  <div className="card_body">
                    <h3 className="patient_name">{cases.name}</h3>
                    <div className="patient_meta">
                      <span>Age: <strong>{cases.age}</strong></span>
                      <span>Gender: <strong>{cases.gender}</strong></span>
                    </div>
                    <div className="case_status_strip">
                      <span className="status_label">Assigned Department</span>
                      <p className="status_text">{cases.department || "General Emergency"}</p>
                    </div>
                    <div className="case_status_strip">
                      <span className="status_label">Triage Diagnosis</span>
                      <p className="status_text">{cases.status}</p>
                    </div>
                  </div>
                  {(userRole === 0 || userRole === 1) && (
                    <div className="card_admin_actions">
                      <button className="case_btn edit" onClick={() => handleEdit(cases._id)}>Modify</button>
                      <button className="case_btn delete" onClick={() => handleDelete(cases._id)}>Discharge</button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="empty_registry">Zero Active Emergencies</div>
            )}
          </div>
        </div>
      </section>

      {/* Section 3: Staff Command Center (Admin) */}
      {(userRole === 0 || userRole === 1) && (
        <section className="command_center_section section_padding alt_bg">
          <div className="section_container">
            <div className="command_glass_panel">
              <div className="panel_header">
                <h2 className="panel_title">{isEditing ? "Modify Patient Data" : "New Patient Admission"}</h2>
                <p className="panel_subtitle">Security clearance required for triage modifications</p>
              </div>

              <form className="command_form" onSubmit={handleSubmit}>
                <div className="form_row">
                  <div className="form_group">
                    <label>Patient Full Name</label>
                    <input type="text" name="name" value={newEmergencyCase.name} onChange={handleChange} placeholder="John Doe" required />
                  </div>
                  <div className="form_group_short">
                    <label>Age</label>
                    <input type="number" name="age" value={newEmergencyCase.age} onChange={handleChange} placeholder="42" required />
                  </div>
                  <div className="form_group_short">
                    <label>Gender</label>
                    <select name="gender" value={newEmergencyCase.gender} onChange={handleChange} className="command_select" required>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
                <div className="form_row">
                  <div className="form_group">
                    <label>Assigned Department</label>
                    <select name="department" value={newEmergencyCase.department} onChange={handleChange} className="command_select" required>
                      {departmentList.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form_group">
                    <label>Current Status / Diagnosis</label>
                    <input type="text" name="status" value={newEmergencyCase.status} onChange={handleChange} placeholder="Critical Cardiac Triage" required />
                  </div>
                </div>

                <div className="form_footer">
                  <button type="submit" className="pulse_primary_btn">
                    {isEditing ? "Confirm Modification" : "Authorize Admission"}
                  </button>
                  {isEditing && (
                    <button type="button" className="pulse_cancel_btn" onClick={handleCancelEdit}>
                      Abort Editing
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Emergency;
