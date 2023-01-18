import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Body from './components/Body/Body';

const theme = createTheme({
  palette: {
    primary: {
        main: '#000'
    },
  },
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme} >
        <div className="gt-main">
            <Body />
        </div>
        </ThemeProvider>
    </div>
  );
}

export default App;
