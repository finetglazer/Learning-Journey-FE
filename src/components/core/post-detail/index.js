export const postDetail = {
    id: 1,
    title: "What are the best practices for structuring a large Zustand store?",
    content: "I'm migrating to **Zustand** and need advice on scalability.\n\n1. **Slices vs. Multiple Stores**: Use one store with slices or separate stores?\n2. **Actions**: Define inside store or externally?\n3. **Async**: Handle in Zustand or use **TanStack Query**?",
    votes: 150,
    answers: 12,
    views: 3420,
    tags: ["react", "zustand", "state-management", "frontend"],
    author: {
        name: "Sarah Wilson",
        avatar: "https://github.com/shadcn.png"
    },
    createdAt: "2023-11-20T14:45:00Z",
    haveSolution: true,
    attachments: [
        {
            name: "store.ts",
            url: "#",
            type: "typescript",
            isAdded: false
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
