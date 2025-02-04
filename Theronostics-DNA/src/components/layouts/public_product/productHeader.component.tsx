import { Link } from "react-router-dom";
import { setTheme } from "../../../redux/action";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import moonImage from "../../../assets/images/moon.svg";
import sunImage from "../../../assets/images/sun.svg";
// import footerlogo from '../../assets/images/footer-logo.svg'
import headerlogo from "../../../assets/images/logo-trans.png";
import { headerMenu } from "../../../constants/headerMenu";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faTimes} from "@fortawesome/free-solid-svg-icons";

const ProductHeader = () => {
  const currentTheme = useAppSelector((state: RootState) => state.theme.theme);
  const dispatch = useAppDispatch();
  const toggleTheme = async () => {
    const newTheme: any = currentTheme === "dark" ? "light" : "dark";
    await dispatch(setTheme(newTheme));
    document.documentElement.setAttribute("data-bs-theme", newTheme);
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", newTheme === "dark" ? "#282828" : "#ffffff");
    }
  };
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Function to handle drawer toggle
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };
  return (
    <header>
      <section className="top-header py-3 py-lg-1 d-none d-lg-block ">
        <div className="container">
          <div className="row d-flex align-items-center justify-content-between">
            <div className="col-lg-12 d-flex justify-content-between align-items-center flex-column flex-lg-row flex-md-row flex-xl-row">
              <div className="order-1 order-lg-0 order-md-0 ">
                {/* <img src={logo} className="img-fluid" alt="" /> */}
                {/* <Link to="https://www.theranostics.co.nz/"><img src={footerlogo} alt="" className="img-fluid" /></Link> */}
                <Link to="https://www.theranostics.co.nz/" className="d-block">
                  <img src={headerlogo} alt="" className="" height={80} />
                </Link>
              </div>

              <div className="site-description order-0 order-lg-1  order-md-1">
                Your genes, your health
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="navbar-parent">
        <nav className="navbar navbar-expand-lg custom-navbar">
          <div className="container-lg px-0">
            <div className="d-flex justify-content-between align-items-center w-100 mobile-top-header d-block d-lg-none">
              <Link
                className="navbar-brand"
                to="https://www.theranostics.co.nz/"
              >
                <img src={headerlogo} className="ss img-fluid" alt="" />
                {/* <img src={footerlogo} alt="" className="img-fluid" /> */}
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
                onClick={toggleDrawer}
              >
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>

            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                {headerMenu.map((menu, index) => (
                  <li key={index} className="nav-item">
                    {menu?.title === "Products" ? (
                      <Link className="nav-link active" to={menu?.path}>
                        {menu?.title}
                      </Link>
                    ) : (
                      <Link className="nav-link" to={menu?.path}>
                        {menu?.title}
                      </Link>
                    )}
                  </li>
                ))}
                <li>
                  <button
                    className="theme-toggle nav-link btn-dark-theme"
                    onClick={toggleTheme}
                  >
                    <span className="moon">
                      <img
                        src={currentTheme === "light" ? moonImage : sunImage}
                        alt="moon"
                        width={20}
                      />
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </section>
      <div
        className={`drawer ${isDrawerOpen ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <Link to="https://www.theranostics.co.nz/" className="d-block">
            <img src={headerlogo} alt="" className="drawer-header-image" />
          </Link>
          {/* <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={closeDrawer}
          ></button> */}

            <button
                        className="btn ms-auto d-block d-lg-none border-0"
                        onClick={closeDrawer}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
        </div>
        <div className="drawer-body">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            {headerMenu.map((menu, index) => (
              <li key={index} className="nav-item">
                {menu?.title === "Products" ? (
                  <Link className="nav-link active" to={menu?.path}>
                    {menu?.title}
                  </Link>
                ) : (
                  <Link className="nav-link" to={menu?.path}>
                    {menu?.title}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <button
                className="theme-toggle nav-link btn-dark-theme"
                onClick={toggleTheme}
              >
                <span className="moon">
                  <img
                    src={currentTheme === "light" ? moonImage : sunImage}
                    alt="moon"
                    width={20}
                  />
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Overlay */}
      {isDrawerOpen && <div className="sidebar-overlay" onClick={closeDrawer}></div>}
    </header>
  );
};

export default ProductHeader;
