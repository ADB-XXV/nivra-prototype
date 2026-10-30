import React from "react";
import EmployerNavbar from "../components/EmployerNavbar";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; }

.nivra-plans {
  --ink: #33292b;
  --muted: #827779;
  --line: #e9dfdb;
  --maroon: #593b40;
  --cream: #faf6f2;
  min-height: 100vh;
  /* Forces the vertical scrollbar to always remain visible, preventing layout shifts */
  overflow-y: scroll; 
  background: var(--cream);
  color: var(--ink);
  font-family: Inter, Arial, sans-serif;
  font-size: 15px;
  padding-bottom: 33px;
}

.nivra-plans .content {
  width: min(696px, calc(100% - 54px));
  margin: 0 auto;
  padding-top: 20px;
}
.nivra-plans h1 {
  margin: 0 0 6px;
  font-size: 2.3rem;
  line-height: 1.25;
  font-weight: 700;
  letter-spacing: -.45px;
}
.nivra-plans .subtitle {
  color: var(--muted);
  margin: 0 0 15px;
  font-size: 15px;
  line-height: 1.4;
}
.nivra-plans .plans {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 14px;
}
.nivra-plans .plan-card {
  min-height: 126px;
  border: 1px solid #e8ded9;
  border-radius: 8px;
  background: #fff;
  padding: 14px 14px 12px;
}
.nivra-plans .plan-card.premium { border-color: #e6c8c5; }
.nivra-plans .plan-name {
  font-size: 13.5px;
  font-weight: 700;
  margin-bottom: 5px;
}
.nivra-plans .price {
  font-size: 22.5px;
  line-height: 1.15;
  font-weight: 700;
  letter-spacing: -.525px;
  margin-bottom: 5px;
}
.nivra-plans .price small {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0;
}
.nivra-plans .plan-desc {
  color: var(--muted);
  font-size: 12px;
  margin-bottom: 10px;
}
.nivra-plans .status {
  display: inline-block;
  padding: 3px 8px;
  background: #e9f0e5;
  color: #52634e;
  border-radius: 3px;
  font-size: 10.5px;
  line-height: 1.1;
  font-weight: 600;
}
.nivra-plans .upgrade {
  display: inline-block;
  background: var(--maroon);
  color: white;
  padding: 9px 16px;
  border-radius: 6px;
  text-decoration: none;
}
.nivra-plans .upgrade:hover { background: #40292e; }
.nivra-plans .features {
  background: #fff;
  border: 1px solid #eee5e0;
  border-radius: 8px;
  padding: 14px;
}
.nivra-plans .features h2 { margin: 0 0 9px; font-size: 1.35rem; }
.nivra-plans .features ul { margin: 0; padding-left: 21px; color: var(--muted); line-height: 1.7; }
`;

export default function PremiumPricing() {
  return (
    <div className="nivra-plans">
      <style suppressHydrationWarning>{styles}</style>
      <EmployerNavbar active="/pricing" />
      <main className="content">
        <h1>Simple plans for better hiring</h1>
        <p className="subtitle">Choose the tools that fit your hiring needs. You can change plans at any time.</p>
        <section className="plans" aria-label="Pricing plans">
          <article className="plan-card">
            <div className="plan-name">Basic</div>
            <div className="price">Free</div>
            <div className="plan-desc">For occasional hiring</div>
            <span className="status">Current plan</span>
          </article>
          <article className="plan-card premium">
            <div className="plan-name">Premium</div>
            <div className="price">₹699 <small>/ month</small></div>
            <div className="plan-desc">For teams hiring more often</div>
            <a className="upgrade" href="/login?role=employer&mode=signup">Choose Premium</a>
          </article>
        </section>
        <section className="features">
          <h2>Premium includes</h2>
          <ul>
            <li>Advanced candidate filters and matching insights</li>
            <li>Side-by-side candidate comparison</li>
            <li>Bulk hiring support</li>
          </ul>
        </section>
      </main>
    </div>
  );
}