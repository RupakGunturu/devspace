# 🧱 Stack Breakdown — Amazon

> Real product. Real engineering. Learn how it's likely built.

---

## Product Overview

Amazon.com is the world's largest e-commerce platform — a catalog of hundreds of millions of products, serving hundreds of millions of customers, with orders needing to go from "click" to "delivered" reliably every time. Amazon is also famous for something else: it was one of the earliest large companies to break its website apart into independent services — what we now call microservices — years before that term was common, and its internal cloud infrastructure eventually became AWS (Amazon Web Services), the company's other massive business.

The core engineering challenge: a single product page load can trigger requests to **over 150 different backend services** — catalog, pricing, reviews, recommendations, inventory — and all of them need to respond fast, because a slow page loses customers.

---

## Frontend Stack

Amazon hasn't published a full breakdown of its exact frontend framework choices, but based on its scale and hiring patterns, it's reasonable to infer:

- **Server-side rendering** for fast initial page loads on the product catalog — critical for e-commerce, where even small delays measurably hurt sales.
- **A mix of internal frameworks and modern JavaScript tooling**, since Amazon.com predates most current frontend frameworks and has evolved gradually rather than doing one clean rewrite.
- **React** is commonly used across newer Amazon properties and internal tools, consistent with broad industry adoption at this scale.

*Amazon has not published detailed public information about its exact frontend stack for Amazon.com — this section reflects reasonable, industry-standard inference rather than confirmed fact.*

---

## Backend Stack

Amazon's backend is a huge, deeply **service-oriented architecture (SOA)** — the direct ancestor of what we now call microservices.

**How it started.** <cite index="58-1">Around 2000, Amazon's engineering team faced a painful process: reconciling code changes from hundreds of developers, resolving conflicts, and merging everything into one giant version before it could go to production — a slow, overloaded delivery pipeline.</cite> That pain pushed Amazon toward **decoupling** — breaking the one big application into many independent services that teams could update separately.

**How it works today.** <cite index="57-1">Amazon's platform is built as a highly decentralized, loosely coupled, service-oriented architecture — a single typical page request to the e-commerce site can involve calls to over 150 different services,</cite> and <cite index="57-1">those services often depend on each other, so the full call graph is usually more than one level deep.</cite>

**Why speed matters so much.** <cite index="57-1">Each service has to meet its own Service Level Agreement (SLA) for response time and availability, because a slow or broken feature can make a potential customer leave the site for good.</cite> <cite index="57-1">Interestingly, the actual business logic behind most of these services is fairly lightweight — the real complexity of scale lives on the data/storage side,</cite> which is exactly why Amazon invested so heavily in building its own database technology (more on that below).

---

## Database

**Dynamo → DynamoDB** is Amazon's most famous database story.

<cite index="53-1">In its early years, Amazon realized that letting applications talk directly to traditional enterprise relational databases invited scalability problems — managing connections, handling concurrent load, and dealing with schema changes — while high availability was critical, since any downtime directly hurt revenue.</cite> <cite index="53-1">This need led to Dynamo: a highly scalable, available, and durable key-value database built for fast-changing data, like a shopping cart.</cite>

<cite name="57">Dynamo's interface was deliberately simple — just two operations: `get()` (find data by key) and `put()` (write data by key), plus a version-tracking mechanism to handle conflicting updates.</cite>

The one drawback: <cite index="53-1">Dynamo was single-tenant, meaning each team had to run and manage their own separate installation of it.</cite> <cite index="53-1">Amazon's engineers eventually combined the best parts of the original Dynamo (scalability, predictable performance) with the best parts of another internal system called SimpleDB (ease of administration, consistency, a table-based data model), which led to the public launch of DynamoDB as an AWS service in 2012.</cite>

**How DynamoDB actually works under the hood:** <cite index="53-1">DynamoDB itself is made up of tens of microservices,</cite> with requests flowing through <cite index="53-1">a request router that first checks authentication (via AWS IAM) and then fetches routing information from a metadata service that tracks tables, indexes, and replication groups.</cite> <cite index="54-1">Tables are distributed and replicated across multiple Availability Zones, and a write only succeeds once a healthy quorum of replicas (two out of three, across different zones) confirms it — if a replica goes down, the system quickly adds a replacement to keep that quorum available.</cite>

**Just how big does this get?** <cite index="51-1">During Prime Day 2022, DynamoDB maintained high availability with single-digit-millisecond responses while peaking at 105.2 million requests per second.</cite>

Beyond DynamoDB, Amazon.com almost certainly also uses relational databases (like Amazon RDS) for data that needs strict consistency (orders, payments) and object storage (Amazon S3) for images and static files — standard practice across AWS-based architectures generally, and consistent with Amazon's own published reference architectures.

---

## Infrastructure

- **AWS (Amazon Web Services)** — Amazon.com itself runs on the same cloud infrastructure that Amazon sells to the rest of the world, including EC2 (virtual servers), S3 (storage), Lambda (serverless functions), and many more.
- **Service-Oriented / Microservices architecture** — hundreds of independently deployable services, each with its own database when possible, so no single team's changes can break someone else's service.
- **Amazon SQS and SNS** — standard AWS messaging/queueing services, used broadly across AWS-based architectures for decoupling services (e.g., "order placed" can trigger inventory update, shipping, and notification services independently).
- **Amazon ElastiCache** — a caching layer to reduce load on primary databases for frequently accessed data.
- **CI/CD pipelines** — Amazon's early struggles with a slow, conflict-heavy release process are exactly what pushed it toward decoupled services and (eventually) far more automated, independent deployment pipelines per service.

---

## APIs & Services

- **AWS IAM (Identity and Access Management)** — handles authentication and authorization checks for internal service calls, as seen directly in DynamoDB's own request-routing flow.
- **Payments** — Amazon Pay and internal payment processing systems, built for extremely high reliability given the direct revenue impact of any failure.
- **Recommendations** — Amazon's product recommendation engine ("customers who bought this also bought...") is one of its most famous and earliest large-scale machine learning use cases.
- **Search** — a dedicated product-search service (Amazon doesn't publish full technical detail, but this is understood to be one of the most heavily-optimized services on the platform given how central search is to the shopping experience).
- **Logistics/fulfillment services** — inventory tracking, warehouse routing, and shipping integration, all as separate backend services in Amazon's SOA.

---

## Scaling Techniques

- **Service-oriented architecture from very early on** — <cite index="58-1">Amazon decoupled its services well before "microservices" was a common industry term,</cite> directly motivated by how painful it had become to ship a single, giant, tightly-coupled application.
- **Independent SLAs per service** — <cite index="57-1">each of the 150+ services behind a typical page load is individually responsible for its own response-time and availability targets,</cite> so the system doesn't rely on one giant, shared performance budget.
- **Purpose-built databases instead of one-size-fits-all** — Dynamo/DynamoDB exists specifically because relational databases didn't fit Amazon's scale and availability requirements for certain workloads (like the shopping cart).
- **Multi-Availability-Zone replication** for high availability — data is written to multiple physical locations before being considered durable.
- **Massive horizontal scaling** — DynamoDB's proven ability to handle over 100 million requests per second (during Prime Day) shows the kind of headroom Amazon builds in for predictable, extreme traffic spikes.

---

## Security & Reliability

- **AWS IAM-based authentication** for internal service-to-service calls.
- **Quorum-based writes across Availability Zones** — a write isn't considered successful until enough independent replicas confirm it, protecting against data loss from a single failure.
- **Continuous data verification** — <cite index="53-1">Amazon's own lessons from building DynamoDB include the importance of continuously verifying data-at-rest to catch and fix corruption before it becomes a bigger problem.</cite>
- **High availability by design** — <cite index="53-1">Amazon has explicitly stated that designing systems for predictability, rather than pure efficiency, tends to produce more stable systems overall.</cite>
- **Encrypted transport (HTTPS/TLS)** for all customer-facing and internal traffic, standard practice for any platform handling payment data.

---

## Performance Optimizations

- **Single-digit-millisecond database responses** at Amazon's DynamoDB scale, even during massive traffic events like Prime Day.
- **Caching layers (ElastiCache)** to avoid hitting primary databases for frequently requested data.
- **Server-side rendering** for fast initial page loads on product pages.
- **Lightweight business logic per service**, pushing complexity down into the data layer where it can be handled by purpose-built systems like DynamoDB rather than application code.
- **Adaptive systems** — <cite index="53-1">DynamoDB is designed to adapt to the traffic patterns of the applications using it, improving customer experience without requiring manual tuning for every workload.</cite>

---

## Engineering Challenges

- **A single page load touching 150+ services.** <cite index="57-1">Coordinating that many dependent service calls, each with its own performance target, while still returning a fast, correct page to the customer, is a constant and central engineering challenge.</cite>
- **Extreme, predictable traffic spikes** — events like Prime Day push infrastructure to handle over 100 million database requests per second without breaking a sweat.
- **Balancing consistency and availability** — for a shopping cart or an order, Amazon has to make careful tradeoffs about when strict consistency matters (payments) versus when eventual consistency is acceptable (product view counts).
- **Operating both a retail giant and a cloud giant on the same underlying infrastructure principles** — lessons learned running Amazon.com directly shaped AWS as a product, and AWS's own reliability requirements now shape how Amazon.com is run.

---

## Infrastructure Cost Considerations

- **Compute** — hundreds of services running continuously, at global scale, is an enormous and constantly-optimized cost center (which is part of why Amazon is so deeply invested in AWS's own cost-efficiency tooling).
- **Storage** — a catalog of hundreds of millions of products, plus customer data, images, and order history, at a truly massive scale.
- **Database throughput** — running systems capable of 100+ million requests per second (as seen on Prime Day) is a major and highly variable cost, spiking hugely during sales events.
- **Logistics/fulfillment technology** — warehouse and shipping systems, while more "operations" than pure software infrastructure, represent a huge technology investment in their own right.

*(No specific dollar figures are invented — these are the most likely major technical cost buckets, based on Amazon's public architecture disclosures.)*

---

## Student Version

- **Frontend:** React or Next.js for a product catalog with server-side rendering for fast page loads.
- **Backend:** Node.js/Express or Java/Spring Boot for a small set of services (catalog, cart, orders).
- **Database:** PostgreSQL for orders/accounts (free-tier friendly on Supabase/Railway); try DynamoDB's free tier directly on AWS if you want hands-on experience with the exact technology Amazon itself uses.
- **Caching:** Redis (Upstash free tier) for product-page caching.
- **Authentication:** Firebase Auth or Supabase Auth.
- **Deployment:** Vercel/Netlify for frontend, Render/Railway for backend.

A great mini-project: split your app into at least three independent services (catalog, cart, orders) that talk to each other over simple REST APIs — a small-scale taste of exactly the "decoupled services" problem Amazon solved at massive scale over twenty years ago.

---

## Technologies Used (Summary Table)

| Layer | Technology | Purpose |
|---|---|---|
| Backend Architecture | Service-Oriented Architecture / Microservices | 150+ independent services per page load |
| Core Database | Dynamo → DynamoDB | Highly available key-value storage (e.g., shopping cart) |
| Relational Data | Amazon RDS (industry-standard inference) | Orders, accounts, structured data |
| Object Storage | Amazon S3 | Images, static files |
| Caching | Amazon ElastiCache | Reducing database load |
| Messaging | Amazon SQS / SNS | Decoupling services via async events |
| Auth | AWS IAM | Internal service authentication/authorization |
| Cloud Platform | AWS | Underlying infrastructure for everything above |

---

## Engineering Lessons

1. Decouple services before a slow, conflict-heavy release process forces your hand.
2. Give each service its own clear performance target (SLA) instead of one shared budget.
3. Build (or choose) the right database for the specific access pattern — a shopping cart's needs are not a financial ledger's needs.
4. Design for predictability over raw efficiency; predictable systems are easier to keep stable.
5. Continuously verify data at rest — don't assume storage is silently correct forever.
6. Plan explicitly for extreme, predictable spikes (sales events) rather than treating them as surprises.
7. The complexity of scale often lives in the data layer, not the business logic — invest accordingly.
8. Internal infrastructure built to solve your own problems can become a product in its own right (this is literally how AWS was born).

---

## References

- AWS Architecture Blog (Official) — [aws.amazon.com/blogs/architecture](https://aws.amazon.com/blogs/architecture/)
- ByteByteGo — [A Deep Dive into Amazon DynamoDB Architecture](https://blog.bytebytego.com/p/a-deep-dive-into-amazon-dynamodb)
- The New Stack — [What Led Amazon to Its Own Microservices Architecture](https://thenewstack.io/led-amazon-microservices-architecture/)
- System Design Codex — [How Amazon Dynamo Works](https://newsletter.systemdesigncodex.com/p/how-amazon-dynamo-works)

*Note: Amazon.com's exact frontend technology choices are not publicly detailed in the same depth as its database and backend architecture — those sections are flagged as reasonable inference rather than confirmed fact.*
