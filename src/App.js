import React from 'react';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName } from '@material-ui/core/styles';
import MUIBaseline from '@material-ui/core/CssBaseline';
import Theme from 'app/css/muiTheme';
import Config from 'app/index.js';
import 'app/css/bootstrap/app.scss';
import "app/../../node_modules/video-react/dist/video-react.css"; // import css

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: true,
});

const App = () => {
  return (
    <JssProvider generateClassName={generateClassName}>
      <Theme>
        <MUIBaseline />
        <Config />
      </Theme>
    </JssProvider>
  );
}
export default App;