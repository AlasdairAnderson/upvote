import { configureStore } from "@reduxjs/toolkit";
import cardsSlice from "@/lib/features/cards/cardsSlice";

export const makeStore = (preloadedState) => {
    return configureStore({
        reducer: {
            cards: cardsSlice
        },
        preloadedState: preloadedState
    });
}