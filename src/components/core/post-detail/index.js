export const postDetail = {
    id: 1,
    title: "Optimizing React Performance with useMemo and useCallback",
    content: "I've been working on a large React application and I'm noticing some performance issues. I've heard about useMemo and useCallback hooks, but I'm not entirely sure when and how to use them effectively. Could someone explain the best practices and provide some real-world examples?",
    votes: 150,
    answers: 12,
    views: 3420,
    tags: ["react", "javascript", "performance", "hooks"],
    author: {
        name: "Sarah Wilson",
        avatar: "https://github.com/shadcn.png"
    },
    createdAt: "2023-11-20T14:45:00Z",
    haveSolution: true,
    attachments: [
        {
            name: "JWTValidator.java",
            url: "#",
            type: "java",
            isAdded: true
        }
    ]
};

export const projects = [
    {
        id: 1,
        name: "Personal Portfolio",
        privacy: "public",
        updatedAt: "2023-11-20T10:00:00Z",
        folders: [
            {
                id: 101,
                name: "Assets",
                children: [
                    { id: 1011, name: "Images" },
                    { id: 1012, name: "Icons" }
                ]
            },
            {
                id: 102,
                name: "Components",
                children: [
                    { id: 1021, name: "Button" },
                    { id: 1022, name: "Input" }
                ]
            },
            { id: 103, name: "Pages" }
        ]
    },
    {
        id: 2,
        name: "E-commerce Platform",
        privacy: "private",
        updatedAt: "2023-11-19T15:30:00Z",
        folders: [
            { id: 201, name: "Backend" },
            { id: 202, name: "Frontend" },
            { id: 203, name: "Docs" },
            { id: 204, name: "Database" }
        ]
    },
    {
        id: 3,
        name: "Task Management App",
        privacy: "team",
        updatedAt: "2023-11-18T09:15:00Z",
        folders: [
            { id: 301, name: "Design" },
            { id: 302, name: "Sprint 1" }
        ]
    }
];
