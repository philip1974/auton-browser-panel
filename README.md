# Browser Panel for Auton Knowledge

Browse the web inside Auton Knowledge. The Agent can read the page you are looking at and, after your confirmation, use visible page controls.

在 Auton Knowledge 里浏览网页。Agent 能读取当前页面和选中文字，也能在你逐次确认后滚动、点击及填写普通表单。

## Requirements

- An Auton Knowledge version that supports the `web.browse` and `web.interact` runtime-plugin permissions. Older versions reject the permission and will not install this plugin.

## Install

1. Open **Settings → Extensions → Plugin marketplace**, find **Browser Panel** and install it. Or install from GitHub with id `dev.auton.browser-panel` and repository `philip1974/auton-browser-panel`.
2. Click **Review permissions**, read what `web.browse`, `web.interact` and `agent.tools` allow, then **Grant and enable**.
3. Open the panel with the 🌐 icon or the `/dev.auton.browser-panel:open` command, type an address and press Enter.

## What the Agent gets

| Tool | Returns |
|---|---|
| `browser_get_page` | Title, URL and main text of the page in the panel (up to 40,000 characters by default; `max_chars` up to 200,000) |
| `browser_get_selection` | The text selected in that page, with its title and URL |
| `browser_get_interactive` | A bounded list of visible supported controls with short-lived opaque refs, select-option snapshots, and explicit restricted-field markers |
| `browser_scroll` | One bounded scroll followed by a fresh interaction observation; scrolls the inner area when the page itself does not scroll, and reports `SCROLL_LIMIT` when nothing moved |
| `browser_act` | One confirmed control click, same-origin observed-link navigation, ordinary text fill, select action, or Enter in a text field, followed by a fresh observation |

All page-derived data is wrapped in `<<<BEGIN UNTRUSTED WEB CONTENT>>>` … `<<<END UNTRUSTED WEB CONTENT>>>` and marked as untrusted. Action refs belong to one observation and expire when the page changes. Every action requires a host-issued, single-use authorization tied to the exact confirmed tool input.
Timed-out actions are reported as having an unknown result and must not be retried automatically. If another page operation is still running, the Agent must wait and obtain a fresh observation.

如果面板没打开，工具会回答「浏览器面板未打开」；没有选中文字时回答「没有选中文字」，不会退回整页。
If the page failed to load, the tools say so (with the network error) instead of reading the browser's error page; while a page is still loading, the result says that too.

## Using the panel

- Type an address (`en.wikipedia.org` is enough) and press Enter; Escape puts back the current address.
- While a page loads, a bar runs under the toolbar and the reload button becomes stop.
- With the page focused, Cmd/Ctrl+R reloads the page and Cmd/Ctrl+[ / ] go back and forward.
- **Open in browser** (the arrow-out button) hands the current page to your system browser — use it for downloads, which the panel refuses and tells you so.
- The panel follows the app language (English, 中文, 日本語, 한국어).

## Shared page selections

On Auton Knowledge 0.3.0 or newer, Browser Panel enables shared page selections. When you select text in a web page and right-click it, other plugins can offer selection actions, such as saving the text to a vocabulary list. The selected text, sentence, page title and URL are shared only after you choose one of those actions. On older Auton Knowledge versions this menu item does not appear, and the rest of Browser Panel keeps working as before.

在 Auton Knowledge 0.3.0 或更新版本中，Browser Panel 会开启网页选区共享。你在网页里选中文字并右键时，其它插件可以提供选区动作，例如把文字收进生词本。只有在你点击某个动作后，选中的文字、所在句、页面标题和 URL 才会交给对应插件。旧版 Auton Knowledge 不会出现这一项，其余功能保持不变。

## Permissions and isolation

- `web.browse` — shows web pages in this plugin's panel and lets it read the page text and your selection there. Pages run in a separate sandboxed process with their own storage, without access to Auton Knowledge or your knowledge base. Only `http` and `https` addresses open; downloads, pop-up windows, notifications, camera, microphone and other device access are refused.
- `web.interact` — observes visible controls and permits confirmed scrolling, control clicks, same-origin observed-link navigation, ordinary text input, selection of enabled options from the exact observation (each select names the option's visible text as `optionName`, which the approval shows), and pressing Enter in a text field (a search box with no button) — refused when its form would send to another site. Text fields, including rich-text and chat editors, show their current value; switches report `checked`, disclosure and menu buttons `expanded`, tabs and options `selected`; disabled controls are listed as disabled and controls covered by a dialog or overlay are left out. Passwords, one-time codes, payment and file fields are visibly marked `restricted` and refused; native submit buttons, cross-origin, popup and download links and unsupported controls are also refused.
- `agent.tools` — registers the five tools above.

Runtime plugins run inside the app; permissions limit the plugin API, they are not a sandbox for the plugin's own code. Install only plugins you trust.

Uninstalling the plugin also clears its browsing data (cookies, storage, cache).

## Limits

- One browser panel, one page at a time; no tabs, bookmarks or history list.
- Closing the panel closes the page. Reopening it loads the last address again, without its back/forward history or scroll position.
- Only the top-level document is read; text inside iframes and PDF viewers is not.
- Interaction is semantic and intentionally limited. Canvas, iframes (same-origin ones included: their controls are not listed), drag-and-drop, uploads, downloads, browser permission prompts, CAPTCHA and arbitrary JavaScript are unsupported; use an external Computer Use workflow when those are genuinely needed.
- The page is hidden while a dialog, menu or Settings covers the panel area.

## Development

```sh
pnpm install
pnpm check   # tests + coverage (95/90)
```

`main.mjs` is the whole plugin: a single ES module with no build step and no runtime dependencies.

## License

MIT
