# 🧱 Stack Breakdown — Uber

> Real product. Real engineering. Learn how it's likely built.

---

## Product Overview

Uber connects riders with drivers (and, through Uber Eats, diners with couriers and restaurants) in real time. It's fundamentally a "physical world, real-time" problem: matching supply and demand, tracking live location, calculating dynamic pricing, and processing payments — all within seconds, across hundreds of cities worldwide.

<cite index="60-1">Unlike freemium apps, Uber's users are all transactional — riders, drivers, eaters, and couriers — and the whole system has to stay reliable in real time, with real money and real people involved.</cite>

---

## Frontend Stack

- **Native mobile apps** — <cite index="65-1">Android apps are written in Java, and iOS apps in Swift,</cite> chosen for maximum performance and full access to phone features like GPS.
- **RxJava** — <cite index="68-1">used to simplify asynchronous and event-based programming on Android.</cite>
- **React + Flux, D3, Mapbox** — <cite index="68-1">used for Uber's web front-end applications, including internal visualizations that help teams understand what's happening across the marketplace in real time.</cite>
- **NGINX** — <cite index="66-1">handles the front end, performing SSL termination and some authentication before requests reach the backend.</cite>

**Why it matters:** Maps, live location, and instant updates are central to the product — so native performance and mapping libraries (like Mapbox) are a bigger deal here than in a typical consumer app.

---

## Backend Stack

Uber's backend evolved dramatically over time — a great real-world lesson in how architecture has to change as a company scales.

**The early years:** <cite index="62-1">Uber started on a classic LAMP stack (PHP + MySQL) in 2009, then became an early adopter of Node.js for its dispatch service in 2011, alongside Python (Flask) for its API layer.</cite>

**The move to microservices:** <cite index="62-1">By 2013, the architecture shifted from a single monolith to microservices, with Python as the primary framework — a transition that introduced real operational complexity.</cite>

**Today's core languages — Go and Java.** <cite index="60-1">Uber adopted Go and Java specifically for high performance, giving both first-class support. Java taps into a large open-source ecosystem and integrates well with tools like Hadoop, while Go offers efficiency, simplicity, and fast runtime speed</cite> — <cite index="60-1">ideal for most new performance-critical services, thanks to its native support for concurrency.</cite> <cite index="68-1">The core trip execution engine was originally built in Node.js for its async, single-threaded processing model — Uber was actually one of the first two companies to run Node.js in production — but it's increasingly been rewritten in Go over time.</cite>

**From microservices to DOMA.** As Uber grew to thousands of microservices, plain microservices architecture started causing its own problems (hard-to-track dependencies, unclear ownership). <cite index="66-1">Uber developed an approach called DOMA — Domain-Oriented microService Architecture — which groups related microservices into "domains," organizes domains into layers, and uses domain gateways so each domain's internal logic stays independent from the others in the same layer,</cite> turning what had become an unwieldy web of services back into something a team could reason about clearly.

**Connecting all those services — Hyperbahn, TChannel, Ringpop.** <cite index="60-1">With hundreds of interdependent microservices, service discovery and routing became critical — Uber built and open-sourced Hyperbahn (plus TChannel and Ringpop) specifically to add automation, intelligence, and performance to this network of services,</cite> alongside more conventional tools like HAProxy.

**The API Gateway.** <cite index="69-1">Uber's API gateway acts as the single point of entry for all its apps, handling routing, protocol conversion, rate limiting, load shedding, and security auditing in one centralized place</cite> — built in Go and Java <cite index="69-1">after Uber decided to align gateway development with the languages its internal platform teams already supported, moving off an earlier Node.js-based generation.</cite>

---

## Database

Uber deliberately uses different databases for different jobs rather than one-size-fits-all:

| Database | Why it's used |
|---|---|
| **Schemaless** (built in-house on MySQL) | <cite index="60-1">Used for long-term data storage,</cite> <cite index="62-1">resembling Google's Bigtable design</cite> — originally built to store trip data reliably at scale. |
| **Cassandra** | <cite index="60-1">Used where high availability and low latency matter most; Cassandra gradually replaced Riak over time for better speed and performance.</cite> |
| **Riak** (earlier) | <cite index="60-1">Originally used alongside Schemaless to meet high-availability, low-latency demands, before Cassandra took over that role.</cite> |
| **Redis** | <cite index="60-1">Used for both caching and queuing, with Twemproxy adding scalability to the caching layer via consistent hashing without hurting the cache hit rate.</cite> |
| **Hadoop warehouse** | <cite index="60-1">Used for distributed storage and analytics on complex data.</cite> |
| **MySQL/PostgreSQL** (legacy) | <cite index="60-1">Older individual instances that Schemaless has gradually been replacing over time.</cite> |

**Simple idea to remember:** Uber didn't try to force one database to do everything — trip history needs durability, live matching needs speed, and analytics needs scale, so each got its own purpose-built system.

---

## Infrastructure

- **Docker + Mesos + Aurora** — <cite index="60-1">Uber runs its microservices in Docker containers on Mesos for scalable, consistent deployment, with Aurora handling long-running services and scheduled (cron) jobs.</cite>
- **Internal build tooling** — <cite index="60-1">an internal "Application Platform" team built a template library that packages services into shippable Docker images automatically.</cite>
- **Celery** — <cite index="60-1">Celery workers process asynchronous workflow operations backed by Redis.</cite>
- **Kafka** — <cite index="68-1">used for data streaming across Uber's Marketplace systems.</cite>
- **Hive, MapReduce, HDFS, Elasticsearch** — <cite index="68-1">used together for data storage, querying, and processing at scale within Uber's data platform.</cite>

---

## APIs & Services

- **Maps & routing** — core to virtually everything Uber does: matching, ETAs, live tracking, and pricing all depend on accurate mapping data.
- **Payments** — real-time, high-reliability payment processing for both riders/eaters and drivers/couriers (who need to get paid quickly and accurately).
- **API Gateway** — <cite index="69-1">a self-serve system where engineers configure a new API's routing, rate limits, and allowed clients through a UI, and the gateway infrastructure automatically turns that configuration into a working API — even auto-generating client SDKs for the mobile apps to consume.</cite>
- **Marketplace data platform** — <cite index="68-1">a dedicated data team turns live marketplace data (supply, demand, pricing) into visualizations and analytics that help teams understand the state of the system in real time.</cite>

---

## Scaling Techniques

- **Microservices, then DOMA** — <cite index="66-1">grouping related microservices into clearly bounded "domains" with their own gateways, so growth in service count doesn't turn into unmanageable chaos.</cite>
- **Purpose-built databases per workload** — using Schemaless for durability, Cassandra for speed, and Hadoop for analytics, instead of one database trying to do everything.
- **Language specialization** — <cite index="60-1">using Go specifically where runtime speed and concurrency matter most, and Java where the broader ecosystem and analytics integrations matter more.</cite>
- **Service discovery infrastructure (Hyperbahn)** — purpose-built tooling so that as the service count grows into the hundreds or thousands, finding and calling the right service reliably doesn't become its own bottleneck.
- **Centralized API gateway** — one well-controlled entry point for rate limiting, load shedding, and routing across a huge and fast-moving set of backend services.

---

## Security & Reliability

- **SSL termination and authentication at the edge (NGINX)** before requests even reach internal services.
- **Rate limiting and load shedding** built directly into the API gateway to protect backend services from being overwhelmed.
- **Domain isolation (DOMA)** — <cite index="65-1">without a system like this, failures in one interdependent microservice can easily cascade to others; grouping and gating access by domain limits that blast radius.</cite>
- **Dedicated data pipelines for logging** — <cite index="65-1">Uber built independent services specifically to push, transport, and temporarily store the huge volume of operational data it generates every day,</cite> which supports both debugging and business monitoring.

---

## Performance Optimizations

- **Go for performance-critical services** — chosen specifically for efficiency and native concurrency support.
- **Asynchronous processing everywhere** — from the original Node.js-based trip engine to Celery workers handling async workflows.
- **Consistent-hashing cache layer (Twemproxy + Redis)** to scale caching without sacrificing hit rate.
- **Purpose-built service discovery (Hyperbahn/TChannel/Ringpop)** to keep inter-service communication fast even as the service count grows into the thousands.

---

## Engineering Challenges

- **Real-time matching in the physical world.** Uber's problems aren't just software problems — they involve real GPS data, real traffic, and real drivers moving through real cities, all needing near-instant coordination.
- **Explosive microservice growth.** <cite index="65-1">Building thousands of independent services brings real challenges: discovering the right service becomes hard, interdependencies must be tightly monitored, and failures can cascade if not handled carefully</cite> — this is exactly what pushed Uber toward DOMA.
- **Operating across hundreds of cities simultaneously**, <cite index="60-1">each potentially with different local rules, pricing, and driver/rider dynamics.</cite>
- **Keeping four separate mobile codebases (Android rider, Android driver, iOS rider, iOS driver) reliable** while hundreds of engineers ship code into them continuously.

---

## Infrastructure Cost Considerations

- **Compute** — running thousands of always-on microservices across a global footprint is Uber's largest ongoing infrastructure cost.
- **Database infrastructure** — running multiple specialized databases (Schemaless, Cassandra, Hadoop) in parallel, each optimized for a different job, adds cost but avoids forcing one system to do everything poorly.
- **Real-time data streaming (Kafka)** — processing live location, matching, and pricing events across the entire platform.
- **Mapping/location services** — a huge and easy-to-underestimate cost category, since virtually every core feature depends on accurate live mapping data.

*(No specific dollar figures are invented — these are the most likely major technical cost buckets.)*

---

## Student Version

- **Frontend:** React Native or Flutter for a shared rider/driver app codebase (cheaper for a solo/student project than fully native apps).
- **Backend:** Node.js or Go (if you want to mirror Uber's real performance-focused choice) with Express or Gin.
- **Database:** PostgreSQL for structured data (users, trips, payments); Redis for live location/caching.
- **Maps:** Mapbox or Google Maps Platform free tier for routing and live tracking.
- **Authentication:** Firebase Auth or Supabase Auth.
- **Deployment:** Vercel/Netlify for frontend, Render/Railway for backend.

A great mini-project: build a simple "rider requests a ride, nearest driver gets notified" matching system using WebSockets — a small-scale version of the real-time matching problem at Uber's core.

---

## Technologies Used (Summary Table)

| Layer | Technology | Purpose |
|---|---|---|
| Mobile Apps | Java (Android), Swift (iOS) | Native rider/driver apps |
| Web Frontend | React + Flux, D3, Mapbox | Web dashboards & visualizations |
| Backend Languages | Go, Java (was Node.js, Python) | Performance-critical microservices |
| Architecture | Microservices → DOMA | Organizing thousands of services |
| Service Discovery | Hyperbahn, TChannel, Ringpop | Finding & routing between services |
| API Layer | Custom API Gateway | Centralized routing, rate limiting |
| Long-term Storage | Schemaless (on MySQL) | Trip history & durable data |
| Fast/High-Availability Storage | Cassandra (was Riak) | Low-latency reads/writes |
| Caching/Queuing | Redis, Twemproxy, Celery | Fast lookups, async task processing |
| Analytics | Hadoop, Hive, MapReduce, HDFS | Large-scale data processing |
| Streaming | Kafka | Real-time event data |
| Containers | Docker, Mesos, Aurora | Running microservices at scale |

---

## Engineering Lessons

1. Expect your stack to change dramatically as you scale — Uber went from PHP to Node.js/Python to Go/Java over about a decade.
2. Use different databases for different jobs rather than forcing one system to handle everything.
3. Microservices solve some problems and create new ones (discovery, cascading failure) — plan for that from the start.
4. When microservices alone stop scaling organizationally, consider a higher-level grouping structure (like Uber's DOMA) instead of just adding more services.
5. Build dedicated infrastructure (like Hyperbahn) once service-to-service communication itself becomes a bottleneck.
6. A centralized, self-serve API gateway saves enormous engineering time once you have many teams shipping APIs independently.
7. Match your language choice to the actual performance need, not just team preference.
8. Real-world, real-time problems (like ride matching) require different engineering priorities than typical web-app problems — location accuracy and latency matter more than almost anything else.

---

## References

- Uber Engineering Blog — [The Uber Engineering Tech Stack, Part I: The Foundation](https://www.uber.com/en-FI/blog/tech-stack-part-one-foundation/)
- Uber Engineering Blog — [The Uber Engineering Tech Stack, Part II: The Edge and Beyond](https://www.uber.com/us/en/blog/uber-tech-stack-part-two/)
- Uber Engineering Blog — [The Architecture of Uber's API Gateway](https://www.uber.com/blog/architecture-api-gateway/)
- Flexiple — [Lessons in Product Building by Making Sense of Uber Engineering](https://flexiple.com/developers/making-sense-of-ubers-engineering)

*Note: Uber's stack has evolved substantially since some of these posts were published (particularly the 2016 tech-stack articles) — this breakdown reflects both historical and more recent public information, flagged where the timeline matters.*
