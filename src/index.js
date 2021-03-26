import React from 'react';
import ReactDOM from 'react-dom';
// import { UseWalletProvider } from 'use-wallet'
import { Provider } from 'react-redux';
import store from './redux/store';
import './index.css';
import App from './App';
import { UseWalletProvider } from 'use-wallet';
import config from 'config';
import reportWebVitals from './reportWebVitals';
import './styles/styles.scss';

const {setting} = store.getState()

ReactDOM.render(
    <Provider store={store}>
        <UseWalletProvider chainId={config[setting.network].chainId}>
            <App foo={setting.network}/>
        </UseWalletProvider>
    </Provider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
