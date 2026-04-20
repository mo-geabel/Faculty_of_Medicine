import React, { useState, useRef, useEffect } from "react";
import "./Announcement.css";
import useAnnouncementContextHook from "../hook/useAnnouncementhook";
import useAchievementhook from "../hook/useAchievementhook";
import useLoginhook from "../hook/useLoginhook";

const Announcement = ({ userRole }) => {
  const [selectedAchievementIndex, setSelectedAchievementIndex] = useState(0);
  const [selectedAnnouncementIndex, setSelectedAnnouncementIndex] = useState(0);
  const { User } = useLoginhook();
  const { announcements, dispatch: disAnnouncement } =
    useAnnouncementContextHook();
  const { achievements, dispatch: disAchievement } = useAchievementhook();
  const [isActive, setIsActive] = useState(false);
  const refann = useRef(null);
  const refach = useRef(null);
  // console.log(announcements[0].blog[0].title);
  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_URL}/announcement/`);
      const data = await response.json();
      if (!response.ok) {
        return console.log(data.error);
      }
      localStorage.setItem("announcements", JSON.stringify(data.data));
      disAnnouncement({ type: "GET_ANNOUNCEMENTS", payload: data.data });
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [disAnnouncement]);
  const fetchAchievement = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_URL}/achievement/`);
      const data = await response.json();
      if (!response.ok) {
        return console.log(data.error);
      }
      localStorage.setItem("achievement", JSON.stringify(data.data));
      disAchievement({ type: "GET_ACHIEVEMENTS", payload: data.data });
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  useEffect(() => {
    fetchAchievement();
  }, [disAchievement]);

  const [newAnnouncement, setNewAnnouncement] = useState({
    id: null,
    title: "",
    date: "",
    department: "",
    content: "",
    blog: { title: "", excerpt: "" },
  });

  const [newAchievement, setNewAchievement] = useState({
    id: null,
    title: "",
    date: "",
    description: "",
    blog: { title: "", excerpt: "" },
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

  const handleRadioChange = (type) => setIsActive(type === "achievement");

  const handleInputChange = (e, setState, nestedKey) => {
    const { name, value } = e.target;
    setState((prev) =>
      nestedKey
        ? { ...prev, [nestedKey]: { ...prev[nestedKey], [name]: value } }
        : { ...prev, [name]: value }
    );
  };

  const submitAnnouncement = async () => {
    try {
      // Prepare payload to match schema: blog must be an array, and whole request must be an array for insertMany
      const announcementToSubmit = {
        ...newAnnouncement,
        blog: [{ 
          title: newAnnouncement.title, 
          excerpt: newAnnouncement.content.slice(0, 150) + "..." 
        }]
      };

      const response = await fetch(
        `${import.meta.env.VITE_URL}/announcement/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${User.token}`,
          },
          body: JSON.stringify([announcementToSubmit]), // Wrap in array for insertMany
        }
      );

      if (response.ok) {
        disAnnouncement({
          type: "CREATE_ANNOUNCEMENT",
          payload: announcementToSubmit,
        });
        setNewAnnouncement({
          id: null,
          title: "",
          date: "",
          department: "",
          content: "",
          blog: { title: "", excerpt: "" },
        });
        fetchAnnouncements();
      } else {
        const errorData = await response.json();
        console.error("Server Error:", errorData);
        alert("Failed to create announcement: " + (errorData.message || errorData.error));
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
    }
  };

  const deleteAnnouncement = async (_id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}/announcement/${_id}`,
        {
          method: "DELETE",
          headers: { authorization: `Bearer ${User.token}` },
        }
      );

      if (response.ok) {
        disAnnouncement({ type: "DELETE_ANNOUNCEMENT", payload: _id });
        fetchAnnouncements();
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  const deleteAchievement = async (_id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}/achievement/${_id}`,
        {
          method: "DELETE",
          headers: { authorization: `Bearer ${User.token}` },
        }
      );

      if (response.ok) {
        disAchievement({ type: "DELETE_ACHIEVEMENT", payload: _id });
        fetchAchievement();
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  const submitAchievement = async () => {
    try {
      // Prepare payload to match schema
      const achievementToSubmit = {
        ...newAchievement,
        blog: [{ 
          title: newAchievement.title, 
          excerpt: newAchievement.description.slice(0, 150) + "..." 
        }]
      };

      const response = await fetch(`${import.meta.env.VITE_URL}/achievement/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${User.token}`,
        },
        body: JSON.stringify([achievementToSubmit]), // Wrap in array for insertMany
      });

      if (response.ok) {
        disAchievement({ type: "CREATE_ACHIEVEMENT", payload: achievementToSubmit });
        setNewAchievement({
          id: null,
          title: "",
          date: "",
          description: "",
          blog: { title: "", excerpt: "" },
        });
        fetchAchievement();
      } else {
        const errorData = await response.json();
        console.error("Server Error:", errorData);
        alert("Failed to create achievement: " + (errorData.message || errorData.error));
      }
    } catch (error) {
      console.error("Error creating achivement:", error);
    }
  };

  const scrollToElement = (ref, index, setIndex) => {
    setIndex(index);
    const element = ref.current;
    const { top } = element.getBoundingClientRect();

    window.scrollTo({
      top: window.scrollY + top - 100,
      behavior: "smooth",
    });
  };

  return (
    <div className="pulse_workspace">
      <div className="workspace_layout">
        {/* Master Sidebar (The Feed) */}
        <aside className="pulse_sidebar">
          <div className="sidebar_fixed_header">
            <h2 className="pulse_brand_title">Medical Pulse</h2>
            <div className="pulse_toggle_switch">
              <button 
                className={`pulse_pill ${!isActive ? "active" : ""}`}
                onClick={() => handleRadioChange("announcement")}
              >
                Announcements
              </button>
              <button 
                className={`pulse_pill ${isActive ? "active" : ""}`}
                onClick={() => handleRadioChange("achievement")}
              >
                Achievements
              </button>
            </div>
          </div>

          <div className="sidebar_scroll_feed">
            {!isActive ? (
              announcements?.map((item, index) => (
                <div 
                  key={item._id} 
                  className={`pulse_mini_card ${selectedAnnouncementIndex === index ? "active" : ""}`}
                  onClick={() => scrollToElement(refann, index, setSelectedAnnouncementIndex)}
                >
                  <div className="mini_card_meta">
                    <span className="mini_date">{item.date}</span>
                    <span className="mini_tag">{item.department}</span>
                  </div>
                  <h4 className="mini_card_title">{item.title}</h4>
                </div>
              ))
            ) : (
              achievements?.map((item, index) => (
                <div 
                  key={item._id} 
                  className={`pulse_mini_card ${selectedAchievementIndex === index ? "active" : ""}`}
                  onClick={() => scrollToElement(refach, index, setSelectedAchievementIndex)}
                >
                  <div className="mini_card_meta">
                    <span className="mini_date">{item.date}</span>
                    <span className="mini_award">🏆</span>
                  </div>
                  <h4 className="mini_card_title">{item.title}</h4>
                </div>
              ))
            )}
          </div>

          {userRole === 0 && (
            <div className="sidebar_admin_footer">
              <div className="admin_glass_mini_panel">
                <h5>Post New {isActive ? "Achievement" : "Announcement"}</h5>
                <div className="mini_form">
                  <input type="text" name="title" placeholder="Entry Title" value={isActive ? newAchievement.title : newAnnouncement.title} onChange={(e) => handleInputChange(e, isActive ? setNewAchievement : setNewAnnouncement)} />
                  
                  {!isActive && (
                    <select name="department" value={newAnnouncement.department} onChange={(e) => handleInputChange(e, setNewAnnouncement)} className="mini_form_select">
                      <option value="">Select Department</option>
                      {departmentList.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  )}

                  <input type="date" name="date" value={isActive ? newAchievement.date : newAnnouncement.date} onChange={(e) => handleInputChange(e, isActive ? setNewAchievement : setNewAnnouncement)} />
                  
                  <textarea 
                    name={isActive ? "description" : "content"} 
                    placeholder={isActive ? "Achievement Description..." : "Announcement Content..."} 
                    value={isActive ? newAchievement.description : newAnnouncement.content} 
                    onChange={(e) => handleInputChange(e, isActive ? setNewAchievement : setNewAnnouncement)}
                  />

                  <button className="mini_publish_btn" onClick={isActive ? submitAchievement : submitAnnouncement}>
                    Push to Pulse
                  </button>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Content Display (The Stage) */}
        <main className="pulse_reading_stage">
          <div ref={!isActive ? refann : refach} className="pulse_canvas_box">
             {!isActive ? (
               <article className="reading_content animate_fade">
                 <header className="reading_header">
                   <div className="reading_meta">
                     <span className="reading_date">{announcements[selectedAnnouncementIndex]?.date}</span>
                     <span className="reading_dept">{announcements[selectedAnnouncementIndex]?.department}</span>
                   </div>
                   <h1 className="reading_title">
                     {announcements[selectedAnnouncementIndex]?.blog?.[0]?.title || announcements[selectedAnnouncementIndex]?.title}
                   </h1>
                   <div className="reading_divider"></div>
                 </header>
                 <div className="reading_body">
                   <p className="reading_excerpt">
                     {announcements[selectedAnnouncementIndex]?.blog?.[0]?.excerpt || announcements[selectedAnnouncementIndex]?.content}
                   </p>
                   {userRole === 0 && (
                     <button className="pulse_delete_action" onClick={() => deleteAnnouncement(announcements[selectedAnnouncementIndex]?._id)}>
                       Remove from Pulse
                     </button>
                   )}
                 </div>
               </article>
             ) : (
               <article className="reading_content animate_fade">
                 <header className="reading_header">
                   <div className="reading_meta">
                     <span className="reading_date">{achievements[selectedAchievementIndex]?.date}</span>
                     <span className="reading_badge">Academic Excellence</span>
                   </div>
                   <h1 className="reading_title">
                     {achievements[selectedAchievementIndex]?.blog?.[0]?.title || achievements[selectedAchievementIndex]?.title}
                   </h1>
                   <div className="reading_divider"></div>
                 </header>
                 <div className="reading_body">
                   <p className="reading_excerpt">
                     {achievements[selectedAchievementIndex]?.blog?.[0]?.excerpt || achievements[selectedAchievementIndex]?.description}
                   </p>
                   {userRole === 0 && (
                     <button className="pulse_delete_action" onClick={() => deleteAchievement(achievements[selectedAchievementIndex]?._id)}>
                       Remove Entry
                     </button>
                   )}
                 </div>
               </article>
             )}
          </div>
        </main>
      </div>
    </div>
  );
};
  



export default Announcement;
