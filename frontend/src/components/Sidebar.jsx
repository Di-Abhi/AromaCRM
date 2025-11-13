import React, { useContext } from 'react';
// import { StoreContext } from '../store/StoreProvider';

const items = ['dashboard','contacts','products','subscriptions','opportunities','activities','settings'];

export default function Sidebar() {
  // const { state, dispatch } = useContext(StoreContext);
  return (
    <aside className="w-64 bg-white border-r p-4">
      <ul className="space-y-2">
        {items.map(i => (
          <li key={i}>
            <button className={`w-full text-left px-3 py-2 rounded ${state.ui.nav===i ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
              onClick={() => dispatch({ type: 'SET_NAV', nav: i })}>
              {i.charAt(0).toUpperCase() + i.slice(1)}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
