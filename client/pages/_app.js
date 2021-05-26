import "../styles/globals.css";
import { Provider } from "react-redux";
import store from "../redux/store";
import ThemeContext from "../context/ThemeContext";
function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ThemeContext>
        <Component {...pageProps} />
      </ThemeContext>
    </Provider>
  );
}

export default MyApp;
