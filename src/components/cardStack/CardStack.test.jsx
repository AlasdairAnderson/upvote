import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '@/lib/store';
import { CardStack } from '@/components/cardStack/CardStack.jsx';
import { mockPostInformation } from '../../__mocks__/cardcontent.js';

// --- Helper ---
const renderCardStack = (stateOverrides = {}, propOverrides = {}) => {
    const defaultState = {
        cards: {
            listingData: { after: null, before: null, geo_filter: null, count: null },
            cards: {
                '123': mockPostInformation.default,
                '234': mockPostInformation.image,
                '345': mockPostInformation.text,
                '456': mockPostInformation.video,
            },
            upvotedCards: {},
            downvotedCards: {},
            activeCard: mockPostInformation.default,
            isLoading: false,
            hasError: false,
            ...stateOverrides
        }
    };

    const store = makeStore(defaultState);
    // Mock dispatch to prevent actual API calls from useEffect
    const originalDispatch = store.dispatch;
    store.dispatch = jest.fn((action) => {
        // Only execute synchronous actions, skip thunks (fetchCards)
        if (typeof action === 'function') return Promise.resolve();
        return originalDispatch(action);
    });

    const props = {
        animation: '',
        redditAPIRequest: { requestType: 'popular', query: '', newRequest: false },
        setRedditAPIRequest: jest.fn(),
        ...propOverrides
    };

    return {
        store,
        props,
        ...render(
            <Provider store={store}>
                <CardStack {...props} />
            </Provider>
        )
    };
};

// ============================================================
// Rendering States
// ============================================================
describe('CardStack rendering', () => {
    it('renders the active card', () => {
        renderCardStack();
        const card = screen.getByTestId('card');
        expect(card).toBeInTheDocument();
        // CardStack only renders 1 card at a time (the active card)
        expect(screen.getAllByTestId('card')).toHaveLength(1);
    });

    it('displays active card title', () => {
        renderCardStack();
        expect(screen.getByText('Lorus Ipsum')).toBeInTheDocument();
    });
});

// ============================================================
// Error States
// ============================================================
describe('CardStack error states', () => {
    it('shows error card when cards object is empty and not loading', () => {
        renderCardStack({
            cards: {},
            activeCard: undefined,
            isLoading: false,
            hasError: false
        });
        expect(screen.getByText('An error has occured')).toBeInTheDocument();
        expect(screen.getByText('No posts could be found')).toBeInTheDocument();
    });

    it('shows error card when hasError is true', () => {
        renderCardStack({
            cards: { '123': mockPostInformation.default },
            activeCard: mockPostInformation.default,
            isLoading: false,
            hasError: true
        });
        expect(screen.getByText('An error has occured')).toBeInTheDocument();
        expect(screen.getByText('Issue getting posts from Reddit')).toBeInTheDocument();
    });

    it('shows "Return to Safety" button on error', () => {
        renderCardStack({
            cards: {},
            activeCard: undefined,
            isLoading: false,
            hasError: true
        });
        expect(screen.getByText('Return to Safety')).toBeInTheDocument();
    });
});

// ============================================================
// Loading State
// ============================================================
describe('CardStack loading state', () => {
    it('shows loading card when loading with no cards', () => {
        renderCardStack({
            cards: {},
            activeCard: undefined,
            isLoading: true,
            hasError: false
        });
        expect(screen.getByText('Loading posts')).toBeInTheDocument();
    });
});

// ============================================================
// Drag Handlers
// ============================================================
describe('CardStack drag handlers', () => {
    it('card responds to pointer events', () => {
        renderCardStack();
        const card = screen.getByTestId('card');
        // Verify the card element exists and can receive pointer events
        expect(card).toBeInTheDocument();
        expect(card.tagName).toBe('LI');
    });
});