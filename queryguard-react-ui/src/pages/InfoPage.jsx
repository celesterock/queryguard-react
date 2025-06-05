import React from "react";
import { Link } from "react-router-dom";
import logo_white from "../assets/logo_white.png";
import Celeste from "../assets/Celeste.jpg";
import Stephanie from "../assets/Stephanie.jpg";
import Anushka from "../assets/Anushka.jpg";
import "../styles/InfoPage.css";
import { Typewriter } from "react-simple-typewriter";
import { faBrain } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faSearch,
  faShieldAlt,
  faChartLine,
  faPlug,
  faCogs,
  faMagic,
  faListAlt,
  faMapMarkerAlt,
  faNetworkWired,
  faBug,
  faCode,
  faDatabase,
  faLock,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";

const steps = [
  {
    icon: faDownload,
    title: "Install Middleware",
    description:
      "Add QueryGuard to your web app with a simple package install and import.",
  },
  {
    icon: faNetworkWired,
    title: "Start Logging",
    description:
      "Capture requests in real-time which are automatically sent to QueryGuard for analysis.",
  },
  {
    icon: faSearch,
    title: "Analyze Threats",
    description:
      "Use your dashboard to explore potential SQL injection attempts and other related analytics.",
  },
];

const teamInfo = [
  {
    title: "Stephanie Chen",
    description: "Full Stack Engineer",
    img: Stephanie,
    email: "stephtc1@uci.edu",
  },
  {
    title: "Celeste Rock",
    description: "Full Stack Engineer",
    img: Celeste,
    email: "crock1@uci.edu",
  },
  {
    title: "Anushka Dwivedi",
    description: "Full Stack Engineer",
    img: Anushka,
    email: "adwived3@uci.edu",
  },
];

// add images to each of these
const aboutus = [
  {
    icon: faBrain,
    title: "BERT-Based ML Detection",
    description:
      "QueryGuard uses the latest in natural language processing to enable us to catch obfuscated or unconventional attacks other tools miss.",
  },
  {
    icon: faChartLine,
    title: "Real-Time Analytics Dashboard",
    description:
      "QueryGuard’s live dashboard gives users and admins clear visibility into who, when, and how attacks are attempted.",
  },
  {
    icon: faPlug,
    title: "Plug-and-Play Architecture",
    description:
      " No code rewrites, no deep integrations. Hosting platforms can deploy QueryGuard via a simple and package.",
  },
  {
    icon: faCogs,
    title: "Designed for Integration",
    description:
      "Whether as an add-on, bundled feature, or part of a custom tier, it adapts to your business model—not the other way around.",
  },
  {
    icon: faMagic,
    title: "Focused on Value, Not Complexity.",
    description:
      "We skip the jargon, steep learning curves, and bloated UIs. What’s left is a clean, modern solution that works quietly in the background",
  },
];

export default function InfoPage() {
  return (
    <div>
      <hr
        style={{
          border: "none",
          borderTop: "1px solid #ccc",
          margin: "1rem 0",
        }}
      />
      <header>
        <h1>QueryGuard</h1>
        <nav>
          <a href="#about"> About Us </a>
          <a href="#how-it-works">How It Works </a>
          <a href="#pricing">Pricing</a>
          <a href="#contact"> Contact Us </a>
          <Link to="/login" className="button">
            Log In
          </Link>
          <Link to="/register" className="button">
            Create Account
          </Link>
        </nav>
      </header>
      <hr
        style={{
          border: "none",
          borderTop: "1px solid #ccc",
          margin: "1rem 0",
        }}
      />

      <div className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h2>Protect Web Applications with Intelligent Detection</h2>
            <p>
              QueryGuard uses advanced AI models to understand and detect
              malicious patterns in real-time—safeguarding your websites against
              SQL injection, unauthorized access, and data breaches.
            </p>
          </div>
          <div className="hero-image flex items-center space-x-4">
            <img
              src={logo_white}
              alt="QueryGuard Logo"
              className="h-10 w-auto"
            />
            <h2 className="text-white text-lg font-semibold">
              <Typewriter
                words={[
                  "AI-Powered Security",
                  "Real-Time Detection",
                  "SQL Injection Defense",
                  "Built for Developers",
                ]}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={2000}
              />
            </h2>
          </div>
        </div>
      </div>

      <div id="about" className="features-section">
        <h3> What Sets us Apart? </h3>
        <h2> Not Just Another Security Scanner </h2>
        <div className="features-grid-about">
          {aboutus.slice(0, 3).map((plan, idx) => (
            <div className="feature-card" key={idx}>
              <FontAwesomeIcon
                icon={plan.icon}
                size="2x"
                style={{
                  backgroundColor: "transparent",
                  marginBottom: "0.5rem",
                  color: "#7393B3",
                  height: "80px",
                  width: "100px",
                }}
              />
              <h3>{plan.title}</h3>
              <p>{plan.description}</p>
            </div>
          ))}
        </div>
        <div
          className="features-grid-about"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            marginTop: "24px",
          }}
        >
          {aboutus.slice(3).map((plan, idx) => (
            <div className="feature-card" key={idx}>
              <FontAwesomeIcon
                icon={plan.icon}
                size="2x"
                style={{
                  backgroundColor: "transparent",
                  marginBottom: "0.5rem",
                  color: "#7393B3",
                  height: "80px",
                  width: "100px",
                }}
              />
              <h3>{plan.title}</h3>
              <p>{plan.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div id="how-it-works" className="features-section">
        <h3>How It Works</h3>
        <div className="features-grid">
          {steps.map((step, idx) => (
            <div className="feature-card" key={idx}>
              <FontAwesomeIcon
                icon={step.icon}
                size="2x"
                style={{
                  backgroundColor: "transparent",
                  marginBottom: "0.5rem",
                  color: "#7393B3",
                  height: "80px",
                  width: "100px",
                }}
              />
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div id="pricing" className="pricing-section">
        <h3 className="pricing-heading">Pricing</h3>
        <div className="pricing-grid pricing-grid-horizontal">
          <div className="pricing-content-wrapper">
            <div className="pricing-left-box">
              <FontAwesomeIcon
                icon={faUserShield}
                size="3x"
                style={{
                  backgroundColor: "transparent",
                  marginBottom: "0.5rem",
                  color: "#7393B3",
                  height: "80px",
                  width: "100px",
                }}
              />
              <h3 className="pricing-price">$15 / month</h3>
              <h4> Real-time protection with Advanced SQL detection </h4>
            </div>
            <div className="pricing-right-content">
              <h3 className="pricing-title">Premium Features</h3>
              <ul className="pricing-feature-list">
                <li>Most Recent SQL injection attempt queries</li>
                <li>Most Common SQL injection attempt queries</li>
                <li>Most recent and common IPs attempting SQL Injection</li>
                <li>Top attacking IPs and endpoints</li>
                <li>Daily Attack count</li>
                <li>Most Recent IP Connections</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div id="contact" className="contact-container">
        <h2 className="contact-heading">Contact Us</h2>
        <h3>
          Email: <strong>queryguardians@gmail.com</strong>
        </h3>
        <h3>University of California Irvine, CA</h3>

        <div className="team-cards">
          {teamInfo.map((info, idx) => (
            <div className="team-card" key={idx}>
              <img src={info.img} alt={info.title} className="team-img" />
              <h3>{info.title}</h3>
              <p>{info.description}</p>
              <p>{info.email}</p>
            </div>
          ))}
        </div>
      </div>
      <footer>
        <p>&copy; 2025 QueryGuard. All rights reserved.</p>
      </footer>
    </div>
  );
}
