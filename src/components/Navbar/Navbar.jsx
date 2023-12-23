import React, { useState, useEffect } from "react";
import "./Navbar.scss";
import { images } from "../../constants";

const Navbar = () => {
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    const handleHashChange = () => {
      setActiveItem(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange, false);

    handleHashChange();

    return () => {
      window.removeEventListener("hashchange", handleHashChange, false);
    };
  }, []);

  return (
    <nav className="app__navbar">
      <div className="app__navbar-logo">
        <img src={images.logo3} alt="Logo Suitmedia" />
      </div>

      <ul className="app__navbar-links">
        {["Work", "About", "Services", "Ideas", "Careers", "Contact"].map((item) => (
          <li className={`app__flex p-text ${activeItem === `#${item}` ? "active" : ""}`} key={`link-${item}`}>
            <div>
              <a href={`#${item}`}>{item}</a>
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
