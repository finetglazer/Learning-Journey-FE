export const POSTS = [
    {
        id: 1,
        title: "Best practices for handling JWT tokens in Next.js 14?",
        content: "I'm building an auth system using Next.js 14 App Router. Should I store the JWT in HTTP-only cookies or localStorage? How do I handle token rotation effectively with server components?",
        votes: 145,
        answers: 12,
        views: 1205,
        haveSolution: true,
        tags: ["Next.js", "Authentication", "JWT", "Security"],
        author: {
            name: "Alex Dev",
            avatar: "https://github.com/shadcn.png"
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    },
    {
        id: 2,
        title: "Spring Boot 3.2 virtual threads performance impact?",
        content: "Has anyone migrated a heavy I/O service to Spring Boot 3.2 to utilize virtual threads (Project Loom)? I'm curious about the real-world performance gains vs reactive programming with WebFlux.",
        votes: 89,
        answers: 5,
        views: 890,
        haveSolution: false,
        tags: ["Java", "Spring Boot", "Performance", "Concurrency"],
        author: {
            name: "JavaGuru99",
            avatar: "https://github.com/shadcn.png"
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
    },
    {
        id: 3,
        title: "Dockerizing a React + Spring Boot application with Nginx",
        content: "I'm trying to create a multi-stage Docker build for my mono-repository. I need Nginx to serve the React static files and reverse proxy API requests to the Spring Boot backend. My current config gives 404s on refresh.",
        votes: 210,
        answers: 18,
        views: 3400,
        haveSolution: true,
        tags: ["Docker", "Nginx", "DevOps", "Deployment"],
        author: {
            name: "ContainerMike",
            avatar: "https://github.com/shadcn.png"
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    },
    {
        id: 4,
        title: "Optimizing PostgreSQL queries for large datasets",
        content: "I have a table with 50 million records. Simple SELECT queries are taking 5+ seconds. I've added indexes on the filtered columns but it's still slow. Should I consider partitioning or is there something I'm missing?",
        votes: 76,
        answers: 8,
        views: 1500,
        haveSolution: true,
        tags: ["PostgreSQL", "Database", "SQL", "Performance"],
        author: {
            name: "DBAdmin_Sarah",
            avatar: "https://github.com/shadcn.png"
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
    },
    {
        id: 5,
        title: "Zustand vs Redux Toolkit in 2024",
        content: "Starting a new dashboard project. Redux Toolkit feels like overkill, but I'm worried about Zustand's scalability for vary large apps. What are the main trade-offs people are seeing in production?",
        votes: 320,
        answers: 45,
        views: 5600,
        haveSolution: true,
        tags: ["React", "State Management", "Redux", "Zustand"],
        author: {
            name: "FrontendFan",
            avatar: "https://github.com/shadcn.png"
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
    },
    {
        id: 6,
        title: "How to implement Redis caching in Spring Boot?",
        content: "I want to cache the results of a heavy calculation service. I'm using @Cacheable annotation but the data doesn't seem to persist in Redis. My configuration looks correct in application.properties.",
        votes: 54,
        answers: 3,
        views: 400,
        haveSolution: false,
        tags: ["Spring Boot", "Redis", "Caching", "Backend"],
        author: {
            name: "CodeWizard",
            avatar: "https://github.com/shadcn.png"
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
    },
    {
        id: 7,
        title: "Tailwind CSS reusable component patterns",
        content: "I'm finding my JSX cluttered with long class strings. I know about @apply, but some say it's an anti-pattern. What is the best way to encapsulate styles for buttons and inputs in a React component library?",
        votes: 112,
        answers: 15,
        views: 2100,
        haveSolution: true,
        tags: ["CSS", "Tailwind", "React", "Design Systems"],
        author: {
            name: "StyleQueen",
            avatar: "https://github.com/shadcn.png"
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
    },
    {
        id: 8,
        title: "Error handling strategy in Microservices architecture",
        content: "How do you propagate error details from one microservice to another? We are using Feign clients. Should we return a standard error object or throw custom exceptions that map to HTTP codes?",
        votes: 95,
        answers: 9,
        views: 1100,
        haveSolution: true,
        tags: ["Microservices", "Architecture", "Java", "Best Practices"],
        author: {
            name: "ArchitechBob",
            avatar: "https://github.com/shadcn.png"
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString()
    },
    {
        id: 9,
        title: "Using ShadcnUI with valid form validation",
        content: "I love ShadcnUI components, but integrating them with React Hook Form and Zod for complex validation rules (like cross-field dependency) is proving tricky. Any examples?",
        votes: 134,
        answers: 10,
        views: 1800,
        haveSolution: true,
        tags: ["React", "ShadcnUI", "Forms", "Zod"],
        author: {
            name: "UIBuilder",
            avatar: "https://github.com/shadcn.png"
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString()
    },
    {
        id: 10,
        title: "Debugging memory leaks in Node.js applications",
        content: "My API server memory usage keeps growing over time until it crashes. I've tried using the Chrome debugger. Are there better tools or common patterns (like closure issues) I should look for?",
        votes: 67,
        answers: 4,
        views: 950,
        haveSolution: false,
        tags: ["Node.js", "Debugging", "Performance", "JavaScript"],
        author: {
            name: "MemoryLeakHunter",
            avatar: "https://github.com/shadcn.png"
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 100).toISOString()
    }
];
