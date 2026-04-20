import React, { useState, useEffect } from "react";
import "./AssistantForm.css";

const AssistantForm = ({
  addAssistant,
  assistant,
  updateAssistant,
  handleCancelEdit,
}) => {
  const [newAssistant, setNewAssistant] = useState({
    img: "./assets/a_logo.png",
    name: "",
    phone: "",
    address: "",
    email: "",
    password: "",
  });

  // Populate the form fields if editing an assistant
  useEffect(() => {
    if (assistant) {
      setNewAssistant({ ...assistant, password: "" }); // Reset password field
    } else {
      setNewAssistant({
        img: "./assets/a_logo.png",
        name: "",
        phone: "",
        address: "",
        email: "",
        password: "",
      });
    }
  }, [assistant]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAssistant((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (assistant) {
      // Update existing assistant
      updateAssistant(newAssistant);
    } else {
      // Add a new assistant
      addAssistant(newAssistant);
    }

    // Clear the form fields after submission
    setNewAssistant({
      img: "./assets/a_logo.png",
      name: "",
      phone: "",
      address: "",
      email: "",
      password: "",
    });

    if (handleCancelEdit) {
      handleCancelEdit();
    }
  };

  return (
    <div className="scholar_form_workspace">
      <form onSubmit={handleSubmit} className="scholar_dynamic_form">
        <div className="scholar_form_group">
          <label>Scholar Full Name</label>
          <input
            className="scholar_input"
            name="name"
            placeholder="e.g. Dr. Sarah Connor"
            value={newAssistant.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="scholar_form_group">
          <label>Academic Email</label>
          <input
            className="scholar_input"
            type="email"
            name="email"
            placeholder="s.connor@faculty.edu"
            value={newAssistant.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="scholar_form_row">
          <div className="scholar_form_group">
            <label>Contact Phone</label>
            <input
              className="scholar_input"
              type="number"
              name="phone"
              placeholder="+20..."
              value={newAssistant.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="scholar_form_group">
            <label>Access Key</label>
            <input
              className="scholar_input"
              name="password"
              placeholder="••••••••"
              value={newAssistant.password}
              onChange={handleChange}
              type="password"
              required={!assistant}
            />
          </div>
        </div>

        <div className="scholar_form_group">
          <label>Residential Address / Office</label>
          <input
            className="scholar_input"
            name="address"
            placeholder="Building 4, Room 202"
            value={newAssistant.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="scholar_form_actions">
          <button type="submit" className="scholar_submit_btn">
            {assistant ? "Apply Modifications" : "Authorize Scholar"}
          </button>
          
          {assistant && (
            <button
              type="button"
              className="scholar_cancel_btn"
              onClick={handleCancelEdit}
            >
              Abort Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AssistantForm;
