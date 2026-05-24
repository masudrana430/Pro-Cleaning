// src/pages/Contact.jsx
import React, { useState } from "react";
// import Container from "../Components/Container";
import { toast } from "react-toastify";
import Container from "../Components/Container";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      // If you have backend endpoint, send there:
      // await fetch(`${API}/contact`, { method:"POST", headers:{...}, body: JSON.stringify(form) })

      toast.success("Message sent! We will get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Container>
      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-3xl font-extrabold text-center">Contact Us</h1>
        <p className="text-center mt-2 text-base-content/70">
          Have a question or want to report something urgent? Send us a message.
        </p>

        <div className="mt-8 rounded-2xl border bg-base-100 p-6 shadow-sm">
          <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="label">
                <span className="label-text">Your Name</span>
              </label>
              <input
                className="input input-bordered w-full"
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Masud"
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="you@email.com"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text">Subject</span>
              </label>
              <input
                className="input input-bordered w-full"
                name="subject"
                value={form.subject}
                onChange={onChange}
                placeholder="How can we help?"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text">Message</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full"
                name="message"
                value={form.message}
                onChange={onChange}
                rows={5}
                placeholder="Write your message..."
                required
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-2">
              <button
                type="reset"
                className="btn btn-ghost"
                onClick={() =>
                  setForm({ name: "", email: "", subject: "", message: "" })
                }
              >
                Clear
              </button>
              <button
                type="submit"
                className={`btn rounded-l-none border-0
    bg-gradient-to-r from-[#36B864] to-[#1A6A3D]
    text-white font-semibold
    transition-colors duration-300
    hover:from-[#48D978] hover:to-[#2B8C4A] ${sending ? "btn-disabled" : ""}`}
                disabled={sending}
              >
                {sending ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-base-100 p-5">
            <p className="text-xs uppercase opacity-60">Email</p>
            <p className="font-semibold">support@yourapp.com</p>
          </div>
          <div className="rounded-2xl border bg-base-100 p-5">
            <p className="text-xs uppercase opacity-60">Phone</p>
            <p className="font-semibold">+880 1XXXXXXXXX</p>
          </div>
          <div className="rounded-2xl border bg-base-100 p-5">
            <p className="text-xs uppercase opacity-60">Hours</p>
            <p className="font-semibold">Sat–Thu, 10am–6pm</p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Contact;
