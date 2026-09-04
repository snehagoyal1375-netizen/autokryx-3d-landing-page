import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import "./App.css";

const GOLD = "#D4AF37";

/* =========================================
   3D — NEURAL PARTICLES
========================================= */

function NeuralParticles({ scrollProgress }) {
  const group = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (!group.current) return;

    group.current.rotation.y =
      t * 0.035 +
      state.pointer.x * 0.08 +
      scrollProgress * Math.PI * 0.7;

    group.current.rotation.x =
      Math.sin(t * 0.18) * 0.08 +
      state.pointer.y * 0.05 +
      scrollProgress * 0.25;
  });

  return (
    <group ref={group}>
      <Sparkles
        count={90}
        scale={[5.5, 5.5, 5.5]}
        size={2}
        speed={0.18}
        color={GOLD}
        opacity={0.55}
      />
    </group>
  );
}

/* =========================================
   3D — DATA RING
========================================= */

function DataRing({
  radius = 1.65,
  rotation = [0, 0, 0],
  speed = 0.35,
  scrollProgress = 0,
}) {
  const ring = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (!ring.current) return;

    ring.current.rotation.z =
      rotation[2] +
      t * speed +
      state.pointer.x * 0.12 +
      scrollProgress * 1.4;

    ring.current.rotation.x =
      rotation[0] +
      Math.sin(t * 0.3) * 0.08 +
      state.pointer.y * 0.08 +
      scrollProgress * 0.35;
  });

  return (
    <mesh ref={ring} rotation={rotation}>
      <torusGeometry args={[radius, 0.018, 8, 64]} />
      <meshBasicMaterial color={GOLD} transparent opacity={0.65} />
    </mesh>
  );
}

/* =========================================
   3D — AI CORE
========================================= */

function AICore({ scrollProgress, tilt }) {
  const core = useRef();
  const inner = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    const pointerX = state.pointer.x;
    const pointerY = state.pointer.y;

    if (core.current) {
      core.current.rotation.y =
        t * 0.28 +
        pointerX * 0.32 +
        scrollProgress * Math.PI * 1.5 +
        tilt.x * 0.35;

      core.current.rotation.x =
        Math.sin(t * 0.22) * 0.12 +
        pointerY * 0.22 +
        scrollProgress * 0.45 +
        tilt.y * 0.3;

      core.current.position.x =
        pointerX * 0.1 +
        tilt.x * 0.08;

      core.current.position.y =
        Math.sin(t * 0.65) * 0.06 +
        pointerY * 0.06 +
        tilt.y * 0.08;

      core.current.position.z =
        scrollProgress * 0.18;
    }

    if (inner.current) {
      inner.current.rotation.y =
        -t * 0.45 +
        pointerX * 0.15 +
        scrollProgress * 1.8;

      inner.current.rotation.x =
        t * 0.18 +
        pointerY * 0.12 +
        scrollProgress * 0.4;
    }
  });

  return (
    <group ref={core}>
      <mesh>
        <sphereGeometry args={[1.18, 32, 32]} />

        <MeshDistortMaterial
          color={GOLD}
          roughness={0.24}
          metalness={0.78}
          distort={0.16}
          speed={1.15}
        />
      </mesh>

      <mesh ref={inner} scale={0.72}>
        <icosahedronGeometry args={[1, 2]} />

        <meshBasicMaterial
          color="#F4D97A"
          wireframe
          transparent
          opacity={0.72}
        />
      </mesh>

      <DataRing
        radius={1.48}
        rotation={[Math.PI / 2.8, 0.2, 0]}
        speed={0.34}
        scrollProgress={scrollProgress}
      />

      <DataRing
        radius={1.72}
        rotation={[0.6, Math.PI / 2.8, 0]}
        speed={-0.25}
        scrollProgress={scrollProgress}
      />

      <DataRing
        radius={1.92}
        rotation={[1.2, 0.3, 0.8]}
        speed={0.18}
        scrollProgress={scrollProgress}
      />
    </group>
  );
}

/* =========================================
   3D — HERO SCENE
========================================= */

function HeroScene({ scrollProgress, tilt }) {
  return (
    <Canvas
      camera={{
        position: [0, 0, 5.2],
        fov: 38,
      }}
      dpr={[1, 1.25]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      performance={{ min: 0.55 }}
    >
      <ambientLight intensity={1.3} />

      <directionalLight
        position={[3, 4, 5]}
        intensity={2.2}
      />

      <pointLight
        position={[-3, 1, 2]}
        intensity={2}
        color="#F4D97A"
      />

      <AICore
        scrollProgress={scrollProgress}
        tilt={tilt}
      />

      <NeuralParticles
        scrollProgress={scrollProgress}
      />
    </Canvas>
  );
}

/* =========================================
   HERO DATA PANEL
========================================= */

function HeroDataPanel() {
  const [activity, setActivity] = useState(74.4);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivity((value) => {
        const next =
          value + (Math.random() - 0.5) * 4;

        return Math.min(
          94,
          Math.max(58, next)
        );
      });
    }, 1600);

    return () => clearInterval(interval);
  }, []);

  const bars = [
    30, 42, 55, 68, 48, 75, 58,
    38, 51, 70, 45, 62, 34, 48,
  ];

  return (
    <div className="heroDataPanel">
      <div className="dataPanelTop">
        <div>
          <span className="dataTiny">
            AUTOKRYX / CORE
          </span>

          <strong>
            INTELLIGENCE ENGINE
          </strong>
        </div>

        <span className="dataLive">
          LIVE
        </span>
      </div>

      <div className="dataPanelLine" />

      <div className="dataMetric">
        <div>
          <span>MODEL ACTIVITY</span>

          <strong>
            {activity.toFixed(1)}%
          </strong>
        </div>

        <div className="metricBars">
          {bars.map((height, index) => (
            <i
              key={index}
              className={
                index < 10
                  ? "active"
                  : ""
              }
              style={{
                height: `${Math.max(
                  22,
                  height +
                    Math.sin(
                      activity + index
                    ) *
                      8
                )}%`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="dataRows">
        <div>
          <span>PROCESSING</span>
          <b>ACTIVE</b>
        </div>

        <div>
          <span>LATENCY</span>
          <b>12.4 ms</b>
        </div>

        <div>
          <span>NETWORK</span>
          <b>SECURE</b>
        </div>
      </div>

      <div className="dataSignal">
        <div className="signalHeader">
          <span>
            INTELLIGENCE SIGNAL
          </span>

          <span>01 / 04</span>
        </div>

        <div className="signalTrack">
          <span />
        </div>
      </div>

      <div className="dataFooter">
        <span>
          AI-NATIVE ARCHITECTURE
        </span>

        <span>• ONLINE</span>
      </div>
    </div>
  );
}

/* =========================================
   MAIN APP
========================================= */

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [scrollProgress, setScrollProgress] =
    useState(0);

  const [tilt, setTilt] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.scrollY;

      const maxScroll =
        document.documentElement
          .scrollHeight -
        window.innerHeight;

      const progress =
        maxScroll > 0
          ? scrollTop / maxScroll
          : 0;

      setScrollProgress(
        Math.min(1, Math.max(0, progress))
      );
    };

    const handlePointer = (event) => {
      const x =
        event.clientX /
          window.innerWidth -
        0.5;

      const y =
        event.clientY /
          window.innerHeight -
        0.5;

      setTilt({
        x: x * 2,
        y: y * -2,
      });
    };

    const handleTouch = (event) => {
      const touch =
        event.touches[0];

      if (!touch) return;

      const x =
        touch.clientX /
          window.innerWidth -
        0.5;

      const y =
        touch.clientY /
          window.innerHeight -
        0.5;

      setTilt({
        x: x * 2,
        y: y * -2,
      });
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    window.addEventListener(
      "pointermove",
      handlePointer,
      { passive: true }
    );

    window.addEventListener(
      "touchmove",
      handleTouch,
      { passive: true }
    );

    handleScroll();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );

      window.removeEventListener(
        "pointermove",
        handlePointer
      );

      window.removeEventListener(
        "touchmove",
        handleTouch
      );
    };
  }, []);

  return (
    <div className="site">

      {isLoading && (
        <div className="sitePreloader" aria-label="Loading Autokryx">
          <div className="preloaderMark">AUTO<span>KRYX</span></div>
          <div className="preloaderLine"><span /></div>
          <div className="preloaderLabel">INITIALIZING INTELLIGENCE / 01</div>
        </div>
      )}

      {/* =====================================
          NAVIGATION
      ====================================== */}

      <nav className="navbar">
        <a
          href="#top"
          className="brand"
        >
          AUTO<span>KRYX</span>
        </a>

        <div className="navLinks">
          <a href="#company">
            Company
          </a>

          <a href="#products">
            Products
          </a>

          <a href="#technology">
            Technology
          </a>

          <a href="#opportunity">
            Opportunity
          </a>

          <a href="#corporate">
            Corporate
          </a>

          <a href="#contact">
            Contact
          </a>

          <a
            href="https://getinside.in/"
            target="_blank"
            rel="noreferrer"
            className="insideBtn"
          >
            INSIDE ↗
          </a>
        </div>
      </nav>

      <main id="top">

        {/* =====================================
            HERO
        ====================================== */}

        <section className="hero section">

          <div className="heroGrid">

            <div className="heroContent">

              <div className="eyebrow">
                <span className="eyebrowDot" />
                TECHNOLOGY BUILT FOR ONE BILLION.
              </div>

              <h1 className="heroTitle">
                BUILDING
                <span>
                  THE
                </span>
                <span className="gold">
                  INTELLIGENCE
                </span>
                <span>
                  LAYER OF
                </span>
                <span>
                  TOMORROW.
                </span>
              </h1>

              <p className="heroDescription">
                Autokryx Technologies is a
                consumer technology company
                headquartered in Delhi NCR.
                We identify where digital
                infrastructure is missing
                and build platforms that fill
                those gaps — at scale, with
                precision, and built for the
                long term.
              </p>

              <div className="heroButtons">
                <a
                  href="#products"
                  className="btn btnDark"
                >
                  Explore Products
                  <span>↗</span>
                </a>

                <a
                  href="#company"
                  className="btn btnLight"
                >
                  Corporate Profile
                </a>
              </div>

            </div>

            <div className="hero3D">

              <div className="hero3DLabel hero3DLabelTop">
                <span className="statusDot" />
                AI CORE / ONLINE
              </div>

              <HeroScene
                scrollProgress={
                  scrollProgress
                }
                tilt={tilt}
              />

              <HeroDataPanel />

              <div className="hero3DLabel hero3DLabelBottom">
                <span>01</span>
                INFRASTRUCTURE • IDENTITY • INTELLIGENCE
              </div>

            </div>

          </div>

          <div className="heroBottomMeta">
            <span>INFRASTRUCTURE</span>
            <i />
            <span>IDENTITY</span>
            <i />
            <span>INTELLIGENCE</span>
          </div>

        </section>

        {/* =====================================
            COMPANY
        ====================================== */}

        <section
          id="company"
          className="section companySection"
        >

          <div className="sectionHeader">
            <span className="sectionNumber">
              01
            </span>

            <span className="sectionLabel">
              COMPANY
            </span>
          </div>

          <div className="companyGrid">

            <h2>
              WE BUILD
              <br />
              THE PLATFORMS
              <br />
              <span>
                INDIA RUNS ON.
              </span>
            </h2>

            <div className="companyText">

              <p>
                Autokryx Technologies is a
                consumer technology company
                headquartered in Delhi NCR.
                We identify where digital
                infrastructure is missing
                and build platforms that fill
                those gaps — at scale, with
                precision, and built for the
                long term.
              </p>

              <div className="companyPrinciples">

                <article>
                  <span>01</span>
                  <div>
                    <h3>
                      Consumer Technology
                    </h3>

                    <p>
                      We build products that
                      end users interact with
                      daily. Our products are
                      designed for real
                      behaviour — built on deep
                      understanding of how
                      India's digital consumers
                      think and move.
                    </p>
                  </div>
                </article>

                <article>
                  <span>02</span>
                  <div>
                    <h3>
                      Scalable Infrastructure
                    </h3>

                    <p>
                      Every platform is
                      engineered to grow from
                      1,000 to 100 million users
                      without architectural
                      overhaul. We think in
                      systems, not features —
                      and build infrastructure
                      that compounds over time.
                    </p>
                  </div>
                </article>

                <article>
                  <span>03</span>
                  <div>
                    <h3>
                      Verified Identity
                    </h3>

                    <p>
                      Across every product
                      vertical, we embed real
                      identity at the foundation.
                      Verified communities create
                      trust. Trust creates
                      engagement. Engagement
                      creates lasting value.
                    </p>
                  </div>
                </article>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================
            PRODUCTS
        ====================================== */}

        <section
          id="products"
          className="section productsSection"
        >

          <div className="sectionHeader">
            <span className="sectionNumber">
              02
            </span>

            <span className="sectionLabel">
              PRODUCTS
            </span>
          </div>

          <div className="productsIntro">

            <h2>
              PRODUCT
              <br />
              <span>
                VERTICALS.
              </span>
            </h2>

          </div>

          <div className="productsList">

            <motion.article
              className="productCard"
              whileHover={{
                y: -8,
              }}
            >
              <div className="productNumber">
                01
              </div>

              <div className="productMain">
                <div className="productTag">
                  ACTIVE
                </div>

                <h3>
                  INSIDE
                </h3>

                <p>
                  India's first verified
                  private social network for
                  college students. INSIDE
                  gives 40 million campus
                  students a space that is
                  entirely their own —
                  verified identities,
                  institution-scoped
                  communities, and zero
                  noise from the outside
                  world.
                </p>

                <a
                  href="https://getinside.in/"
                  target="_blank"
                  rel="noreferrer"
                  className="textLink"
                >
                  VISIT INSIDE ↗
                </a>
              </div>

              <div className="productArrow">
                ↗
              </div>
            </motion.article>

            <motion.article
              className="productCard"
              whileHover={{
                y: -8,
              }}
            >
              <div className="productNumber">
                02
              </div>

              <div className="productMain">
                <div className="productTag">
                  IN DEVELOPMENT
                </div>

                <h3>
                  KRYX
                </h3>

                <p>
                  A permissioned blockchain
                  infrastructure layer enabling
                  verified digital identity,
                  immutable credential
                  attestation, and trustless
                  data exchange — powering
                  institutional-grade trust
                  across Autokryx's product
                  ecosystem and partner
                  networks.
                </p>

                <a
                  href="#contact"
                  className="textLink"
                >
                  PARTNER ENQUIRY ↗
                </a>
              </div>

              <div className="productArrow">
                ↗
              </div>
            </motion.article>

            <motion.article
              className="productCard"
              whileHover={{
                y: -8,
              }}
            >
              <div className="productNumber">
                03
              </div>

              <div className="productMain">
                <div className="productTag">
                  AI INTELLIGENCE
                </div>

                <h3>
                  REDAKX AI
                </h3>

                <p>
                  AI-powered intelligence
                  infrastructure designed to
                  transform complex information
                  into useful, actionable
                  knowledge for modern digital
                  systems.
                </p>

                <a
                  href="#contact"
                  className="textLink"
                >
                  EXPLORE ↗
                </a>
              </div>

              <div className="productArrow">
                ↗
              </div>
            </motion.article>

            <motion.article
              className="productCard"
              whileHover={{
                y: -8,
              }}
            >
              <div className="productNumber">
                04
              </div>

              <div className="productMain">
                <div className="productTag">
                  PLANNED
                </div>

                <h3>
                  NEXUS
                </h3>

                <p>
                  Community infrastructure
                  for verified professional and
                  social networks — beyond
                  campus, beyond a single
                  vertical. NEXUS will bring
                  Autokryx's identity-first
                  approach to every structured
                  community in India.
                </p>

                <a
                  href="#contact"
                  className="textLink"
                >
                  EXPRESSION OF INTEREST ↗
                </a>
              </div>

              <div className="productArrow">
                ↗
              </div>
            </motion.article>

            <motion.article
              className="productCard"
              whileHover={{
                y: -8,
              }}
            >
              <div className="productNumber">
                05
              </div>

              <div className="productMain">
                <div className="productTag">
                  ROADMAP
                </div>

                <h3>
                  VAULT
                </h3>

                <p>
                  Financial services embedded
                  natively within the Autokryx
                  product ecosystem — payments,
                  savings, and credit designed
                  specifically for the verified
                  communities our platforms
                  serve.
                </p>

                <a
                  href="#contact"
                  className="textLink"
                >
                  INVESTOR ENQUIRY ↗
                </a>
              </div>

              <div className="productArrow">
                ↗
              </div>
            </motion.article>

          </div>

        </section>

        {/* =====================================
            TECHNOLOGY
        ====================================== */}

        <section
          id="technology"
          className="section technologySection"
        >

          <div className="sectionHeader">
            <span className="sectionNumber">
              03
            </span>

            <span className="sectionLabel">
              TECHNOLOGY
            </span>
          </div>

          <div className="technologyGrid">

            <h2>
              BUILT
              <br />
              DIFFERENT.
              <br />
              <span>
                BY DESIGN.
              </span>
            </h2>

            <div className="technologyList">

              {[
                [
                  "I",
                  "Identity-Native Architecture",
                ],
                [
                  "II",
                  "Network Effect Engine",
                ],
                [
                  "III",
                  "Privacy-First Infrastructure",
                ],
                [
                  "IV",
                  "India-Scale Engineering",
                ],
              ].map(
                ([number, title]) => (
                  <div
                    className="technologyItem"
                    key={number}
                  >
                    <span>
                      {number}
                    </span>

                    <strong>
                      {title}
                    </strong>

                    <span>
                      ↗
                    </span>
                  </div>
                )
              )}

            </div>

          </div>

        </section>

        {/* =====================================
            STATS
        ====================================== */}

        <section className="statsSection">

          <div className="stat">
            <span>01</span>
            <strong>
              IDENTITY-NATIVE
            </strong>
          </div>

          <div className="stat">
            <span>02</span>
            <strong>
              NETWORK EFFECT
            </strong>
          </div>

          <div className="stat">
            <span>03</span>
            <strong>
              PRIVACY-FIRST
            </strong>
          </div>

          <div className="stat">
            <span>04</span>
            <strong>
              INDIA-SCALE
            </strong>
          </div>

        </section>

        {/* =====================================
            OPPORTUNITY
        ====================================== */}

        <section
          id="opportunity"
          className="section opportunitySection"
        >

          <div className="sectionHeader">
            <span className="sectionNumber">
              04
            </span>

            <span className="sectionLabel">
              OPPORTUNITY
            </span>
          </div>

          <div className="opportunityContent">

            <h2>
              INDIA IS
              <br />
              THE
              <br />
              <span>
                OPPORTUNITY.
              </span>
            </h2>

            <div className="opportunityStats">

              <article>
                <strong>
                  900 M+
                </strong>

                <span>
                  INTERNET USERS IN INDIA
                  BY 2030
                </span>
              </article>

              <article>
                <strong>
                  40 M
                </strong>

                <span>
                  COLLEGE STUDENTS
                  UNDERSERVED TODAY
                </span>
              </article>

              <article>
                <strong>
                  $150 B
                </strong>

                <span>
                  INDIA CONSUMER TECH
                  MARKET SIZE (2025)
                </span>
              </article>

            </div>

          </div>

        </section>

        {/* =====================================
            CORPORATE
        ====================================== */}

        <section
          id="corporate"
          className="section corporateSection"
        >

          <div className="sectionHeader">
            <span className="sectionNumber">
              05
            </span>

            <span className="sectionLabel">
              CORPORATE
            </span>
          </div>

          <div className="corporateGrid">

            <h2>
              INCORPORATED.
              <br />
              COMPLIANT.
              <br />
              <span>
                BUILT TO ENDURE.
              </span>
            </h2>

            <div className="corporateDetails">

              <div>
                <span>
                  LEGAL STRUCTURE
                </span>

                <strong>
                  Private Limited Company
                </strong>
              </div>

              <div>
                <span>
                  GOVERNING LAW
                </span>

                <strong>
                  Companies Act, 2013 — India
                </strong>
              </div>

              <div>
                <span>
                  CIN
                </span>

                <strong>
                  U62012UW2026PTC250543
                </strong>
              </div>

              <div>
                <span>
                  REGULATOR
                </span>

                <strong>
                  Ministry of Corporate
                  Affairs · Government of India
                </strong>
              </div>

              <div>
                <span>
                  INDUSTRY CODE
                </span>

                <strong>
                  NIC 62012 · Information
                  Technology
                </strong>
              </div>

              <div>
                <span>
                  YEAR OF INCORPORATION
                </span>

                <strong>
                  2026
                </strong>
              </div>

              <div>
                <span>
                  COMPLIANCE STATUS
                </span>

                <strong>
                  Active · Fully Compliant
                </strong>
              </div>

            </div>

          </div>

        </section>

        {/* =====================================
            PARTNERS
        ====================================== */}

        <section className="section partnersSection">

          <div className="sectionHeader">
            <span className="sectionNumber">
              06
            </span>

            <span className="sectionLabel">
              PARTNERSHIPS
            </span>
          </div>

          <div className="partnersIntro">
            <h2>
              BUILT WITH
              <br />
              <span>
                THE BEST.
              </span>
            </h2>
          </div>

          <div className="partnersGrid">

            {[
              { name: "SARVAM AI", mark: "SA" },
              { name: "AWS", mark: "AWS" },
              { name: "NVIDIA", mark: "N" },
              { name: "MICROSOFT", mark: "MS" },
              { name: "DEEPGRAM", mark: "DG" },
            ].map((partner) => (
              <div className="partner" key={partner.name}>
                <span className="partnerMark" aria-hidden="true">
                  {partner.mark}
                </span>
                <span className="partnerName">{partner.name}</span>
                <span className="partnerLine" aria-hidden="true" />
              </div>
            ))}

          </div>

        </section>

        {/* =====================================
            VISION
        ====================================== */}

        <section id="vision" className="section visionSection">

          <div className="visionLabel">
            OUR VISION
          </div>

          <h2>
            FROM
            <br />
            <span>
              DELHI NCR
            </span>
            <br />
            TO INDIA.
          </h2>

          <div className="visionTimeline">

            <article>
              <span>I</span>

              <div>
                <h3>
                  Delhi NCR · Product-Market Fit
                </h3>

                <p>
                  Controlled launch of INSIDE
                  across select NCR institutions.
                  Proving the model, refining the
                  platform, building the playbook.
                </p>

                <small>
                  Active · 2026
                </small>
              </div>
            </article>

            <article>
              <span>II</span>

              <div>
                <h3>
                  North India · Network Expansion
                </h3>

                <p>
                  Scaling the proven playbook
                  across UP, Haryana, Rajasthan,
                  and Punjab. First 100+ institutions.
                  First 1M verified users.
                </p>

                <small>
                  2026–27
                </small>
              </div>
            </article>

            <article>
              <span>III</span>

              <div>
                <h3>
                  National · Platform Dominance
                </h3>

                <p>
                  Full national rollout. INSIDE
                  becomes the default social
                  infrastructure of Indian campus
                  life. KRYX and NEXUS enter beta.
                </p>

                <small>
                  2027
                </small>
              </div>
            </article>

            <article>
              <span>IV</span>

              <div>
                <h3>
                  Consumer Tech Conglomerate
                </h3>

                <p>
                  Multiple product verticals
                  operating at scale. Autokryx as
                  India's definitive consumer
                  technology infrastructure company.
                </p>
              </div>
            </article>

          </div>

        </section>

        {/* =====================================
            CAREERS
        ====================================== */}

        <section id="careers" className="section careersSection">

          <div className="sectionHeader">
            <span className="sectionNumber">
              07
            </span>

            <span className="sectionLabel">
              CAREERS
            </span>
          </div>

          <div className="careersGrid">

            <h2>
              BUILD
              <br />
              WHAT'S
              <br />
              <span>
                NEXT.
              </span>
            </h2>

            <div>
              <p>
                Multiple product verticals,
                intelligent infrastructure and
                India-scale engineering require
                people who want to build for the
                long term.
              </p>

              <a
                href="#contact"
                className="textLink"
              >
                START A CONVERSATION ↗
              </a>
            </div>

          </div>

        </section>

        {/* =====================================
            CONTACT
        ====================================== */}

        <section
          id="contact"
          className="section contactSection"
        >

          <div className="sectionHeader">
            <span className="sectionNumber">
              08
            </span>

            <span className="sectionLabel">
              CONTACT
            </span>
          </div>

          <div className="contactContent">

            <h2>
              BUILDING INDIA'S
              <br />
              CONSUMER TECHNOLOGY
              <br />
              <span>
                INFRASTRUCTURE.
              </span>
            </h2>

            <a
              href="mailto:contact@autokryx.in"
              className="contactEmail"
            >
              contact@autokryx.in
            </a>

          </div>

        </section>

      </main>

      {/* =====================================
          FOOTER
      ====================================== */}

      <footer className="footer">

        <div className="footerBrand">
          AUTO<span>KRYX</span>
        </div>

        <div className="footerDescription">
          Building India's consumer technology
          infrastructure. A registered Private
          Limited company under the Companies
          Act, 2013.
        </div>

        <div className="footerColumns">

          <div>
            <span>COMPANY</span>

            <a href="#company">
              About
            </a>

            <a href="#products">
              Products
            </a>

            <a href="#technology">
              Technology
            </a>

            <a href="#corporate">
              Corporate
            </a>

            <a href="#vision">
              Vision
            </a>

            <a href="#careers">
              Careers
            </a>
          </div>

          <div>
            <span>PRODUCTS</span>

            <a href="#products">
              INSIDE
            </a>

            <a href="#products">
              KRYX
            </a>

            <a href="#products">
              REDAKX AI
            </a>

            <a href="#products">
              NEXUS
            </a>

            <a href="#products">
              VAULT
            </a>
          </div>

          <div>
            <span>LEGAL</span>

            <a href="https://autokryx.in/privacy/" target="_blank" rel="noreferrer">
              Privacy Policy
            </a>

            <a href="https://autokryx.in/terms/" target="_blank" rel="noreferrer">
              Terms of Service
            </a>

            <a href="https://www.mca.gov.in/" target="_blank" rel="noreferrer">
              MCA Verified
            </a>

            <a href="#contact">
              Investor Relations
            </a>

            <a href="#contact">
              Press & Media
            </a>
          </div>

        </div>

        <div className="footerBottom">

          <span>
            © 2026 Autokryx Technologies
            Private Limited. All rights reserved.
          </span>

          <span>
            CIN: U62012UW2026PTC250543 ·
            Companies Act, 2013 · MCA ·
            Government of India
          </span>

        </div>

      </footer>

    </div>
  );
}

export default App;
