# Browser Panel for Auton Knowledge

Browse the web inside Auton Knowledge. The Agent can read the page you are looking at and the text you select, so you can ask about it without copying and pasting.

在 Auton Knowledge 里浏览网页。Agent 能读到你正在看的页面和你选中的文字，直接提问即可，不用复制粘贴。

## Requirements

- An Auton Knowledge version that supports the `web.browse` runtime-plugin permission. Older versions reject the permission and will not install this plugin.

## Install

1. Open **Settings → Extensions → Plugin marketplace**, find **Browser Panel** and install it. Or install from GitHub with id `dev.auton.browser-panel` and repository `philip1974/auton-browser-panel`.
2. Click **Review permissions**, read what `web.browse` and `agent.tools` allow, then **Grant and enable**.
3. Open the panel with the 🌐 icon or the `/dev.auton.browser-panel:open` command, type an address and press Enter.

## What the Agent gets

| Tool | Returns |
|---|---|
| `browser_get_page` | Title, URL and main text of the page in the panel (up to 40,000 characters by default; `max_chars` up to 200,000) |
| `browser_get_selection` | The text selected in that page, with its title and URL |

Both tools wrap page text in `<<<BEGIN UNTRUSTED WEB CONTENT>>>` … `<<<END UNTRUSTED WEB CONTENT>>>` and tell the model never to follow instructions found inside it. Every call goes through Auton Knowledge's normal tool confirmation.

如果面板没打开，工具会回答「浏览器面板未打开」；没有选中文字时回答「没有选中文字」，不会退回整页。
If the page failed to load, the tools say so (with the network error) instead of reading the browser's error page; while a page is still loading, the result says that too.

## Using the panel

- Type an address (`en.wikipedia.org` is enough) and press Enter; Escape puts back the current address.
- While a page loads, a bar runs under the toolbar and the reload button becomes stop.
- With the page focused, Cmd/Ctrl+R reloads the page and Cmd/Ctrl+[ / ] go back and forward.
- The panel follows the app language (English, 中文, 日本語, 한국어).

## Permissions and isolation

- `web.browse` — shows web pages in this plugin's panel and lets it read the page text and your selection there. Pages run in a separate sandboxed process with their own storage, without access to Auton Knowledge or your knowledge base. Only `http` and `https` addresses open; downloads, pop-up windows, notifications, camera, microphone and other device access are refused.
- `agent.tools` — registers the two tools above.

Runtime plugins run inside the app; permissions limit the plugin API, they are not a sandbox for the plugin's own code. Install only plugins you trust.

Uninstalling the plugin also clears its browsing data (cookies, storage, cache).

## Limits

- One browser panel, one page at a time; no tabs, bookmarks or history list.
- Closing the panel closes the page. Reopening it loads the last address again, without its back/forward history or scroll position.
- Only the top-level document is read; text inside iframes and PDF viewers is not.
- The page is hidden while a dialog, menu or Settings covers the panel area.

## Development

```sh
pnpm install
pnpm check   # tests + coverage (95/90)
```

`main.mjs` is the whole plugin: a single ES module with no build step and no runtime dependencies.

## License

MIT
