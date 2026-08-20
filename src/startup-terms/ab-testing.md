**A/B Testing** (also called split testing) is comparing two versions of something to see which one performs better — with real users, real data, and no guessing.

> "Opinions are like assholes — everyone has one." A/B testing replaces opinions with evidence.

---

## How A/B Testing Works

| Step | Action | Example |
|---|---|---|
| 1. **Hypothesis** | "I believe changing X will improve Y" | "Changing the CTA button from blue to yellow will increase clicks" |
| 2. **Variants** | Create two versions (A = control, B = variant) | Blue button (A) vs. Yellow button (B) |
| 3. **Split traffic** | Randomly show each version to 50% of users | 1,000 users see A, 1,000 see B |
| 4. **Measure** | Track the metric you're testing | Click-through rate |
| 5. **Decide** | If B is statistically significant, ship it | B had 23% higher CTR with p < 0.05 |

<details>
<summary>The things most people get wrong about A/B testing</summary>

### 1. Testing Without Enough Traffic

Statistical significance requires sample size. If you have 100 daily visitors, an A/B test might take months to reach significance. Don't start testing until you have enough traffic to get results in 1-2 weeks.

**Rule of thumb:** You need at least 1,000 conversions per variant to detect a 5% improvement with 95% confidence.

### 2. Testing Trivial Changes

Testing button colors when your onboarding flow is broken is like rearranging deck chairs on the Titanic. Focus A/B tests on the **highest-impact, highest-uncertainty** decisions first.

**Priority order:**
1. Value proposition / positioning
2. Pricing / plan structure
3. Onboarding flow / activation
4. Key conversion points (signup, purchase, upgrade)
5. Email subject lines, button colors, etc. (low impact)

### 3. Stopping Too Early

Peeking at results before the test is complete and declaring a winner is the #1 A/B testing mistake. If you check daily and stop when something looks significant, you'll ship false positives 30%+ of the time.

**Rule:** Set your sample size in advance. Don't peek. Wait for the test to complete.

### 4. Ignoring Segment Effects

The overall result might show no difference, but one segment (new users, mobile users, US users) might show a massive difference. Always analyze by segment after the test completes.

### 5. Testing Everything, Optimizing Nothing

A/B testing is a tool, not a strategy. If you test 50 things but can't implement the winners, you've wasted time. Have a system for shipping winners quickly.

</details>

---

## What to A/B Test (Priority Matrix)

| Impact | Low Effort | High Effort |
|---|---|---|
| **High** | CTA copy, pricing page layout, email subject lines | Onboarding flow, checkout process, landing page redesign |
| **Low** | Button colors, image swaps, social proof placement | Full site redesign, new feature positioning |

---

## A/B Testing Tools

| Tool | Best For | Cost |
|---|---|---|
| **Google Optimize** | Simple web tests | Free |
| **Optimizely** | Enterprise experimentation | $$$ |
| **LaunchDarkly** | Feature flags + experimentation | $$ |
| **PostHog** | Product analytics + A/B tests | Free tier |
| **Split.io** | Feature flags | Free tier |

---

## The Bayesian vs. Frequentist Debate

| Approach | How It Works | Pros | Cons |
|---|---|---|---|
| **Frequentist** | P-values and confidence intervals | Industry standard, well-understood | Requires fixed sample size, rigid |
| **Bayesian** | Probability distributions, continuous updating | More intuitive, can peek at results | More complex, requires prior assumptions |

For most startups, **Bayesian is better** — it gives you probability estimates ("B has a 94% chance of being better") rather than binary pass/fail, and you can make decisions earlier with less traffic.

---

## A/B Testing Is Not a Silver Bullet

- **It optimizes within a paradigm:** A/B testing can tell you which headline works better, but it can't tell you if you should build the product at all.
- **It's slow for big decisions:** Validating a new market or value proposition requires qualitative research, not A/B tests.
- **Local maximum trap:** You can optimize a bad funnel to perfection and still have a bad funnel. Sometimes you need a redesign, not an optimization.
