import instagramMd from "../stackbreakdown/stack-breakdown-instagram.md?raw";
import stripeMd from "../stackbreakdown/stack-breakdown-stripe.md?raw";
import uberMd from "../stackbreakdown/stack-breakdown-uber.md?raw";
import amazonMd from "../stackbreakdown/stack-breakdown-amazon.md?raw";
import spotifyMd from "../stackbreakdown/stack-breakdown-spotify.md?raw";
import netflixMd from "../stackbreakdown/stack-breakdown-netflix.md?raw";
import whatsappMd from "../stackbreakdown/stack-breakdown-whatsapp.md?raw";
import zomatoMd from "../stackbreakdown/stack-breakdown-zomato.md?raw";
import swiggyMd from "../stackbreakdown/stack-breakdown-swiggy.md?raw";
import discordMd from "../stackbreakdown/stack-breakdown-discord.md?raw";

export type StackBreakdownItem = {
  slug: string;
  productName: string;
  title: string;
  description: string;
  icon: string;
  faviconDomain: string;
  tags: string[];
  body: string;
};

export const STACK_BREAKDOWNS: StackBreakdownItem[] = [
  {
    slug: "instagram",
    productName: "Instagram",
    title: "Stack Breakdown — Instagram",
    description:
      "How Instagram scaled to 14 million users with just 3 engineers — Django, PostgreSQL, Cassandra, and the art of keeping things boring.",
    icon: "📸",
    faviconDomain: "instagram.com",
    tags: ["React", "Django", "PostgreSQL", "Cassandra", "Redis", "AWS"],
    body: instagramMd,
  },
  {
    slug: "stripe",
    productName: "Stripe",
    title: "Stack Breakdown — Stripe",
    description:
      "The financial infrastructure of the internet — how Stripe handles trust, correctness, and massive transaction volumes without breaking a sweat.",
    icon: "💳",
    faviconDomain: "stripe.com",
    tags: ["Ruby", "Java", "React", "PostgreSQL", "Kafka", "Kubernetes"],
    body: stripeMd,
  },
  {
    slug: "uber",
    productName: "Uber",
    title: "Stack Breakdown — Uber",
    description:
      "Matching supply and demand in real time across hundreds of cities — geospatial indexing, dynamic pricing, and the microservices mesh behind every ride.",
    icon: "🚗",
    faviconDomain: "uber.com",
    tags: ["Go", "React", "Kafka", "Cassandra", "Redis", "Kubernetes"],
    body: uberMd,
  },
  {
    slug: "amazon",
    productName: "Amazon",
    title: "Stack Breakdown — Amazon",
    description:
      "The world's largest e-commerce platform — where a single product page triggers 150+ microservice calls and AWS itself was born.",
    icon: "📦",
    faviconDomain: "amazon.com",
    tags: ["Java", "React", "DynamoDB", "Aurora", "CloudFront", "AWS"],
    body: amazonMd,
  },
  {
    slug: "spotify",
    productName: "Spotify",
    title: "Stack Breakdown — Spotify",
    description:
      "Streaming audio to 365 million listeners worldwide — microservices, event-driven architecture, and the recommendation engine behind Discover Weekly.",
    icon: "🎵",
    faviconDomain: "spotify.com",
    tags: ["Java", "Python", "React", "Bigtable", "Kafka", "GCP"],
    body: spotifyMd,
  },
  {
    slug: "netflix",
    productName: "Netflix",
    title: "Stack Breakdown — Netflix",
    description:
      "From a monolith outage to the most influential microservices architecture in the industry — how Netflix streams billions of hours monthly.",
    icon: "🎬",
    faviconDomain: "netflix.com",
    tags: ["Java", "React", "Cassandra", "MySQL", "S3", "AWS"],
    body: netflixMd,
  },
  {
    slug: "whatsapp",
    productName: "WhatsApp",
    title: "Stack Breakdown — WhatsApp",
    description:
      "42 billion messages a day with just 50 engineers — Erlang's actor model, end-to-end encryption, and radical simplicity at scale.",
    icon: "💬",
    faviconDomain: "whatsapp.com",
    tags: ["Erlang", "Ejabberd", "MySQL", "Yaws", "FreeBSD", "XMPP"],
    body: whatsappMd,
  },
  {
    slug: "zomato",
    productName: "Zomato",
    title: "Stack Breakdown — Zomato",
    description:
      "Three products in one — restaurant discovery, food ordering, and live delivery tracking — all running at millions of orders per day.",
    icon: "🍜",
    faviconDomain: "zomato.com",
    tags: ["Go", "React", "Kafka", "Elasticsearch", "Redis", "Kubernetes"],
    body: zomatoMd,
  },
  {
    slug: "swiggy",
    productName: "Swiggy",
    title: "Stack Breakdown — Swiggy",
    description:
      "India's largest hyperlocal delivery platform — 400+ microservices, real-time logistics optimization, and 130+ services in the order-fulfillment path.",
    icon: "🛵",
    faviconDomain: "swiggy.com",
    tags: ["Go", "Java", "React", "Kafka", "Cassandra", "Kubernetes"],
    body: swiggyMd,
  },
  {
    slug: "discord",
    productName: "Discord",
    title: "Stack Breakdown — Discord",
    description:
      "200 million monthly active users, trillions of messages, and just 5 engineers on the messaging backend — Elixir, Rust, and the actor model.",
    icon: "🎮",
    faviconDomain: "discord.com",
    tags: ["Elixir", "Rust", "React", "ScyllaDB", "GCP", "Electron"],
    body: discordMd,
  },
];

export const allStackBreakdowns = () => [...STACK_BREAKDOWNS];
export const stackBreakdownBySlug = (slug: string) =>
  STACK_BREAKDOWNS.find((sb) => sb.slug === slug);
