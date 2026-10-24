import React from "react";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; }
.nivra-plans {
  --ink: #33292b;
  --muted: #827779;
  --line: #e9dfdb;
  --maroon: #593b40;
  --cream: #faf6f2;
  min-height: 100vh;
  background: var(--cream);
  color: var(--ink);
  font-family: Inter, Arial, sans-serif;
  font-size: 10px;
  padding-bottom: 22px;
}
.nivra-plans .top-strip {
  height: 16px;
  background: var(--maroon);
  color: #f7eeee;
  padding: 3px 9px;
  font-size: 7px;
  font-weight: 500;
  letter-spacing: .05px;
}
.nivra-plans .content {
  width: min(464px, calc(100% - 36px));
  margin: 0 auto;
  padding-top: 13px;
}
.nivra-plans h1 {
  margin: 0 0 4px;
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  letter-spacing: -.3px;
}
.nivra-plans .subtitle {
  color: var(--muted);
  margin: 0 0 10px;
  font-size: 8px;
  line-height: 1.4;
}
.nivra-plans .plans {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 11px;
  margin-bottom: 9px;
}
.nivra-plans .plan-card {
  min-height: 84px;
  border: 1px solid #e8ded9;
  border-radius: 5px;
  background: #fff;
  padding: 9px 9px 8px;
}
.nivra-plans .plan-card.premium { border-color: #e6c8c5; }
.nivra-plans .plan-name {
  font-size: 9px;
  font-weight: 700;
  margin-bottom: 3px;
}
.nivra-plans .price {
  font-size: 15px;
  line-height: 1.15;
  font-weight: 700;
  letter-spacing: -.35px;
  margin-bottom: 3px;
}
.nivra-plans .price small {
  font-size: 8px;
  font-weight: 500;
  letter-spacing: 0;
}
.nivra-plans .plan-desc {
  color: var(--muted);
  font-size: 8px;
  margin-bottom: 7px;
}
.nivra-plans .status {
  display: inline-block;
  padding: 2px 5px;
  background: #e9f0e5;
  color: #52634e;
  border-radius: 2px;
  font-size: 7px;
  line-height: 1.1;
  font-weight: 600;
}
.nivra-plans .upgrade {
  display: inline-block;
  background: var(--maroon);
  color: white;
}
.nivra-plans .upgrade:hover { background: #40292e; }
.nivra-plans .features {
  background: #fff;
  border: 1px solid #eee5e0;
  border-radius: 5px;
  padding: 9px;
}
.nivra-plans .features h2 { margin: 0 0 6px; font-size: 9px; }
.nivra-plans .features ul { margin: 0; padding-left: 14px; color: var(--muted); line-height: 1.7; }
`;

export default function PremiumPricing() {
  return (
    <div className="nivra-plans">
      <style>{styles}</style>
      <div className="top-strip">Nivra · Employer plans</div>
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