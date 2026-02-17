import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk that can call Reddit API to fetch content
export const fetchCards = createAsyncThunk(
    'cards/fetchCards',
    async (args) => {
        //extract paramerters
        try{
        const { redditAPIRequest, listingData  } = args;
        let path = '';

        switch (redditAPIRequest.requestType) {
            case 'search':
                path = `search.json?q=${redditAPIRequest.query}&`;
                break;
            case 'category':
                path = `r/${redditAPIRequest.query}.json?`;
                break;
            default:
                path = 'r/popular.json?';
        }    
        
        console.log(listingData)
        const request = await fetch(`/api/reddit?path=${path}&after=${listingData.after}`);

        if(!request.ok){
            throw new Error(`HTTP error! status: ${request.status}\n Message: ${request.statusText}`);
        }

        const data = await request.json();
        const currentListingData = {
            after: data.data.after,
            before: data.data.before,
            modhash: data.data.modhash,
            dist: data.data.dist,
            geo_filter: data.data.geo_filter
        };
        const currentCards = data.data.children.map((child) => {
            const content = child.data;
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
            const isImageType = ['image', 'link'].includes(content.post_hint);
            const hasImageData = content.preview?.images?.[0]?.source;
            if(isImageType && hasImageData){
                const cleanedUrl = content.preview.images[0].source.url.replaceAll("&amp;","&");
                card.post_content.content = cleanedUrl;
                card.post_content.type = 'image';
            } else if (content.post_hint === 'hosted:video' && content.media && content.media.reddit_video) {
                card.post_content.content = content.media.reddit_video.fallback_url;
                card.post_content.type = 'video';   
            } else {
                card.post_content.content = content.selftext || '';
                card.post_content.type = 'text';
            }
            return card;
        });
        const cards = Object.values(currentCards);
        return { cards, currentListingData };
    } catch(error) {
        console.error('Fetch Error: ', error);
        throw error;
    }}
)

const cardsSlice = createSlice({
    name: 'cards',
    initialState: {
        listingData: {
            after: null,
            before: null,
            geo_filter: null,
            count: null
        },
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
            state.upvotedCards[id] = action.payload;
        },
        addDownvote: (state, action) => {
            const { id } = action.payload;
            state.downvotedCards[id] = action.payload;
        },
        updateActiveCard: (state, action) => {
            state.activeCard = action.payload;
        },
        deleteVotedCard: (state, action) => {
            delete state.cards[action.payload.id];
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
            console.log(action.payload);
            const { cards, currentListingData } = action.payload;
            state.listingData = currentListingData;
            for(const card of cards) {
                const { id } = card;
                state.cards[id] = card;
            }
        })
    }
})

export const { addUpvote, addDownvote, updateActiveCard, deleteVotedCard } = cardsSlice.actions;
export const selectCards = (state) => {
    const cards = state.cards.cards;
    return cards;
};
export const selectActiveCard = (state) => {
    return state.cards.activeCard;
};
export const selectUpvotedCards = (state) => {
    return state.cards.upvotedCards;
};
export const selectDownvotedCards = (state) => {
    return state.cards.downvotedCards;
};
export const selectListingData = (state) => {
    return state.cards.listingData
} 
export default cardsSlice.reducer; 