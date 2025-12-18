export const POSTS = Array.from({ length: 30 }).map((_, i) => ({
    id: i + 1,
    title: `How to deploy Spring Boot + React + MySQL website? What services are required? [Post ${i + 1}]`,
    content: `I am a fresher and I am building a small hotel website.\nMy tech stack is: Backend: Spring Boot (Java) Frontend: React Database: MySQL.\nI want to deploy this project so that it is publicly accessible ...\nThe idea of Persistent-Memory gawk is fabulous because it improves the performance, size, and clarity of many scripts on static and reference data.\nHowever, I have a significant problem in adopting this model: When I use an awk script pattern concurrently.`,
    votes: Math.floor(Math.random() * 100),
    answers: Math.floor(Math.random() * 20),
    views: Math.floor(Math.random() * 10000),
    haveSolution: true,
    tags: ["Java", "Spring Boot", "React", "MySQL", "Deployment"].slice(0, Math.floor(Math.random() * 6) + 2),
    author: {
        name: `User ${i + 1}`,
        avatar: "https://github.com/shadcn.png"
    },
    createdAt: new Date().toISOString()
}));
