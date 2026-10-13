import { StrictMode } from 'react'; import { createRoot } from 'react-dom/client'; import App from './App'; import './styles/global.css'; import './styles/roulette.css'; import './styles/navigation.css'; import './styles/backup.css'; import './styles/optional-rules.css'; import './styles/abilities.css';
createRoot(document.getElementById('root')!).render(<StrictMode><App/></StrictMode>);
