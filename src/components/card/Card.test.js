import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { mockPostInformation } from '../../__mocks__/cardcontent.js';
import { Card } from './Card';
import React from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '@/lib/store';

// --- Helper: render Card wrapped with Redux Provider ---
const renderCard = (cardData, extraProps = {}) => {
    const store = makeStore({
        cards: {
            listingData: { after: null, before: null, geo_filter: null, count: null },
            cards: { [cardData.id]: cardData },
            upvotedCards: {},
            downvotedCards: {},
            activeCard: cardData,
            isLoading: false,
            hasError: false
        }
    });

    const defaultProps = {
        animation: '',
        card: cardData,
        cardPoistioning: {
            mouseStartingPosition: { x: null, y: null },
            mouseCurrentPosition: { x: null, y: null },
            mouseDelta: { x: null, y: null },
            voteStatus: 'none'
        },
        onPointerDragStart: jest.fn(),
        onPointerDragStop: jest.fn(),
        setRedditAPIRequest: jest.fn(),
        ...extraProps
    };

    return {
        store,
        ...render(
            <Provider store={store}>
                <Card {...defaultProps} />
            </Provider>
        ),
        props: defaultProps
    };
};

// ============================================================
// Card Rendering
// ============================================================
describe('Card Rendering', () => {
    it('renders with a title', () => {
        renderCard(mockPostInformation.default);
        const card = screen.getByTestId('card');
        expect(card).toHaveTextContent('Lorus Ipsum');
    });

    it('renders img element for image content type', () => {
        renderCard(mockPostInformation.image);
        const image = screen.getByTestId('image');
        expect(image).toBeInTheDocument();
    });

    it('renders video element for video content type', () => {
        renderCard(mockPostInformation.video);
        const video = screen.getByTestId('video');
        expect(video).toBeInTheDocument();
    });

    it('renders p element for text content type', () => {
        renderCard(mockPostInformation.text);
        const text = screen.getByTestId('text');
        expect(text).toBeInTheDocument();
    });

    it('renders fallback for unrecognised content type', () => {
        // mockPostInformation.default has type "test" (not a real type)
        renderCard(mockPostInformation.default);
        const noContent = screen.getByTestId('no content');
        expect(noContent).toBeInTheDocument();
    });

    it('renders "No content found" when post_content is missing', () => {
        const cardWithNoContent = { ...mockPostInformation.default, id: 'no-content', post_content: null };
        renderCard(cardWithNoContent);
        expect(screen.getByText('No content found')).toBeInTheDocument();
    });
});

// ============================================================
// Stat Rounding (roundStats)
// ============================================================
describe('Card stat rounding', () => {
    it('displays raw number for stats under 1000', () => {
        renderCard(mockPostInformation.default);
        const card = screen.getByTestId('card');
        // upvotes is 221 which is under 1000
        expect(card).toHaveTextContent('221');
    });

    it('rounds stats over 1000 to nearest K', () => {
        renderCard(mockPostInformation.default);
        const card = screen.getByTestId('card');
        // num_comments is 3432 → 3K
        expect(card).toHaveTextContent('3K');
    });

    it('rounds large downvotes correctly', () => {
        renderCard(mockPostInformation.default);
        const card = screen.getByTestId('card');
        // downvotes is 105402 → 105K
        expect(card).toHaveTextContent('105K');
    });
});

// ============================================================
// Error Content Type
// ============================================================
describe('Card error content', () => {
    const errorCard = {
        id: 'error-card',
        upvotes: 0,
        downvotes: 0,
        num_comments: 0,
        title: 'An error has occured',
        post_content: {
            content: 'No posts could be found',
            type: 'error'
        }
    };

    it('renders error message and "Return to Safety" button', () => {
        renderCard(errorCard);
        expect(screen.getByText('No posts could be found')).toBeInTheDocument();
        expect(screen.getByText('Return to Safety')).toBeInTheDocument();
    });

    it('clicking "Return to Safety" calls setRedditAPIRequest with popular defaults', async () => {
        const user = userEvent.setup();
        const { props } = renderCard(errorCard);

        await user.click(screen.getByText('Return to Safety'));

        expect(props.setRedditAPIRequest).toHaveBeenCalledWith({
            requestType: 'popular',
            query: '',
            newRequest: true
        });
    });
});

// ============================================================
// Card Interactions
// ============================================================
describe('Card interactions', () => {
    it('calls onPointerDragStart on pointer down', () => {
        const { props } = renderCard(mockPostInformation.default);
        const card = screen.getByTestId('card');

        fireEvent.pointerDown(card, { clientX: 200, clientY: 300, pointerId: 1 });

        expect(props.onPointerDragStart).toHaveBeenCalled();
    });

    it('calls onPointerDragStop on pointer up', () => {
        const { props } = renderCard(mockPostInformation.default);
        const card = screen.getByTestId('card');

        fireEvent.pointerUp(card, { clientX: 200, clientY: 300, pointerId: 1 });

        expect(props.onPointerDragStop).toHaveBeenCalled();
    });
});
