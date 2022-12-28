import "./App.css";
import { Main } from "./components/Main";
import { AppProvider } from "./context/AppConfig";

function App() {
  return <AppProvider children={<Main />} />;
}

export default App;
