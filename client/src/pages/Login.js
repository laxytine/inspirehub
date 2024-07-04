import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../assets/css/login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(true);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsActive(e.target.value.trim() !== "" && password.trim() !== "");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setIsActive(e.target.value.trim() !== "" && email.trim() !== "");
  };

  function authenticate(e) {
    e.preventDefault();
    fetch("http://localhost:4000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.access !== "undefined") {
          localStorage.setItem("token", data.access);
          localStorage.setItem("isAdmin", data.user.isAdmin);
          localStorage.setItem("isVerified", data.user.isVerified);
          localStorage.setItem("id", data.user.id);
          Swal.fire({
            title: "Login Successful",
            icon: "success",
            text: "Welcome to InspireHub",
          }).then(() => {
            navigate("/blogs", { replace: true }); // Navigate to /blogs without full page reload
          });
        } else if (data.error) {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: data.error,
          });
        }
      });

    setEmail("");
    setPassword("");
  }

  // Redirect if user is already logged in
  if (localStorage.getItem("token") !== null) {
    navigate("/blogs", { replace: true });
    return null; // Render nothing while redirecting
  }

  return (
    <Container className="login-container bg-login">
      <Row className="h-100 align-items-center justify-content-center">
        <Col className="d-flex justify-content-center align-items-center">
          <div className="login-form-wrapper mb-5 pb-5">
            <h1 className="title mb-5 text-white">Login</h1>
            <Form onSubmit={authenticate} className="text-white">
              <Form.Group as={Row} controlId="userEmail" className="mb-3">
                <Form.Label column className="label">
                  Email address
                </Form.Label>
                <Col>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                    className="placeholder"
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="password" className="mb-3">
                <Form.Label column className="label">
                  Password
                </Form.Label>
                <Col>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    className="placeholder"
                  />
                </Col>
              </Form.Group>

              <div className="text-center">
                <Button
                  variant="warning"
                  type="submit"
                  id="submitBtn"
                  disabled={!isActive}
                  className="rounded-pill"
                >
                  Submit
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
