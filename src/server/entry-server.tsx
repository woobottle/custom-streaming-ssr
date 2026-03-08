//`StaticRouter`(from `react-router-dom`)로 `App`을 감싸고 `location={url}`을 전달
//`ReactDOMServer.renderToString()`으로 HTML 문자열을 반환
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from '../client/App';
import { PassThrough, Readable } from 'node:stream';

export function render(url: string, template: string): Readable {
  const [head, footer] = template.split('<!-- separator -->')

  async function* asyncGenerator() {
    yield head;
    const passThrough = new PassThrough();
    let timeout: NodeJS.Timeout;
    const { pipe, abort } = renderToPipeableStream(<StaticRouter location={url}>
      <App />
    </StaticRouter>, {
      onShellReady() {
        // 시작 시 timeout으로 abort 예약
        timeout = setTimeout(() => {
          abort()
        }, 3000)
        pipe(passThrough);
      },
      onError(err) {
        console.error(err)
      },
      onAllReady() {
        // 완료 시 clear
        clearTimeout(timeout)
      }
    });

    for await (const chunk of passThrough) { 
      yield chunk;
    }
    
    yield footer;
  }

  return Readable.from(asyncGenerator())
}
