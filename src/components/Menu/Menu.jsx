import { addDownvote, addUpvote, deleteVotedCard, selectActiveCard, selectCards, selectUpvotedCards, selectDownvotedCards } from "@/lib/features/cards/cardsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks"

export const Menu = () => {
    const cards = useAppSelector(selectCards);
    const downvotedCards = useAppSelector(selectDownvotedCards);
    const upvotedCards = useAppSelector(selectUpvotedCards);
    const dispatch = useAppDispatch();
    const activeCard = useAppSelector(selectActiveCard);

    const onClickUpvote = () => {
        dispatch(addUpvote(activeCard));
        dispatch(deleteVotedCard(activeCard));
    }

    const onClickDownvote = () => {
        dispatch(addDownvote(activeCard));
        dispatch(deleteVotedCard(activeCard));
    }

    return(
        <menu>
            <li><a><img id="categories" src="/widgetsIcon.svg" alt="categories"/></a></li>
            <li><a><img id="downvote" src="/DownvoteIcon.svg" alt="Downvote Contnet" onClick={onClickDownvote}/></a></li>
            <li><a><img id="upvote" src="/UpvoteIcon.svg" alt="Upvote Content" onClick={onClickUpvote}/></a></li>
            <li><img id="user" src="/Arnold.jpg" alt="user icon"/></li>
        </menu>
    )
}