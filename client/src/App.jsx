import NotificationHandler from './components/NotificationHandler';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <NotificationHandler />
      <ToastContainer />
      {/* ... rest of your app */}
    </>
  );
}

export default App;