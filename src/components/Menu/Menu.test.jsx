import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '@/lib/store';
import { Menu } from './Menu';

// --- Helper ---
const renderMenu = (overrides = {}) => {
    const mockCard = {
        id: 'active1',
        author: 'testuser',
        upvotes: 500,
        downvotes: 100,
        num_comments: 42,
        title: 'Active Post',
        subreddit_name_prefixed: 'r/test',
        subreddit_id: 't5_test',
        totalvotes: 600,
        post_content: { type: 'text', content: 'Hello' }
    };

    const store = makeStore({
        cards: {
            listingData: { after: null, before: null, geo_filter: null, count: null },
            cards: { active1: mockCard },
            upvotedCards: {},
            downvotedCards: {},
            activeCard: mockCard,
            isLoading: false,
            hasError: false
        }
    });

    const props = {
        setAnimation: jest.fn(),
        animation: '',
        setRedditAPIRequest: jest.fn(),
        ...overrides
    };

    return {
        store,
        props,
        ...render(
            <Provider store={store}>
                <Menu {...props} />
            </Provider>
        )
    };
};

// ============================================================
// Menu Rendering
// ============================================================
describe('Menu rendering', () => {
    it('renders upvote and downvote buttons', () => {
        renderMenu();
        expect(screen.getByAltText('Upvote Content')).toBeInTheDocument();
        expect(screen.getByAltText('Downvote Contnet')).toBeInTheDocument();
    });

    it('renders category menu button', () => {
        renderMenu();
        expect(screen.getByAltText('category menu')).toBeInTheDocument();
    });

    it('renders search button', () => {
        renderMenu();
        expect(screen.getByAltText('search icon')).toBeInTheDocument();
    });

    it('renders search input field', () => {
        renderMenu();
        expect(screen.getByPlaceholderText('search...')).toBeInTheDocument();
    });
});

// ============================================================
// Upvote / Downvote Buttons
// ============================================================
describe('Menu voting', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('clicking upvote calls setAnimation with "is-upvoted"', async () => {
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
        const { props } = renderMenu();

        await user.click(screen.getByAltText('Upvote Content'));
        expect(props.setAnimation).toHaveBeenCalledWith('is-upvoted');
    });

    it('clicking downvote calls setAnimation with "is-downvoted"', async () => {
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
        const { props } = renderMenu();

        await user.click(screen.getByAltText('Downvote Contnet'));
        expect(props.setAnimation).toHaveBeenCalledWith('is-downvoted');
    });

    it('upvote dispatches addUpvote and deleteVotedCard after timeout', async () => {
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
        const { store } = renderMenu();

        await user.click(screen.getByAltText('Upvote Content'));

        // Before timeout — card should still be in cards
        expect(store.getState().cards.upvotedCards).toEqual({});

        // After timeout
        jest.advanceTimersByTime(2500);

        expect(store.getState().cards.upvotedCards).toHaveProperty('active1');
        expect(store.getState().cards.cards).not.toHaveProperty('active1');
    });

    it('downvote dispatches addDownvote and deleteVotedCard after timeout', async () => {
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
        const { store } = renderMenu();

        await user.click(screen.getByAltText('Downvote Contnet'));

        expect(store.getState().cards.downvotedCards).toEqual({});

        jest.advanceTimersByTime(2500);

        expect(store.getState().cards.downvotedCards).toHaveProperty('active1');
        expect(store.getState().cards.cards).not.toHaveProperty('active1');
    });

    it('vote buttons are disabled while animation is active', () => {
        renderMenu({ animation: 'is-upvoted' });

        const upvoteBtn = screen.getByAltText('Upvote Content').closest('button');
        const downvoteBtn = screen.getByAltText('Downvote Contnet').closest('button');

        expect(upvoteBtn).toBeDisabled();
        expect(downvoteBtn).toBeDisabled();
    });

    it('vote buttons are enabled when no animation', () => {
        renderMenu({ animation: '' });

        const upvoteBtn = screen.getByAltText('Upvote Content').closest('button');
        const downvoteBtn = screen.getByAltText('Downvote Contnet').closest('button');

        expect(upvoteBtn).not.toBeDisabled();
        expect(downvoteBtn).not.toBeDisabled();
    });
});

// ============================================================
// Category Menu
// ============================================================
describe('Menu category selection', () => {
    it('clicking category button reveals category options', async () => {
        const user = userEvent.setup();
        renderMenu();

        const categoryBtn = screen.getByAltText('category menu');
        await user.click(categoryBtn);

        expect(screen.getByText('Popular')).toBeInTheDocument();
        expect(screen.getByText('Humor')).toBeInTheDocument();
        expect(screen.getByText('Questions')).toBeInTheDocument();
        expect(screen.getByText('Inspiration')).toBeInTheDocument();
    });

    it('selecting Popular calls setRedditAPIRequest with r/popular', async () => {
        const user = userEvent.setup();
        const { props } = renderMenu();

        // Open category menu
        await user.click(screen.getByAltText('category menu'));
        await user.click(screen.getByText('Popular'));

        expect(props.setRedditAPIRequest).toHaveBeenCalledWith({
            requestType: 'category',
            query: 'r/popular',
            newRequest: true
        });
    });

    it('selecting Humor calls setRedditAPIRequest with r/funny', async () => {
        const user = userEvent.setup();
        const { props } = renderMenu();

        await user.click(screen.getByAltText('category menu'));
        await user.click(screen.getByText('Humor'));

        expect(props.setRedditAPIRequest).toHaveBeenCalledWith({
            requestType: 'category',
            query: 'r/funny',
            newRequest: true
        });
    });

    it('selecting Questions calls setRedditAPIRequest with r/AskReddit', async () => {
        const user = userEvent.setup();
        const { props } = renderMenu();

        await user.click(screen.getByAltText('category menu'));
        await user.click(screen.getByText('Questions'));

        expect(props.setRedditAPIRequest).toHaveBeenCalledWith({
            requestType: 'category',
            query: 'r/AskReddit',
            newRequest: true
        });
    });

    it('selecting Inspiration calls setRedditAPIRequest with r/interestingasfuck', async () => {
        const user = userEvent.setup();
        const { props } = renderMenu();

        await user.click(screen.getByAltText('category menu'));
        await user.click(screen.getByText('Inspiration'));

        expect(props.setRedditAPIRequest).toHaveBeenCalledWith({
            requestType: 'category',
            query: 'r/interestingasfuck',
            newRequest: true
        });
    });
});

// ============================================================
// Search Form
// ============================================================
describe('Menu search', () => {
    it('clicking search icon reveals search input', async () => {
        const user = userEvent.setup();
        renderMenu();

        await user.click(screen.getByAltText('search icon'));

        const searchInput = screen.getByPlaceholderText('search...');
        expect(searchInput).toBeInTheDocument();
    });

    it('submitting search calls setRedditAPIRequest with search term', async () => {
        const user = userEvent.setup();
        const { props } = renderMenu();

        // Open search
        await user.click(screen.getByAltText('search icon'));

        // Type and submit
        const searchInput = screen.getByPlaceholderText('search...');
        await user.type(searchInput, 'cats');
        await user.click(screen.getByText('Submit'));

        expect(props.setRedditAPIRequest).toHaveBeenCalledWith({
            requestType: 'search',
            query: 'cats',
            newRequest: true
        });
    });

    it('submitting empty search does not call setRedditAPIRequest', async () => {
        const user = userEvent.setup();
        const { props } = renderMenu();

        await user.click(screen.getByAltText('search icon'));
        await user.click(screen.getByText('Submit'));

        expect(props.setRedditAPIRequest).not.toHaveBeenCalled();
    });

    it('clears search input after successful submission', async () => {
        const user = userEvent.setup();
        renderMenu();

        await user.click(screen.getByAltText('search icon'));
        const searchInput = screen.getByPlaceholderText('search...');
        await user.type(searchInput, 'dogs');
        await user.click(screen.getByText('Submit'));

        expect(searchInput).toHaveValue('');
    });
});
