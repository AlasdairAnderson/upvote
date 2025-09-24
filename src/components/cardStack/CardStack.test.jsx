import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../utils/testutils';
import { CardStack } from '@/components/cardStack/CardStack.jsx';
import { mockPostInformation } from '../../__mocks__/cardcontent.js';
import { Card } from '../card/Card';
import { makeStore } from '@/lib/store';


describe('CardStack', () => {

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
        const store = makeStore(preloadedState);
        console.log('Store state:', store.getState());
        store.dispatch = jest.fn();

        renderWithProviders(<CardStack/>, { store });
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