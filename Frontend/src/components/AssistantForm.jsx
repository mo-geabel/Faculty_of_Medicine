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
    <div className="add-form">
      <form onSubmit={handleSubmit}>
        <input
          className="custom-input"
          name="name"
          placeholder="Enter name"
          value={newAssistant.name}
          onChange={handleChange}
          required
        />
        <input
          className="custom-input"
          name="password"
          placeholder="Enter password"
          value={newAssistant.password}
          onChange={handleChange}
          type="password"
          required
        />
        <input
          className="custom-input"
          type="number"
          name="phone"
          placeholder="Enter phone"
          value={newAssistant.phone}
          onChange={handleChange}
          required
        />
        <input
          className="custom-input"
          name="address"
          placeholder="Enter address"
          value={newAssistant.address}
          onChange={handleChange}
          required
        />
        <input
          className="custom-input"
          type="email"
          name="email"
          placeholder="Enter email"
          value={newAssistant.email}
          onChange={handleChange}
          required
        />

        <button type="submit" className="submit-btn">
          {assistant ? "Update Assistant" : "Add Assistant"}
        </button>
        {assistant && (
          <button
            type="button"
            className="cancel-btn"
            onClick={handleCancelEdit}
          >
            Cancel Edit
          </button>
        )}
      </form>
    </div>
  );
};

export default AssistantForm;
