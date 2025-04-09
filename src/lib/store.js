import { configureStore } from "@reduxjs/toolkit";
import cardsSlice from "@/lib/features/cards/cardsSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            cards: cardsSlice
        }
    });
}