import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

//Redux
import { Provider } from 'react-redux' //Semelhante ao ContextAPI
import { store } from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}> {/* Vamos poder compartilhar tudo que tiver dentro do Redux com nossos apps */}
      <App />
    </Provider>
  </React.StrictMode>
);

