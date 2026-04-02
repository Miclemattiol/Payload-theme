type FontSlot = {
  source?: 'google' | 'custom'
  googleFamily?: string
  googleWeights?: string[]
  customFile?: { url?: string; name?: string }
}

type ColorGroup = {
  primary?: string
  secondary?: string
  background?: string
  surface?: string
  textPrimary?: string
  textSecondary?: string
  border?: string
}

type LayoutBreakpoint = {
  contentWidth?: 'full' | 'centered'
  maxWidth?: number
  paddingX?: number
}

type ThemeData = {
  colorsLight?: ColorGroup
  colorsDark?: ColorGroup
  heading?: FontSlot
  body?: FontSlot
  display?: FontSlot
  mono?: FontSlot
  accent?: FontSlot
  shape?: {
    radiusSm?: number
    radiusMd?: number
    radiusLg?: number
    radiusXl?: number
  }
  layout?: {
    mobile?: LayoutBreakpoint
    tablet?: LayoutBreakpoint
    desktop?: LayoutBreakpoint
  }
}

const colorVars = (colors: ColorGroup | undefined, prefix = ''): string => {
  if (!colors) return ''
  const p = prefix ? `${prefix}-` : ''
  return [
    colors.primary        && `  --color-${p}primary: ${colors.primary};`,
    colors.secondary      && `  --color-${p}secondary: ${colors.secondary};`,
    colors.background     && `  --color-${p}background: ${colors.background};`,
    colors.surface        && `  --color-${p}surface: ${colors.surface};`,
    colors.textPrimary    && `  --color-${p}text-primary: ${colors.textPrimary};`,
    colors.textSecondary  && `  --color-${p}text-secondary: ${colors.textSecondary};`,
    colors.border         && `  --color-${p}border: ${colors.border};`,
  ].filter(Boolean).join('\n')
}

const fontFamily = (slot: FontSlot | undefined): string => {
  if (!slot) return ''
  if (slot.source === 'google' && slot.googleFamily) return `'${slot.googleFamily}', sans-serif`
  if (slot.source === 'custom' && slot.customFile?.name) return `'${slot.customFile.name}', sans-serif`
  return ''
}

export const buildGoogleFontsUrl = (theme: ThemeData): string | null => {
  const slots = [theme.heading, theme.body, theme.display, theme.mono, theme.accent]
  const families = slots
    .filter(s => s?.source === 'google' && s?.googleFamily)
    .map(s => {
      const weights = (s!.googleWeights?.length ? s!.googleWeights : ['400']).join(';')
      return `family=${s!.googleFamily!.replace(/ /g, '+')}:wght@${weights}`
    })

  if (!families.length) return null
  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`
}

export const buildFontFaces = (theme: ThemeData): string => {
  const slots = [
    { slot: theme.heading, name: 'heading' },
    { slot: theme.body, name: 'body' },
    { slot: theme.display, name: 'display' },
    { slot: theme.mono, name: 'mono' },
    { slot: theme.accent, name: 'accent' },
  ]

  return slots
    .filter(({ slot }) => slot?.source === 'custom' && slot?.customFile?.url)
    .map(({ slot }) => `@font-face {
  font-family: '${slot!.customFile!.name}';
  src: url('${slot!.customFile!.url}') format('woff2');
  font-display: swap;
}`)
    .join('\n')
}

const layoutVars = (bp: LayoutBreakpoint | undefined, name: string): string => {
  if (!bp) return ''
  return [
    bp.maxWidth  && `  --max-width-${name}: ${bp.contentWidth === 'centered' ? bp.maxWidth : 'none'}px;`,
    bp.paddingX !== undefined && `  --padding-x-${name}: ${bp.paddingX}px;`,
  ].filter(Boolean).join('\n')
}

export const buildThemeCSS = (theme: ThemeData): string => {
  const rootVars = [
    colorVars(theme.colorsLight),
    theme.heading?.source && `  --font-heading: ${fontFamily(theme.heading)};`,
    theme.body?.source    && `  --font-body: ${fontFamily(theme.body)};`,
    theme.display?.source && `  --font-display: ${fontFamily(theme.display)};`,
    theme.mono?.source    && `  --font-mono: ${fontFamily(theme.mono)};`,
    theme.accent?.source  && `  --font-accent: ${fontFamily(theme.accent)};`,
    theme.shape?.radiusSm !== undefined && `  --radius-sm: ${theme.shape.radiusSm}px;`,
    theme.shape?.radiusMd !== undefined && `  --radius-md: ${theme.shape.radiusMd}px;`,
    theme.shape?.radiusLg !== undefined && `  --radius-lg: ${theme.shape.radiusLg}px;`,
    theme.shape?.radiusXl !== undefined && `  --radius-xl: ${theme.shape.radiusXl}px;`,
    `  --radius-full: 9999px;`,
    layoutVars(theme.layout?.mobile, 'mobile'),
    layoutVars(theme.layout?.tablet, 'tablet'),
    layoutVars(theme.layout?.desktop, 'desktop'),
  ].filter(Boolean).join('\n')

  const darkVars = colorVars(theme.colorsDark)

  const baseStyles = `*, *::before, *::after { box-sizing: border-box; }

body {
  background-color: var(--color-background);
  color: var(--color-text-primary);
  font-family: var(--font-body);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  color: var(--color-text-primary);
}

code, pre, kbd, samp {
  font-family: var(--font-mono);
}`

  return [
    buildFontFaces(theme),
    `:root {\n${rootVars}\n}`,
    darkVars && `[data-theme="dark"] {\n${darkVars}\n}\n\n@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="light"]) {\n${darkVars}\n  }\n}`,
    baseStyles,
  ].filter(Boolean).join('\n\n')
}
