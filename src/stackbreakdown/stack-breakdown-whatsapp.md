# 🧱 Stack Breakdown — WhatsApp

> Real product. Real engineering. Learn how it's likely built.

---

## Product Overview

WhatsApp is a messaging app used by over 2 billion people to send texts, photos, voice notes, and make calls — all end-to-end encrypted. What makes WhatsApp famous in engineering circles isn't just its size, it's *how few engineers it took to build it*: at the time Facebook acquired it for $19 billion in 2014, <cite index="23-1">WhatsApp was handling 42 billion messages a day with just 50 engineers.</cite>

The core challenge: keep hundreds of millions of devices connected at once, deliver messages instantly and reliably, and do it all without needing a huge team or huge infrastructure budget.

---

## Frontend Stack

WhatsApp's client apps (Android, iOS, Web, Desktop) are native or near-native apps built per platform, optimized for low battery and data usage rather than flashy UI. Key ideas:

- **Native mobile apps** (Java/Kotlin on Android, Swift/Objective-C on iOS) for performance and battery efficiency.
- **Persistent connections** — the app keeps one long-lived connection to WhatsApp's servers open at all times (instead of repeatedly reconnecting), so messages arrive instantly.
- **Custom protocol on top of XMPP** — WhatsApp started with the open XMPP chat standard but modified it heavily, because standard XMPP <cite index="21-1">wasn't efficient enough for mobile — it used too much data and drained batteries too fast.</cite> The custom version is lighter and faster.
- **End-to-end encryption (Signal Protocol)** — added in 2016, so messages can only be read by sender and recipient, not even by WhatsApp itself.

---

## Backend Stack

This is where WhatsApp's story gets interesting — it deliberately avoided the "typical" stack.

**Erlang** is the core programming language for WhatsApp's servers. <cite index="21-1">Each user gets their own lightweight Erlang process, so messages move directly from one process to another with very little overhead.</cite> <cite index="22-1">Erlang processes don't share memory and are managed by lightweight schedulers that can run millions of processes across multiple cores — and if a process crashes, another process can simply restart it, making the whole system self-healing.</cite>

**Ejabberd** — <cite index="22-1">an open-source chat server written in Erlang, which WhatsApp heavily modified to optimize for message routing and delivery at their scale.</cite>

**One process per connection** — <cite index="26-1">when a phone connects, that connection becomes its own Erlang process that holds the session state and the network socket, with no connection pooling or multiplexing — just one process managing one user's connection, start to finish.</cite>

**Design philosophy** — <cite index="26-1">WhatsApp's engineers built the system around three goals: speed, reliability, and isolating failures, favoring small focused components, asynchronous processing everywhere, and partitioning backend systems into independent "islands" that fail without taking each other down.</cite>

---

## Database

| System | Why it's used | What it stores |
|---|---|---|
| **Mnesia** | <cite index="22-1">An Erlang-native distributed database — since it's written in Erlang itself, there's no mismatch between how the app and the database represent data.</cite> | Temporary/in-transit message data, session info. Messages are only kept until delivered, then deleted. |
| **MySQL (sharded)** | <cite index="21-1">Used for persistent data like user profiles and message history, split into shards so each shard only handles a subset of users, allowing the system to scale horizontally.</cite> | Long-term account/profile data. |

**Simple idea to remember:** WhatsApp doesn't try to store your whole chat history forever on its servers — messages are transient. <cite index="25-1">This "transience" simplifies the system a lot, since the architecture can focus on throughput and quick delivery instead of long-term storage.</cite>

---

## Infrastructure

- **FreeBSD** instead of Linux — <cite index="22-1">the founders chose FreeBSD partly because of their history working with it at Yahoo!, and partly because they found its networking stack handled their workload better after benchmarking both.</cite>
- **YAWS (Yet Another Web Server)** — <cite index="22-1">an Erlang-based web server used by WhatsApp for storing multimedia (photos, videos), also using WebSockets for fast two-way communication.</cite>
- **Vertical scaling first** — <cite index="21-1">before adding more servers, WhatsApp pushed each individual server to handle over 2 million concurrent connections</cite> — a deliberate "make each machine do more before adding more machines" strategy.
- **Own datacenters** — WhatsApp initially rented bare-metal servers (SoftLayer, now part of IBM), then moved onto Facebook/Meta's own infrastructure after the 2014 acquisition.

---

## APIs & Services

- **Push notifications** — third-party push services (like Google's push infrastructure on Android) to wake the app when a message arrives while it's in the background.
- **Signal Protocol** — the encryption library underneath end-to-end encryption, also used by Signal and other secure messengers.
- **WhatsApp Business API** — a separate service that lets businesses send messages to customers at scale (used for order confirmations, support, etc.).

---

## Scaling Techniques

- **One process per user connection** — Erlang's lightweight processes mean millions of simultaneous users don't need millions of expensive OS threads.
- **Vertical scaling before horizontal** — squeezing more out of each server first, since <cite index="21-1">vertical scaling is often simpler than adding more machines.</cite>
- **Sharded MySQL** for persistent data, so no single database has to hold everyone's account info.
- **Async, isolated "islands"** — <cite index="26-1">each part of the backend is partitioned so that if one node fails, a peer takes over, and replication flows one-way to keep things simple.</cite>
- **Hot code swapping** — <cite index="21-1">Erlang allows updating running code without disconnecting users</cite>, so WhatsApp can ship fixes without forcing everyone offline.
- **Overprovisioning** — <cite index="28-1">keeping extra server headroom on purpose, so sudden traffic spikes (major sports events, breaking news) don't overwhelm the system.</cite>

---

## Security & Reliability

- **End-to-end encryption (Signal Protocol)** for all chats, calls, and media by default since 2016.
- **"Let it crash" philosophy** — <cite index="29-1">instead of trying to prevent every possible error, Erlang's supervisors detect failing components and automatically restart them, so one error doesn't bring down the whole system.</cite>
- **Fault isolation** — partitioning backend systems into independently-failing pieces.
- **No long-term message storage on servers** — reduces the amount of sensitive data sitting on WhatsApp's infrastructure at any given time.

---

## Performance Optimizations

- Custom, lightweight protocol (instead of full XMPP) to cut down on data usage and battery drain.
- One persistent connection per device instead of frequent reconnects.
- Erlang's lightweight process model avoids the overhead of traditional OS threads.
- FreeBSD kernel tuning — <cite index="28-1">modifying kernel parameters like file descriptor and socket limits to support millions of connections per server.</cite>
- Continuous benchmarking — <cite index="28-1">regularly measuring CPU, context switches, and system calls to find and remove bottlenecks.</cite>

---

## Engineering Challenges

- **Keeping hundreds of millions of devices connected simultaneously**, each with a live, persistent connection.
- **Sudden traffic spikes** — <cite index="25-1">world events like earthquakes and soccer matches create massive, sudden spikes in message volume that the system has to absorb without falling over.</cite>
- **Scaling a small team alongside a massive user base** — <cite index="25-1">WhatsApp famously reached about 40 million users per engineer, largely by relying on the cloud/hosting provider to handle hardware and datacenter concerns while engineers focused purely on software.</cite>
- **End-to-end encryption at scale** — rethinking message delivery and key management so that encryption doesn't get in the way of speed or multi-device support.

---

## Infrastructure Cost Considerations

- **Compute** — thousands of cores running Erlang processes non-stop is the core, unavoidable cost.
- **Network bandwidth** — moving tens of billions of messages, photos, and calls daily.
- **Storage** — sharded MySQL for persistent account data, though message transience keeps this smaller than you'd expect for a messaging app this size.
- **Push notification infrastructure** — waking up apps across billions of devices reliably.

*(No specific dollar figures are published — WhatsApp is famous specifically for doing this with a lean cost structure relative to its scale.)*

---

## Student Version

You won't build Erlang-at-2-billion-users, but you can absolutely build a real-time chat app that teaches the same core ideas:

- **Frontend:** React or React Native for a shared web/mobile chat UI.
- **Backend:** Node.js with Socket.IO (event-driven, similar spirit to Erlang's async model, and free/well-documented) — or try Elixir + Phoenix Channels if you want to use the same language family WhatsApp does.
- **Database:** PostgreSQL for user accounts, Redis for tracking who's currently online.
- **Authentication:** Firebase Auth or Supabase Auth (free tiers).
- **Encryption:** for a learning project, look at the open-source Signal Protocol libraries to add basic end-to-end encryption — a great "resume" feature to implement yourself.
- **Deployment:** Render or Railway free tier for the backend, Vercel/Netlify for the frontend.

A great mini-project: build one-process-per-connection chat using WebSockets, and simulate "let it crash" by making your server auto-restart a crashed connection handler without dropping other users.

---

## Technologies Used (Summary Table)

| Layer | Technology | Purpose |
|---|---|---|
| Mobile Apps | Native Android (Java/Kotlin), iOS (Swift/Obj-C) | Client apps |
| Protocol | Custom protocol (based on XMPP) | Efficient mobile messaging |
| Backend Language | Erlang | Massive concurrency, one process per user |
| Chat Server | Ejabberd (modified) | Message routing & delivery |
| In-memory DB | Mnesia | Transient message/session data |
| Persistent DB | MySQL (sharded) | User profiles, account data |
| OS | FreeBSD | Server operating system |
| Web/Media Server | YAWS | Multimedia storage, WebSockets |
| Encryption | Signal Protocol | End-to-end encryption |

---

## Engineering Lessons

1. Pick the tool that matches your problem, even if it's unconventional (Erlang + FreeBSD over the "default" Java + Linux).
2. Lightweight, isolated processes (one per user) beat heavyweight shared infrastructure for massive concurrency.
3. "Let it crash" and auto-restart beats trying to prevent every possible failure.
4. Vertical scaling (do more per server) can delay the need for complex horizontal scaling.
5. Don't store more data than you need — transient messages simplify everything downstream.
6. Benchmark your assumptions (FreeBSD vs Linux) instead of following the crowd.
7. A small, focused team can operate at massive scale if the architecture removes unnecessary complexity.
8. Overprovision for predictable spikes (major world events) rather than scrambling reactively.

---

## References

- High Scalability — [How WhatsApp Grew to Nearly 500 Million Users, 11,000 Cores, and 70 Million Messages a Second](https://highscalability.com/how-whatsapp-grew-to-nearly-500-million-users-11000-cores-an/)
- ByteByteGo — [How WhatsApp Handles 40 Billion Messages Per Day](https://blog.bytebytego.com/p/how-whatsapp-handles-40-billion-messages)
- CometChat — [Understanding WhatsApp's Architecture & System Design](https://www.cometchat.com/blog/whatsapps-architecture-and-system-design)
- Rick Reed (WhatsApp Engineering) — "WhatsApp: Half a Billion Unsuspecting FreeBSD Users" (conference talk)

*Note: WhatsApp (now owned by Meta) has not published a fully detailed modern architecture breakdown — much of the above reflects the well-documented early/growth-era architecture, which is widely believed to still underpin the system's core design philosophy today.*
