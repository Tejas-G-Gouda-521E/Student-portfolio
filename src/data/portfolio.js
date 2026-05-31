export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export const personalInfo = {
  name: "Babu",
  title: "Creative Developer",
  tagline: "Crafting immersive digital experiences at the intersection of design, code, and motion.",
  bio: "I'm a full-stack creative developer passionate about building premium web experiences. From cinematic 3D landscapes to pixel-perfect interfaces, I blend technical precision with artistic vision to deliver products that feel alive.",
  location: "Available Worldwide",
  email: "hello@babu.dev",
  profileImage: "/profile.jpg",
};

export const skills = [
  {
    category: "Frontend",
    items: ["React", "TypeScript", "Three.js", "Tailwind CSS", "GSAP", "WebGL"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Python", "PostgreSQL", "GraphQL", "REST APIs", "Redis"],
  },
  {
    category: "Tools & Design",
    items: ["Figma", "Blender", "Git", "Docker", "Vite", "Framer Motion"],
  },
  {
    category: "Specialties",
    items: ["3D Web", "Motion Design", "UI/UX", "Performance", "Creative Coding", "AR/VR"],
  },
];

export const skillCarousel = skills.flatMap((group) =>
  group.items.map((name) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    category: group.category,
  }))
);

export const projects = [
  {
    id: 1,
    title: "Nebula Dashboard",
    description:
      "A real-time analytics platform with WebGL data visualizations and glassmorphic UI components.",
    tags: ["React", "Three.js", "D3.js"],
    year: "2025",
    link: "#",
  },
  {
    id: 2,
    title: "Aurora Commerce",
    description:
      "Premium e-commerce experience featuring 3D product previews and fluid scroll-driven animations.",
    tags: ["Next.js", "R3F", "Stripe"],
    year: "2025",
    link: "#",
  },
  {
    id: 3,
    title: "Pulse AI Studio",
    description:
      "AI-powered creative suite with generative art tools and collaborative canvas workflows.",
    tags: ["Python", "React", "WebSockets"],
    year: "2024",
    link: "#",
  },
  {
    id: 4,
    title: "Vertex Portfolio",
    description:
      "Award-winning portfolio template with procedural terrain generation and cinematic transitions.",
    tags: ["Vite", "GSAP", "Tailwind"],
    year: "2024",
    link: "#",
  },
];

export const socialLinks = [
  { label: "GitHub", href: "https://github.com", icon: "github" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
  { label: "Twitter", href: "https://twitter.com", icon: "twitter" },
  { label: "Dribbble", href: "https://dribbble.com", icon: "dribbble" },
];
