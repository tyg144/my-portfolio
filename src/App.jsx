import { useRef } from 'react'
import './index.css'

function App() {

  const photoRef = useRef(null)

  const handlePhotoMove = (e) => {
    const card = photoRef.current

    if (!card) return

    const rect = card.getBoundingClientRect()

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateY = ((x - centerX) / centerX) * 10
    const rotateX = ((centerY - y) / centerY) * 10

    const moveX = ((x - centerX) / centerX) * 8
    const moveY = ((y - centerY) / centerY) * 8

    card.style.transform = `
      perspective(900px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translate(${moveX}px, ${moveY}px)
      scale(1.03)
    `
  }

  const handlePhotoLeave = () => {
    const card = photoRef.current

    if (!card) return

    card.style.transform = `
      perspective(900px)
      rotateX(0deg)
      rotateY(0deg)
      translate(0px, 0px)
      scale(1)
    `
  }

  return (
    <div className="portfolio">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <div className="logo">
          TY.
        </div>

        <div className="nav-links">

          <a href="#home">
            Home
          </a>

          <a href="#about">
            About
          </a>

          <a href="#skills">
            Skills
          </a>

          <a href="#contact">
            Contact
          </a>

        </div>

      </nav>


      {/* ================= HERO ================= */}

      <section id="home" className="hero">

        <div className="hero-content">

          <p className="hello">
            HELLO, I'M
          </p>

          <h1>
            tyG
          </h1>

          <h2>
            Entrepreneur ♠
          </h2>

          <p className="description">
            - an entrepreneur, dentist technician and trader. I build
            businesses, explore, and approach the markets with discipline.
          </p>

          <div className="hero-buttons">

            <a
              href="#contact"
              className="button primary"
            >
              WORK WITH US
            </a>

            <a
              href="#about"
              className="button secondary"
            >
              ABOUT ME
            </a>

          </div>

        </div>


        {/* ================= INTERACTIVE PHOTO ================= */}

        <div className="hero-image">

          <div
            className="photo-card"
            ref={photoRef}
            onMouseMove={handlePhotoMove}
            onMouseLeave={handlePhotoLeave}
          >

            <img
              src="/photo.jpg"
              alt="Ty"
              className="profile-photo"
            />

          </div>

        </div>

      </section>


      {/* ================= ABOUT ================= */}

      <section id="about" className="section">

        <p className="section-label">
          01 — ABOUT
        </p>

        <h2 className="section-title">
          About
        </h2>

        <div className="about-content">

          <div className="about-text">

            <p>
              Dentist by profession. Trader by passion.
              I work with precision in dentistry and discipline in the markets.
            </p>

            <p>
              Different fields, same mindset — stay sharp, manage risk,
              and never stop improving.
            </p>

          </div>


          <div className="about-info">

            <div className="info-item">

              <span>
                Based in
              </span>

              <strong>
                Cambodia
              </strong>

            </div>


            <div className="info-item">

              <span>
                Focus
              </span>

              <strong>
                Trader | Dentist | Investor
              </strong>

            </div>


            <div className="info-item">

              <span>
                Available for
              </span>

              <strong>
                New Opportunities
              </strong>

            </div>

          </div>

        </div>

      </section>


      {/* ================= SKILLS ================= */}

      <section id="skills" className="section">

        <p className="section-label">
          02 — SKILLS
        </p>

        <h2 className="section-title">
          Skills
        </h2>


        <div className="skills-grid">

          <div className="skill-card">

            <span className="skill-number">
              01
            </span>

            <h3>
              Financial Markets 𖠿
            </h3>

            <p>
              Analyzing market structure, price action, liquidity,
              and trading opportunities.
            </p>

          </div>


          <div className="skill-card">

            <span className="skill-number">
              02
            </span>

            <h3>
              Dentistry ⛑︎
            </h3>

            <p>
              Providing patient-focused dental care with precision,
              attention to detail, and continuous learning.
            </p>

          </div>


          <div className="skill-card">

            <span className="skill-number">
              03
            </span>

            <h3>
              Trading & Risk Management ₿
            </h3>

            <p>
              Developing disciplined strategies with proper risk
              management and execution.
            </p>

          </div>


          <div className="skill-card">

            <span className="skill-number">
              04
            </span>

            <h3>
              Research & Thesis ⌕
            </h3>

            <p>
              Turning ideas and problems into practical solutions.
            </p>

          </div>

        </div>

      </section>


      {/* ================= CONTACT ================= */} <section id="contact" className="section"> <p className="section-label"> 03 — CONTACT </p> <h2 className="section-title"> Contact </h2> <div className="contact-content"> <p className="contact-description"> Got a vision? Let’s build Quiet Empires. </p> <div className="contact-buttons"> <a href="https://www.instagram.com/144tyg/" target="_blank" rel="noopener noreferrer" className="button primary" > Contact Us </a> <a href="https://web.facebook.com/chmatrades" target="_blank" rel="noopener noreferrer" className="button secondary" > Facebook Page </a> </div> </div> </section>


      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <strong>
          AKA 144.
        </strong>

        <p>
          © 2026 GONWILD TEAM
        </p>

      </footer>

    </div>
  )
}

export default App