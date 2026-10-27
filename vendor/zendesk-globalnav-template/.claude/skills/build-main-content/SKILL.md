---
skill_name: build-main-content
description: Build features in GlobalNav template main content areas only
trigger_phrases:
  - "build this design on {product}'s main content area"
  - "build this design on {product}"
  - "implement this design in {product}"
  - "build on the main content area"
  - "add to the {product} main content"
  - "build {product}'s main content area"
  - "modify the main content for {product}"
  - "build on {product} content area"
  - "add features to {product} main content"
  - "build in the {product} page"
  - "create UI in {product} main content"
  - "build from this figma"
  - "implement this figma design"
  - "add this figma to {product}"
  - "here's a figma link"
  - "use garden components for this figma"
  - "implement with garden components"
auto_invoke_when:
  - package.json contains "zendesk-globalnav-template"
  - working with any of: Support, Knowledge, AI Agents, Chat, Voice, Analytics, Workforce Management, Quality Assurance, Community, Sales, Admin Center
---

# Build on GlobalNav Main Content Areas

This skill helps you build features on top of the GlobalNav template by modifying **only the main content components** while preserving the TopBar and left navigation.

---

## ⚠️ MANDATORY: Garden Design System for Figma Designs

**When implementing ANY Figma design link or screenshot:**

🎯 **YOU MUST USE the complete Zendesk Garden Design System from https://github.com/zendeskgarden**

### Components
- ✅ **ALL buttons** → `<Button>` from `@zendeskgarden/react-buttons`
- ✅ **ALL inputs** → `<Input>`, `<Textarea>`, `<Select>` from `@zendeskgarden/react-forms`
- ✅ **ALL form controls** → Garden form components (Checkbox, Radio, Toggle)
- ❌ **NEVER** create custom UI components that Garden already provides

### Typography
- ✅ **ALL text** → `<XL>`, `<LG>`, `<MD>`, `<SM>`, `<XXS>` from `@zendeskgarden/react-typography`
- ✅ **ALL headings** → Use `tag` prop: `<XL tag="h1">`, `<LG tag="h2">`
- ❌ **NEVER** use plain HTML tags: `<h1>`, `<h2>`, `<p>`, `<span>` for content text
- ❌ **NEVER** apply custom font-size, font-weight, or line-height

### Colors
- ✅ **ALL colors** → Use Garden color tokens from the palette
- ✅ **Reference** Garden color documentation for proper values
- ❌ **NEVER** use arbitrary hex codes like `#1234AB` without checking Garden tokens
- ❌ **NEVER** use inline color styles without Garden token equivalents

### Icons
- ✅ **ALL icons** → Import from `@zendeskgarden/svg-icons`
- ✅ **Format**: `import { ReactComponent as IconName } from '@zendeskgarden/svg-icons/src/16/icon-name.svg'`
- ❌ **NEVER** use custom SVG icons, emoji, or icon fonts when Garden icons exist
- ❌ **NEVER** use other icon libraries (FontAwesome, Material Icons, etc.)

**This is NON-NEGOTIABLE for Figma implementations.** See detailed system guidelines below.

---

## When to Use This Skill

✅ **USE THIS SKILL EVERY TIME** when:
- The project's `package.json` contains `"zendesk-globalnav-template"` as a dependency
- The user mentions any Zendesk product: Support, Knowledge, AI Agents, Chat, Voice, Analytics, Workforce Management, Quality Assurance, Community, Sales, or Admin Center
- **The user provides a Figma design URL to implement (MUST use Garden components from https://github.com/zendeskgarden)**
- The user says "build this design on [Product]'s main content area" or similar

❌ **DON'T USE** when:
- Starting a brand new project (use `/globalnav-start` instead)
- Working on a non-GlobalNav React project
- User explicitly asks to modify the chrome/navigation components

## Quick Detection Check

Before working on any feature request, check if this is a GlobalNav project:

```bash
# Check if zendesk-globalnav-template is installed
grep -q "zendesk-globalnav-template" package.json && echo "✅ GlobalNav project - use build-main-content skill"
```

If this returns "✅ GlobalNav project", this skill should be used for all feature building.

## 🎨 Figma Design Implementation Rules

**When a user provides a Figma link or screenshot, follow these MANDATORY rules:**

### Rule 1: Garden Components are REQUIRED
**ALWAYS use Zendesk Garden React components from https://github.com/zendeskgarden for ALL UI elements**

- ✅ Use `<Button>` from `@zendeskgarden/react-buttons` - NOT custom buttons
- ✅ Use `<Input>` from `@zendeskgarden/react-forms` - NOT custom inputs
- ✅ Use `<Select>` from `@zendeskgarden/react-forms` - NOT custom dropdowns
- ✅ See full mapping tables in sections below

### Rule 2: Garden Typography is REQUIRED
**ALWAYS use Garden typography components - NEVER plain HTML tags**

- ✅ Use `<XL>`, `<LG>`, `<MD>`, `<SM>`, `<XXS>` from `@zendeskgarden/react-typography`
- ✅ Use `tag` prop for semantic HTML: `<XL tag="h1">`, `<LG tag="h2">`
- ❌ NEVER use `<h1>`, `<h2>`, `<p>`, `<span>` directly for content
- ❌ NEVER apply custom `font-size`, `font-weight`, `line-height`
- ❌ NEVER use CSS like `fontSize: '24px'` or `fontWeight: 600`

### Rule 3: Garden Colors are REQUIRED
**ALWAYS use Garden color tokens - NEVER arbitrary colors**

- ✅ Reference Garden's color palette for all color values
- ✅ Use semantic color names from Garden documentation
- ❌ NEVER use arbitrary hex codes without verifying Garden token
- ❌ NEVER use inline styles like `color: '#FF5733'`
- 📚 Check: https://garden.zendesk.com/design/color

### Rule 4: Garden Icons are REQUIRED
**ALWAYS use Garden SVG icons - NEVER custom or third-party icons**

- ✅ Import from `@zendeskgarden/svg-icons/src/16/` or `/src/26/`
- ✅ Format: `import { ReactComponent as IconName } from '@zendeskgarden/svg-icons/src/16/icon-name.svg'`
- ❌ NEVER use FontAwesome, Material Icons, or other icon libraries
- ❌ NEVER use emoji or Unicode symbols for icons
- 📚 Browse icons: https://garden.zendesk.com/design/icons

### Rule 5: Analysis Before Implementation
Before writing ANY code:
1. List every UI element in the Figma design
2. Map each to its Garden component using the tables in this skill
3. Identify all text → Map to Garden typography components
4. Identify all colors → Verify against Garden color tokens
5. Identify all icons → Find Garden icon equivalents
6. Import all needed Garden packages
7. Implement with Garden system (components, typography, colors, icons)

### Rule 6: Custom Code Only for Layout
- ✅ Use styled-components for: grid containers, flexbox wrappers, spacing, positioning
- ❌ NEVER use styled-components for: buttons, inputs, text, form controls, colors, typography

### Quick Check Before Starting
**Ask yourself these questions:**
- [ ] Did I map every Figma element to a Garden component?
- [ ] Am I importing from `@zendeskgarden/react-*` packages?
- [ ] Am I avoiding custom buttons/inputs/selects/checkboxes?
- [ ] Am I using Garden typography (`<XL>`, `<LG>`, `<MD>`, `<SM>`) - NOT `<h1>`, `<p>`?
- [ ] Am I using Garden color tokens - NOT arbitrary hex codes?
- [ ] Am I using Garden icons from `@zendeskgarden/svg-icons` - NOT other icon libraries?
- [ ] Did I avoid custom `font-size`, `font-weight`, `line-height` styles?
- [ ] Did I check the component mapping tables below?

**If you answered NO to any question, STOP and review the Garden system sections below.**

## CRITICAL: Import Rules (MUST FOLLOW)

When implementing Figma designs or building features:

✅ **ALWAYS import from the mainContent bundle:**
```jsx
import { SupportMainContent } from 'zendesk-globalnav-template/mainContent'
import { KnowledgeMainContent } from 'zendesk-globalnav-template/mainContent'
```

❌ **NEVER import chrome components (unless user explicitly confirms chrome updates):**
```jsx
// DON'T DO THIS when building features
import { TopBar, GlobalNavPageTemplate } from 'zendesk-globalnav-template/chrome'
import { MainNav } from 'zendesk-globalnav-template'
```

**Why This Matters:**
- The `/mainContent` export contains ONLY the 11 product MainContent components
- The `/chrome` export contains navigation structure (TopBar, Nav, Subnav)
- When you import from `/mainContent`, chrome components are NOT available
- This prevents accidental modifications to the navigation chrome

**File System Protection:**
- Chrome components: `src/components/chrome/` → Protected
- MainContent components: `src/components/mainContent/` → Safe to modify

**Default Behavior:**
Unless the user explicitly says to update the TopBar or left navigation:
1. Import from `/mainContent` bundle only
2. Modify only the specific `*MainContent.jsx` component
3. Never touch GlobalNavPageTemplate, TopBar, MainNav, or Subnav files

## What This Skill Does

When a user asks to build something in a product's main content area (e.g., "Build this design on Support's main content area"), this skill:

1. **Detects scope**: Asks if chrome (TopBar/MainNav) should be modified (REQUIRED for Figma designs)
2. **Identifies product**: Determines which product/page the user is referring to
3. **Locates component**: Finds the correct MainContent component file
4. **Protects chrome**: Makes changes ONLY to the MainContent component (unless authorized)
5. **Implements design**: Uses Garden components and typography for consistency
6. **Preserves structure**: Keeps the TopBar, left nav (subnav), and GlobalNav intact

## Primary Workflow: Implementing Figma Designs

**This is the most common use case for this skill.** When a user provides a Figma URL or screenshot:

### 🎨 CRITICAL: Garden Design System Priority

**When implementing ANY Figma design, you MUST use the complete Zendesk Garden Design System from https://github.com/zendeskgarden**

✅ **ALWAYS DO:**
- Map every Figma element to its Garden component equivalent FIRST
- Use Garden components from `@zendeskgarden/react-*` packages
- Use Garden typography components (`<XL>`, `<LG>`, `<MD>`, `<SM>`, `<XXS>`) for ALL text
- Use Garden color tokens for ALL colors
- Use Garden icons from `@zendeskgarden/svg-icons` for ALL icons
- Only create custom styled components for layout (grids, containers, spacing)
- Refer to the Garden component mapping tables in this skill (see sections below)
- Check Garden documentation: https://garden.zendesk.com

❌ **NEVER DO:**
- Build custom input fields when `<Input>` exists
- Create custom buttons when `<Button>` exists
- Use plain HTML tags like `<h1>`, `<h2>`, `<p>` for content text
- Apply custom `font-size`, `font-weight`, or `line-height` styles
- Use arbitrary color hex codes without verifying Garden tokens
- Use FontAwesome, Material Icons, or other icon libraries
- Use emoji or Unicode symbols for icons
- Style plain HTML elements when Garden components are available
- Skip the component/typography/color/icon mapping analysis

**Why Garden Design System is Required:**
- Ensures consistency with Zendesk design system
- Provides built-in accessibility (ARIA, keyboard nav, semantic HTML)
- Includes proper validation states and focus management
- Supports dark mode where applicable
- Maintains proper typography hierarchy and readability
- Uses color tokens that are tested for contrast and accessibility
- Provides consistent iconography across products
- Reduces maintenance burden

### Step 1: ALWAYS Ask About Scope First (MANDATORY)

**Before implementing ANYTHING, ask this question:**

> I'll implement this design in the **[Product]** main content area. Should I also update:
> - **The top bar?** (Yes/No)
> - **The left navigation?** (Yes/No)
>
> If not specified, I'll only modify the main content component and preserve all navigation chrome.

**Wait for user response before proceeding.**

### Step 2: Default to Main Content Only

**Unless the user explicitly says "Yes" to updating chrome:**
- ✅ **ONLY modify** the `*MainContent.jsx` component for the specified product
- ❌ **DO NOT touch** `TopBar.jsx`, `MainNav.jsx`, `GlobalNavPageTemplate.jsx`, or any Subnav files
- ✅ **Import from** `zendesk-globalnav-template/mainContent` (not `/chrome`)

### Step 3: Implement Design in MainContent Using Garden Components

**MANDATORY: Map Figma → Garden Components First**

Before writing ANY code, complete this analysis:
1. **Identify every UI element** in the Figma design (buttons, inputs, text, etc.)
2. **Map each to its Garden equivalent** using the tables in this skill
3. **Import all needed Garden packages** at the top of the file
4. **Only then** start implementing with Garden components

**Extract the main content area from the Figma design:**
- Remove any navigation chrome from the design (top bar, side nav) unless authorized
- Fit the content inside the existing `ContentArea` wrapper
- **Use Garden components from `@zendeskgarden/react-*` for ALL UI elements**
- Only use custom styled-components for layout containers (grids, flexbox wrappers)
- Preserve the template's layout structure

**Example Implementation Order:**
```jsx
// 1. Import Garden typography FIRST
import { XL, LG, MD, SM } from '@zendeskgarden/react-typography';

// 2. Import Garden form components
import { Field, Label, Input, Textarea, Select } from '@zendeskgarden/react-forms';

// 3. Import Garden buttons
import { Button } from '@zendeskgarden/react-buttons';

// 4. Import Garden icons
import { ReactComponent as PlusIcon } from '@zendeskgarden/svg-icons/src/16/plus-stroke.svg';

// 5. Then styled-components for layout ONLY (NO typography, colors, or UI controls)
const FormGrid = styled.div`
  display: grid;
  gap: 24px;
  max-width: 800px;
`;

// 6. Implement with Garden system
<FormGrid>
  {/* ✅ Garden typography - NOT <h1> */}
  <XL tag="h1">Page Title</XL>

  {/* ✅ Garden typography - NOT <p> */}
  <MD>Form description text</MD>

  {/* ✅ Garden form components */}
  <Field>
    <Label>Email</Label>
    <Input type="email" placeholder="you@example.com" />
  </Field>

  {/* ✅ Garden button with Garden icon */}
  <Button isPrimary>
    <PlusIcon />
    Submit
  </Button>
</FormGrid>
```

### Step 4: Test and Verify

**Confirm that:**
- The main content area shows the new design
- The TopBar and left navigation are unchanged (unless authorized)
- The design is responsive and scrollable

## Analyzing Figma Designs for Garden Component Mapping

**PRIMARY GOAL: Map every Figma element to a Garden React component from https://github.com/zendeskgarden**

When you receive a Figma URL or token, your analysis process should be:
1. Identify all UI elements in the design
2. Map each element to its Garden component equivalent
3. Import the required Garden packages
4. Implement using Garden components (not custom code)

### Step 1: Fetch and Inspect the Design

**Method A: Figma API (if token provided)**
```bash
# Get the design structure
curl -H "X-Figma-Token: <token>" "https://api.figma.com/v1/files/<file-id>/nodes?ids=<node-id>&depth=5"

# Get rendered image
curl -H "X-Figma-Token: <token>" "https://api.figma.com/v1/images/<file-id>?ids=<node-id>&format=png&scale=2"
```

**Method B: Screenshot**
If user provides a screenshot, read it directly with the Read tool.

### Step 2: Identify Component Types

When analyzing the Figma design (API data or screenshot), look for:

**From API Data (JSON):**
- `"type": "TEXT"` → Check fontSize to determine typography component
  - 24-32px → `<XL>`
  - 20-24px → `<LG>`
  - 16-18px → `<MD>`
  - 14px → `<SM>`
  - 12px → `<XXS>`
- `"type": "INSTANCE"` → Check componentId or name for component type
- Component names containing:
  - `"Input"`, `"Text field"` → `<Input>`
  - `"Textarea"`, `"Text area"` → `<Textarea>`
  - `"Dropdown"`, `"Select"` → `<Select>`
  - `"Checkbox"` → `<Checkbox>`
  - `"Radio"` → `<Radio>`
  - `"Button"` → `<Button>` (check for variant: Primary, Secondary, etc.)
  - `"Toggle"`, `"Switch"` → `<Toggle>`

**From Screenshot:**
Look for these visual patterns:
- **Large bold text at top** → Page title (`<XL>`)
- **Medium headings** → Section headers (`<LG>`)
- **Rectangle with border + cursor** → Text input (`<Input>`)
- **Tall rectangle with border** → Textarea (`<Textarea>`)
- **Rectangle with dropdown arrow (▼)** → Select dropdown (`<Select>`)
- **Small square + label** → Checkbox (`<Checkbox>`)
- **Small circle + label** → Radio button (`<Radio>`)
- **Filled rectangle with text** → Primary button (`<Button isPrimary>`)
- **Outlined rectangle with text** → Secondary button (`<Button>`)
- **Gray descriptive text** → Hint text (`<Hint>` or `<SM>`)

### Step 3: Map Components Systematically

Create a mental inventory as you scan the design:

```
Top to bottom:
1. Breadcrumbs → Custom styled component with <BreadcrumbLink>
2. "Page title" (32px, bold) → <XL tag="h1">
3. "Page description" (14px, gray) → <MD> or <SM>
4. "Section header" (20px, bold) → <LG tag="h2">
5. "{Label}" + helper text + textarea → <Field><Label><Hint><Textarea>
6. "Field label" + dropdown → <Field><Label><Select>
7. Checkbox + label → <Field><Checkbox><Label>
... continue for entire design
```

### Step 4: Prioritize Garden Components (MANDATORY)

**🎯 CRITICAL RULE: ALWAYS use Garden React components from https://github.com/zendeskgarden**

**For EVERY UI element in the Figma design:**
1. First, check if a Garden component exists (see mapping tables below)
2. Use the Garden component from `@zendeskgarden/react-*` package
3. Only create custom styled-components for layout (grid, flexbox containers)
4. NEVER recreate UI controls that Garden already provides

❌ **Don't do this (WRONG):**
```jsx
// Building custom input - NEVER DO THIS
const CustomInput = styled.input`
  border: 1px solid #d8dcde;
  padding: 8px 12px;
  border-radius: 4px;
`;
<CustomInput type="text" placeholder="Enter value" />

// Building custom button - NEVER DO THIS
const CustomButton = styled.button`
  background: #1f73b7;
  color: white;
  padding: 8px 16px;
`;
<CustomButton>Submit</CustomButton>
```

✅ **Do this instead (CORRECT):**
```jsx
// Use Garden components from @zendeskgarden packages
import { Input, Field, Label } from '@zendeskgarden/react-forms';
import { Button } from '@zendeskgarden/react-buttons';

<Field>
  <Label>Field label</Label>
  <Input placeholder="Enter value" />
</Field>

<Button isPrimary>Submit</Button>
```

**Why Garden Design System is REQUIRED:**

**Components:**
- ✅ Accessibility (ARIA labels, keyboard navigation, screen reader support)
- ✅ Consistent styling with Zendesk design system
- ✅ Built-in validation states and error handling
- ✅ Focus management and interaction states
- ✅ Dark mode support (where applicable)
- ✅ Cross-browser compatibility
- ✅ Matches official Figma component library

**Typography:**
- ✅ Maintains consistent visual hierarchy across all Zendesk products
- ✅ Proper line-height and letter-spacing for readability
- ✅ Responsive font sizes that scale appropriately
- ✅ Semantic HTML through `tag` prop for SEO and accessibility

**Colors:**
- ✅ WCAG AA/AAA compliant contrast ratios
- ✅ Consistent color meaning across products (e.g., red = danger)
- ✅ Theme support and potential dark mode compatibility
- ✅ Brand consistency with Zendesk identity

**Icons:**
- ✅ Consistent visual style across all icons
- ✅ Optimized SVG file sizes
- ✅ Proper sizing (16px, 26px) for pixel-perfect rendering
- ✅ Semantic meaning that users recognize across Zendesk products

**Overall:**
- ✅ Maintained and updated by Zendesk Garden team
- ✅ Reduces technical debt and maintenance burden
- ✅ Ensures updates propagate automatically through package updates

**Garden Documentation:**
- 📚 Main site: https://garden.zendesk.com
- 📚 GitHub: https://github.com/zendeskgarden
- 📚 Components: https://garden.zendesk.com/components
- 📚 Typography: https://garden.zendesk.com/components/typography
- 📚 Colors: https://garden.zendesk.com/design/color
- 📚 Icons: https://garden.zendesk.com/design/icons

### Step 5: Extract Design Tokens and Map to Garden

When mapping Figma to Garden, extract these values and verify against Garden's design system:

**Typography (MANDATORY - Use Garden Components):**
- ✅ Map font sizes to Garden typography components (`<XL>`, `<LG>`, `<MD>`, `<SM>`, `<XXS>`)
- ✅ Use `tag` prop for semantic HTML: `<XL tag="h1">`, `<LG tag="h2">`
- ❌ NEVER use plain `<h1>`, `<h2>`, `<p>` tags
- ❌ NEVER apply custom `font-size`, `font-weight`, `line-height`
- 📚 Reference: https://garden.zendesk.com/components/typography

**Colors (MANDATORY - Verify Garden Tokens):**
- ✅ Always verify color values in Garden documentation before using
- ✅ Common Garden colors (verify current values in docs):
  - `#1f73b7` (blue) → Links, primary actions
  - `#2f3941` (dark gray) → Body text
  - `#68737d` (medium gray) → Secondary text
  - `#d8dcde` (light gray) → Borders
  - `#f8f9f9` (very light gray) → Background
- ❌ NEVER use arbitrary hex codes without checking Garden palette
- 📚 Reference: https://garden.zendesk.com/design/color

**Icons (MANDATORY - Use Garden Icons):**
- ✅ Identify all icons in Figma and map to Garden icon equivalents
- ✅ Import from `@zendeskgarden/svg-icons/src/16/` or `/src/26/`
- ❌ NEVER use emoji, custom SVGs, or third-party icon libraries
- 📚 Browse all icons: https://garden.zendesk.com/design/icons

**Spacing (Custom Layout Only):**
- ✅ Note gaps between elements (8px, 16px, 24px, 40px are common)
- ✅ Use these for margin/padding in styled-components for layout containers
- ✅ This is the PRIMARY use case for custom styled-components

### Example: Complete Analysis

Given this Figma design:
```
[Page Layout Frame]
  ├─ [Breadcrumbs] "Parent › Parent › Current"
  ├─ [Text: 32px, bold] "Page title"
  ├─ [Text: 14px, gray] "Page description"
  ├─ [Text: 20px, bold] "Section header"
  ├─ [Text: 16px, bold] "The thing to enter"
  ├─ [Text: 14px, gray] "Helper text here..."
  ├─ [Textarea component]
  ├─ [Label] "Field label"
  ├─ [Dropdown component]
  └─ [Checkbox + Label] "Checkbox label"
```

Maps to:
```jsx
import { XL, LG, MD, SM } from '@zendeskgarden/react-typography';
import { Field, Label, Textarea, Select, Checkbox, Hint } from '@zendeskgarden/react-forms';

<ContentArea>
  <Breadcrumbs>...</Breadcrumbs>
  <XL tag="h1">Page title</XL>
  <MD>Page description</MD>

  <LG tag="h2">Section header</LG>

  <FieldGroup>
    <MD style={{ fontWeight: 600 }}>The thing to enter</MD>
    <SM style={{ color: '#68737d' }}>Helper text here...</SM>
    <Field>
      <Textarea rows={5} />
    </Field>
  </FieldGroup>

  <Field>
    <Label>Field label</Label>
    <Select>
      <option>Select...</option>
    </Select>
  </Field>

  <Field>
    <Checkbox>
      <Label>Checkbox label</Label>
    </Checkbox>
  </Field>
</ContentArea>
```

## Available Products & Their Main Content Components

The GlobalNav template has the following products with dedicated main content components:

| Product | Main Content Component | File Path |
|---------|----------------------|-----------|
| Support | `SupportMainContent` | `src/components/mainContent/SupportMainContent.jsx` |
| Knowledge | `KnowledgeMainContent` | `src/components/mainContent/KnowledgeMainContent.jsx` |
| AI Agents | `AIAgentsMainContent` | `src/components/mainContent/AIAgentsMainContent.jsx` |
| Chat | `ChatMainContent` | `src/components/mainContent/ChatMainContent.jsx` |
| Voice | `VoiceMainContent` | `src/components/mainContent/VoiceMainContent.jsx` |
| Analytics | `AnalyticsMainContent` | `src/components/mainContent/AnalyticsMainContent.jsx` |
| Workforce Management | `WorkforceManagementMainContent` | `src/components/mainContent/WorkforceManagementMainContent.jsx` |
| Quality Assurance | `QualityAssuranceMainContent` | `src/components/mainContent/QualityAssuranceMainContent.jsx` |
| Community | `CommunityMainContent` | `src/components/mainContent/CommunityMainContent.jsx` |
| Sales | `SalesMainContent` | `src/components/mainContent/SalesMainContent.jsx` |
| Admin Center | `AdminCenterMainContent` | `src/components/mainContent/AdminCenterMainContent.jsx` |

## Secondary Workflow: Building Features (No Figma)

For simple feature requests without Figma designs, follow these steps:

### Step 1: Identify the Product

When the user says something like:
- "Build on the Support main content area"
- "Add a dashboard to AI Agents"
- "Create a form in the Admin Center page"

Extract the product name and map it to the correct MainContent component.

### Step 2: Confirm Scope (if ambiguous)

If the request could involve chrome modifications, ask:
> Should I also update the top bar or left navigation, or just the main content area?

**Default**: Only modify the MainContent component unless explicitly told otherwise.

### Step 3: Read the Current MainContent Component

Read the relevant MainContent component file to understand its current structure:

```bash
# Example for Support
Read src/components/mainContent/SupportMainContent.jsx
```

### Step 4: Build ONLY in the MainContent Component

**CRITICAL RULES (MANDATORY):**

✅ **ALWAYS DO:**
- Ask about chrome updates FIRST when implementing Figma designs
- Import from `zendesk-globalnav-template/mainContent` (not `/chrome`)
- Modify only the specific `*MainContent.jsx` component
- Use Garden components (`@zendeskgarden/react-*`)
- Use Garden typography (`XL`, `LG`, `MD`, `SM`)
- Keep the `ContentArea` wrapper with its styling
- Follow the existing styled-components pattern

❌ **NEVER DO (unless user explicitly authorizes):**
- Modify `TopBar.jsx`
- Modify `MainNav.jsx`
- Modify `GlobalNavPageTemplate.jsx`
- Modify any Subnav components (`*Subnav.jsx`)
- Import from `zendesk-globalnav-template/chrome`
- Change the left navigation structure
- Change the top bar or product switcher
- Add your own `ThemeProvider` (one already exists at root)
- Replace the entire template when implementing Figma designs

**⚠️ VIOLATION CONSEQUENCES:**
Breaking these rules will **destroy the navigation chrome** and require reverting all changes.

### Step 5: Map Figma Components to Garden Components

**CRITICAL:** When implementing Figma designs, always map Figma components to their correct Garden equivalents. This ensures consistency with Zendesk's design system.

## Garden Design System: Typography, Colors & Icons

**These are MANDATORY components of the Garden Design System and must be used in ALL Figma implementations.**

### Garden Typography System

**RULE: NEVER use plain HTML tags for text content. ALWAYS use Garden typography components.**

#### Typography Component Mapping

| Font Size in Figma | Garden Component | Usage | Example |
|-------------------|------------------|-------|---------|
| 28-36px | `<XXXL>` | Hero text, main titles | `<XXXL tag="h1">Page Title</XXXL>` |
| 24-32px | `<XL>` | Page headings | `<XL tag="h1">Page Title</XL>` |
| 20-24px | `<LG>` | Section headings | `<LG tag="h2">Section Title</LG>` |
| 16-18px | `<MD>` | Body text, labels | `<MD>Body text here</MD>` |
| 14px | `<SM>` | Secondary text | `<SM>Secondary info</SM>` |
| 12px | `<XXS>` | Captions, hints | `<XXS>Caption text</XXS>` |

#### Import Statement
```jsx
import { XXXL, XL, LG, MD, SM, XXS } from '@zendeskgarden/react-typography';
```

#### Common Mistakes - Typography

❌ **WRONG:**
```jsx
<h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Title</h1>
<p style={{ fontSize: '16px' }}>Body text</p>
<span style={{ fontSize: '14px', color: '#68737d' }}>Helper text</span>
```

✅ **CORRECT:**
```jsx
<XL tag="h1">Title</XL>
<MD>Body text</MD>
<SM>Helper text</SM>
```

### Garden Color System

**RULE: NEVER use arbitrary hex codes. ALWAYS verify colors against Garden's color palette.**

#### Garden Color Tokens

Garden uses semantic color tokens. Reference these instead of hardcoding hex values:

| Color Purpose | Garden Token Reference | Common Hex (verify in docs) |
|--------------|------------------------|------------------------------|
| Primary blue (links, actions) | Primary color | `#1f73b7` |
| Text - primary | Foreground default | `#2f3941` |
| Text - secondary | Foreground subtle | `#68737d` |
| Border - default | Border default | `#d8dcde` |
| Background - subtle | Background subtle | `#f8f9f9` |
| Danger/Error | Danger color | `#cc3340` |
| Success | Success color | `#038153` |
| Warning | Warning color | `#ad5e18` |

#### Color Documentation
- 📚 Official color docs: https://garden.zendesk.com/design/color
- 📚 Color palette reference: Check Garden documentation for current tokens

#### Common Mistakes - Colors

❌ **WRONG:**
```jsx
const CustomText = styled.div`
  color: #FF5733;  // Random hex code
  background: #123456;  // Not a Garden color
`;
```

✅ **CORRECT:**
```jsx
// Use Garden components with built-in colors
import { MD } from '@zendeskgarden/react-typography';

// Or reference Garden colors in styled-components
const CustomContainer = styled.div`
  color: #2f3941;  // Garden foreground color (verify in docs)
  background: #f8f9f9;  // Garden subtle background (verify in docs)
`;
```

**IMPORTANT:** Always verify color values in Garden documentation before using them.

### Garden Icon System

**RULE: NEVER use custom SVGs or third-party icon libraries. ALWAYS use Garden SVG icons.**

#### Garden Icon Packages

Garden provides SVG icons in multiple sizes:
- **16px icons**: `@zendeskgarden/svg-icons/src/16/`
- **26px icons**: `@zendeskgarden/svg-icons/src/26/`

#### Import Format
```jsx
// Import as React component
import { ReactComponent as IconName } from '@zendeskgarden/svg-icons/src/16/icon-name.svg';
```

#### Common Garden Icons

| Icon Purpose | Icon Name | Import Example |
|-------------|-----------|----------------|
| Add/Create | `plus-stroke` | `import { ReactComponent as PlusIcon } from '@zendeskgarden/svg-icons/src/16/plus-stroke.svg'` |
| Search | `search-stroke` | `import { ReactComponent as SearchIcon } from '@zendeskgarden/svg-icons/src/16/search-stroke.svg'` |
| Settings | `settings-stroke` | `import { ReactComponent as SettingsIcon } from '@zendeskgarden/svg-icons/src/16/settings-stroke.svg'` |
| Delete | `trash-stroke` | `import { ReactComponent as TrashIcon } from '@zendeskgarden/svg-icons/src/16/trash-stroke.svg'` |
| Edit | `edit-stroke` | `import { ReactComponent as EditIcon } from '@zendeskgarden/svg-icons/src/16/edit-stroke.svg'` |
| Close/X | `x-stroke` | `import { ReactComponent as XIcon } from '@zendeskgarden/svg-icons/src/16/x-stroke.svg'` |
| Check | `check-lg-stroke` | `import { ReactComponent as CheckIcon } from '@zendeskgarden/svg-icons/src/16/check-lg-stroke.svg'` |
| Arrow right | `arrow-right-stroke` | `import { ReactComponent as ArrowIcon } from '@zendeskgarden/svg-icons/src/16/arrow-right-stroke.svg'` |
| Info | `info-stroke` | `import { ReactComponent as InfoIcon } from '@zendeskgarden/svg-icons/src/16/info-stroke.svg'` |

#### Using Icons with Buttons
```jsx
import { Button, IconButton } from '@zendeskgarden/react-buttons';
import { ReactComponent as PlusIcon } from '@zendeskgarden/svg-icons/src/16/plus-stroke.svg';

// Icon button (icon only)
<IconButton aria-label="Add item">
  <PlusIcon />
</IconButton>

// Button with icon and text
<Button isPrimary>
  <PlusIcon />
  Add Item
</Button>
```

#### Icon Documentation
- 📚 Browse all icons: https://garden.zendesk.com/design/icons
- 📚 Icon usage guidelines: https://garden.zendesk.com/components/icon-button

#### Common Mistakes - Icons

❌ **WRONG:**
```jsx
// Using emoji
<Button>➕ Add</Button>

// Using FontAwesome
import { FaPlus } from 'react-icons/fa';
<Button><FaPlus /> Add</Button>

// Custom SVG
const CustomIcon = () => <svg>...</svg>;
<Button><CustomIcon /> Add</Button>
```

✅ **CORRECT:**
```jsx
import { Button } from '@zendeskgarden/react-buttons';
import { ReactComponent as PlusIcon } from '@zendeskgarden/svg-icons/src/16/plus-stroke.svg';

<Button isPrimary>
  <PlusIcon />
  Add Item
</Button>
```

### Complete Example: Garden Design System

Here's a complete example using components, typography, colors, and icons:

```jsx
import React from 'react';
import styled from 'styled-components';
import { XL, LG, MD, SM } from '@zendeskgarden/react-typography';
import { Field, Label, Input, Textarea } from '@zendeskgarden/react-forms';
import { Button } from '@zendeskgarden/react-buttons';
import { ReactComponent as PlusIcon } from '@zendeskgarden/svg-icons/src/16/plus-stroke.svg';

// Custom styling ONLY for layout
const FormContainer = styled.div`
  max-width: 600px;
  padding: 24px;
  background: #f8f9f9;  // Garden subtle background (verify in docs)
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const ExampleForm = () => {
  return (
    <FormContainer>
      {/* ✅ Garden typography - NOT <h1> */}
      <XL tag="h1">Create New Item</XL>

      {/* ✅ Garden typography - NOT <p> */}
      <MD>Fill out the form below to create a new item.</MD>

      {/* ✅ Garden form components */}
      <Field>
        <Label>Item Name</Label>
        <Input placeholder="Enter name" />
      </Field>

      <Field>
        <Label>Description</Label>
        <SM>Provide a detailed description</SM>
        <Textarea rows={5} placeholder="Enter description" />
      </Field>

      {/* ✅ Garden button with Garden icon */}
      <Button isPrimary>
        <PlusIcon />
        Create Item
      </Button>
    </FormContainer>
  );
};
```

---

#### Available Garden Packages

The template has these Garden packages as peer dependencies:
- `@zendeskgarden/react-buttons` - Buttons, IconButtons
- `@zendeskgarden/react-forms` - Inputs, Selects, Checkboxes, TextFields
- `@zendeskgarden/react-typography` - XL, LG, MD, SM text components
- `@zendeskgarden/react-tabs` - Tabs, TabPanel
- `@zendeskgarden/react-tooltips` - Tooltips
- `@zendeskgarden/react-avatars` - Avatar components
- `@zendeskgarden/svg-icons` - Garden icon library

#### Figma-to-Garden Component Mapping Guide

When you see these in Figma designs, map them to Garden components:

##### Typography (from `@zendeskgarden/react-typography`)

| Figma Element | Garden Component | Usage |
|---------------|------------------|-------|
| Page title / H1 (24-32px) | `<XL tag="h1">` | Main page heading |
| Section heading / H2 (20-24px) | `<LG tag="h2">` | Section titles |
| Body text / H3 (16-18px) | `<MD tag="h3">` or `<MD>` | Subheadings, body text, labels |
| Small text / Caption (14px) | `<SM>` | Secondary text, captions |
| Tiny text (12px) | `<XXS>` | Hints, metadata |

**Example:**
```jsx
import { XL, LG, MD, SM } from '@zendeskgarden/react-typography';

<XL tag="h1">Page title</XL>
<MD>Page description</MD>
<LG tag="h2">Section header</LG>
```

##### Form Components (from `@zendeskgarden/react-forms`)

| Figma Element | Garden Component | Import & Usage |
|---------------|------------------|----------------|
| Text input / Text field | `<Input>` | `import { Input, Field, Label } from '@zendeskgarden/react-forms'`<br/>`<Field><Label>Label</Label><Input /></Field>` |
| Textarea / Multiline input | `<Textarea>` | `<Field><Label>Label</Label><Textarea rows={5} /></Field>` |
| Dropdown / Select | `<Select>` | `<Field><Label>Label</Label><Select><option>...</option></Select></Field>` |
| Checkbox | `<Checkbox>` | `<Field><Checkbox><Label>Label</Label></Checkbox></Field>` |
| Radio button | `<Radio>` | `<Field><Radio><Label>Label</Label></Radio></Field>` |
| Toggle / Switch | `<Toggle>` | `<Field><Toggle><Label>Label</Label></Toggle></Field>` |
| Field label | `<Label>` | Wraps form field labels |
| Field hint / Helper text | `<Hint>` | `<Hint>Helper text</Hint>` |
| Field message / Error | `<Message>` | `<Message validation="error">Error message</Message>` |

**Example:**
```jsx
import { Field, Label, Input, Textarea, Checkbox, Select, Hint } from '@zendeskgarden/react-forms';

<Field>
  <Label>Email address</Label>
  <Hint>We'll never share your email</Hint>
  <Input type="email" placeholder="you@example.com" />
</Field>

<Field>
  <Label>Comments</Label>
  <Textarea rows={5} placeholder="Enter your comments" />
</Field>

<Field>
  <Label>Country</Label>
  <Select>
    <option value="">Select a country</option>
    <option value="us">United States</option>
    <option value="uk">United Kingdom</option>
  </Select>
</Field>

<Field>
  <Checkbox>
    <Label>I agree to the terms</Label>
  </Checkbox>
</Field>
```

##### Buttons (from `@zendeskgarden/react-buttons`)

| Figma Element | Garden Component | Usage |
|---------------|------------------|-------|
| Primary button (filled) | `<Button isPrimary>` | Main call-to-action |
| Secondary button (outlined) | `<Button>` | Secondary actions |
| Basic button (text only) | `<Button isBasic>` | Tertiary actions |
| Danger button (red) | `<Button isDanger>` | Delete, destructive actions |
| Icon button | `<IconButton>` | Button with only an icon |
| Button with icon | `<Button><Icon /> Text</Button>` | Button with icon + text |

**Example:**
```jsx
import { Button, IconButton } from '@zendeskgarden/react-buttons';
import { ReactComponent as PlusIcon } from '@zendeskgarden/svg-icons/src/16/plus-stroke.svg';

<Button isPrimary>Save changes</Button>
<Button>Cancel</Button>
<Button isBasic>Learn more</Button>
<Button isDanger>Delete account</Button>
<IconButton><PlusIcon /></IconButton>
```

##### Tabs (from `@zendeskgarden/react-tabs`)

| Figma Element | Garden Component | Usage |
|---------------|------------------|-------|
| Tab navigation | `<Tabs><TabList><Tab>` | Tabbed interface |
| Tab content area | `<TabPanel>` | Content for each tab |

**Example:**
```jsx
import { Tabs, TabList, Tab, TabPanel } from '@zendeskgarden/react-tabs';

<Tabs>
  <TabList>
    <Tab>Overview</Tab>
    <Tab>Settings</Tab>
  </TabList>
  <TabPanel>Overview content</TabPanel>
  <TabPanel>Settings content</TabPanel>
</Tabs>
```

##### Other Components

| Figma Element | Garden Component | Package & Usage |
|---------------|------------------|-----------------|
| Avatar / Profile pic | `<Avatar>` | `@zendeskgarden/react-avatars`<br/>`<Avatar><img src="..." alt="..." /></Avatar>` |
| Tooltip | `<Tooltip>` | `@zendeskgarden/react-tooltips`<br/>`<Tooltip content="Help text"><Button>Hover</Button></Tooltip>` |
| Tag / Badge | `<Tag>` | `@zendeskgarden/react-tags`<br/>`<Tag>Label</Tag>` |
| Alert / Notification | `<Alert>` | `@zendeskgarden/react-notifications`<br/>`<Alert type="success">Success!</Alert>` |

#### Figma Component Recognition Patterns

When analyzing a Figma design, look for these patterns:

**Forms:**
- Look for `Field label`, `Input`, `Textarea`, `Dropdown`, `Checkbox`, `Radio` in component names
- Check for hint text or helper text below fields
- Form sections usually have labels followed by input elements

**Typography Hierarchy:**
- Largest text at top = Page title → `<XL>`
- Second level headings = Section headers → `<LG>`
- Body text, labels = Content text → `<MD>`
- Small descriptive text = Helper text → `<SM>` or `<Hint>`

**Buttons:**
- Filled/solid background = Primary → `isPrimary`
- Outlined/border only = Default/Secondary → `<Button>`
- Text only/minimal = Basic → `isBasic`
- Red/destructive = Danger → `isDanger`

**Interactive Elements:**
- Square checkboxes = `<Checkbox>`
- Round radio buttons = `<Radio>`
- Toggle switches = `<Toggle>`
- Dropdown arrows = `<Select>`

#### Component Detection Priority

When implementing Figma designs, follow this priority order:

1. **Typography first:** Map all text elements to `XL`, `LG`, `MD`, `SM` components
2. **Forms second:** Identify form fields and use Garden form components
3. **Buttons third:** Replace button designs with Garden button variants
4. **Layout last:** Use styled-components for custom spacing/layout

**Example workflow:**
```jsx
// 1. Typography
import { XL, LG, MD, SM } from '@zendeskgarden/react-typography';

// 2. Forms
import { Field, Label, Input, Select, Checkbox } from '@zendeskgarden/react-forms';

// 3. Buttons
import { Button } from '@zendeskgarden/react-buttons';

// 4. Layout (styled-components for custom containers)
const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;
```

### Step 6: Follow the Pattern

Each MainContent component should follow this pattern:

```jsx
import React from 'react';
import styled from 'styled-components';
import { XL, MD } from '@zendeskgarden/react-typography';
// Import other Garden components as needed

const ContentArea = styled.div`
  flex: 1;
  width: 100%;
  padding: 24px;
  overflow: auto;
`;

// Add your custom styled components here
const CustomSection = styled.div`
  /* your styles */
`;

export const YourMainContent = () => {
  return (
    <ContentArea>
      {/* Your content here */}
      <XL tag="h1" style={{ marginBottom: '16px' }}>Your Title</XL>
      <MD>Your content</MD>

      {/* Build your UI here */}
    </ContentArea>
  );
};

export default YourMainContent;
```

### Step 7: Test the Changes

After making changes:
1. Verify the dev server is running (`npm run dev`)
2. Navigate to the correct product in the UI
3. Confirm the main content area shows your changes
4. Confirm the TopBar and left nav are unchanged

## Advanced: Figma Design Adaptation Tips

When adapting Figma designs to MainContent components, follow these guidelines:

### Extracting Content from Figma

**Remove from Figma code:**
- Any `<ThemeProvider>` wrappers (already exists at root)
- Full-page layout containers (e.g., PageContainer)
- Navigation elements (top bar, side nav) unless user approved chrome updates
- Absolute positioning that conflicts with ContentArea flex layout

**Keep from Figma code:**
- The actual content layout (grids, cards, forms, tables)
- Color values and spacing
- Component hierarchy and nesting
- Interactive elements (buttons, inputs, dropdowns)

**Adapt for MainContent with Garden Design System:**
- Wrap everything in the existing `ContentArea` component
- **Typography**: Replace ALL text with Garden typography components (`<XL>`, `<LG>`, `<MD>`, `<SM>`)
- **Components**: Use Garden form components instead of custom inputs/buttons
- **Colors**: Convert Figma colors to Garden tokens (verify in documentation)
- **Icons**: Replace all icons with Garden SVG icons from `@zendeskgarden/svg-icons`
- **Layout**: Use styled-components ONLY for spacing, grids, and containers
- Ensure responsive behavior (grid auto-fit, flex wraps)

### Example: Figma Design → MainContent

❌ **WRONG** - Don't do this:
```jsx
// Replacing the entire GlobalNavPageTemplate with Figma output
export const GlobalNavPageTemplate = () => {
  return (
    <ThemeProvider>
      <FullPageLayout>
        {/* Figma-generated nav + content */}
      </FullPageLayout>
    </ThemeProvider>
  );
};
```

✅ **CORRECT** - Do this:
```jsx
// Only updating the MainContent component
import React from 'react';
import styled from 'styled-components';
import { XL, MD } from '@zendeskgarden/react-typography';

const ContentArea = styled.div`
  flex: 1;
  width: 100%;
  padding: 24px;
  overflow: auto;
`;

// Your Figma-adapted styled components
const FigmaContent = styled.div`
  /* Figma design styles */
`;

export const SupportMainContent = () => {
  return (
    <ContentArea>
      {/* Figma content adapted here */}
      <FigmaContent>
        <XL tag="h1">Figma Design Title</XL>
        {/* Rest of Figma content */}
      </FigmaContent>
    </ContentArea>
  );
};

export default SupportMainContent;
```

### Common Mistakes to Avoid

| Mistake | Impact | Solution |
|---------|--------|----------|
| Replacing GlobalNavPageTemplate.jsx | Left nav disappears | Only edit MainContent component |
| Adding nested ThemeProvider | Styling conflicts | Remove it, use root provider |
| Hard-coding full page dimensions | Breaks layout | Use ContentArea wrapper |
| Ignoring existing structure | Navigation broken | Preserve template chrome |
| Not asking about scope | Wrong files modified | Always ask check-in question |

## Examples

### Example 1: User asks to build a dashboard in Support

```
User: "Build a dashboard in the Support main content area with cards showing ticket stats"
```

**Your response:**
1. Identify: Support → `SupportMainContent.jsx`
2. Read: `src/components/mainContent/SupportMainContent.jsx`
3. Modify ONLY that file
4. Add dashboard UI using Garden components
5. Keep TopBar and navigation unchanged

### Example 2: User asks to add a form to Admin Center

```
User: "Add a settings form to the Admin Center page"
```

**Your response:**
1. Identify: Admin Center → `AdminCenterMainContent.jsx`
2. Read: `src/components/mainContent/AdminCenterMainContent.jsx`
3. Modify ONLY that file
4. Add form UI using Garden form components
5. Keep TopBar and navigation unchanged

### Example 3: User asks to build analytics charts

```
User: "Build charts in the Analytics main content area"
```

**Your response:**
1. Identify: Analytics → `AnalyticsMainContent.jsx`
2. Read: `src/components/mainContent/AnalyticsMainContent.jsx`
3. Modify ONLY that file
4. Add chart UI (may need to install a chart library)
5. Keep TopBar and navigation unchanged

## Garden Component Quick Reference

### Typography
```jsx
import { XL, LG, MD, SM, XXS } from '@zendeskgarden/react-typography';

<XL tag="h1">Extra Large (page title)</XL>
<LG tag="h2">Large (section heading)</LG>
<MD>Medium (body text)</MD>
<SM>Small (secondary text)</SM>
<XXS>Extra Extra Small (captions)</XXS>
```

### Buttons
```jsx
import { Button } from '@zendeskgarden/react-buttons';

<Button isPrimary>Primary Action</Button>
<Button>Secondary Action</Button>
<Button isBasic>Basic Button</Button>
<Button isDanger>Delete</Button>
```

### Forms
```jsx
import { Field, Label, Input, Textarea, Checkbox, Select } from '@zendeskgarden/react-forms';

<Field>
  <Label>Label Text</Label>
  <Input placeholder="Enter text" />
</Field>
```

### Tabs
```jsx
import { Tabs, TabList, Tab, TabPanel } from '@zendeskgarden/react-tabs';

<Tabs>
  <TabList>
    <Tab>Tab 1</Tab>
    <Tab>Tab 2</Tab>
  </TabList>
  <TabPanel>Content 1</TabPanel>
  <TabPanel>Content 2</TabPanel>
</Tabs>
```

## Common Patterns

### Dashboard Card Layout
```jsx
const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 24px;
`;

const Card = styled.div`
  background: white;
  border: 1px solid #d8dcde;
  border-radius: 8px;
  padding: 24px;
`;
```

### Data Table Layout
```jsx
const TableContainer = styled.div`
  background: white;
  border: 1px solid #d8dcde;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 24px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;
```

### Form Layout
```jsx
const FormContainer = styled.div`
  max-width: 600px;
  background: white;
  border: 1px solid #d8dcde;
  border-radius: 8px;
  padding: 24px;
  margin-top: 24px;
`;

const FormSection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;
```

## Pre-Implementation Checklist

Before making ANY changes:

- [ ] ✅ Confirmed this is a GlobalNav project (`zendesk-globalnav-template` in package.json)
- [ ] ✅ Asked user about chrome update scope (for Figma designs)
- [ ] ✅ Identified which product MainContent component to modify
- [ ] ✅ Read the current MainContent component file

## Post-Implementation Checklist

After making changes:

### ✅ Garden Design System (MANDATORY for Figma designs)

#### Components
- [ ] ✅ Used `@zendeskgarden/react-*` components for ALL UI elements
- [ ] ✅ Mapped every Figma element to its Garden equivalent
- [ ] ✅ NO custom buttons - used `<Button>` from Garden
- [ ] ✅ NO custom inputs - used `<Input>`, `<Textarea>`, `<Select>` from Garden
- [ ] ✅ NO custom checkboxes/radios - used Garden form components
- [ ] ✅ Verified imports from `@zendeskgarden/` packages

#### Typography
- [ ] ✅ Used Garden typography (`<XL>`, `<LG>`, `<MD>`, `<SM>`, `<XXS>`) for ALL text
- [ ] ✅ NO plain HTML tags - avoided `<h1>`, `<h2>`, `<p>`, `<span>` for content
- [ ] ✅ Used `tag` prop for semantic HTML: `<XL tag="h1">`, `<LG tag="h2">`
- [ ] ✅ NO custom font styles - avoided `font-size`, `font-weight`, `line-height`
- [ ] ✅ Imported from `@zendeskgarden/react-typography`

#### Colors
- [ ] ✅ Used Garden color tokens for ALL colors
- [ ] ✅ Verified color values against Garden documentation
- [ ] ✅ NO arbitrary hex codes without Garden token verification
- [ ] ✅ NO inline color styles without checking Garden palette

#### Icons
- [ ] ✅ Used Garden icons from `@zendeskgarden/svg-icons` for ALL icons
- [ ] ✅ Imported as `ReactComponent`: `import { ReactComponent as Icon } from '@zendeskgarden/svg-icons/src/16/...svg'`
- [ ] ✅ NO emoji or Unicode symbols for icons
- [ ] ✅ NO FontAwesome, Material Icons, or other icon libraries
- [ ] ✅ NO custom SVG icons when Garden icons exist

### ✅ MainContent Modifications
- [ ] ✅ Modified ONLY the specific `*MainContent.jsx` component
- [ ] ✅ Kept the ContentArea wrapper intact
- [ ] ✅ Imported from `/mainContent` bundle (not `/chrome`)

### ❌ Chrome Protection
- [ ] ❌ Did NOT modify TopBar.jsx (unless authorized)
- [ ] ❌ Did NOT modify MainNav.jsx (unless authorized)
- [ ] ❌ Did NOT modify GlobalNavPageTemplate.jsx (unless authorized)
- [ ] ❌ Did NOT modify any Subnav components (unless authorized)

### ✅ Testing
- [ ] ✅ Tested in the dev server
- [ ] ✅ Verified TopBar and left nav are unchanged
- [ ] ✅ Confirmed Garden components render correctly
- [ ] ✅ Tested keyboard navigation and accessibility

## Troubleshooting

### Issue: "I can't see my changes"
- Make sure you're viewing the correct product in the UI
- Check if the dev server reloaded
- Verify you modified the correct MainContent component

### Issue: "Garden component not working"
- Verify the Garden package is installed (check package.json)
- Import from the correct Garden package
- Check Garden documentation: https://garden.zendesk.com

### Issue: "Layout is broken"
- Make sure you kept the ContentArea wrapper
- Check for CSS conflicts with styled-components
- Verify flex: 1 and padding: 24px are preserved on ContentArea

## Quick Reference: Figma → Garden Component Mapping

Use this table for instant component lookup when implementing designs:

| Visual Pattern in Figma | Garden Component | Import Statement | Basic Usage |
|-------------------------|------------------|------------------|-------------|
| **Large heading (24-32px)** | `<XL>` | `import { XL } from '@zendeskgarden/react-typography'` | `<XL tag="h1">Title</XL>` |
| **Section heading (20-24px)** | `<LG>` | `import { LG } from '@zendeskgarden/react-typography'` | `<LG tag="h2">Section</LG>` |
| **Body text (16-18px)** | `<MD>` | `import { MD } from '@zendeskgarden/react-typography'` | `<MD>Body text</MD>` |
| **Small text (14px)** | `<SM>` | `import { SM } from '@zendeskgarden/react-typography'` | `<SM>Small text</SM>` |
| **Text input field** | `<Input>` | `import { Input, Field, Label } from '@zendeskgarden/react-forms'` | `<Field><Label>Label</Label><Input /></Field>` |
| **Large text box** | `<Textarea>` | `import { Textarea, Field, Label } from '@zendeskgarden/react-forms'` | `<Field><Label>Label</Label><Textarea rows={5} /></Field>` |
| **Dropdown with arrow** | `<Select>` | `import { Select, Field, Label } from '@zendeskgarden/react-forms'` | `<Field><Label>Label</Label><Select><option>...</option></Select></Field>` |
| **Square checkbox + label** | `<Checkbox>` | `import { Checkbox, Field, Label } from '@zendeskgarden/react-forms'` | `<Field><Checkbox><Label>Label</Label></Checkbox></Field>` |
| **Round radio + label** | `<Radio>` | `import { Radio, Field, Label } from '@zendeskgarden/react-forms'` | `<Field><Radio><Label>Label</Label></Radio></Field>` |
| **Toggle switch** | `<Toggle>` | `import { Toggle, Field, Label } from '@zendeskgarden/react-forms'` | `<Field><Toggle><Label>Label</Label></Toggle></Field>` |
| **Helper text below field** | `<Hint>` | `import { Hint } from '@zendeskgarden/react-forms'` | `<Hint>Helper text</Hint>` |
| **Error message** | `<Message>` | `import { Message } from '@zendeskgarden/react-forms'` | `<Message validation="error">Error</Message>` |
| **Filled button (solid)** | `<Button isPrimary>` | `import { Button } from '@zendeskgarden/react-buttons'` | `<Button isPrimary>Save</Button>` |
| **Outlined button** | `<Button>` | `import { Button } from '@zendeskgarden/react-buttons'` | `<Button>Cancel</Button>` |
| **Text-only button** | `<Button isBasic>` | `import { Button } from '@zendeskgarden/react-buttons'` | `<Button isBasic>Learn more</Button>` |
| **Red/danger button** | `<Button isDanger>` | `import { Button } from '@zendeskgarden/react-buttons'` | `<Button isDanger>Delete</Button>` |
| **Tab navigation** | `<Tabs>` | `import { Tabs, TabList, Tab, TabPanel } from '@zendeskgarden/react-tabs'` | `<Tabs><TabList><Tab>Tab</Tab></TabList><TabPanel>Content</TabPanel></Tabs>` |

### Component Import Bundles

Commonly used together - import in groups:

```jsx
// Typography
import { XL, LG, MD, SM, XXS } from '@zendeskgarden/react-typography';

// Forms (most common)
import { Field, Label, Input, Textarea, Checkbox, Select, Hint, Message } from '@zendeskgarden/react-forms';

// Buttons
import { Button, IconButton } from '@zendeskgarden/react-buttons';

// Tabs
import { Tabs, TabList, Tab, TabPanel } from '@zendeskgarden/react-tabs';
```

### Color Reference

Common Figma colors and their usage:

| Hex Color | Usage | Where to Use |
|-----------|-------|--------------|
| `#1f73b7` | Primary blue | Links, primary actions |
| `#2f3941` | Dark gray | Main text, headings |
| `#68737d` | Medium gray | Secondary text, hints |
| `#d8dcde` | Light gray | Borders, dividers |
| `#f8f9f9` | Very light gray | Backgrounds |
| `#cc3340` | Danger red | Error states, delete buttons |
| `#038153` | Success green | Success messages |

## Notes

- Each MainContent component is independent
- Users switch between products using the TopBar product switcher
- The left nav (subnav) is only visible for certain products (Knowledge, AI Agents)
- Main content area has `overflow: auto` for scrolling
- Use the 56px left nav + 240px subnav (if visible) widths in your calculations
- TopBar height is approximately 60px

## 🎯 Final Reminder: Complete Garden Design System Required

**For ALL Figma design implementations, you MUST use:**

1. ✅ **Garden Components** from `@zendeskgarden/react-*` packages
   - Buttons, inputs, forms, tabs, tooltips, etc.

2. ✅ **Garden Typography** from `@zendeskgarden/react-typography`
   - `<XL>`, `<LG>`, `<MD>`, `<SM>`, `<XXS>` - NEVER plain HTML tags

3. ✅ **Garden Colors** - verify all colors against Garden palette
   - Check documentation: https://garden.zendesk.com/design/color

4. ✅ **Garden Icons** from `@zendeskgarden/svg-icons`
   - NEVER use emoji, FontAwesome, or custom SVGs

**Custom styled-components should ONLY be used for:**
- Layout containers (grids, flexbox)
- Spacing (margins, padding)
- Positioning

**NEVER use custom styled-components for:**
- Buttons, inputs, form controls
- Typography (headings, body text)
- Colors (without verifying Garden tokens)
- Icons

**Always check:**
- 📚 https://garden.zendesk.com - Main documentation
- 📚 https://github.com/zendeskgarden - Source code
- 📚 Component mapping tables in this skill
