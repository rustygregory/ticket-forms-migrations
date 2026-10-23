# Ticket forms migration

Flora prototype of Admin Center **Tickets → Forms**, migrating Garden-era screens to Flora patterns.

## Screens

- **Forms list** (`#/forms`) — Flora list UI with search, Active filter, Ticket / Service Catalog tabs, reorderable rows, and Add ticket form
- **Add form** (`#/forms/new`) — form builder with system fields, available fields panel, drag/click to add, Cancel / Save

## Run

```bash
npm install
npm run dev
```

## Stack

- React 18 + Vite
- Garden v9 components themed with a local Flora `ThemeProvider` (same approach as other prototypes; `@zendesk-ui/react-components` is private)
- Flora spacing / button / tag / filter / draggable guidance from Zendesk Design (zeroheight)
- `@dnd-kit` for reorder and field add
