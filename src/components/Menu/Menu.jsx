import { addDownvote, addUpvote, deleteVotedCard, selectActiveCard, selectCards, selectUpvotedCards, selectDownvotedCards } from "@/lib/features/cards/cardsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";


export const Menu = ({ setAnimation, animation }) => {
    const cards = useAppSelector(selectCards);
    const downvotedCards = useAppSelector(selectDownvotedCards);
    const upvotedCards = useAppSelector(selectUpvotedCards);
    const dispatch = useAppDispatch();
    const activeCard = useAppSelector(selectActiveCard);

    const onClickUpvote = () => {
        setAnimation("is-upvoted");
        setTimeout(() => {
            dispatch(addUpvote(activeCard));
            dispatch(deleteVotedCard(activeCard));
            setAnimation("");
        },2500)
    }

    const onClickDownvote = () => {
        setAnimation("is-downvoted");
        setTimeout(() => {
            dispatch(addDownvote(activeCard));
            dispatch(deleteVotedCard(activeCard));
            setAnimation("");
        }, 2500)
    }

    return(
        <menu>
            <li><button><img id="categories" src="/widgetsIcon.svg" alt="categories"/></button></li>
            <li><button disabled={animation === "" ? false : true}><img id="downvote" src="/DownvoteIcon.svg" alt="Downvote Contnet" onClick={onClickDownvote}/></button></li>
            <li><button disabled={animation != "" ? true : false}><img id="upvote" src="/UpvoteIcon.svg" alt="Upvote Content" onClick={onClickUpvote}/></button></li>
            <li><img id="user" src="/Arnold.jpg" alt="user icon"/></li>
        </menu>
    )
}