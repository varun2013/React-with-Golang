import React from "react";
import { Link } from "react-router-dom";
import { FooterProps } from "../../../types/layouts.type";

const Footer: React.FC<FooterProps> = ({ sidebarCollapsed }) => {
  return (
    <footer className={`footer ${sidebarCollapsed ? "expanded" : ""}`}>
      <div className="container-fluid py-3">
        <div className="row text-muted d-flex justify-content-center">
          <div className="col-lg-6 text-center text-lg-start">
            <p className="mb-0">
              <Link to="/" className="text-muted">
                <strong>Theranostics</strong>
              </Link>
            </p>
          </div>
          <div className="col-lg-6 text-center text-lg-end">
            <ul className="list-inline">
              <li className="list-inline-item">
                <Link
                  to="https://www.theranostics.co.nz/privacy/"
                  target="_blank"
                  className="text-muted"
                >
                  Terms and Conditions
                </Link>
              </li>
              <li className="list-inline-item">
                <Link
                  to="https://www.theranostics.co.nz/privacy/"
                  target="_blank"
                  className="text-muted"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
