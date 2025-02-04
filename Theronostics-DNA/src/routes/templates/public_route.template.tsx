import { useDispatch } from "react-redux";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { setTheme } from "../../redux/action";
import backgroundLight from "../../assets/images/bg_1.webp";
import backgroundDark from "../../assets/images/dark_bg.webp";
import logo_new from "../../assets/images/logo_new.jpeg";
import labPng from "../../assets/images/lab.webp";
import darklabPng from "../../assets/images/dark_lab.webp";
import sunImage from "../../assets/images/sun.svg";
import moonImage from "../../assets/images/moon.svg";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loader from "../../components/common/loader/Loader";
import { PublicTemplateProps } from "../../types/route.type";

const PublicTemplate: React.FC<PublicTemplateProps> = ({ children }) => {
  const dispatch = useDispatch();
  const loading = useAppSelector((state: RootState) => state.loader.loader);
  const currentTheme = useAppSelector((state: RootState) => state.theme.theme);

  const toggleTheme = async () => {
    const newTheme: any = currentTheme === "dark" ? "light" : "dark";
    await dispatch(setTheme(newTheme));
    document.documentElement.setAttribute("data-bs-theme", newTheme);
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", newTheme === "dark" ? "#282828" : "#ffffff");
    }
  };

  // Determine the background image for the entire page based on the theme
  const pageBackground =
    currentTheme === "dark" ? backgroundDark : backgroundLight;

  // Determine the lab image based on the theme
  const labImage = currentTheme === "dark" ? darklabPng : labPng;

  return (
    <div
      className="form-wrap"
      style={{
        backgroundImage: `url(${pageBackground})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        color: currentTheme === "dark" ? "#ffffff" : "#000000",
      }}
    >
      <Button
        variant="light"
        onClick={toggleTheme}
        className="auth-switch"
        style={{
          backgroundColor: "#d6dde5",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          borderRadius: "50%", // Make it circular
        }}
      >
        {currentTheme === "dark" ? (
          <img src={sunImage} alt="sun" style={{ height: "20px" }} />
        ) : (
          <img src={moonImage} alt="moon" style={{ height: "20px" }} />
        )}
      </Button>

      <Container fluid className="d-flex flex-grow-1">
        <Row className="flex-grow-1 w-100 row-gap-3">
          {/* 
            3. Left Section:
              - Set background image based on theme.
              - Place logo on the left.
              - Lab image in the center based on theme.
              - Footer with terms on left and both links on the right.
          */}
          <Col md={6} className="d-none d-md-flex align-items-center">
            <div className="left-bg">
              {/* Top Logo on the left */}
              <div className="logo_outer">
                <img src={logo_new} alt="Logo" />
              </div>

              {/* Center Lab Image */}
              <div className="lab">
                <img src={labImage} alt="lab" className="img-fluid" />
              </div>

              {/* Footer */}
              <div className="w-100 copyright-box">
                <p className="mb-0">
                  © The Theranostics Inc. (2024) | Theranostics™
                </p>
                <ul>
                  <li>
                    <Link
                      to="https://www.theranostics.co.nz/privacy/"
                      target="_blank"
                      className="me-3 text-decoration-none"
                    >
                      Terms and Conditions
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="https://www.theranostics.co.nz/privacy/"
                      target="_blank"
                      className="text-decoration-none"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </Col>

          {/* 
            3. Right Section:
              - Contains the children components.
              - Adjust background color based on theme.
          */}
          <Col
            md={6}
            className="d-flex flex-column justify-content-center align-items-center p-4 right-section"
            style={{
              backgroundColor: "transparent",
            }}
          >
            <div className="logo_outer d-block d-md-none mb-4">
              <img src={logo_new} alt="Logo" />
            </div>
            {children}
          </Col>
        </Row>
      </Container>

      {/* Loader */}
      {loading && <Loader />}
    </div>
  );
};

export default PublicTemplate;
