import {render, screen, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom';
import { mockPostInformation, mockActiveCard } from '../../__mocks__/cardcontent.js'
import { Card } from './Card';

describe("Card Rendering", () => {
    it('Should render with a title', () => {
        //Set up
        render(<Card card={mockPostInformation.default}/>);
        //Identification
        const card = screen.getByTestId('card')
        //Result
        expect(card).toHaveTextContent('Lorus Ipsum');
    });
    it('Should have img element if passed an image content type', () => {
        //Set up
        render(<Card card={mockPostInformation.image}/>);
        //Identification
        const image = screen.getByTestId('image');
        //Result
        expect(image).toBeInTheDocument();
    });
    it('Should have video element if passed a video content type', () => {
        //Set up
        render(<Card card={mockPostInformation.video}/>);
        //Identification
        const video = screen.getByTestId('video');
        //Result
        expect(video).toBeInTheDocument();
    });
    it('Should have p element if passed text content type', () => {
        //Set up
        render(<Card card={mockPostInformation.text}/>)
        //Identification
        const text = screen.getByTestId('text');
        //Result
        expect(text).toBeInTheDocument();
    });
    it('Should return no content found if content type does not match image, text or video', () => {
        //Set up
        render(<Card card={mockPostInformation.default}/>);
        //Identification
        const noContent = screen.getByTestId('no content');
        //Result
        expect(noContent).toBeInTheDocument();

    });
    it('Should round upvotes, downvotes & comments if over 1000 to nearest 1000', () => {
        render(<Card card={mockPostInformation.default}/>);
        const card = screen.getByTestId('card');
        expect(card).toHaveTextContent('3K')
    });
    it('Should not round upvotes, downvotes & comments if not over 1000', () => {
        render(<Card card={mockPostInformation.default}/>);
        const card = screen.getByTestId('card');
        expect(card).toHaveTextContent('221')
    });
});
describe("Card Interations", () => {
    it('registers a click', async () => {
        const mockHandelingClick = jest.fn();
        const user = userEvent.setup()
        render(<Card card={mockPostInformation.default} onMouseDown={mockHandelingClick}/>);

        const card = screen.getByTestId('card');
        await user.click(card);

        expect(mockHandelingClick).toHaveBeenCalled();
    });
});


