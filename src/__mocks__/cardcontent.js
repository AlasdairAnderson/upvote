export const mockPostInformation = {
    default: {
        title: "Lorus Ipsum",
        id: '1234',
        upvotes: 221,
        downvotes: 105402,
        num_comments: 3432,
        post_content: {
            type: 'test',
            content: 'This is a very long paragraph that will be used to see if the Card component renders'
        }
    },
    image: {
        title: "Lorus Ipsum",
        id: '2345',
        upvotes: 35411,
        downvotes: 500101,
        num_comments: 200,
        post_content: {
            type: 'image',
            content: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F7a%2F44%2F39%2F7a4439f4189cd94113bb371ac7042ed2.jpg&f=1&nofb=1&ipt=3b178edbc654b5861b02aff0765b4f8355185301010ab5ce405ff7b78213780c'
        }
    },
    video: {
        title: "Lorus Ipsum",
        id: '3456',
        upvotes: 35411,
        downvotes: 500101,
        num_comments: 200,
        post_content: {
            type: 'video',
            content: 'https://youtu.be/-xet6KVNwWU'
        }
    },
    text: {
        title: "Lorus Ipsum",
        id: '4567',
        upvotes: 35411,
        downvotes: 500101,
        num_comments: 200,
        post_content: {
            type: 'text',
            content: 'This is a very long paragraph that will be used to see if the Card component renders'
        }
    }
}

export const mockActiveCard = {
    id: '123',
    mouseStartingPostion: {
        x: null,
        y: null
    },
    mouseCurrentPosition: {
        x: null,
        y: null
    },
    vote: 'not cast'
}