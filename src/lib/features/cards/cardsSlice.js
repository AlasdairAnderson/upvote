import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk that can call Reddit API to fetch content
const fetchCards = createAsyncThunk(
    'cards/fetchCards',
    async (arg, thunkAPI) => {
        // extract paramerters
        const { requestType, query } = arg;
        const baseURL = `https://www.reddit.com/`;
        const URLargument = '';

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

        const request = await fetch(`${baseURL}${URLargument}`);

        const data = await request.json();

        return data;

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
        builder.addCase(fetchCards.rejected, (action) => {
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
export const selectCards = (state) => state.cards.cards;
export default cardsSlice.reducer; 