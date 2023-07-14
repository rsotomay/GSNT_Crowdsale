import Navbar from "react-bootstrap/Navbar";

import logo from "../logo_GSNT.png";

const Navigation = () => {
  return (
    <Navbar>
      <img
        alt="logo_GSNT"
        src={logo}
        width="50"
        height="50"
        className="d-inline-block align-top mx-2"
      />
      <Navbar.Brand href="#">GSTN ICO Crowdsale</Navbar.Brand>
    </Navbar>
  );
};

export default Navigation;
