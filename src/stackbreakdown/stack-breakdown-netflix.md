# 🧱 Stack Breakdown — Netflix

> Real product. Real engineering. Learn how it's likely built.

---

## Product Overview

Netflix is the world's largest streaming service, with <cite index="38-1">over 180 million subscribers across 200+ countries.</cite> Members watch billions of hours of shows and movies every month, on everything from phones to smart TVs to game consoles.

Netflix's engineering story is one of the most famous in tech: it started as a single, giant application (a "monolith") and rebuilt itself piece by piece into one of the most influential microservices architectures in the industry — largely because of one bad day. <cite index="32-1">In August 2008, a database corruption caused a three-day outage that stopped Netflix from shipping DVDs to customers, exposing how fragile a monolithic system really was.</cite> That incident kicked off a multi-year rebuild.

---

## Frontend Stack

- **React** — <cite index="30-1">used for Netflix's web client, with server-side rendering optimizations for fast load times.</cite>
- **Node.js** — <cite index="31-1">Netflix engineers use modern UI technologies like Node.js, React, and RxJS to build rich client apps that run across thousands of different device types</cite> (TVs, game consoles, streaming boxes, phones).
- **Falcor, then GraphQL** — <cite index="30-1">Falcor was Netflix's own data-fetching library used historically, while GraphQL with the DGS framework is used broadly today</cite> to let client apps request exactly the data they need.
- **RxJS** — used to handle streams of asynchronous events (user interactions, playback state) in a clean, predictable way.

**Why it matters:** Netflix runs on an enormous range of devices with wildly different screen sizes and processing power — the frontend stack is built to adapt to all of them from one shared foundation.

---

## Backend Stack

Netflix runs **thousands of microservices**, each owning one small piece of functionality (recommendations, billing, playback, search, etc.), largely built with **Java and Spring Boot**.

**The edge layer — Zuul.** <cite index="34-1">Zuul became Netflix's single point of entry, routing traffic, balancing load, and enforcing security for all incoming requests, before later evolving into Zuul 2 and incorporating Envoy for extra performance.</cite>

**Finding services — Eureka.** <cite index="34-1">Eureka acts as the "phonebook" of the system — a service registry that keeps track of where every one of Netflix's microservices is currently running,</cite> since with thousands of independently-deployed services, nothing can be hardcoded to a fixed address.

**Handling failure — Hystrix.** <cite index="31-1">Hystrix isolates latency and fault tolerance at the level of individual service calls, so if one dependency slows down or fails, it doesn't take the whole system down with it.</cite>

**Configuration — Archaius.** <cite index="39-1">An open-source configuration management library that gathers settings from many sources and lets properties change at runtime without restarting the application.</cite>

**Workflow orchestration — Conductor.** <cite index="34-1">Conductor orchestrates complex, multi-step workflows, like billing or the video-delivery pipeline, across many microservices.</cite>

**Best practice: one database per service.** <cite index="33-1">Netflix's own best-practice guidance is to never share the same backend data store across microservices — sharing a database creates hidden coupling that defeats the purpose of splitting into microservices in the first place.</cite>

---

## Database

| Database | Why it's used |
|---|---|
| **Cassandra** | <cite index="30-1">Appears repeatedly across Netflix's engineering posts and talks as a primary online datastore for scale-out workloads</cite> — chosen for horizontal scalability across regions. |
| **EVCache** | <cite index="30-1">A memcached-based caching system used for ephemeral, volatile caching</cite> — fast, temporary data that doesn't need to survive a restart. |
| **Key-Value Data Abstraction Layer** | <cite index="30-1">A standardized internal layer Netflix built for accessing backing stores like Cassandra</cite>, so different teams don't each reinvent their own database-access patterns. |

**Simple idea to remember:** Netflix moved away from relational (SQL) databases for its largest workloads because a single relational database <cite index="34-1">couldn't support millions of users spread across the globe</cite> — Cassandra's design, built for distributing data across many machines and regions, fit that problem much better.

---

## Infrastructure

- **AWS** — <cite index="30-1">Netflix completed its full migration to AWS in 2016</cite>, running its entire streaming backend in the cloud rather than its own datacenters (though its actual video delivery uses its own network — see below).
- **Titus** — <cite index="30-1">Netflix's internal container platform, open-sourced in 2018, used to run containers at scale.</cite>
- **Spinnaker** — <cite index="30-1">Enables automated, multi-region continuous delivery,</cite> letting Netflix ship new code safely and frequently across the globe, including canary and blue/green deployment strategies.
- **Kubernetes** — adopted more recently for some workloads alongside Titus.
- **Multi-region setup** — Netflix runs active infrastructure across multiple AWS regions (e.g., US-East, US-West, EU) for both performance and disaster recovery, so an outage in one region doesn't take the whole service down.

**Open Connect — Netflix's own CDN.** <cite index="30-1">Netflix built and operates its own content delivery network, placing Netflix caching servers directly inside internet service providers and major network interconnects to get video as physically close to viewers as possible.</cite> <cite index="30-1">Encoded video is pushed out to these servers during off-peak hours, and during actual playback your device fetches video from the nearest one, falling back to others if needed.</cite> This is a big deal: Netflix doesn't rely on a generic third-party CDN for the one thing that matters most (getting video to your screen smoothly) — it built its own.

---

## APIs & Services

- **Video encoding & packaging** — Netflix encodes each title into multiple quality levels and formats, using per-title and per-scene encoding optimization measured with a video-quality metric called VMAF, to balance quality against file size.
- **DRM (Digital Rights Management)** — uses HTML5 EME (Encrypted Media Extensions) in browsers to protect licensed content from being copied.
- **A/B testing infrastructure** — <cite index="31-1">Netflix continuously runs data-driven A/B tests to experiment with new ideas and measure the value of every feature before rolling it out fully.</cite>
- **Kafka + Flink** — <cite index="34-1">Kafka streams trillions of messages (every click, play, pause, and rating), and Flink processes those events in real time to power recommendations and monitor playback quality.</cite>

---

## Scaling Techniques

- **Microservices** — <cite index="38-1">Netflix now runs over 1,000 microservices, each managing a separate part of the business,</cite> so teams can build, test, and deploy independently instead of touching one giant shared codebase.
- **Stateless servers** — <cite index="38-1">by keeping servers stateless, Netflix can operate at very large scale across a huge number of clients</cite> without one server needing to "remember" a specific user's session.
- **Chaos Engineering** — <cite index="31-1">Chaos Monkey, part of the "Simian Army," randomly kills production instances to test that the system survives unexpected failures,</cite> and this was later extended with more precise chaos tools for automated, guarded experiments.
- **Canary analysis** — automatically comparing a small slice of users on new code against the rest of the system before a full rollout, to catch problems early.
- **Own CDN (Open Connect)** to physically shorten the distance video has to travel to each viewer.
- **Gradual migration over big-bang rewrites** — <cite index="32-1">the full monolith-to-microservices transition took about seven years, a deliberate, gradual process rather than a risky all-at-once rewrite.</cite>

---

## Security & Reliability

- **Fault isolation per service call (Hystrix)** — one failing dependency doesn't cascade into a full outage.
- **Chaos Engineering as a discipline** — proactively testing failure instead of just hoping it doesn't happen.
- **DRM/encryption** to protect licensed video content.
- **Multi-region redundancy** for disaster recovery if an entire AWS region goes down.
- **"Full Cycle" ownership model** — Netflix engineering teams both build and operate what they ship, which tends to produce more reliability-conscious code since the same people who write it are on the hook when it breaks.

---

## Performance Optimizations

- **Per-title and per-scene video encoding** to get the best visual quality at the smallest file size for each specific piece of content.
- **Own CDN (Open Connect)** placing content physically close to viewers.
- **EVCache** for extremely fast, ephemeral data lookups instead of hitting a full database on every request.
- **Server-side rendering** for the web client to get content on-screen faster.
- **Adaptive concurrency limits** — Netflix open-sourced tooling for automatically shedding load gracefully when a service is under heavy pressure, instead of falling over entirely.

---

## Engineering Challenges

- **Scaling past a single monolith** — <cite index="37-1">the original monolith bundled authentication, catalog management, recommendations, streaming, billing, and support all together, so a single bug anywhere could threaten the whole app.</cite>
- **Personalization at massive scale** — powering recommendations for hundreds of millions of different viewers, each with unique taste.
- **Global video delivery** — getting a smooth stream to every device type, on every network quality, in every country, without buffering.
- **Observability across 1,000+ services** — knowing what's happening across such a distributed system requires serious investment in monitoring and telemetry tools (Netflix built its own, called Atlas, for exactly this).
- **Cost management at scale** — running this much infrastructure means constant work on making the underlying compute and storage cost-efficient.

---

## Infrastructure Cost Considerations

- **Compute (AWS)** — thousands of microservices running continuously is Netflix's largest and most variable cost.
- **CDN infrastructure (Open Connect)** — building and maintaining physical caching servers inside ISPs worldwide is a major, ongoing capital investment.
- **Video storage & encoding** — storing and re-encoding an enormous content library in multiple formats and quality levels.
- **Data & streaming infrastructure** — running Kafka/Flink-based pipelines that process every user interaction in real time.
- **Content licensing/production** — not "infrastructure" in the technical sense, but by far Netflix's largest overall cost as a business.

*(No specific dollar figures are invented — these are just the likely biggest technical cost buckets.)*

---

## Student Version

- **Frontend:** React, with a simple video player component (e.g., using the free, open-source Video.js library).
- **Backend:** Node.js or Java/Spring Boot for a small set of services (catalog, user accounts, "watch history").
- **Database:** PostgreSQL for structured data; Redis for caching hot data like trending titles.
- **Video hosting:** instead of building your own CDN, use a free-tier video host (like Cloudflare Stream's free trial, or simply YouTube's unlisted videos) to focus on the product logic rather than video infrastructure.
- **Authentication:** Firebase Auth or Supabase Auth.
- **Deployment:** Vercel/Netlify for frontend, Render/Railway for backend.

A great mini-project: build a simple recommendation feature based on what a user has "watched" before — even a basic version teaches the same fundamental idea behind Netflix's much bigger recommendation engine.

---

## Technologies Used (Summary Table)

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React, Node.js, RxJS | Cross-device client apps |
| Data fetching | Falcor (historically), GraphQL | Efficient client-server data fetching |
| Backend | Java, Spring Boot | Thousands of microservices |
| Edge/Gateway | Zuul | Routing, load balancing, security |
| Service discovery | Eureka | Finding running services |
| Fault tolerance | Hystrix | Isolating failures per service call |
| Config management | Archaius | Runtime configuration |
| Workflow orchestration | Conductor | Multi-step business workflows |
| Database | Cassandra | Scale-out primary datastore |
| Caching | EVCache | Ephemeral, fast lookups |
| Streaming/events | Kafka, Flink | Real-time event processing |
| Containers | Titus, Kubernetes | Running services at scale |
| CI/CD | Spinnaker | Automated multi-region delivery |
| CDN | Open Connect (Netflix's own) | Global video delivery |
| Chaos testing | Chaos Monkey / Simian Army | Proactive failure testing |

---

## Engineering Lessons

1. Monoliths are fine until they aren't — plan your architecture around your actual scale, not the scale you started at.
2. A single outage can justify a multi-year architectural investment if the root cause is systemic.
3. Never share a database across microservices — it silently re-creates monolith-style coupling.
4. Isolate failures at the smallest possible unit (per service call, not per whole system).
5. Test your system's resilience on purpose (Chaos Monkey) instead of waiting for real outages to find weaknesses.
6. Build (or rent) your CDN based on how critical delivery speed is to your core product.
7. Gradual, measured migrations beat risky big-bang rewrites.
8. Give teams full ownership ("build it, run it") to keep reliability everyone's problem, not just Ops.
9. Invest early in observability — you can't fix what you can't see across a thousand services.
10. Open-sourcing your internal tools can build both community goodwill and a stronger internal culture of clean design.

---

## References

- Netflix Tech Blog (Official) — [netflixtechblog.com](https://netflixtechblog.com/)
- Netflix Open Source Software Center — [netflix.github.io](https://netflix.github.io/)
- F5/NGINX — [Adopting Microservices at Netflix: Lessons for Architectural Design](https://www.f5.com/company/blog/nginx/microservices-at-netflix-architectural-best-practices)
- VdoCipher — [Netflix Tech Stack Explained: CDN (Open Connect) and Microservices](https://www.vdocipher.com/blog/netflix-tech-stack-and-architecture/)

*Note: Some details (exact current use of Kubernetes alongside Titus, specific current data-pipeline choices) reflect Netflix's well-documented general architecture and may have evolved since the referenced sources were published.*
