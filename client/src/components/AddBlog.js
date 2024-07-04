import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";

const AddBlog = ({ show, onClose }) => {
  const [BlogData, setBlogData] = useState({
    title: "",
    content: ""
  });

  const handleInputChange = (e) => {
    const { title, value } = e.target;
    setBlogData({ ...BlogData, [title]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/blogs/addBlog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(BlogData),
      });
      const data = await response.json();
      if (data.success) {
        Swal.fire({
          title: "Success",
          icon: "success",
          text: "Blog added successfully",
        });
        onClose();
      } else {
        Swal.fire({
          title: "Error",
          icon: "error",
          text: data.message,
        });
      }
    } catch (error) {
      console.error("Error adding Blog:", error);
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Blog</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={blogData.title}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="content">
            <Form.Label>Director</Form.Label>
            <Form.Control
              type="text"
              name="content"
              value={blogData.content}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Post
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddBlog;
