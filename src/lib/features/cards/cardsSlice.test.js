import { configureStore } from '@reduxjs/toolkit';
import cardsReducer, {
    addUpvote,
    addDownvote,
    updateActiveCard,
    deleteVotedCard,
    fetchCards,
    selectCards,
    selectActiveCard,
    selectUpvotedCards,
    selectDownvotedCards,
    selectListingData,
    selectLoadingState,
    selectErrorState
} from './cardsSlice';

// --- Helper ---
const createTestStore = (preloadedState) =>
    configureStore({
        reducer: { cards: cardsReducer },
        preloadedState: preloadedState ? { cards: preloadedState } : undefined
    });

const mockCard = {
    id: 'abc123',
    author: 'testuser',
    upvotes: 500,
    downvotes: 100,
    num_comments: 42,
    title: 'Test Post',
    subreddit_name_prefixed: 'r/test',
    subreddit_id: 't5_test',
    totalvotes: 600,
    post_content: { type: 'text', content: 'Hello world' }
};

const mockCard2 = {
    id: 'def456',
    author: 'otheruser',
    upvotes: 1000,
    downvotes: 200,
    num_comments: 99,
    title: 'Another Post',
    subreddit_name_prefixed: 'r/other',
    subreddit_id: 't5_other',
    totalvotes: 1200,
    post_content: { type: 'image', content: 'https://example.com/img.jpg' }
};

// ============================================================
// Reducers
// ============================================================
describe('cardsSlice reducers', () => {
    let store;

    beforeEach(() => {
        store = createTestStore();
    });

    // --- addUpvote ---
    it('addUpvote: adds card to upvotedCards keyed by id', () => {
        store.dispatch(addUpvote(mockCard));
        expect(store.getState().cards.upvotedCards).toEqual({ abc123: mockCard });
    });

    it('addUpvote: can add multiple cards', () => {
        store.dispatch(addUpvote(mockCard));
        store.dispatch(addUpvote(mockCard2));
        expect(Object.keys(store.getState().cards.upvotedCards)).toHaveLength(2);
    });

    // --- addDownvote ---
    it('addDownvote: adds card to downvotedCards keyed by id', () => {
        store.dispatch(addDownvote(mockCard));
        expect(store.getState().cards.downvotedCards).toEqual({ abc123: mockCard });
    });

    it('addDownvote: can add multiple cards', () => {
        store.dispatch(addDownvote(mockCard));
        store.dispatch(addDownvote(mockCard2));
        expect(Object.keys(store.getState().cards.downvotedCards)).toHaveLength(2);
    });

    // --- updateActiveCard ---
    it('updateActiveCard: sets activeCard to the provided payload', () => {
        store.dispatch(updateActiveCard(mockCard));
        expect(store.getState().cards.activeCard).toEqual(mockCard);
    });

    it('updateActiveCard: replaces previous active card', () => {
        store.dispatch(updateActiveCard(mockCard));
        store.dispatch(updateActiveCard(mockCard2));
        expect(store.getState().cards.activeCard).toEqual(mockCard2);
    });

    // --- deleteVotedCard ---
    it('deleteVotedCard: removes card from cards by id', () => {
        // Preload a card
        const storeWithCards = createTestStore({
            listingData: { after: null, before: null, geo_filter: null, count: null },
            cards: { abc123: mockCard, def456: mockCard2 },
            upvotedCards: {},
            downvotedCards: {},
            activeCard: {},
            isLoading: false,
            hasError: false
        });

        storeWithCards.dispatch(deleteVotedCard(mockCard));
        const remaining = storeWithCards.getState().cards.cards;
        expect(remaining).not.toHaveProperty('abc123');
        expect(remaining).toHaveProperty('def456');
    });
});

// ============================================================
// Selectors
// ============================================================
describe('cardsSlice selectors', () => {
    const fullState = {
        cards: {
            listingData: { after: 't3_abc', before: null, geo_filter: 'US', count: 5 },
            cards: { abc123: mockCard },
            upvotedCards: { def456: mockCard2 },
            downvotedCards: {},
            activeCard: mockCard,
            isLoading: true,
            hasError: false
        }
    };

    it('selectCards returns the cards object', () => {
        expect(selectCards(fullState)).toEqual({ abc123: mockCard });
    });

    it('selectActiveCard returns the active card', () => {
        expect(selectActiveCard(fullState)).toEqual(mockCard);
    });

    it('selectUpvotedCards returns upvoted cards', () => {
        expect(selectUpvotedCards(fullState)).toEqual({ def456: mockCard2 });
    });

    it('selectDownvotedCards returns downvoted cards', () => {
        expect(selectDownvotedCards(fullState)).toEqual({});
    });

    it('selectListingData returns listing metadata', () => {
        expect(selectListingData(fullState)).toEqual({
            after: 't3_abc', before: null, geo_filter: 'US', count: 5
        });
    });

    it('selectLoadingState returns isLoading', () => {
        expect(selectLoadingState(fullState)).toBe(true);
    });

    it('selectErrorState returns hasError', () => {
        expect(selectErrorState(fullState)).toBe(false);
    });
});

// ============================================================
// fetchCards async thunk
// ============================================================
describe('fetchCards async thunk', () => {
    let store;

    beforeEach(() => {
        store = createTestStore();
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    const mockRedditResponse = {
        data: {
            after: 't3_next',
            before: null,
            modhash: '',
            dist: 2,
            geo_filter: 'US',
            children: [
                {
                    data: {
                        id: 'post1',
                        author: 'user1',
                        author_flair_background_color: null,
                        ups: 800,
                        upvote_ratio: 0.8,
                        num_comments: 50,
                        title: 'First Post',
                        subreddit_name_prefixed: 'r/test',
                        subreddit_id: 't5_test',
                        post_hint: 'self',
                        preview: {
                            images: [{ source: { url: 'https://example.com/img.jpg' } }]
                        }
                    }
                },
                {
                    data: {
                        id: 'post2',
                        author: 'user2',
                        author_flair_background_color: '#ff0000',
                        ups: 1500,
                        upvote_ratio: 0.75,
                        num_comments: 120,
                        title: 'Second Post',
                        subreddit_name_prefixed: 'r/pics',
                        subreddit_id: 't5_pics',
                        post_hint: 'image',
                        preview: {
                            images: [{ source: { url: 'https://example.com/img2.jpg&amp;test=1' } }]
                        }
                    }
                }
            ]
        }
    };

    // --- pending ---
    it('sets isLoading to true and hasError to false when pending', () => {
        // Don't resolve the fetch so we stay in pending state
        global.fetch.mockReturnValue(new Promise(() => { }));

        store.dispatch(fetchCards({
            redditAPIRequest: { requestType: 'popular', query: '', newRequest: true },
            listingData: { after: null }
        }));

        const state = store.getState().cards;
        expect(state.isLoading).toBe(true);
        expect(state.hasError).toBe(false);
    });

    // --- fulfilled ---
    it('populates cards and listing data on success', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockRedditResponse)
        });

        await store.dispatch(fetchCards({
            redditAPIRequest: { requestType: 'popular', query: '', newRequest: true },
            listingData: { after: null }
        }));

        const state = store.getState().cards;
        expect(state.isLoading).toBe(false);
        expect(state.hasError).toBe(false);
        expect(Object.keys(state.cards).length).toBe(2);
        expect(state.cards['post1']).toBeDefined();
        expect(state.cards['post2']).toBeDefined();
        expect(state.listingData.after).toBe('t3_next');
    });

    it('clears existing cards when newRequest is true', async () => {
        // Pre-populate store with a card
        const storeWithCards = createTestStore({
            listingData: { after: null, before: null, geo_filter: null, count: null },
            cards: { oldCard: mockCard },
            upvotedCards: {},
            downvotedCards: {},
            activeCard: {},
            isLoading: false,
            hasError: false
        });

        global.fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockRedditResponse)
        });

        await storeWithCards.dispatch(fetchCards({
            redditAPIRequest: { requestType: 'search', query: 'cats', newRequest: true },
            listingData: { after: null }
        }));

        const state = storeWithCards.getState().cards;
        expect(state.cards).not.toHaveProperty('oldCard');
        expect(Object.keys(state.cards).length).toBe(2);
    });

    it('appends cards when newRequest is false (pagination)', async () => {
        const storeWithCards = createTestStore({
            listingData: { after: 't3_prev', before: null, geo_filter: null, count: null },
            cards: { existingCard: mockCard },
            upvotedCards: {},
            downvotedCards: {},
            activeCard: {},
            isLoading: false,
            hasError: false
        });

        global.fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockRedditResponse)
        });

        await storeWithCards.dispatch(fetchCards({
            redditAPIRequest: { requestType: 'popular', query: '', newRequest: false },
            listingData: { after: 't3_prev' }
        }));

        const state = storeWithCards.getState().cards;
        expect(state.cards).toHaveProperty('existingCard');
        expect(state.cards).toHaveProperty('post1');
        expect(state.cards).toHaveProperty('post2');
        expect(Object.keys(state.cards).length).toBe(3);
    });

    it('replaces &amp; with & in image URLs', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockRedditResponse)
        });

        await store.dispatch(fetchCards({
            redditAPIRequest: { requestType: 'popular', query: '', newRequest: true },
            listingData: { after: null }
        }));

        const post2 = store.getState().cards.cards['post2'];
        expect(post2.post_content.content).not.toContain('&amp;');
        expect(post2.post_content.content).toContain('&test=1');
    });

    // --- rejected ---
    it('sets hasError to true and isLoading to false on failure', async () => {
        global.fetch.mockResolvedValue({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error'
        });

        await store.dispatch(fetchCards({
            redditAPIRequest: { requestType: 'popular', query: '', newRequest: true },
            listingData: { after: null }
        }));

        const state = store.getState().cards;
        expect(state.isLoading).toBe(false);
        expect(state.hasError).toBe(true);
    });

    it('sets hasError to true when fetch throws a network error', async () => {
        global.fetch.mockRejectedValue(new Error('Network error'));

        await store.dispatch(fetchCards({
            redditAPIRequest: { requestType: 'popular', query: '', newRequest: true },
            listingData: { after: null }
        }));

        const state = store.getState().cards;
        expect(state.isLoading).toBe(false);
        expect(state.hasError).toBe(true);
    });

    // --- URL building ---
    it('builds correct URL for search requests', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockRedditResponse)
        });

        await store.dispatch(fetchCards({
            redditAPIRequest: { requestType: 'search', query: 'javascript', newRequest: true },
            listingData: { after: null }
        }));

        const calledUrl = global.fetch.mock.calls[0][0];
        expect(calledUrl).toContain('path=search.json');
        expect(calledUrl).toContain('q=javascript');
    });

    it('builds correct URL for category requests', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockRedditResponse)
        });

        await store.dispatch(fetchCards({
            redditAPIRequest: { requestType: 'category', query: 'r/funny', newRequest: true },
            listingData: { after: null }
        }));

        const calledUrl = global.fetch.mock.calls[0][0];
        expect(calledUrl).toContain('path=r%2Ffunny.json');
    });

    it('includes after param for pagination', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockRedditResponse)
        });

        await store.dispatch(fetchCards({
            redditAPIRequest: { requestType: 'popular', query: '', newRequest: false },
            listingData: { after: 't3_abc123' }
        }));

        const calledUrl = global.fetch.mock.calls[0][0];
        expect(calledUrl).toContain('after=t3_abc123');
    });
});
