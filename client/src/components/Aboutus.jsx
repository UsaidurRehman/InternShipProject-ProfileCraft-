import React from "react";
import "./Style/Aboutus.css";
import { useNavigate } from "react-router-dom";

export default function Aboutus() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/steperdas"); // Ensure this matches your route
  };

  return (
    <section className="about">
      {/* Hero Section */}
      <div className="about__hero">
        <h1 className="about__title">About Us</h1>
        <p className="about__subtitle">
          Build a professional CV, explore jobs instantly, and master tips to get hired faster.
        </p>
        <sub style={{fontFamily:"Arial"}}>the art of creating or designing a profile</sub>
      </div>

      <div className="about__content container">
        {/* Mission */}
        <div className="about__intro card">
          <h2 className="highlight-title">Our Mission</h2>
          <p>
            We make your career journey simple and efficient. Create standout CVs in minutes, explore job openings
            with one click, and access expert tips to boost your chances of success.
          </p>
        </div>

        {/* Key Features */}
        <div className="about__features">
          <h2 className="section-title highlight-title">Key Features</h2>

          <div className="features__grid">
            {[
              { icon: "📝", title: "Create Professional CVs", desc: "Build ATS-friendly CVs that showcase your skills and achievements." },
              { icon: "🎨", title: "Diverse Templates", desc: "Pick from modern designs tailored to your industry." },
              { icon: "✏️", title: "Edit Anytime", desc: "Easily update or customize your CV whenever you want." },
              { icon: "💼", title: "One-Click Job Lists", desc: "Discover jobs instantly and apply with confidence." },
            ].map((feature, i) => (
              <article className="feature card" key={i}>
                <div className="feature__icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="about__cta card">
          <h2 className="highlight-title">Ready to Start?</h2>
          <p>Create your CV, choose a template, and land your dream job—all in one place.</p>
          <button className="btn btn--primary" type="button" onClick={handleNavigate}>
            Start Building Your CV
          </button>
        </div>

        {/* Project Info */}
        <div className="about__info card">
          <p>
            <strong>Project by:</strong> <br />
            USAID UR REHMAN <br />
            MESAM ABBAS <br />
            <em>Internship Project (Computer Science Students)</em>
          </p>
        </div>
      </div>
    </section>
  );
}
