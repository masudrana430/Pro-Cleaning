import { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";
import Container from "./Container";

const API_BASE = "http://localhost:3000";

const ContactSection = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErr("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSuccess("");

    const { name, email, subject, message } = form;

    if (!name || !email || !subject || !message) {
      setErr("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/messages`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to send message.");
      }

      setSuccess("Your message has been sent successfully.");
      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      setErr(error.message || "Failed to send message.");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setErr("");
        setSuccess("");
      }, 3000);
    }
  };

  return (
    <Container>
    <section className="py-14 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-100 px-3 py-1 bg-rose-50/60 text-[11px] font-semibold uppercase tracking-wide text-rose-700">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Support & Contact
          </div>
          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900">
            Need help or want to{" "}
            <span className="bg-gradient-to-r from-rose-500 via-red-500 to-orange-400 bg-clip-text text-transparent">
              reach our team?
            </span>
          </h2>
          <p className="mt-3 text-sm md:text-base text-slate-500 max-w-2xl mx-auto">
            Whether it’s an issue, suggestion, or partnership inquiry, share a
            few details and we will respond as soon as possible.
          </p>
        </div>

        {/* Main card */}
        <div className="rounded-3xl border border-slate-100 shadow-2xl bg-base-100/90 backdrop-blur-xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.5fr)] gap-8">
          {/* Left: contact info / brand block */}
          <div className="flex flex-col justify-between gap-6">
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2">
                Get in touch with us
              </h3>
              <p className="text-sm text-slate-600">
                Our support team is here to assist you with blood donation
                requests, account issues, or any feedback about the platform.
              </p>
            </div>

            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
                  <FiMail className="w-4 h-4" />
                </span>
                <div>
                  <p className="font-semibold text-slate-800">Email</p>
                  <p className="text-xs md:text-sm">
                    support@blood-donation.app
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 border border-sky-100">
                  <FiPhone className="w-4 h-4" />
                </span>
                <div>
                  <p className="font-semibold text-slate-800">Phone</p>
                  <p className="text-xs md:text-sm">+880 1XXX-XXXXXX</p>
                  <p className="text-[11px] text-slate-500">
                    Sun–Thu, 10:00 AM – 6:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <FiMapPin className="w-4 h-4" />
                </span>
                <div>
                  <p className="font-semibold text-slate-800">Location</p>
                  <p className="text-xs md:text-sm">
                    Dhaka, Bangladesh (Online-first platform)
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <p className="text-[11px] text-slate-500">
                We aim to respond within 24 hours. For urgent medical
                emergencies, please contact your local hospital directly.
              </p>
            </div>
          </div>

          {/* Right: form */}
          <div className="md:pl-4">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Name
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="input input-bordered rounded-xl text-sm"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  className="input input-bordered rounded-xl text-sm"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-control md:col-span-2">
                <label className="label pb-1">
                  <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Subject
                  </span>
                </label>
                <input
                  type="text"
                  name="subject"
                  className="input input-bordered rounded-xl text-sm"
                  placeholder="How can we help you?"
                  value={form.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-control md:col-span-2">
                <label className="label pb-1">
                  <span className="label-text text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Message
                  </span>
                </label>
                <textarea
                  name="message"
                  className="textarea textarea-bordered rounded-2xl text-sm min-h-[120px]"
                  placeholder="Write your message here..."
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              {err && (
                <p className="text-error text-xs md:text-sm md:col-span-2">
                  {err}
                </p>
              )}
              {success && (
                <p className="text-success text-xs md:text-sm md:col-span-2">
                  {success}
                </p>
              )}

              <div className="md:col-span-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mt-2">
                <p className="text-[11px] text-slate-500">
                  By submitting this form you agree that we may contact you
                  regarding your request.
                </p>
                <button
                  type="submit"
                  className="btn rounded-full border-0 px-6
                    bg-gradient-to-r from-rose-500 via-red-500 to-orange-400
                    text-white font-semibold shadow-lg shadow-rose-300/60
                    hover:shadow-rose-400/80 transition"
                  disabled={loading}
                >
                  {loading ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <FiSend className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
    </Container>
  );
};

export default ContactSection;
