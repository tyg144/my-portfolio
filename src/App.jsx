import { useRef, useEffect, useState } from 'react'
import { createParticleOrb } from './ParticleOrb'
import './index.css'
import MusicPlayer from './MusicPlayer'
import CustomCursor from './CustomCursor'
import LoadingScreen from './LoadingScreen'

function ParticleOrbBackground() {
  const containerRef = useRef(null)
  const [cambodiaTime, setCambodiaTime] = useState('')

  // Live Cambodia clock — updates every second
  useEffect(() => {
    const updateTime = () => {
      const time = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Phnom_Penh',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
      }).format(new Date())

      setCambodiaTime(time)
    }

    updateTime()

    const timer = setInterval(updateTime, 1000)

    return () => clearInterval(timer)
  }, [])

  // Keep the existing large particle orb
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const destroy = createParticleOrb(container)

    return () => destroy()
  }, [])

  return (
    <div className="contact-orb-widget">
      <div className="contact-orb-timezone">
        <span className="timezone-dot" />
        <span>CAMBODIA — {cambodiaTime} GMT+7</span>
      </div>

      <div
        ref={containerRef}
        className="particle-orb-background"
      />
    </div>
  )
}

function App() {
  const photoRef = useRef(null)

  // Smooth reveal animations when scrolling
  useEffect(() => {
    const portfolio = document.querySelector('.portfolio')
    if (!portfolio) return

    const animatedElements = portfolio.querySelectorAll(
      '.hero-content, .hero-image, .section-label, .section-title, .about-text, .about-info, .skill-card, .experience-item, .contact-content, .footer'
    )

    animatedElements.forEach((element) => {
      element.classList.add('reveal-on-scroll')
    })

    // Respect the visitor's reduced-motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      animatedElements.forEach((element) => {
        element.classList.add('is-visible')
      })
      return
    }

    portfolio.classList.add('motion-ready')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )

    animatedElements.forEach((element) => {
      observer.observe(element)
    })

    return () => {
      observer.disconnect()
      portfolio.classList.remove('motion-ready')
    }
  }, [])

  // Existing interactive photo tilt
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
      <LoadingScreen />
      <CustomCursor />


      {/* ================= NAVBAR ================= */}

      <nav className="navbar">
        <div className="logo">TY.</div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* ================= HERO ================= */}

      <section id="home" className="hero">

        <div className="hero-content">
          <p className="hello">HELLO, I'M</p>

          <h1 className="glitch" data-text="tyG">
            tyG
          </h1>

          <h2 className="decade-title">
            The Next Decade ♠
          </h2>

          <p className="description">
            - an entrepreneur, dental technician, and trader. I build
            businesses, sharpen my skills, and make every move with
            purpose and discipline.
          </p>

          <div className="hero-buttons">
            <a href="#contact" className="button primary">
              WORK WITH US
            </a>

            <a href="#about" className="button secondary">
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
            {/* YOUR EXISTING PHOTO — KEEP IT */}
            <img
              src="/photo.jpg"
              alt="Ty"
              className="profile-photo"
            />


            {/* SPINNING DENTAL LOGO ONLY */}
            <div className="dental-spin-badge">
              <img
                src="/logo.png"
                alt="Dental logo"
                className="dental-spin-center"
              />
            </div>


          </div>
        </div>
      </section>


      {/* ================= ABOUT ================= */}

      <section id="about" className="section">
        <p className="section-label">01 — ABOUT</p>

        <h2 className="section-title">About</h2>

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
              <span>Based in</span>
              <strong>Cambodia</strong>
            </div>

            <div className="info-item">
              <span>Focus</span>
              <strong>Trader | Dentist | Investor</strong>
            </div>

            <div className="info-item">
              <span>Available for</span>
              <strong>New Opportunities</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SKILLS ================= */}

      <section id="skills" className="section">
        <p className="section-label">02 — SKILLS</p>

        <h2 className="section-title">Skills</h2>

        <div className="skills-grid">
          <div className="skill-card">
            <span className="skill-number">01</span>
            <h3>Financial Markets <span className="skill-symbol">𖠿</span></h3>
            <p>
              Analyzing market structure, price action, liquidity,
              and trading opportunities.
            </p>
          </div>

          <div className="skill-card">
            <span className="skill-number">02</span>
            <h3>Dentistry <span className="skill-symbol">⛑︎</span></h3>
            <p>
              Providing patient-focused dental care with precision,
              attention to detail, and continuous learning.
            </p>
          </div>

          <div className="skill-card">
            <span className="skill-number">03</span>
            <h3>Trading &amp; Risk Management <span className="skill-symbol">₿</span></h3>
            <p>
              Developing disciplined strategies with proper risk
              management and execution.
            </p>
          </div>

          <div className="skill-card">
            <span className="skill-number">04</span>
            <h3>Research &amp; Thesis <span className="skill-symbol">⌕</span></h3>
            <p>
              Turning ideas and problems into practical solutions.
            </p>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="section experience-section">
        <p className="section-label">03 — EXPERIENCE</p>
        <h2 className="section-title">Where I’ve Been.</h2>

        <div className="experience-list">

          {/* CURRENT / FEATURED ROLE */}
          <article className="experience-item">
            <p className="experience-date">
              <span className="current-badge">
                <span className="current-dot"></span>
                <span>CURRENT</span>
              </span>
            </p>


            <div className="experience-details">
              <h3>Dental CAD/CAM Technician</h3>

              <p className="experience-description">
                Designing and producing custom dental restorations using digital workflows and CAD/CAM technology. Focused on accurate margin design, occlusion, material selection, and restoration quality.
              </p>

              <div className="experience-tags">
                <span>Exocad</span>
                <span>MillBox</span>
                <span>Zirconia</span>
                <span>3D Dental Design</span>
              </div>
            </div>
          </article>

          {/* FULL-STACK DEVELOPER */}
          <article className="experience-item">
            <p className="experience-date">JUN 2022 — FEB 2024</p>

            <div className="experience-details">
              <h3>Full-Stack Developer</h3>

              <p className="experience-description">
                Built and shipped 3 major product features end-to-end.
                Introduced automated testing with PHPUnit and Jest,
                increasing test coverage from 12% to 78%.
              </p>

              <div className="experience-tags">
                <span>PHP</span>
                <span>JavaScript</span>
                <span>PHPUnit</span>
                <span>Jest</span>
              </div>
            </div>
          </article>

          {/* GAME MOD MENU DEVELOPER */}
          <article className="experience-item">
            <p className="experience-date">SEP 2019 — MAY 2024</p>

            <div className="experience-details">
              <h3>Game Mod Menu Developer</h3>
              <p className="experience-company">
                Independent <span>· Home-based</span>
              </p>

              <p className="experience-description">
                Built mod menus for various games and developed
                practical Lua scripting skills along the way.
              </p>

              <div className="experience-tags">
                <span>Lua</span>
                <span>Game Modder</span>
              </div>
            </div>
          </article>

        </div>
      </section>

      {/* ================= CONTACT ================= */}

      <section id="contact" className="section">
        <ParticleOrbBackground />

        <p className="section-label">03 — CONTACT</p>

        <h2 className="section-title">Let's Talk</h2>

        <div className="contact-content">
          <p className="contact-description">
            Got a vision? Let’s build Quiet Empires.
          </p>

          <div className="contact-buttons">
            <a
              href="https://www.instagram.com/144tyg/"
              target="_blank"
              rel="noopener noreferrer"
              className="button primary"
            >
              Contact Us
            </a>

            <a
              href="https://web.facebook.com/chmatrades"
              target="_blank"
              rel="noopener noreferrer"
              className="button secondary"
            >
              Facebook Page
            </a>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer className="footer">
        <strong>AKA 144.</strong>
        <p>© 2026 GONWILD TEAM</p>
      </footer>

      <MusicPlayer />

    </div>
  )
}

export default App