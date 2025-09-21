import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { makeStore } from '@/lib/store';

export function renderWithProviders(
    ui,
    {
        preloadedState = {},
        store = makeStore(preloadedState),
        ...renderOptions
    } = {}
) {
    function Wrapper({children}) {
        return <Provider store={store}>{children}</Provider>
    }

    return {store, ...render(ui, { wrapper: Wrapper, ...renderOptions})}
}