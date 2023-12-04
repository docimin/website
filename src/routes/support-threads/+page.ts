type MockThread = {
    username?: string;
    title: string;
    text: string;
    replies?: MockMessage[];
};

type MockMessage = {
    username?: string;
    text: string;
};

// Mock threads about appwrite support
const MockData: MockThread[] = [
    {
        username: 'appwrite',
        title: 'Welcome to Appwrite!',
        text: 'Welcome to Appwrite! We are glad to have you here. If you have any questions, feel free to ask them here.',
        replies: [
            {
                username: 'user1',
                text: 'Hello! I am new to Appwrite. I am excited to get started.'
            },
            {
                username: 'user2',
                text: 'Hi, I am new too! I am looking forward to learning more about Appwrite.'
            },
            {
                username: 'user3',
                text: 'Welcome! I am happy to help if you have any questions.'
            }
        ]
    },
    {
        username: 'user1',
        title: 'How do I create a new project?',
        text: 'I am trying to create a new project, but I cannot find the option to do so. Can someone help me?',
        replies: [
            {
                username: 'user2',
                text: 'Go to the dashboard and click on the "Create Project" button. You can then enter the name of your project and click "Create".'
            },
            {
                username: 'user3',
                text: 'You can also create a project from the CLI. See the documentation for more information.'
            }
        ]
    },
    {
        username: 'user2',
        title: 'How do I create a new collection?',
        text: 'I am trying to create a new collection, but I cannot find the option to do so. Can someone help me?',
        replies: [
            {
                username: 'user1',
                text: 'Go to the dashboard and click on the "Create Collection" button. You can then enter the name of your collection and click "Create".'
            },
            {
                username: 'user3',
                text: 'You can also create a collection from the CLI.'
            }
        ]
    }
];

type SearchResult<T> = {
    data: T;
    rank: number; // Percentage of query words found, from 0 to 1
};

const mockSearch = <T extends Record<string, unknown>>(arr: T[], q: string): SearchResult<T>[] => {
    const queryWords = q.toLowerCase().split(/\s+/);
    const rankPerWord = 1 / queryWords.length;
    const res: SearchResult<T>[] = [];

    arr.forEach((item) => {
        Object.values(item).forEach((value) => {
            const stringified = JSON.stringify(value);

            let rank = 0;
            queryWords.forEach((word) => {
                if (stringified.includes(word)) {
                    rank += rankPerWord;
                }
            });

            if (rank === 0) return;

            res.push({
                data: item,
                rank
            });
        });
    });

    return res.sort((a, b) => b.rank - a.rank);
};

export function load({ url }) {
    const query = url.searchParams.get('q');
    if (!query) {
        return { threads: MockData };
    }

    return {
        threads: mockSearch(MockData, query)
    };
}
