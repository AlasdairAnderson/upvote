import { addDownvote, addUpvote, deleteVotedCard, selectActiveCard, selectCards, selectUpvotedCards, selectDownvotedCards } from "@/lib/features/cards/cardsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useState } from "react";


export const Menu = ({ setAnimation, animation }) => {
    const cards = useAppSelector(selectCards);
    const downvotedCards = useAppSelector(selectDownvotedCards);
    const upvotedCards = useAppSelector(selectUpvotedCards);
    const dispatch = useAppDispatch();
    const activeCard = useAppSelector(selectActiveCard);
    const [isMenuVisible, setIsMenuVisible] = useState(false);

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

    return (
        <div className="menus">
            <menu className="category-menu" id={isMenuVisible ? "visible" : ""}>
                <li className="category-menu-item"><button><img src="/popularIcon.svg"></img>Popular</button></li>
                <li className="category-menu-item"><button>Humor</button></li>
                <li className="category-menu-item"><button>Questions</button></li>
                <li className="category-menu-item"><button>Inspiration</button></li>
            </menu>
            <menu className="menu">
                <li><button onClick={() => setIsMenuVisible(currentMenuVisibility => !currentMenuVisibility)}><img id="category-menu-icon" src="/category_menu.svg" alt="category menu" /></button></li>
                <li><button onClick={onClickDownvote} disabled={animation != "" ? true : false}><img id="downvote" src="/DownvoteIcon.svg" alt="Downvote Contnet" /></button></li>
                <li><button onClick={onClickUpvote} disabled={animation != "" ? true : false}><img id="upvote" src="/UpvoteIcon.svg" alt="Upvote Content" /></button></li>
                <li><img id="search" src="/searchIcon.svg" alt="search icon" /></li>
            </menu>
        </div>
    )
}