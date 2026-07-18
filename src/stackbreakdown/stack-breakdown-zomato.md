# 🧱 Stack Breakdown — Zomato

> Real product. Real engineering. Learn how it's likely built.

---

## Product Overview

Zomato is a food delivery and restaurant discovery app. Users browse restaurants, read reviews, order food, and track delivery live on a map. It's really three products in one: a search/discovery engine (finding restaurants), a transactional system (ordering + payment + delivery), and a recommendation engine (suggesting what to eat next).

It runs at huge scale — millions of orders a day, across thousands of cities — so speed, reliability, and never losing an order or a payment are the core engineering challenges.

---

## Frontend Stack

- **React** – used for Zomato.com and parts of the app UI. Zomato rebuilt its old PHP + jQuery website into a modern React-based frontend in recent years, moving to a "microfrontend" setup where different teams own different pieces of the page.
- **TypeScript** – added along with the React rewrite for type safety on a large, multi-team codebase.
- **React Native** (commonly used industry-wide for apps like this) – likely powers shared logic between iOS and Android, though Zomato hasn't detailed this publicly.
- **HTML5 / CSS3 / JavaScript** – core web building blocks for responsive pages.

**Why it matters:** A single app used by ordering customers, browsing customers, and everyone in between needs a UI that loads fast and updates live (order status, delivery map) without feeling clunky.

---

## Backend Stack

Zomato runs on a **microservices architecture** — lots of small, independent services instead of one giant program. Each service owns one job: user accounts, restaurant listings, order processing, payments, and so on.

**Languages used:** Python (with Django), Java (with Spring Boot), and Node.js. Python and Django handle a lot of the core web/business logic; Java is used for scalable backend services; Node.js is used where fast, event-driven handling of many requests at once matters (like live order tracking).

**API Gateway:** All requests from the app or website pass through a gateway first. It checks who you are (authentication), makes sure you're not spamming requests (rate limiting), and routes your request to the right microservice.

**Why microservices?** With one team owning "restaurant search" and another owning "payments," teams can update their own piece without breaking everyone else's code — important when you have this many moving parts.

---

## Database

| Database | Why it's used |
|---|---|
| **PostgreSQL / MongoDB** | Core structured data — user accounts, restaurant info, order records. |
| **Redis** | Caching — storing frequently-requested data (like a popular restaurant's menu) in memory so it doesn't need a fresh database lookup every time. |
| **Elasticsearch** | Powers fast restaurant and dish search. |
| **ClickHouse / Druid** (commonly used for this kind of scale, per industry reporting) | Analytics — crunching huge amounts of order/traffic data for dashboards and business reporting. |

**Simple idea to remember:** Zomato likely separates "read" databases from "write" databases (a pattern called CQRS) — writing a new order and reading a restaurant's menu are very different jobs, and splitting them keeps both fast.

---

## Infrastructure

- **Cloud provider:** AWS — for servers, storage, and scaling up/down based on demand.
- **Docker + Kubernetes:** Package each microservice into a container and let Kubernetes automatically start more copies when traffic spikes (like dinner time).
- **Kafka:** A message queue — when an order is placed, an "order created" event goes into Kafka, and multiple services (restaurant notification, delivery assignment, customer tracking) can all react to it independently.
- **CI/CD pipelines:** Automated testing and deployment so new code ships safely and often.

---

## APIs & Services

- **Maps** – Google Maps (or similar) for restaurant locations, delivery routing, and live tracking.
- **Payments** – integrated payment gateways plus Zomato's internal systems, built to be PCI-DSS compliant (an industry security standard for handling card data safely).
- **Authentication** – OAuth 2.0 for secure login and session handling.
- **Notifications** – push notifications for order updates.
- **Machine learning** – used for personalized restaurant/dish recommendations and predicting delivery times.

---

## Scaling Techniques

- **Microservices** so different parts of the system scale independently — restaurant search might get 10x the traffic of the payments service, and each can scale on its own.
- **Event-driven architecture with Kafka** to decouple services — one part of the system doesn't need to wait on another to finish its job.
- **Caching with Redis** to avoid hitting the main database for the same popular data over and over.
- **Auto-scaling and load balancing** to spread traffic evenly and add more servers automatically during busy hours.
- **CQRS (splitting reads and writes)** so search/browsing traffic doesn't slow down order processing.

---

## Security & Reliability

- **OAuth 2.0** for login and authorization.
- **HTTPS/TLS encryption** for all traffic.
- **PCI-DSS compliance** for handling payments safely.
- **GDPR-style privacy practices** — letting users control and delete their data.
- **Idempotency checks** — making sure that if a request gets sent twice (like a payment retry after a network glitch), the user isn't charged twice or the order isn't duplicated.

---

## Performance Optimizations

- Caching hot data (popular restaurants, menus) in Redis.
- CDN for images (restaurant photos, dish photos) so they load fast worldwide.
- Search indexing (Elasticsearch) so restaurant/dish search returns near-instantly.
- Splitting read-heavy and write-heavy traffic so one doesn't slow down the other.

---

## Engineering Challenges

- **Real-time logistics** — the moment you place an order, the system has to find the restaurant, assign a nearby delivery partner, process payment, and estimate delivery time — all within seconds.
- **Never losing money** — payment flows must handle network failures gracefully without double-charging or losing an order.
- **Personalization at scale** — recommending food you'll actually like, for millions of different users, without feeling creepy or repetitive.
- **Traffic spikes** — meal times create huge, predictable surges that infrastructure has to handle smoothly.

---

## Infrastructure Cost Considerations

- **Compute** — running hundreds of microservices around the clock is the biggest ongoing cost.
- **Database & caching** — storing and quickly retrieving huge amounts of order and restaurant data.
- **Maps/location API calls** — every delivery involves several location lookups.
- **Machine learning infrastructure** — running recommendation and ETA-prediction models.

*(No exact dollar figures are published by Zomato — these are just the likely biggest cost buckets.)*

---

## Student Version

- **Frontend:** React (free, well-documented, huge community).
- **Backend:** Node.js + Express, or Python + Django if you want to mirror Zomato's real stack.
- **Database:** PostgreSQL (free on Supabase/Railway) + Redis (free tier on Upstash) for caching.
- **Auth:** Firebase Auth or Supabase Auth — free and quick to set up.
- **Storage:** Supabase Storage or Cloudflare R2 free tier for restaurant images.
- **Deployment:** Vercel/Netlify for frontend, Render/Railway for backend — all free or cheap for a hobby project.

A great simplified feature to build: a live order-tracking page using WebSockets — it teaches the same real-time-update problem Zomato solves, just at a much smaller scale.

---

## Technologies Used (Summary Table)

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React, TypeScript | Web/app UI |
| Backend | Python (Django), Java (Spring Boot), Node.js | Microservices |
| Database | PostgreSQL, MongoDB | Core data storage |
| Caching | Redis | Fast repeated lookups |
| Search | Elasticsearch | Restaurant/dish search |
| Analytics | ClickHouse/Druid | Business reporting |
| Messaging | Kafka | Event-driven order pipeline |
| Cloud | AWS | Hosting & scaling |
| Containers | Docker, Kubernetes | Deployment & scaling |

---

## Engineering Lessons

1. Break big systems into small, focused microservices.
2. Use event queues (like Kafka) so services don't block each other.
3. Cache anything read often and changed rarely.
4. Separate your read traffic from your write traffic when both are heavy.
5. Design payment flows to be idempotent — never double-charge on retry.
6. Invest in search performance — it's often the first thing users interact with.
7. Automate scaling instead of manually adding servers during traffic spikes.
8. A good team culture can rebuild even a decade-old legacy system successfully.

---

## References

- Zomato Engineering Blog — [blog.zomato.com/category/technology](https://blog.zomato.com/category/technology)
- "Building Zomato's Thriving Pirate Community" — engineering leadership retrospective on rebuilding Zomato's frontend team

*Note: Some specific technology choices here (exact analytics databases, some infra tooling) are commonly reported by outside sources rather than confirmed directly by Zomato, and are marked as "likely" rather than officially confirmed.*
