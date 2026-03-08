//`StaticRouter`(from `react-router-dom`)로 `App`을 감싸고 `location={url}`을 전달
//`ReactDOMServer.renderToString()`으로 HTML 문자열을 반환
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from '../client/App';

export function render(url: string): string {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );
}
