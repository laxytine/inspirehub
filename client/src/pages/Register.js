import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../assets/css/registration.css";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function registerUser(e) {
    e.preventDefault();

    fetch("http://localhost:4000/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data.message) {
          setName("");
          setEmail("");
          setPassword("");
          Swal.fire({
            title: "Success",
            icon: "success",
            text: data.message,
          });
          navigate("/login");
        } else if (data.error) {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: data.error,
          });
        } else {
          Swal.fire({
            title: "Oops...",
            icon: "error",
            text: "Something went wrong. Please try again.",
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          title: "Oops...",
          icon: "error",
          text: "Something went wrong. Please try again.",
        });
      });
  }

  return localStorage.getItem("token") !== null ? (
    <Navigate to="/" />
  ) : (
    <Container className="registration-container bg-register">
      <Row className="h-100 align-items-center justify-content-center">
        <Col md={8}>
          <div className="registration-form-wrapper">
            <h1 className="title mb-5 text-center">Register</h1>
            <Form onSubmit={registerUser}>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column className="label" md={12}>
                  Username:
                </Form.Label>
                <Col md={12}>
                  <Form.Control
                    type="text"
                    placeholder="Enter Username"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="placeholder rounded-pill"
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column className="label" md={12}>
                  Email:
                </Form.Label>
                <Col md={12}>
                  <Form.Control
                    type="email"
                    placeholder="Enter Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="placeholder rounded-pill"
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column className="label" md={12}>
                  Password:
                </Form.Label>
                <Col md={12}>
                  <Form.Control
                    type="password"
                    placeholder="Enter Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="placeholder rounded-pill"
                  />
                </Col>
              </Form.Group>
              <div className="d-flex justify-content-center">
                <Button
                  variant="warning"
                  type="submit"
                  className="btn rounded-pill"
                >
                  Submit
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/login")}
                  className="btn rounded-pill"
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
