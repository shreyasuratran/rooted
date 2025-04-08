import React, { useState } from 'react';
import './ContactUs.css';
import { Link } from 'react-router-dom';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
      <Link to="/home" className="back-arrow">←</Link>
        <h1>Contact Us</h1>
        <p>We're here to help. Send us a message below.</p>
      </div>

      {submitted ? (
        <div className="thank-you-message">
          <h3>🌱 Thank you for your message!</h3>
          <p>We'll get back to you soon.</p>
        </div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="4"
            value={form.message}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit">Send Message</button>
        </form>
      )}
    </div>
  );
};

export default ContactUs;