import React, { useState, useRef, useEffect } from "react";
import "./Announcement.css";
import useAnnouncementContextHook from "../../hook/useAnnouncementHook";
import useAchievementhook from "../../hook/useAchievementhook";
import useLoginhook from "../../hook/useLoginhook";

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
      const response = await fetch(
        `${import.meta.env.VITE_URL}/announcement/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${User.token}`,
          },
          body: JSON.stringify(newAnnouncement),
        }
      );

      if (response.ok) {
        disAnnouncement({
          type: "CREATE_ANNOUNCEMENT",
          payload: newAnnouncement,
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
      const response = await fetch(`${import.meta.env.VITE_URL}/achievement/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${User.token}`,
        },
        body: JSON.stringify(newAchievement),
      });

      if (response.ok) {
        disAchievement({ type: "CREATE_ACHIEVEMENT", payload: newAchievement });
        setNewAchievement({
          id: null,
          title: "",
          date: "",
          description: "",
          blog: { title: "", excerpt: "" },
        });
        fetchAchievement();
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
    <div ref={refann} className="an-container">
      <div className="right-bar">
        {announcements && (
          <div className="ann">
            <h2>
              <h2>
                {announcements?.[selectedAnnouncementIndex]?.blog?.[0]?.title ||
                  "No Announcements available"}
              </h2>
            </h2>
            <span id="date">
              {announcements[selectedAnnouncementIndex]?.date}
            </span>
            <p>
              {announcements[selectedAnnouncementIndex]?.blog[0]?.excerpt ||
                "No description available"}
            </p>
          </div>
        )}
        <div ref={refach} className="chh">
          <h2>
            {achievements?.[selectedAchievementIndex]?.blog?.[0]?.title ||
              "No achievements available"}
          </h2>
          <span id="date">
            {achievements?.[selectedAchievementIndex]?.date ||
              "No date available"}
          </span>
          <p>
            {achievements?.[selectedAchievementIndex]?.blog?.[0]?.excerpt ||
              "No description available"}
          </p>
        </div>

        {userRole === 0 && (
          <div className="add">
            <h5>Add</h5>
            <div className="nbt">
              <label htmlFor="announcement">Announcement</label>
              <input
                onClick={() => handleRadioChange("announcement")}
                type="radio"
                id="announcement"
                name="selection"
                checked={!isActive}
              />
              <label htmlFor="achievement">Achievement</label>
              <input
                onClick={() => handleRadioChange("achievement")}
                type="radio"
                id="achievement"
                name="selection"
              />
            </div>
            <div className="add-form">
              {isActive ? (
                <>
                  <input
                    type="text"
                    name="title"
                    placeholder="Achievement Title"
                    value={newAchievement.title}
                    onChange={(e) =>
                      handleInputChange(e, setNewAchievement, null)
                    }
                  />
                  <input
                    type="text"
                    name="date"
                    placeholder="Achievement Date"
                    value={newAchievement.date}
                    onChange={(e) =>
                      handleInputChange(e, setNewAchievement, null)
                    }
                  />
                  <input
                    type="text"
                    name="description"
                    placeholder="Achievement Description"
                    value={newAchievement.description}
                    onChange={(e) =>
                      handleInputChange(e, setNewAchievement, null)
                    }
                  />
                  <input
                    type="text"
                    name="title"
                    placeholder="Blog Title"
                    value={newAchievement.blog.title}
                    onChange={(e) =>
                      handleInputChange(e, setNewAchievement, "blog")
                    }
                  />
                  <textarea
                    name="excerpt"
                    placeholder="Blog Excerpt"
                    value={newAchievement.blog.excerpt}
                    onChange={(e) =>
                      handleInputChange(e, setNewAchievement, "blog")
                    }
                  />
                  <button onClick={submitAchievement}>
                    Submit Achievement
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    name="title"
                    placeholder="Announcement Title"
                    value={newAnnouncement.title}
                    onChange={(e) =>
                      handleInputChange(e, setNewAnnouncement, null)
                    }
                  />
                  <input
                    type="text"
                    name="date"
                    placeholder="Announcement Date"
                    value={newAnnouncement.date}
                    onChange={(e) =>
                      handleInputChange(e, setNewAnnouncement, null)
                    }
                  />
                  <input
                    type="text"
                    name="department"
                    placeholder="Department"
                    value={newAnnouncement.department}
                    onChange={(e) =>
                      handleInputChange(e, setNewAnnouncement, null)
                    }
                  />
                  <input
                    type="text"
                    name="content"
                    placeholder="Content"
                    value={newAnnouncement.content}
                    onChange={(e) =>
                      handleInputChange(e, setNewAnnouncement, null)
                    }
                  />
                  <input
                    type="text"
                    name="title"
                    placeholder="Blog Title"
                    value={newAnnouncement.blog.title}
                    onChange={(e) =>
                      handleInputChange(e, setNewAnnouncement, "blog")
                    }
                  />
                  <textarea
                    name="excerpt"
                    placeholder="Blog Excerpt"
                    value={newAnnouncement.blog.excerpt}
                    onChange={(e) =>
                      handleInputChange(e, setNewAnnouncement, "blog")
                    }
                  />
                  <button onClick={submitAnnouncement}>
                    Submit Announcement
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="left-bar">
        <div className="an">
          <h2>Announcements</h2>
          {announcements?.map((announcement, index) => (
            <div key={announcement._id} className="contents">
              <h5
                onClick={() =>
                  scrollToElement(refann, index, setSelectedAnnouncementIndex)
                }
              >
                {announcement.title}
              </h5>
              <p>{announcement.date}</p>
              <p>{announcement.department}</p>
              <p>{announcement.content}</p>
              {userRole === 0 && (
                <button onClick={() => deleteAnnouncement(announcement._id)}>
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="ach">
          <h2>Achievements</h2>

          {achievements?.map((achievement, index) => (
            <div key={achievement._id} className="contents">
              <h5
                onClick={() =>
                  scrollToElement(refach, index, setSelectedAchievementIndex)
                }
              >
                {achievement.title}
              </h5>
              <p>{achievement.date}</p>
              <p>{achievement.description}</p>
              {userRole === 0 && (
                <button onClick={() => deleteAchievement(achievement._id)}>
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Announcement;
