"use client";

import Image from "next/image";
import Link from "next/link";

const heroCards = [
  {
    key: "apl",
    src: "/logos/allocation.png",
    alt: "Logo Allocations familiales",
    title: "APL",
    text: "Aide au logement",
    className: "hero-card hero-card-apl",
  },
  {
    key: "crous",
    src: "/logos/logo-crouss.png",
    alt: "Logo Crous Lorraine",
    title: "CROUS",
    text: "Bourse & logement",
    className: "hero-card hero-card-crous",
  },
  {
    key: "sante",
    src: "/logos/assurance-maladie.png",
    alt: "Logo Sante",
    title: "Sante",
    text: "Securite sociale & mutuelle",
    className: "hero-card hero-card-sante",
  },
  {
    key: "impots",
    src: "/logos/finances-public.png",
    alt: "Logo Finances publiques",
    title: "Impots",
    text: "Declaration de revenus",
    className: "hero-card hero-card-impots",
  },
  {
    key: "transport",
    src: "/logos/reseau-stan.png",
    alt: "Logo Transport",
    title: "Transport",
    text: "Aides et abonnements",
    className: "hero-card hero-card-transport",
  },
];

const featureCards = [
  {
    src: "/logos/allocation.png",
    alt: "Logo Allocations familiales",
    title: "APL / CAF",
    text: "Aide au logement",
  },
  {
    src: "/logos/logo-crouss.png",
    alt: "Logo Crous Lorraine",
    title: "Bourse CROUS",
    text: "Jusqu'a 661EUR/mois",
  },
  {
    src: "/logos/reseau-stan.png",
    alt: "Logo Transport",
    title: "Aides transport",
    text: "Jusqu'a 75%",
  },
  {
    src: "/logos/assurance-maladie.png",
    alt: "Logo Sante",
    title: "Mutuelle",
    text: "Une complementaire sante",
  },
  {
    src: "/logos/finances-public.png",
    alt: "Logo Finances publiques",
    title: "Impots",
    text: "1re declaration de revenus",
  },
  {
    src: "/logos/assurance-habitation.jpg",
    alt: "Illustration assurance habitation",
    title: "Assurance habitation",
    text: "Obligatoire pour ton logement",
  },
];

const trustItems = [
  { title: "2 min", text: "en moyenne", icon: "◷" },
  { title: "Sans inscription", text: "100% gratuit", icon: "◌" },
  { title: "Sources officielles", text: "a jour et fiables", icon: "✓" },
];

function HeroInfoCard({
  src,
  alt,
  title,
  text,
  className,
}: {
  src: string;
  alt: string;
  title: string;
  text: string;
  className: string;
}) {
  return (
    <div className={className}>
      <div className="hero-card-logo">
        <Image src={src} alt={alt} width={74} height={74} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
      <div className="hero-card-copy">
        <p>{title}</p>
        <span>{text}</span>
      </div>
    </div>
  );
}

function FeatureCard({ src, alt, title, text }: { src: string; alt: string; title: string; text: string }) {
  return (
    <div className="feature-card">
      <div className="feature-logo">
        <Image src={src} alt={alt} width={64} height={64} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
      <div>
        <p className="feature-title">{title}</p>
        <p className="feature-text">{text}</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="landing-shell">
      <style>{`
        .landing-shell {
          width: 100%;
          background:
            radial-gradient(circle at 3% 40%, rgba(193, 142, 255, 0.58), transparent 13%),
            radial-gradient(circle at 50% 74%, rgba(255,255,255,0.96), transparent 18%),
            linear-gradient(180deg, #ffffff 0%, #f7f9ff 76%, #f5f8ff 100%);
        }

        .landing-inner {
          max-width: 1540px;
          margin: 0 auto;
          padding: 38px 28px 56px;
        }

        .hero {
          display: grid;
          grid-template-columns: minmax(470px, 560px) minmax(740px, 1fr);
          gap: 28px;
          align-items: stretch;
          min-height: 680px;
        }

        .hero-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 54px 0 42px 18px;
          position: relative;
          z-index: 2;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          width: fit-content;
          padding: 10px 16px;
          border-radius: 999px;
          background: rgba(255,255,255,0.88);
          color: #16b7b0;
          font-size: 17px;
          font-weight: 700;
          box-shadow: 0 10px 25px rgba(74, 96, 161, 0.08);
          margin-bottom: 28px;
        }

        .hero-title {
          margin: 0;
          color: #13245f;
          font-size: clamp(4rem, 6.1vw, 6.35rem);
          line-height: 0.98;
          letter-spacing: -0.07em;
          font-weight: 900;
        }

        .hero-title span {
          color: #4f79fb;
        }

        .hero-description {
          margin: 28px 0 0;
          max-width: 440px;
          color: #637091;
          font-size: 22px;
          line-height: 1.5;
        }

        .hero-cta {
          margin-top: 28px;
          width: fit-content;
        }

        .trust-row {
          display: flex;
          gap: 34px;
          flex-wrap: wrap;
          margin-top: 34px;
        }

        .trust-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .trust-icon {
          width: 28px;
          height: 28px;
          border-radius: 999px;
          border: 2px solid #4f79fb;
          color: #4f79fb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .trust-item p,
        .trust-item span {
          display: block;
          margin: 0;
        }

        .trust-item p {
          color: #23335f;
          font-size: 16px;
          font-weight: 700;
        }

        .trust-item span {
          color: #66759b;
          font-size: 15px;
          margin-top: 2px;
        }

        .hero-visual {
          position: relative;
          min-height: 650px;
          border-radius: 0 0 0 0;
          overflow: hidden;
          background:
            linear-gradient(90deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.08) 14%, rgba(255,255,255,0.02) 28%),
            linear-gradient(118deg, rgba(221,231,255,0.94) 0%, rgba(240,234,255,0.88) 54%, rgba(248,222,232,0.92) 100%);
          border-radius: 0 0 22px 22px;
          box-shadow: inset 0 24px 58px rgba(255,255,255,0.56);
        }

        .hero-visual::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 10% 72%, rgba(255,255,255,0.82), transparent 22%),
            radial-gradient(circle at 34% 30%, rgba(255,255,255,0.38), transparent 12%),
            radial-gradient(circle at 84% 20%, rgba(255,255,255,0.18), transparent 18%);
        }

        .hero-visual::after {
          content: "";
          position: absolute;
          inset: 20px 18px 24px;
          border-radius: 0 0 24px 24px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.02)),
            radial-gradient(circle at 72% 28%, rgba(255,255,255,0.16), transparent 18%);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.16);
          pointer-events: none;
        }

        .hero-wall-photo {
          position: absolute;
          inset: 32px 24px 32px;
          border-radius: 24px;
          background:
            radial-gradient(circle at 36% 12%, rgba(101, 84, 69, 0.2), transparent 11%),
            radial-gradient(circle at 80% 48%, rgba(255, 234, 208, 0.5), transparent 12%),
            linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02));
          overflow: hidden;
        }

        .hero-photo-card {
          position: absolute;
          width: 56px;
          height: 46px;
          border-radius: 8px;
          background: rgba(255,255,255,0.34);
          box-shadow: 0 8px 16px rgba(90, 100, 143, 0.08);
          border: 1px solid rgba(255,255,255,0.28);
        }

        .hero-lamp {
          position: absolute;
          right: 36px;
          bottom: 112px;
          width: 138px;
          height: 170px;
          transform: rotate(8deg);
          opacity: 0.82;
        }

        .hero-lamp::before {
          content: "";
          position: absolute;
          top: 0;
          right: 4px;
          width: 54px;
          height: 70px;
          border-radius: 26px 26px 14px 14px;
          background: linear-gradient(180deg, #fff1df 0%, #f4d3ac 100%);
          box-shadow: 0 8px 30px rgba(255, 228, 183, 0.5);
        }

        .hero-lamp::after {
          content: "";
          position: absolute;
          top: 48px;
          right: 34px;
          width: 4px;
          height: 118px;
          background: #d9c4af;
          border-radius: 999px;
        }

        .hero-person {
          position: absolute;
          right: 178px;
          bottom: 86px;
          width: 398px;
          height: 450px;
          z-index: 2;
        }

        .hero-head {
          position: absolute;
          top: 32px;
          left: 112px;
          width: 146px;
          height: 172px;
          border-radius: 44% 44% 46% 46%;
          background: linear-gradient(180deg, #f6cfb4 0%, #e9b58d 100%);
          z-index: 2;
        }

        .hero-hair {
          position: absolute;
          top: 0;
          left: 90px;
          width: 196px;
          height: 128px;
          border-radius: 48% 48% 40% 40%;
          background:
            radial-gradient(circle at 16% 24%, #4a2419 0 11%, transparent 12%),
            radial-gradient(circle at 32% 16%, #5f3122 0 14%, transparent 15%),
            radial-gradient(circle at 48% 18%, #3f1d14 0 12%, transparent 13%),
            radial-gradient(circle at 64% 16%, #552b1d 0 14%, transparent 15%),
            radial-gradient(circle at 80% 24%, #3d1c14 0 12%, transparent 13%),
            radial-gradient(circle at 18% 58%, #3d1c14 0 12%, transparent 13%),
            radial-gradient(circle at 38% 56%, #5f3122 0 14%, transparent 15%),
            radial-gradient(circle at 58% 58%, #4b2318 0 13%, transparent 14%),
            radial-gradient(circle at 78% 58%, #5c2f21 0 13%, transparent 14%),
            linear-gradient(180deg, #4f261a 0%, #2b130e 100%);
          z-index: 3;
        }

        .hero-eye,
        .hero-mouth {
          position: absolute;
          background: transparent;
        }

        .hero-eye {
          top: 94px;
          width: 16px;
          height: 6px;
          border-bottom: 2px solid #6f4031;
          border-radius: 999px;
        }

        .hero-eye-left {
          left: 44px;
        }

        .hero-eye-right {
          right: 44px;
        }

        .hero-mouth {
          left: 50%;
          bottom: 36px;
          width: 38px;
          height: 16px;
          transform: translateX(-50%);
          border-bottom: 3px solid #9c5b45;
          border-radius: 0 0 18px 18px;
        }

        .hero-hoodie {
          position: absolute;
          left: 46px;
          right: 32px;
          bottom: 66px;
          height: 228px;
          border-radius: 44% 44% 16% 16% / 34% 34% 18% 18%;
          background: linear-gradient(180deg, #5a90eb 0%, #2f67c6 100%);
          box-shadow: 0 18px 36px rgba(57, 100, 182, 0.24);
        }

        .hero-laptop {
          position: absolute;
          left: 56px;
          bottom: 0;
          width: 304px;
          height: 176px;
          border-radius: 22px 22px 12px 12px;
          background: linear-gradient(180deg, #f0d7c4 0%, #dcb89c 100%);
          border: 1px solid rgba(177, 134, 98, 0.42);
          box-shadow: 0 24px 44px rgba(115, 82, 56, 0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3c2316;
          font-size: 48px;
          font-weight: 800;
          letter-spacing: -0.08em;
          z-index: 4;
        }

        .hero-laptop::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: -14px;
          width: 342px;
          height: 16px;
          transform: translateX(-50%);
          border-radius: 999px;
          background: linear-gradient(180deg, #d2d6dc 0%, #b4bac6 100%);
        }

        .hero-capy {
          position: absolute;
          right: 80px;
          bottom: 16px;
          width: 154px;
          height: 172px;
          z-index: 5;
        }

        .hero-capy-body {
          position: absolute;
          inset: 34px 0 0;
          border-radius: 42% 42% 30% 30%;
          background: linear-gradient(180deg, #c28b5e 0%, #8f5c37 100%);
          box-shadow: 0 18px 28px rgba(104, 67, 40, 0.22);
        }

        .hero-capy-body::before,
        .hero-capy-body::after {
          content: "";
          position: absolute;
          top: -12px;
          width: 30px;
          height: 34px;
          border-radius: 48% 48% 36% 36%;
          background: #93613d;
        }

        .hero-capy-body::before {
          left: 26px;
        }

        .hero-capy-body::after {
          right: 26px;
        }

        .hero-capy-face {
          position: absolute;
          inset: 32px 18px 22px;
          border-radius: 48%;
          background: linear-gradient(180deg, rgba(255,223,189,0.95), rgba(241,199,153,0.9));
        }

        .hero-capy-eye {
          position: absolute;
          top: 44px;
          width: 12px;
          height: 4px;
          border-bottom: 3px solid #452615;
          border-radius: 999px;
        }

        .hero-capy-eye-left {
          left: 26px;
        }

        .hero-capy-eye-right {
          right: 26px;
        }

        .hero-capy-nose {
          position: absolute;
          top: 58px;
          left: 50%;
          width: 18px;
          height: 14px;
          transform: translateX(-50%);
          background: #512c1a;
          border-radius: 10px;
        }

        .hero-capy-smile {
          position: absolute;
          left: 50%;
          bottom: 24px;
          width: 42px;
          height: 18px;
          transform: translateX(-50%);
          border-bottom: 3px solid #4a2917;
          border-radius: 0 0 22px 22px;
        }

        .hero-capy-arm {
          position: absolute;
          left: -8px;
          bottom: 44px;
          width: 52px;
          height: 18px;
          background: #a66f44;
          border-radius: 999px;
          transform: rotate(-18deg);
        }

        .hero-speech {
          position: absolute;
          right: 188px;
          top: 318px;
          width: 134px;
          padding: 16px 18px;
          border-radius: 24px;
          background: rgba(255,255,255,0.94);
          color: #364460;
          font-size: 17px;
          line-height: 1.35;
          box-shadow: 0 18px 30px rgba(74, 96, 165, 0.14);
          z-index: 6;
        }

        .hero-speech::after {
          content: "";
          position: absolute;
          right: 18px;
          bottom: -10px;
          width: 18px;
          height: 18px;
          background: rgba(255,255,255,0.94);
          transform: rotate(45deg);
          border-radius: 4px;
        }

        .hero-card {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 18px 20px;
          background: rgba(255,255,255,0.96);
          border: 1px solid #dfe6fd;
          border-radius: 26px;
          box-shadow: 0 18px 34px rgba(74, 96, 165, 0.12);
          z-index: 7;
        }

        .hero-card-apl {
          top: 44px;
          left: 112px;
          width: 244px;
        }

        .hero-card-crous {
          top: 154px;
          left: 14px;
          width: 222px;
        }

        .hero-card-sante {
          top: 98px;
          right: 26px;
          width: 276px;
        }

        .hero-card-impots {
          top: 252px;
          right: 6px;
          width: 286px;
        }

        .hero-card-transport {
          right: 12px;
          bottom: 128px;
          width: 270px;
        }

        .hero-card-logo {
          width: 74px;
          height: 74px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .hero-card-copy p,
        .hero-card-copy span {
          display: block;
          margin: 0;
        }

        .hero-card-copy p {
          color: #1f2e5a;
          font-size: 16px;
          font-weight: 800;
          line-height: 1.15;
        }

        .hero-card-copy span {
          color: #4c5d86;
          font-size: 15px;
          line-height: 1.3;
          margin-top: 8px;
        }

        .hero-doodle {
          position: absolute;
          color: rgba(255,255,255,0.9);
          z-index: 6;
          line-height: 1;
        }

        .features {
          margin-top: -6px;
          padding: 30px 32px 22px;
          background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,250,255,0.96));
          border-radius: 0 0 28px 28px;
          box-shadow: 0 20px 44px rgba(74, 96, 165, 0.08);
        }

        .features-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 0 0 26px;
          color: #172555;
          font-size: 26px;
          font-weight: 800;
          text-align: center;
        }

        .features-grid {
          display: grid;
          grid-template-columns: 48px repeat(6, minmax(0, 1fr)) 48px;
          gap: 16px;
          align-items: center;
        }

        .arrow-pill {
          width: 48px;
          height: 48px;
          border-radius: 999px;
          border: 1px solid #e4ebff;
          background: rgba(255,255,255,0.96);
          box-shadow: 0 10px 24px rgba(74, 96, 165, 0.08);
          color: #4b77fb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
        }

        .feature-card {
          min-height: 118px;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 16px;
          border-radius: 22px;
          border: 1px solid #e5ebfe;
          background: rgba(255,255,255,0.96);
          box-shadow: 0 10px 24px rgba(74, 96, 165, 0.08);
        }

        .feature-logo {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .feature-title {
          margin: 0;
          color: #1d2c58;
          font-size: 15px;
          font-weight: 800;
          line-height: 1.2;
        }

        .feature-text {
          margin: 6px 0 0;
          color: #5c698b;
          font-size: 14px;
          line-height: 1.4;
        }

        .footer-trust {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: 16px;
          margin-top: 28px;
          color: #5c688a;
          font-size: 18px;
          line-height: 1.6;
        }

        .footer-trust p {
          margin: 0;
        }

        .footer-trust strong {
          color: #1e2c58;
        }

        @media (max-width: 1260px) {
          .landing-inner {
            padding-left: 18px;
            padding-right: 18px;
          }

          .hero {
            grid-template-columns: 1fr;
          }

          .hero-left {
            padding-left: 0;
            padding-bottom: 0;
          }

          .hero-description {
            max-width: 640px;
          }

          .hero-visual {
            min-height: 720px;
          }

          .features-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .arrow-pill {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .landing-inner {
            padding: 20px 12px 38px;
          }

          .hero-left {
            padding-top: 20px;
          }

          .hero-title {
            font-size: 3.5rem;
          }

          .hero-description {
            font-size: 18px;
          }

          .hero-visual {
            min-height: 760px;
          }

          .hero-person {
            right: 50%;
            transform: translateX(50%);
            bottom: 34px;
            width: 320px;
            height: 372px;
          }

          .hero-head {
            left: 92px;
            width: 118px;
            height: 140px;
          }

          .hero-hair {
            left: 72px;
            width: 160px;
            height: 106px;
          }

          .hero-hoodie {
            height: 182px;
          }

          .hero-laptop {
            left: 20px;
            width: 258px;
            height: 146px;
            font-size: 38px;
          }

          .hero-laptop::after {
            width: 286px;
          }

          .hero-capy {
            right: -4px;
            width: 122px;
            height: 140px;
          }

          .hero-speech {
            right: 20px;
            top: auto;
            bottom: 238px;
            width: 124px;
            font-size: 14px;
          }

          .hero-card {
            gap: 12px;
            padding: 12px 14px;
          }

          .hero-card-logo {
            width: 58px;
            height: 58px;
          }

          .hero-card-copy p {
            font-size: 14px;
          }

          .hero-card-copy span {
            font-size: 13px;
          }

          .hero-card-apl {
            top: 18px;
            left: 14px;
            width: 212px;
          }

          .hero-card-crous {
            top: 126px;
            left: 10px;
            width: 198px;
          }

          .hero-card-sante {
            top: 88px;
            right: 12px;
            width: 194px;
          }

          .hero-card-impots {
            top: 226px;
            right: 12px;
            width: 204px;
          }

          .hero-card-transport {
            right: 12px;
            bottom: 128px;
            width: 206px;
          }

          .trust-row {
            gap: 18px;
          }

          .features {
            padding: 22px 12px 18px;
          }

          .features-title {
            font-size: 22px;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .footer-trust {
            font-size: 15px;
          }
        }
      `}</style>

      <div className="landing-inner">
        <section className="hero">
          <div className="hero-left">
            <div className="hero-badge">
              <span aria-hidden="true">⌘</span>
              <span>Pour les 18-25 ans</span>
            </div>

            <h1 className="hero-title">
              Devenir adulte,
              <br />
              c&apos;est aussi gerer
              <br />
              <span>ses demarches.</span>
            </h1>

            <p className="hero-description">
              Premier appart, bourse, sante, impots... Capy t&apos;aide a comprendre quoi faire, sans jargon.
            </p>

            <div className="hero-cta">
              <Link href="/questionnaire" className="btn-primary" style={{ padding: "18px 32px", borderRadius: 18, fontSize: 18 }}>
                Commencer en 2 minutes
                <span aria-hidden="true" style={{ fontSize: 22 }}>
                  →
                </span>
              </Link>
            </div>

            <div className="trust-row">
              {trustItems.map((item) => (
                <div key={item.title} className="trust-item">
                  <div className="trust-icon" aria-hidden="true">
                    {item.icon}
                  </div>
                  <div>
                    <p>{item.title}</p>
                    <span>{item.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-wall-photo">
              <div className="hero-photo-card" style={{ top: 52, left: 112 }} />
              <div className="hero-photo-card" style={{ top: 70, left: 188 }} />
              <div className="hero-photo-card" style={{ top: 98, right: 102 }} />
              <div className="hero-photo-card" style={{ top: 190, right: 54 }} />
              <div className="hero-photo-card" style={{ top: 220, left: 154 }} />
              <div className="hero-photo-card" style={{ top: 286, left: 108 }} />
              <div className="hero-photo-card" style={{ top: 314, right: 184 }} />
            </div>

            {heroCards.map((card) => (
              <HeroInfoCard key={card.key} {...card} />
            ))}

            <div className="hero-person">
              <div className="hero-head">
                <div className="hero-eye hero-eye-left" />
                <div className="hero-eye hero-eye-right" />
                <div className="hero-mouth" />
              </div>
              <div className="hero-hair" />
              <div className="hero-hoodie" />
              <div className="hero-laptop">Capy</div>

              <div className="hero-capy">
                <div className="hero-capy-body">
                  <div className="hero-capy-face">
                    <div className="hero-capy-eye hero-capy-eye-left" />
                    <div className="hero-capy-eye hero-capy-eye-right" />
                    <div className="hero-capy-nose" />
                    <div className="hero-capy-smile" />
                  </div>
                </div>
                <div className="hero-capy-arm" />
              </div>
            </div>

            <div className="hero-speech">
              Je suis <span style={{ color: "#4f79fb", fontWeight: 800 }}>Capy</span>, ton assistant autonomie 👋
            </div>

            <div className="hero-lamp" />

            <div className="hero-doodle" style={{ top: 86, right: 312, fontSize: 42 }}>
              ✦
            </div>
            <div className="hero-doodle" style={{ top: 132, right: 138, fontSize: 46 }}>
              ⤴
            </div>
            <div className="hero-doodle" style={{ top: 238, left: 286, fontSize: 62 }}>
              ↺
            </div>
            <div className="hero-doodle" style={{ top: 206, right: 262, fontSize: 48 }}>
              ↷
            </div>
            <div className="hero-doodle" style={{ bottom: 98, right: 10, fontSize: 72 }}>
              ↘
            </div>
          </div>
        </section>

        <section className="features">
          <h2 className="features-title">
            <span aria-hidden="true" style={{ color: "#d38aff" }}>
              ✦
            </span>
            <span>Les aides que tu peux decouvrir avec Capy</span>
          </h2>

          <div className="features-grid">
            <div className="arrow-pill" aria-hidden="true">
              ‹
            </div>

            {featureCards.map((card) => (
              <FeatureCard key={card.title} {...card} />
            ))}

            <div className="arrow-pill" aria-hidden="true">
              ›
            </div>
          </div>

          <div className="footer-trust">
            <div
              aria-hidden="true"
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                border: "2px solid #4f79fb",
                color: "#4f79fb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                flexShrink: 0,
              }}
            >
              ✓
            </div>
            <p>
              Toutes les informations viennent de <strong>sources officielles</strong> (Service-Public.fr, CAF.fr,
              Ameli.fr, impots.gouv.fr, et autres). Aucune publicite, aucun partenaire commercial.{" "}
              <Link href="/sources" style={{ color: "#4f79fb", fontWeight: 700, textDecoration: "underline" }}>
                En savoir plus
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
