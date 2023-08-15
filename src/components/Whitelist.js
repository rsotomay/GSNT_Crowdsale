import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";

const Whitelist = ({ provider, crowdsale, setIsLoading }) => {
  const [isWaiting, setIsWaiting] = useState(false);
  const [addressToAdd, setAddressToAdd] = useState("");

  const addToWhitelistHandler = async (e) => {
    e.preventDefault();
    setIsWaiting(true);

    try {
      const signer = await provider.getSigner();
      const transaction = await crowdsale
        .connect(signer)
        .addToWhitelist(addressToAdd);
      await transaction.wait();
    } catch {
      window.alert("You are not in the whitelist to buy tokens.");
    }

    setIsLoading(true);
  };
  return (
    <Form
      onSubmit={addToWhitelistHandler}
      style={{ maxWidth: "800px", margin: "50px auto" }}
    >
      {isWaiting ? (
        <Spinner
          animation="border"
          style={{ display: "block", margin: "0 auto" }}
        />
      ) : (
        <Form.Group className="text-center" as={Row}>
          <Col>
            <Form.Control
              type="text"
              placeholder="Enter Address"
              onChange={(e) => setAddressToAdd(e.target.value)}
            />
          </Col>
          <Col className="text-center">
            <Button variant="primary" type="submit" style={{ width: "100%" }}>
              Add to Whitelist
            </Button>
          </Col>
        </Form.Group>
      )}
    </Form>
  );
};

export default Whitelist;
