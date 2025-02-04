import { Link } from "react-router-dom";
import footerlogo from "../../../assets/images/footer-logo.svg";
import { footerMenu } from "../../../constants/footerMenu";
const KitRegisterFooter: React.FC = () => {
  return (
    <footer>
      <section className="footer">
        <div className="container">
          <div className="row row-gap-3">
            {footerMenu.map((ele, i) => {
              return (
                <div className="col-lg-4 col-md-4 col-6" key={i}>
                  <div className="useful-links">
                    <h3>{ele?.title}</h3>
                    <ul>
                      {ele?.links.map((link, index) => {
                        return (
                          <li key={index}>
                            <Link to={link?.path}>{link?.title}</Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              );
            })}
            <div className="col-lg-4 col-md-4 col-12">
              <div className="d-flex align-items-center justify-content-center">
                <Link to="">
                  <img src={footerlogo} alt="" height={'80px'} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bottom-footer">
        <div className="container">
          <div className="row row-gap-3">
            <div className="col-lg-12">
              <div className="d-flex justify-content-center justify-content-lg-between justify-content-md-between align-items-center flex-column flex-lg-row flex-md-row flex-xl-row">
                <div>
                  <p className="m-0">
                    © The Theranostics Inc. (2024) | Theranostics™
                  </p>
                </div>
                <div>
                  <ul className="m-0 p-0 d-flex list-unstyled gap-2">
                    <li>
                      <Link
                        to="https://www.theranostics.co.nz/privacy/"
                        target="_blank"
                      >
                        Terms and Conditions
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="https://www.theranostics.co.nz/privacy/"
                        target="_blank"
                      >
                        Privacy Policy
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default KitRegisterFooter;
