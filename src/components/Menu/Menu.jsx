import { addDownvote, addUpvote, deleteVotedCard, selectActiveCard, selectCards, selectUpvotedCards, selectDownvotedCards } from "@/lib/features/cards/cardsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useState } from "react";


export const Menu = ({ setAnimation, animation, setRedditAPIRequest }) => {
    const cards = useAppSelector(selectCards);
    const downvotedCards = useAppSelector(selectDownvotedCards);
    const upvotedCards = useAppSelector(selectUpvotedCards);
    const dispatch = useAppDispatch();
    const activeCard = useAppSelector(selectActiveCard);
    const [isCategoryMenuVisible, setIsCategoryMenuVisible] = useState(false);
    const [isSearchMenuVisible, setIsSearchMenuVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const onClickUpvote = () => {
        setAnimation("is-upvoted");
        setTimeout(() => {
            dispatch(addUpvote(activeCard));
            dispatch(deleteVotedCard(activeCard));
            setAnimation("");
        }, 2500)
    }

    const onClickDownvote = () => {
        setAnimation("is-downvoted");
        setTimeout(() => {
            dispatch(addDownvote(activeCard));
            dispatch(deleteVotedCard(activeCard));
            setAnimation("");
        }, 2500)
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setRedditAPIRequest({ requestType: 'search', query: searchTerm, newRequest: true });
        setSearchTerm("");
    }

    return (
        <menu className="menu">
            <menu className='hidden-menu category-menu' id={isCategoryMenuVisible ? "visible" : ""}>
                <li className="category-menu-item"><button onClick={() => { setRedditAPIRequest({ requestType: 'category', query: 'r/popular', newRequest: true }) }}><img src="/popularIcon.svg" />Popular</button></li>
                <li className="category-menu-item"><button onClick={() => { setRedditAPIRequest({ requestType: 'category', query: 'r/funny', newRequest: true }) }}><img src="/humorIcon.svg" />Humor</button></li>
                <li className="category-menu-item"><button onClick={() => { setRedditAPIRequest({ requestType: 'category', query: 'r/AskReddit', newRequest: true }) }}><img src="/questionIcon.svg" />Questions</button></li>
                <li className="category-menu-item"><button onClick={() => { setRedditAPIRequest({ requestType: 'category', query: 'r/interestingasfuck', newRequest: true }) }}><img src="/inspirationIcon.svg" />Inspiration</button></li>
            </menu>
            <li><button id="menu-item-category" onClick={() => setIsCategoryMenuVisible(currentMenuVisibility => !currentMenuVisibility)}><img id="category-menu-icon" src="/category_menu.svg" alt="category menu" /></button></li>
            <li><button onClick={onClickDownvote} disabled={animation != "" ? true : false}><img id="downvote" src="/DownvoteIcon.svg" alt="Downvote Contnet" /></button></li>
            <li><button onClick={onClickUpvote} disabled={animation != "" ? true : false}><img id="upvote" src="/UpvoteIcon.svg" alt="Upvote Content" /></button></li>
            <form onSubmit={(e) => handleFormSubmit(e)} className="hidden-menu search-form" id={isSearchMenuVisible ? "visible" : ""}>
                <input type="text" className="search-menu" id="search" name="search" onChange={e => setSearchTerm(e.target.value)} value={searchTerm} placeholder="search..."></input>
                <button type="submit">Submit</button>
            </form>
            <li><button id="menu-item-search" onClick={() => setIsSearchMenuVisible(currentMenuVisibility => !currentMenuVisibility)}><img id="search" src="/searchIcon.svg" alt="search icon" /></button></li>
        </menu >
    )
}