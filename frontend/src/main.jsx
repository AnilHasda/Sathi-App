import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {Provider} from "react-redux";
import Store from "./Redux/Store/Store";
import App from './App.jsx';
import './index.css';
import {Toaster} from "react-hot-toast";
import {BrowserRouter} from "react-router-dom"
createRoot(document.getElementById('root')).render(

    <Provider store={Store}>
      <Toaster/>
      <BrowserRouter>
    <App />
    </BrowserRouter>
    </Provider>
)
