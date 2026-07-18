# 🧱 Stack Breakdown — Swiggy

> Real product. Real engineering. Learn how it's likely built.

---

## Product Overview

Swiggy is India's largest hyperlocal delivery platform, launched in 2014 in Bangalore as a food-delivery service and since expanded into grocery delivery (Instamart), quick-commerce, and courier-style pickup/drop (Genie). It connects three distinct user groups in real time: customers ordering food or goods, restaurants/stores fulfilling orders, and delivery partners moving through the city.

**Scale & challenge:** <cite index="38-1">Swiggy operates over 400+ microservices in production, with more than 130 of them directly participating in the order-fulfillment path — from rendering the home page to food arriving at the customer's doorstep.</cite> That scale creates a genuinely hard distributed-systems problem: every home-screen load triggers a fan-out of calls across dozens of services (catalog, pricing, discounts, serviceability, ETA prediction) that all have to resolve within a tight latency budget, or the app feels slow. On top of that, Swiggy runs a live logistics-optimization problem 24/7 — matching thousands of concurrent orders to the nearest available delivery partner while accounting for traffic, restaurant prep time, and partner location, all in real time.

---

## Frontend Stack

| Technology | Why it's used | Benefits |
|---|---|---|
| **React.js** | Powers Swiggy's customer-facing web app. | Component reuse, fast UI updates for a catalog/cart-heavy interface. |
| **React Native** (commonly reported; not officially detailed by Swiggy) | Likely used for parts of the mobile experience given widespread industry adoption at this app category and scale. | Shared logic across iOS/Android where used. |
| **Kotlin (Android)** | Native Android development for the primary customer and delivery-partner apps, standard for performance-sensitive, GPS-heavy consumer apps at this scale. | Native performance for location tracking, push notifications, background services. |
| **Swift (iOS)** | Native iOS development, same rationale as Kotlin above. | Native performance and tighter OS integration for real-time tracking features. |

*Swiggy's customer, restaurant, and delivery-partner apps are each separate native or hybrid applications — this is inferred from the product's three-sided marketplace structure and common practice for delivery apps at this scale, since Swiggy hasn't published a detailed frontend-stack breakdown.*

---

## Backend Stack

Swiggy's backend is a large, Java-centric microservices architecture. <cite index="41-1">Swiggy is largely a Java shop, using Java 8 with Spring Boot as an abstraction layer providing tools for caching, auditing, and pipeline building across its microservice architecture.</cite> Public job postings and engineering blog posts also reference Go, Python, and Node.js for specific newer services, consistent with a large organization that's added languages over time rather than mandating a single stack.

**Architecture pattern:** <cite index="38-1">Swiggy runs 400+ microservices in production, with 130+ directly in the order-fulfillment path (home page rendering through delivery).</cite> Requests from mobile/web clients pass through an API gateway responsible for routing and load balancing to the appropriate backend services, a standard pattern for this kind of large microservices estate.

**Resilience engineering** is a heavily documented theme in Swiggy's own engineering writing. <cite index="38-1">Because dependencies are federated (owned by different teams and updated continuously), a single "fixed latency budget per dependency" approach doesn't hold up in production — Swiggy's engineering team has written specifically about how a downstream microservice's SLA (e.g., a cart-pricing service promising 100ms at P99) can't be evenly split across its own dependencies with a naive fixed formula, since real-world P99 distributions shift over time.</cite> This has pushed Swiggy toward more adaptive resilience patterns (circuit breakers, dynamic timeout budgets, fallback logic) so that a slowdown or brownout in one microservice doesn't cascade into a platform-wide outage.

**Logistics platform:** Swiggy has publicly written about re-architecting its logistics/serviceability platform — the system responsible for determining what's deliverable to a given address, assigning delivery partners, and tracking live order status — as the company expanded from pure food delivery into Instamart, Stores, and Genie, unifying logistics capabilities across all of them rather than building separate systems per vertical.

---

## Database

| Database | Why it's used | What it stores |
|---|---|---|
| **MySQL** | <cite index="41-1">Used as Swiggy's core transactional data store.</cite> | Orders, transactions, user accounts — data needing strong consistency. |
| **PostgreSQL** | Referenced across multiple independent sources describing Swiggy's stack. | Additional transactional/relational workloads across services. |
| **Elasticsearch** | <cite index="41-1">Used as a NoSQL layer for aggregation, reporting, and ad-hoc queries.</cite> Also referenced for restaurant/menu search. | Restaurant and menu search, catalog browsing, analytics queries. |
| **Redis** | Widely reported caching layer across Swiggy's stack. | Session data, hot-path caching (e.g., cart state, frequently accessed catalog data). |
| **Aerospike** | Reported in multiple independent stack breakdowns as part of Swiggy's caching/low-latency layer. | High-throughput, low-latency key-value data — a common choice for ad-tech-style real-time lookups at Swiggy's scale. |
| **ScyllaDB** | Reported in independent stack summaries. | Likely used for high-write-throughput workloads such as order/logistics event data, similar to its use at other high-scale consumer platforms. |

*Some of the above (Aerospike, ScyllaDB) come from third-party stack-analysis sources rather than Swiggy's own engineering blog, so they should be read as commonly reported rather than officially confirmed.*

---

## Infrastructure

- **Cloud provider — AWS**, consistently reported as Swiggy's primary cloud provider across engineering write-ups and job postings.
- **Containers & orchestration** — Docker and Kubernetes are commonly cited for Swiggy's microservices deployment, consistent with a 400+ microservice estate that needs automated scaling and deployment.
- **Message brokers — Kafka and RabbitMQ**, widely reported as Swiggy's event-streaming and async-messaging backbone, used to decouple services in the order-fulfillment pipeline (e.g., order-placed events triggering downstream restaurant-notification, partner-assignment, and customer-tracking services independently).
- **Logging & observability — Sumo Logic**, <cite index="41-1">used as a core part of Swiggy's tech stack, notably for its LogReduce feature which automatically recognizes and compresses duplicate log entries so engineers can find root causes faster.</cite>
- **API Gateway** — sits in front of the microservices estate to handle routing, load balancing, authentication, and rate limiting for the 400+ backend services.

---

## APIs & Services

- **Maps & routing** — Google Maps Platform (or an equivalent mapping provider) for address geocoding, delivery-partner routing, and live tracking; standard for any hyperlocal delivery platform.
- **Payments** — UPI, Razorpay, Paytm, and Swiggy's internal wallet, commonly cited across write-ups of Swiggy's payment integrations, reflecting India's UPI-first payments landscape.
- **Notifications** — push notification services (FCM for Android, APNs for iOS) plus SMS/WhatsApp-based order updates, standard for keeping three different user types (customer, restaurant, delivery partner) informed in real time.
- **Search** — Elasticsearch-backed restaurant and dish search, referenced in Swiggy's own engineering blog under search-performance work.
- **AI/ML services** — internal ML models for ETA prediction, delivery-partner allocation, and personalized recommendations on the home feed — a major and recurring theme in Swiggy's public engineering writing, even where specific model architectures aren't disclosed.

---

## Scaling Techniques

- **Microservices decomposition** — <cite index="38-1">400+ services in production allow small, independent teams to own, develop, test, and release functionality without blocking each other.</cite>
- **Adaptive latency budgeting** instead of fixed per-dependency timeout splits, so that a service's SLA holds up even as its downstream dependencies' performance shifts over time.
- **Circuit breakers and fallback logic** to prevent a single failing/slow microservice from cascading into a platform-wide brownout — explicitly discussed in Swiggy's engineering blog series on resilient microservices.
- **Event-driven architecture via Kafka/RabbitMQ** to decouple the order-fulfillment pipeline into independently scalable stages.
- **Caching layers (Redis/Aerospike)** to absorb read-heavy traffic on catalog and pricing data without hitting the primary transactional databases on every request.
- **Serviceability/logistics platform re-architecture** — unifying delivery-partner assignment and address-serviceability logic across Swiggy's multiple verticals (food, Instamart, Genie) instead of maintaining separate systems, reducing duplicated engineering effort as new business lines launch.

---

## Security & Reliability

- **API Gateway-level authentication and authorization** for all client requests before they reach internal microservices.
- **Resilience patterns (circuit breakers, adaptive timeouts, fallback responses)** are a first-class engineering concern at Swiggy, given how many services sit on the critical path of a single order.
- **Encrypted transport (HTTPS/TLS)** for all client-server communication, standard for any app handling payment and location data.
- **Payment security** — reliance on established, PCI-compliant third-party payment processors (Razorpay, Paytm, UPI rails) rather than handling raw card data internally, a standard and safer pattern for consumer apps at this scale.
- **Centralized logging (Sumo Logic)** enabling faster root-cause analysis during incidents.

---

## Performance Optimizations

- **Search performance work** — Swiggy's engineering blog has published specifically on making restaurant/dish search "blazing fast," indicating dedicated investment in search-latency optimization (indexing strategy, query optimization) on top of Elasticsearch.
- **Caching hot-path data** (catalog, pricing, cart state) in Redis/Aerospike to avoid repeated expensive computation or database round-trips on every home-screen load.
- **CDN-backed image delivery** for restaurant and dish photos — standard practice for a highly visual, catalog-browsing app experience.
- **Opinionated internal tooling** — Swiggy's engineering blog references an internal "Swiggy-Rest" CRUD library built on Spring, suggesting standardized, optimized patterns for building new microservices quickly and consistently rather than each team reinventing common CRUD/data-access boilerplate.

---

## Engineering Challenges

**Home-page computation complexity.** <cite index="38-1">Rendering Swiggy's home page for a single user involves a chain of computations across many backend services to produce a personalized, orderable set of options — restaurants and items filtered by serviceability, availability, and relevance.</cite> Coordinating that many service calls within an acceptable latency budget, without any single slow dependency degrading the whole page load, is a recurring and explicitly documented engineering problem.

**Cascading failure prevention.** With 130+ services directly in the order path, a naive architecture would let one slow or failing service take down the entire ordering flow. Swiggy's public engineering writing on resilient microservices — dynamic latency budgeting, circuit breaking, graceful degradation — exists specifically to prevent that.

**Real-time logistics matching.** Assigning the right delivery partner to the right order, accounting for live location, traffic, and restaurant prep time, at the scale of millions of daily orders, is a continuous optimization problem that Swiggy has re-architected multiple times as it expanded into new verticals (Instamart, Genie).

**Multi-vertical platform unification.** As Swiggy expanded beyond food delivery, a recurring engineering theme has been building shared logistics/serviceability infrastructure that multiple business lines (food, grocery, courier) can use, instead of duplicating delivery-partner allocation and tracking logic per vertical.

---

## Infrastructure Cost Considerations

- **Compute** — 400+ microservices running continuously across AWS is likely Swiggy's largest and most variable cost center, scaling up sharply during meal-time demand spikes.
- **Database & caching infrastructure** — MySQL/PostgreSQL for transactional data plus Redis/Aerospike caching layers represent a significant, always-on cost given order volume.
- **Maps/location API calls** — geocoding, routing, and live-tracking calls at the volume of millions of daily deliveries are a meaningful and easy-to-underestimate cost category for any hyperlocal logistics platform.
- **ML/AI infrastructure** — ETA prediction and delivery-partner allocation models likely require dedicated, always-on inference infrastructure given how central these predictions are to the core product experience.
- **Third-party payment processing fees** — a per-transaction cost tied directly to order volume, though this is a payments-processing cost rather than infrastructure per se.

*(No dollar figures are invented — Swiggy has not published a detailed cost breakdown.)*

---

## Student Version

### Frontend
React for web, React Native for a shared mobile codebase (cheaper to build and maintain solo than separate native apps for a learning project).

### Backend
Node.js with Express, or Java with Spring Boot if you want stack parity with Swiggy's real engineering culture — both are free and well-documented for building a REST API around restaurants, menus, and orders.

### Database
PostgreSQL (free-tier friendly on Supabase or Railway) for orders/users/restaurants; add Redis (Upstash free tier) once you want to cache menu data.

### Authentication
Firebase Auth or Supabase Auth for free email/OAuth login instead of building your own auth system.

### Storage
Supabase Storage or Cloudflare R2 free tier for restaurant/dish images.

### Deployment
Frontend on Vercel/Netlify; backend on Render or Railway free/hobby tiers. For a genuinely impressive student project, add a simple real-time order-tracking feature using Socket.IO — a scaled-down version of exactly the kind of live-tracking problem Swiggy solves at massive scale.

---

## Technologies Used (Summary Table)

| Layer | Technology | Purpose |
|---|---|---|
| Frontend (Web) | React.js | Customer-facing web app |
| Mobile Apps | Kotlin (Android), Swift (iOS) | Native customer/partner apps |
| Backend | Java, Spring Boot (+ Go, Python, Node.js for specific services) | 400+ microservices |
| Transactional DB | MySQL, PostgreSQL | Orders, users, transactions |
| Search/Analytics | Elasticsearch | Restaurant & menu search, reporting |
| Caching | Redis, Aerospike | Low-latency hot-path data |
| Cloud Provider | AWS | Compute, storage, networking |
| Messaging | Kafka, RabbitMQ | Event-driven order pipeline |
| Logging | Sumo Logic | Centralized log aggregation |
| Payments | Razorpay, Paytm, UPI, internal wallet | Order payments |

---

## Engineering Lessons

1. **Microservices scale team autonomy, not just traffic** — 400+ services exist primarily to let small teams ship independently.
2. **Fixed latency budgets don't survive contact with production** — adaptive, measured approaches beat static formulas in a federated-ownership environment.
3. **Resilience has to be designed in, not bolted on** — circuit breakers and fallbacks matter most exactly where they're hardest to add (deep in a 130-service critical path).
4. **Search deserves dedicated engineering investment** — Swiggy treats "fast search" as its own engineering problem worth a blog series, not an afterthought.
5. **Logistics platforms should be built for reuse across business lines**, not duplicated per vertical, as the product portfolio grows.
6. **Centralized, smart log tooling (like LogReduce) pays for itself** the first time it cuts incident-diagnosis time from hours to minutes.
7. **Internal opinionated frameworks (like an internal CRUD library) reduce cross-team inconsistency** at large microservice counts.
8. **Cache aggressively on read-heavy, compute-heavy paths** like personalized home-feed rendering.
9. **Decouple with event streams** so that one part of the order lifecycle (e.g., partner assignment) can evolve independently of another (e.g., customer notifications).
10. **Expect and design for demand spikes** — meal-time traffic patterns make Swiggy's load profile far spikier than many consumer apps, which pushes toward elastic, auto-scaling infrastructure.

---

## References

- Swiggy Bytes (Official Engineering Blog) — [Designing Resilient Microservices — Part 1](https://bytes.swiggy.com/designing-resilient-microservices-part-1-6a72fe964759)
- Swiggy Bytes — [Architecture and Design Principles Behind Swiggy's Delivery Partners App](https://bytes.swiggy.com/architecture-and-design-principles-behind-the-swiggys-delivery-partners-app-4db1d87a048a)
- Swiggy Bytes — Engineering blog index (search, resilience, serviceability platform series): [bytes.swiggy.com](https://bytes.swiggy.com)

*Note: Several stack details (Aerospike, ScyllaDB, specific frontend mobile framework choices, exact payment providers) are drawn from third-party analyses and commonly reported industry sources rather than Swiggy's own official documentation, and are flagged accordingly throughout this article.*
