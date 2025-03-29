import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk that can call Reddit API to fetch content
export const fetchCards = createAsyncThunk(
    'cards/fetchCards',
    async (args) => {
        //extract paramerters
        const { requestType, query } = args;
        const baseURL = `https://www.reddit.com/`;
        let URLargument = '';

        switch (requestType) {
            case 'search':
                URLargument = `search.json?q=${query}`;
                break;
            case 'category':
                URLargument = `r/${query}.json`;
                break;
            default:
                URLargument = 'r/popular.json';
        }

        console.log(`${baseURL}${URLargument}`);
        const request = await fetch(`${baseURL}${URLargument}`);

        const data = await request.json();
        const cards = data.data.children.map((child) => {
            const content = child.data;
            const downvotes = Math.round((content.ups / content.upvote_ratio) - content.ups)
            const card = {
                id: content.id,
                author: content.author,
                author_flair_background_color: content.author_flair_background_color,
                upvotes: content.ups,
                downvotes: downvotes,
                num_comments: content.num_comments,
                title: content.title,
                subreddit_name_prefixed: content.subreddit_name_prefixed,
                subreddit_id: content.subreddit_id,
                is_video: content.is_video,


            }
            console.log(`card: ${Object.values(card)}`)
            return card;
        })
        return cards;
    }
)

const cardsSlice = createSlice({
    name: 'cards',
    initialState: {
        cards: {},
        upvotedCards: {},
        downvotedCards: {},
        isLoading: false,
        hasError: false
    },
    reducers: {
        addUpvote: (state, action) => {
            const { id } = action.payload;
            state.upvotedCards[id] = action.payload
        },
        addDownvote: (state, action) => {
            const { id } = action.payload;
            state.downvotedCards[id] = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCards.rejected, (state, action) => {
            state.isLoading = false;
            state.hasError = true;
            console.log(action.error);
        }).addCase(fetchCards.pending, (state) => {
            state.isLoading = true;
            state.hasError = false;
        }).addCase(fetchCards.fulfilled, (state, action) => {
            state.isLoading = false;
            state.hasError = false;
            const cards = action.payload;
            for(const card of cards) {
                const { id } = card;
                state.cards[id] = card;
            }
        })
    }
})

export const { addUpvote, addDownvote } = cardsSlice.actions;
export const selectCards = (state) => {
    const cards = state.cards.cards
    return cards;
};
export default cardsSlice.reducer; 