import React, { useEffect, useState } from "react";
import Pop from "./Pop";
import a_logo from "../../public/assets/a_logo.png";
import "./Faculty_Member.css";
import members from "../../public/assets/members.avif";
import Hero from "./Hero";
import useMemberhook from "../../hook/useMemberhook";
const Faculty_Member = () => {
  const [open, setopen] = useState(false);
  const [selected, setselected] = useState(null);
  const { Members, dispatch } = useMemberhook();
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/Members/");
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
    <>
      <Hero
        onclick={scrollToSection}
        photo={members}
        title="Faculty Members"
        txt_btn="See them"
      />{" "}
      <div className="member-container">
        <div className="list-contaier">
          <div className="member-list">
            {filtered.map((Member) => (
              <div key={Member._id} className="card">
                <div key={Member.id} className="card-details">
                  <img src={Member.img} alt="" />
                  <p>Name: {Member.name}</p>
                  <p>Department: {Member.department}</p>
                  <p>Title: {Member.title}</p>
                  <button
                    className="card-btn"
                    onClick={() => openModal(Member)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="search-bar">
            <h2>Search</h2>
            <input onChange={handlechange} type="text" name="Search" />
          </div>
        </div>
        <Pop isOpen={open} onClose={onclose} assistant={selected} />
      </div>
    </>
  );
};

export default Faculty_Member;
