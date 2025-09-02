import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import { Card } from './Card';

const mockPostInformation = {
    default: {
        title: "Lorus Ipsum",
        id: '1234',
        upvotes: '221',
        downvotes: '105402',
        num_comments: '3432',
        post_content: {
            type: 'test',
            content: 'This is a very long paragraph that will be used to see if the Card component renders'
        }
    },
    image: {
        title: "Lorus Ipsum",
        id: '2345',
        upvotes: '35411',
        downvotes: '500101',
        num_comments: '200',
        post_content: {
            type: 'image',
            content: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F7a%2F44%2F39%2F7a4439f4189cd94113bb371ac7042ed2.jpg&f=1&nofb=1&ipt=3b178edbc654b5861b02aff0765b4f8355185301010ab5ce405ff7b78213780c'
        }
    },
    video: {
        title: "Lorus Ipsum",
        id: '3456',
        upvotes: '35411',
        downvotes: '500101',
        num_comments: '200',
        post_content: {
            type: 'video',
            content: 'https://youtu.be/-xet6KVNwWU'
        }
    },
    text: {
        title: "Lorus Ipsum",
        id: '4567',
        upvotes: '35411',
        downvotes: '500101',
        num_comments: '200',
        post_content: {
            type: 'text',
            content: 'This is a very long paragraph that will be used to see if the Card component renders'
        }
    }
} 

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
    it('registers a click', () => {
        const mockHandelingClick = jest.fn();
        render(<Card card={mockPostInformation.default} onMouseDown={mockHandelingClick}/>);
        expect(mockHandelingClick).toHaveBeenCalled;
    });
});


