import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/InfoPage.css";
import { Typewriter } from "react-simple-typewriter";

const steps = [
  {
    title: "Install Middleware",
    description:
      "Add QueryGuard to your web app with a simple package install and import.",
  },
  {
    title: "Start Logging",
    description:
      "Capture requests in real-time which are automatically sent to  QueryGuard for analysis .",
  },
  {
    title: "Analyze Threats",
    description:
      "Use your dashboard to explore potential SQL injection attempts.",
  },
];

// add images to each of these
const aboutus = [
  {
    title: "BERT-Based ML Detection",
    description:
      "QueryGuard uses the latest in natural language processing to enable us to catch obfuscated or unconventional attacks other tools miss.",
  },
  {
    title: "Real-Time Analytics Dashboard",
    description:
      "QueryGuard’s live dashboard gives users and admins clear visibility into who, when, and how attacks are attempted.",
  },
  {
    title: "Plug-and-Play Architecture",
    description:
      " No code rewrites, no deep integrations. Hosting platforms can deploy QueryGuard via a simple and package.",
  },
  {
    title: "Designed for Integration",
    description:
      "Whether as an add-on, bundled feature, or part of a custom tier, it adapts to your business model—not the other way around.",
  },
  {
    title: "Focused on Value, Not Complexity.",
    description:
      "We skip the jargon, steep learning curves, and bloated UIs. What’s left is a clean, modern solution that works quietly in the background",
  },
];

const pricingPlans = [
  {
    title: "Free",
    description: "Basic logging and alerts",
    price: "$0",
  },
  {
    title: "Pro",
    description: "Advanced analytics and ML detection",
    price: "$15/mo",
  },
  {
    title: "Enterprise",
    description: "Custom integrations & priority support",
    price: "TBD",
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
          <a href="#features">Features </a>
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
            <img src={logo} alt="QueryGuard Logo" className="h-10 w-auto" />
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
              <h3>{plan.title}</h3>
              <p>{plan.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div id="features" className="features-section">
        <h3>Features</h3>
        <div className="features-grid-features">
          <div className="feature-card">
            <h3>ML-Powered Detection</h3>
            <p>Advanced AI models detect SQL injection threats in real-time.</p>
            {/* ML-image(gear working) */}
          </div>
          <div className="feature-card">
            <h3>Real-Time Analytics</h3>
            <p>Monitor visitor logs and suspicious activities instantly.</p>
            {/* clock image */}
          </div>
          <div className="feature-card">
            <h3>Easy API Integration</h3>
            <p>Supports custom log formats.</p>
            {/* api image */}
          </div>
          <div className="feature-card">
            <h3>Lightning Fast</h3>
            <p>Optimized for speed without affecting site performance.</p>
            {/* some image */}
          </div>
          <div className="feature-card">
            <h3>Instant Alerts</h3>
            <p>Get notified of potential SQLi attacks immediately.</p>
            {/* alerts image */}
          </div>
          <div className="feature-card">
            <h3>Customizable Rules</h3>
            <p>Fine-tune settings to fit your security needs.</p>
            {/* some image */}
          </div>
        </div>
      </div>
      <div id="how-it-works" className="features-section">
        <h3>How It Works</h3>
        <div className="features-grid">
          {steps.map((step, idx) => (
            <div className="feature-card" key={idx}>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div id="pricing" className="features-section">
        <h3>Pricing</h3>
        <div className="features-grid">
          {pricingPlans.map((plan, idx) => (
            <div className="feature-card" key={idx}>
              <h3>{plan.title}</h3>
              <p>{plan.description}</p>
              <p>{plan.price}</p>
            </div>
          ))}
        </div>
      </div>
      <div id="contact" className="features-section">
        <h3>Contact Us</h3>
        <div className="features-grid">
          <div className="feature-card">
            <p className="text-gray-300 mb-2">Email: support@qg.com</p>
            <p className="text-gray-300 mb-2">Phone: +1 (555) 123-4567</p>
            <p className="text-gray-300">
              Address: University of California Irvine, CA
            </p>
          </div>
        </div>
      </div>
      <footer>
        <p>&copy; 2025 QueryGuard. All rights reserved.</p>
      </footer>
    </div>
  );
}
