import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../utils/testutils';
import { CardStack } from '@/components/cardStack/CardStack.jsx';
import { mockPostInformation } from '../../__mocks__/cardcontent.js';

global.fetch = jest.fn()

describe('CardStack', () => {
    beforeEach(() => {
        fetch.mockClear();
        fetch.mockResolvedValue({
            ok: true,
            json: async () => (
                {
                    data: {
                        cards: { 
                            cards: {mockPostInformation},
                            upvotedCards: {},
                            downvotedCards: {},
                            isLoading: false,
                            hasError: false
                        }   
                    }
                    
                }
            )
        });
    });

    it('renders multiple cards', async () => {
        const preloadedState = {
            cards: {
                cards: {
                    '123': mockPostInformation.default,
                    '234': mockPostInformation.image,
                    '345': mockPostInformation.text,
                    '456': mockPostInformation.video
                },
                upvotedCards: {},
                downvotedCards: {},
                isLoading: false,
                hasError: false
            }
        }
        console.log('Preloaded State:', preloadedState);
        
        renderWithProviders(<CardStack/>, { preloadedState });

        screen.debug();

        const cards = await screen.findAllByTestId('card');
        screen.debug();
        expect(screen.queryByText('Loading...')).toBeNull();
        expect(cards).toHaveLength(4);
    });
});
describe('handlesMouseDown', () => {
    it('should set active card with correct initial values', () => {

    });
    it('should only allow one active car at a time', () => {

    });
    it('should handle touch events for mobile devices', () => {

    });
})