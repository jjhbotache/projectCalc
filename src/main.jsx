import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import App from './App'
import store from './store.js';
import { ToastContainer } from 'react-toastify';
import './main.css'
import 'react-toastify/dist/ReactToastify.css';


createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      
      />
      <App />
    </Provider>
)
