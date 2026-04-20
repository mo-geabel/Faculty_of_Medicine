import React, { useEffect, useState } from "react";
import Pop from "./Pop";
import a_logo from "../assets/a_logo.png";
import "./Faculty_Member.css";
import members from "../assets/members.avif";
import Hero from "./Hero";
import useMemberhook from "../hook/useMemberhook";
const Faculty_Member = () => {
  const [open, setopen] = useState(false);
  const [selected, setselected] = useState(null);
  const { Members, dispatch } = useMemberhook();
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${import.meta.env.VITE_URL}/Members`);
      const data = await response.json();
      console.log(data);
      dispatch({ type: "GET_Members", payload: data });
    };
    fetchData();
  }, [dispatch]);

  const openModal = (assistant) => {
    setopen(true);
    setselected(assistant);
  };
  const onclose = () => {
    setopen(false);
    setselected(null);
  };
  const [search, setsearch] = useState("");

  const handlechange = (e) => {
    const value = e.target.value;
    setsearch(value);
  };

  const filtered = Members.filter((member) =>
    member.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  );
  const scrollToSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };
  return (
    <div className="faculty_page">
      <Hero
        onclick={scrollToSection}
        photo={members}
        title="Distinguished Faculty"
        subtitle="Meet the world-class educators and researchers shaping the next generation of healthcare leaders."
        txt_btn="Meet the Faculty"
      />

      <div className="members_section">
        <div className="section_container">
          <div className="search_header">
            <h2 className="search_title">Faculty Directory</h2>
            <div className="search_bar">
              <input
                onChange={handlechange}
                type="text"
                placeholder="Search by name, department, or title..."
                value={search}
              />
              <span className="search_icon">🔍</span>
            </div>
          </div>

          <div className="member_grid">
            {filtered.map((Member) => (
              <div key={Member._id} className="member_card">
                <div className="card_header">
                  <div className="avatar_box">
                    <img src={a_logo} alt={Member.name} />
                  </div>
                  <div className="member_meta">
                    <span className="dept_tag">{Member.department}</span>
                  </div>
                </div>
                
                <div className="card_body">
                  <h3 className="member_name">{Member.name}</h3>
                  <p className="member_title">{Member.title}</p>
                </div>

                <div className="card_footer">
                  <button
                    className="view_details_btn"
                    onClick={() => openModal(Member)}
                  >
                    View Biography
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Pop isOpen={open} onClose={onclose} assistant={selected} />
      </div>
    </div>
  );
};

export default Faculty_Member;
