import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk that can call Reddit API to fetch content
export const fetchCards = createAsyncThunk(
    'cards/fetchCards',
    async (args) => {
        //extract paramerters
        try{
        const { requestType, query } = args;
        //const baseURL = `https://www.reddit.com/`;
        let path = '';

        

        switch (requestType) {
            case 'search':
                path = `search.json?q=${query}&`;
                break;
            case 'category':
                path = `r/${query}.json?`;
                break;
            default:
                path = 'r/popular.json?';
        }
        //console.log(`${baseURL}${URLargument}`);
        //const request = await fetch(`${baseURL}${URLargument}`);        
        
        const request = await fetch(`/api/reddit?path=${path}`);

        if(!request.ok){
            throw new Error(`HTTP error! status: ${request.status}`);
        }

        const data = await request.json();
        const cards = data.data.children.map((child) => {
            const content = child.data;
            //console.log(content);
            const totalvotes = Math.round(content.ups / content.upvote_ratio);
            const downvotes = totalvotes - content.ups
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
                totalvotes: totalvotes,
                post_content: {}
            }
            
            if(content.post_hint === 'image' && content.preview && Array.isArray(content.preview.images) && content.preview.images.length > 0 && content.preview.images[0].source){
                card.post_content.content = content.preview.images[0].source.url;
                card.post_content.type = 'image';
            } else if (content.post_hint === 'link' && content.preview && Array.isArray(content.preview.images) && content.preview.images.length > 0 && content.preview.images[0].source) {
                card.post_content.content = content.preview.images[0].source.url;
                card.post_content.type = 'image';
            } else if (content.post_hint === 'hosted:video' && content.media && content.media.reddit_video) {
                card.post_content.content = content.media.reddit_video.fallback_url;
                card.post_content.type = 'video';   
            } else {
                card.post_content.content = content.selftext || '';
                card.post_content.type = 'text';
            }
            return card;
        })
        return cards;
    } catch(error) {
        console.error('Fetch Error: ', error);
        throw error;
    }}
)

const cardsSlice = createSlice({
    name: 'cards',
    initialState: {
        cards: {},
        upvotedCards: {},
        downvotedCards: {},
        activeCard: {},
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
        },
        updateActiveCard: (state, action) => {
            state.activeCard = action.payload;
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

export const { addUpvote, addDownvote, updateActiveCard } = cardsSlice.actions;
export const selectCards = (state) => {
    const cards = state.cards.cards;
    return cards;
};
export const selectActiveCard = (state) => {
    return state.cards.activeCard;
}
export default cardsSlice.reducer; 