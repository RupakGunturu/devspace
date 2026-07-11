# 🧱 Stack Breakdown — Stripe

> Real product. Real engineering. Learn how it's likely built.

---

## 📖 Product Overview

Stripe builds the financial infrastructure that lets businesses accept payments, manage subscriptions, issue cards, and move money online. <cite index="71-1">Stripe describes itself as the "financial infrastructure of the internet," organized around four product pillars: Payments (its core identity since 2009), Connect (letting platforms like Shopify and GitHub Sponsors embed payments into their own products), Capital (loans for small businesses), Issuing (virtual/physical cards), and Treasury (banking-as-a-service).</cite>

Unlike a typical consumer app, Stripe's core engineering challenge is trust and correctness at scale: every request touches real money, so accuracy, security, and reliability matter more than almost anything else — while still needing to process an enormous, constantly growing volume of transactions.

---

## 🖥️ Frontend Stack

- **React + TypeScript** — used for Stripe's dashboard and customer-facing web interfaces, standard for a large, data-dense web application.
- **JavaScript-oriented frontend broadly** — <cite index="74-1">Stripe's frontend work is mostly JavaScript-oriented, complementing the backend.</cite>

Stripe also ships one of the most widely used frontend developer tools in the industry: **Stripe.js and Stripe Elements**, pre-built, secure UI components that let any website collect card details without that sensitive data ever touching the business's own servers — a huge part of why Stripe is so easy to integrate compared to handling raw payment data yourself.

---

## ⚙️ Backend Stack

**Ruby is Stripe's historical core.** <cite index="71-1">Stripe operates what's almost certainly the world's largest Ruby codebase, with more than 20 million lines of code.</cite> <cite index="77-1">For years, the majority of Stripe's code and business value lived in a single giant Ruby monorepo</cite> — an approach that's unusual at this scale, since most companies of Stripe's size split into many separate repositories or services much earlier.

**Keeping a 20-million-line Ruby codebase sane — Sorbet.** <cite index="70-1">Sorbet, a type-checker, now runs across Stripe's entire Ruby codebase — over 15 million lines spread across 150,000 files — and has become crucial to Stripe's growth, increasing productivity and helping foster a shared engineering culture.</cite> Ruby is a dynamically typed language by default, so layering static type-checking on top at this scale is a serious engineering investment that pays off in fewer bugs and easier refactors.

**Expanding beyond Ruby.** <cite index="71-1">Stripe is investing heavily in Java and Go on the backend, plus machine learning and AI tooling — though there's no requirement for new engineers to already know these languages; they pick them up on the job.</cite>

**Monorepo philosophy.** <cite index="77-1">Stripe's codebase was fairly tightly coupled by design, and the team knew early on it wouldn't easily or quickly be broken apart into a large number of microservices — instead, they continually invested in tools and patterns for modularity within the monorepo itself,</cite> rather than assuming microservices were automatically the right answer at scale.

**API design as a first-class discipline.** <cite index="76-1">Every single change that modifies Stripe's public API must pass a strict review process that goes well beyond a normal code review</cite> — reflecting how central API stability and clarity are to Stripe's whole business (developers build on top of that API directly).

---

## 🗄️ Database

Stripe hasn't published one single definitive database list, but its own engineering blog and credible reporting point to:

- **PostgreSQL** — widely reported as a core relational database for Stripe's transactional data, valued for strong consistency guarantees, which matters enormously when the data represents real money.
- **A custom Data Movement Platform** — <cite index="70-1">Stripe has published specifically about its database infrastructure and the design of its "Data Movement Platform," built to move data reliably across its systems.</cite>
- **Global Payments and Treasury Network (GPTN)** — <cite index="73-1">a programmable infrastructure Stripe has spent over a decade building for global money movement, which batches transfers to reduce cost, nets opposing flows to minimize the actual cash that needs to move, and routes payments through the optimal path between accounts — modeled internally as a graph, with accounts as nodes and payment rails as edges.</cite>

**Simple idea to remember:** for a payments company, correctness matters more than raw speed. That's why Stripe invests so heavily in custom infrastructure (like GPTN) purpose-built for financial accuracy, rather than just using an off-the-shelf database and calling it done.

---

## ☁️ Infrastructure

- **AWS** — Stripe's infrastructure runs substantially on AWS, based on both Stripe's own published engineering content and widely reported information, including serverless tools like Lambda for specific workloads.
- **Continuous Integration (CI) at massive scale** — <cite index="70-1">Stripe's CI system orchestrates build pipelines and runs tens of thousands of test suites that engineers depend on daily to validate their changes, combining open-source tooling with custom-built engineering.</cite>
- **Gradual, automated rollout of changes.** <cite index="76-1">The best way Stripe ships often and safely is by ensuring every change is automatically tested via the CI pipeline and then gradually deployed — this is the default approach for all new services at Stripe.</cite>
- **Fault domain minimization ("reduce the blast radius").** <cite index="76-1">Stripe designs systems so that failures are isolated and don't propagate to impact a broad swath of users — accounting explicitly for risks like downstream dependency failures, networking issues, and even entire cloud-region outages.</cite>
- **Proactive scaling for known spikes.** <cite index="76-1">Engineers are encouraged to actively gather data on how much their systems will need to scale in the near future and plan for it proactively — for example, explicitly preparing for Black Friday/Cyber Monday traffic loads.</cite>

---

## 🔌 APIs & Services

- **The Stripe API itself** — Stripe's core product is, in a real sense, its API — <cite index="70-1">abstracting away the complexity of payments has driven the evolution of Stripe's APIs for over a decade, culminating in things like the PaymentIntents API.</cite>
- **Stripe Radar** — <cite index="76-1">Stripe's machine-learning-powered fraud detection system, built by a dedicated ML infrastructure team.</cite>
- **Stripe Connect** — platform infrastructure that lets other businesses (marketplaces, SaaS platforms) embed payments and financial services directly into their own products.
- **Stripe Billing** — <cite index="70-1">lets businesses manage customer relationships involving recurring payments, usage-based triggers, and other customizable billing features.</cite>
- **Webhooks** — Stripe's primary mechanism for notifying integrated businesses about payment state changes (a charge succeeded, a subscription renewed, etc.) in real time.

---

## 📈 Scaling Techniques

- **A deliberately large monorepo, kept manageable with tooling** — instead of assuming microservices are automatically the answer, Stripe invested heavily in internal tools (autoloaders, centrally-managed dev environments called "devboxes") to keep a huge, tightly-coupled Ruby codebase productive to work in.
- **Static typing at massive scale (Sorbet)** — layering type safety onto an already-huge dynamic codebase instead of rewriting it in a different language.
- **Gradual, automated deployment** for every change, reducing the risk of any single rollout causing a widespread problem.
- **Explicit blast-radius reduction** — designing for the assumption that some component will eventually fail, and making sure that failure stays contained.
- **Proactive capacity planning** for predictable high-traffic events (Black Friday/Cyber Monday) rather than reactive firefighting.

---

## 🔒 Security & Reliability

- **PCI-DSS compliance** — as a payments company, Stripe operates under some of the strictest data-security standards in the industry for handling card data.
- **Strict API review process** — <cite index="76-1">every API-modifying change goes through a review process well beyond a standard code review,</cite> since a mistake in a public API used by millions of integrations is far more costly than a typical internal bug.
- **Isolating failure domains** so a problem in one part of the system (say, a specific region or a specific downstream dependency) doesn't spread to affect unrelated users.
- **Machine learning-based fraud detection (Radar)**, running continuously across live transaction volume.
- **Extremely disciplined change management** — <cite index="76-1">Stripe's own internal data shows the vast majority of operational failures come from making changes (to APIs, products, or systems) with unintended consequences, which is exactly why gradual, automatically-tested rollouts are the default for every new service.</cite>

---

## ⚡ Performance Optimizations

- **Static type-checking at scale (Sorbet)** to catch bugs before they ever reach production, in a 15-million-plus-line Ruby codebase.
- **Custom internal tooling for developer productivity** (autoloaders, "devbox" environments) so that a huge, shared codebase doesn't slow every individual engineer down as the company grows.
- **Purpose-built financial infrastructure (GPTN)** that batches and nets transfers, meaning less actual money movement (and cost) is needed to settle the same volume of transactions.
- **Heavy investment in CI** so that tens of thousands of tests run automatically and fast, keeping the feedback loop for engineers short even at massive codebase scale.

---

## 📊 Engineering Challenges

- **Correctness matters more than almost anything.** Unlike most consumer software, a bug at Stripe can mean real money lost or duplicated — this shapes everything from API review discipline to deployment strategy.
- **Operating a massive, tightly-coupled Ruby monorepo** at a scale most companies would have split into microservices years earlier — a genuinely unusual and well-documented architectural choice.
- **Global money movement is inherently slow and fragmented** — <cite index="73-1">a wire transfer submitted in the afternoon might not settle until end of day, ACH can take one to three business days, and cross-border payments touch multiple correspondent banks, each adding lag and fees</cite> — which is exactly the problem Stripe's GPTN was built to abstract away for its customers.
- **Balancing speed of shipping with financial-grade reliability** — <cite index="76-1">Stripe explicitly wrestles with the tension between needing to ship changes quickly for its users and the fact that changes are the leading cause of its own operational failures.</cite>
- **Regulatory complexity** — operating across many countries' financial regulations simultaneously, a challenge that's more about compliance engineering than pure performance engineering.

---

## 💰 Infrastructure Cost Considerations

- **Compute** — running a massive monorepo's worth of services, plus tens of thousands of CI test runs per day, is a significant and constant cost.
- **Database & data-movement infrastructure** — maintaining strict transactional consistency for financial data at Stripe's scale (Stripe reports processing hundreds of millions of transactions) requires serious, dedicated infrastructure investment.
- **Machine learning infrastructure** — running fraud-detection models (Radar) continuously across live transaction volume.
- **Compliance & security tooling** — PCI-DSS compliance and financial regulation adherence require ongoing, dedicated engineering investment that isn't optional.

*(No specific dollar figures are invented — these are the most likely major technical cost buckets, based on Stripe's own public engineering writing.)*

---

## 🎯 Student Version

You're not going to build a payments processor from scratch (and for good legal reasons, you shouldn't try to handle raw card data yourself) — but you can build a realistic e-commerce checkout flow using Stripe itself:

- **Frontend:** React + TypeScript, using Stripe.js/Stripe Elements for a secure, pre-built checkout UI.
- **Backend:** Node.js or Python (Flask/FastAPI) to create Stripe Checkout Sessions and handle webhooks.
- **Database:** PostgreSQL to store your own order records (never store raw card numbers yourself — let Stripe handle that).
- **Webhooks:** implement a webhook endpoint to update order status when Stripe notifies you a payment succeeded — this teaches the same event-driven pattern Stripe's whole platform is built around.
- **Deployment:** Vercel/Netlify for frontend, Render/Railway for backend.

Stripe's own test mode and extensive documentation make this one of the most beginner-friendly ways to build something genuinely production-quality as a student project.

---

## 📚 Technologies Used (Summary Table)

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React, TypeScript | Dashboard & customer-facing UI |
| Payment UI | Stripe.js, Stripe Elements | Secure, pre-built checkout components |
| Backend (Core) | Ruby (20M+ lines, monorepo) | Business logic across most of Stripe |
| Type Safety | Sorbet | Static type-checking for Ruby at scale |
| Backend (Growing) | Java, Go | Performance-critical & newer services |
| Database | PostgreSQL (widely reported) | Transactional financial data |
| Money Movement | Global Payments and Treasury Network (GPTN) | Batching, netting, routing global transfers |
| Fraud Detection | Stripe Radar (ML-based) | Real-time fraud prevention |
| Cloud | AWS | Hosting & infrastructure |
| CI/Testing | Custom CI system | Running tens of thousands of test suites |

---

## 💡 Engineering Lessons

1. Microservices aren't automatically the answer — Stripe kept a huge monorepo and invested in tooling instead of splitting prematurely.
2. Layering static types onto a dynamic language (Sorbet on Ruby) can be worth it at serious scale, even without a full rewrite.
3. For systems handling real money, correctness and reliability outrank almost every other engineering priority.
4. Treat your public API as a product in its own right — Stripe's strict API review process reflects how much developers depend on API stability.
5. Most operational failures come from making changes, not from things randomly breaking — invest in safe, gradual rollout as the default.
6. Design explicitly to contain failure ("reduce the blast radius") rather than hoping nothing ever breaks.
7. Plan proactively for known, predictable spikes (Black Friday) instead of reacting after the fact.
8. Purpose-built infrastructure (like GPTN) can eliminate real-world inefficiencies (slow, costly money movement) that off-the-shelf tools can't solve.

---

## 🔗 References

- Stripe Engineering Blog (Official) — [stripe.com/blog/engineering](https://stripe.com/blog/engineering)
- The Pragmatic Engineer — [Inside Stripe's Engineering Culture, Part 1](https://newsletter.pragmaticengineer.com/p/stripe) and [Part 2](https://newsletter.pragmaticengineer.com/p/stripe-part-2)
- Nelhage (former Stripe engineer) — [Stripe's Monorepo Developer Environment](https://blog.nelhage.com/post/stripe-dev-environment/)
- Stripe Developer Blog — [stripe.dev/blog](https://stripe.dev/blog)

*Note: Several third-party sources online make specific claims about Stripe's exact current backend languages (e.g., heavy Rust usage) that aren't corroborated by Stripe's own engineering blog or by credible independent reporting — those unconfirmed claims are excluded here in favor of well-sourced information.*
