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

export type StyleData = {
  slug?: string
  isDefault?: boolean
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
}

export type LayoutData = {
  layout?: {
    mobile?: LayoutBreakpoint
    tablet?: LayoutBreakpoint
    desktop?: LayoutBreakpoint
  }
}

const colorVars = (colors: ColorGroup | undefined): string => {
  if (!colors) return ''
  return [
    colors.primary        && `  --color-primary: ${colors.primary};`,
    colors.secondary      && `  --color-secondary: ${colors.secondary};`,
    colors.background     && `  --color-background: ${colors.background};`,
    colors.surface        && `  --color-surface: ${colors.surface};`,
    colors.textPrimary    && `  --color-text-primary: ${colors.textPrimary};`,
    colors.textSecondary  && `  --color-text-secondary: ${colors.textSecondary};`,
    colors.border         && `  --color-border: ${colors.border};`,
  ].filter(Boolean).join('\n')
}

const fontFamily = (slot: FontSlot | undefined): string => {
  if (!slot) return ''
  if (slot.source === 'google' && slot.googleFamily) return `'${slot.googleFamily}', sans-serif`
  if (slot.source === 'custom' && slot.customFile?.name) return `'${slot.customFile.name}', sans-serif`
  return ''
}

const fontVars = (style: StyleData): string => {
  return [
    style.heading?.source && `  --font-heading: ${fontFamily(style.heading)};`,
    style.body?.source    && `  --font-body: ${fontFamily(style.body)};`,
    style.display?.source && `  --font-display: ${fontFamily(style.display)};`,
    style.mono?.source    && `  --font-mono: ${fontFamily(style.mono)};`,
    style.accent?.source  && `  --font-accent: ${fontFamily(style.accent)};`,
  ].filter(Boolean).join('\n')
}

const shapeVars = (shape: StyleData['shape']): string => {
  if (!shape) return ''
  return [
    shape.radiusSm !== undefined && `  --radius-sm: ${shape.radiusSm}px;`,
    shape.radiusMd !== undefined && `  --radius-md: ${shape.radiusMd}px;`,
    shape.radiusLg !== undefined && `  --radius-lg: ${shape.radiusLg}px;`,
    shape.radiusXl !== undefined && `  --radius-xl: ${shape.radiusXl}px;`,
    `  --radius-full: 9999px;`,
  ].filter(Boolean).join('\n')
}

const layoutVars = (bp: LayoutBreakpoint | undefined, name: string): string => {
  if (!bp) return ''
  return [
    bp.maxWidth  && `  --max-width-${name}: ${bp.contentWidth === 'centered' ? `${bp.maxWidth}px` : 'none'};`,
    bp.paddingX !== undefined && `  --padding-x-${name}: ${bp.paddingX}px;`,
  ].filter(Boolean).join('\n')
}

export const buildGoogleFontsUrl = (style: StyleData): string | null => {
  const slots = [style.heading, style.body, style.display, style.mono, style.accent]
  const families = slots
    .filter(s => s?.source === 'google' && s?.googleFamily)
    .map(s => {
      const weights = (s!.googleWeights?.length ? s!.googleWeights : ['400']).join(';')
      return `family=${s!.googleFamily!.replace(/ /g, '+')}:wght@${weights}`
    })
  if (!families.length) return null
  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`
}

export const buildAllGoogleFontsUrl = (styles: StyleData[]): string | null => {
  const allFamilies: string[] = []
  for (const style of styles) {
    const slots = [style.heading, style.body, style.display, style.mono, style.accent]
    for (const s of slots) {
      if (s?.source === 'google' && s?.googleFamily) {
        const weights = (s.googleWeights?.length ? s.googleWeights : ['400']).join(';')
        allFamilies.push(`family=${s.googleFamily.replace(/ /g, '+')}:wght@${weights}`)
      }
    }
  }
  if (!allFamilies.length) return null
  return `https://fonts.googleapis.com/css2?${allFamilies.join('&')}&display=swap`
}

const buildFontFaces = (style: StyleData): string => {
  const slots = [
    { slot: style.heading },
    { slot: style.body },
    { slot: style.display },
    { slot: style.mono },
    { slot: style.accent },
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

const buildStyleBlock = (style: StyleData): string => {
  const selector = style.isDefault || !style.slug
    ? ':root'
    : `:root[data-style="${style.slug}"]`

  const darkSelector = style.isDefault || !style.slug
    ? '[data-theme="dark"]'
    : `[data-style="${style.slug}"][data-theme="dark"]`

  const darkMediaSelector = style.isDefault || !style.slug
    ? ':root:not([data-theme="light"])'
    : `:root:not([data-theme="light"])[data-style="${style.slug}"]`

  const lightVars = [colorVars(style.colorsLight), fontVars(style), shapeVars(style.shape)].filter(Boolean).join('\n')
  const darkVars = colorVars(style.colorsDark)

  const parts: string[] = []

  if (lightVars) parts.push(`${selector} {\n${lightVars}\n}`)

  if (darkVars) {
    parts.push(`${darkSelector} {\n${darkVars}\n}`)
    parts.push(`@media (prefers-color-scheme: dark) {\n  ${darkMediaSelector} {\n${darkVars.split('\n').map(l => '  ' + l).join('\n')}\n  }\n}`)
  }

  return parts.join('\n\n')
}

export const buildStylesCSS = (styles: StyleData[]): string => {
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

  const fontFaces = styles.map(buildFontFaces).filter(Boolean).join('\n')
  const styleBlocks = styles.map(buildStyleBlock).join('\n\n')

  return [fontFaces, styleBlocks, baseStyles].filter(Boolean).join('\n\n')
}

export const buildLayoutCSS = (theme: LayoutData): string => {
  const vars = [
    layoutVars(theme.layout?.mobile, 'mobile'),
    layoutVars(theme.layout?.tablet, 'tablet'),
    layoutVars(theme.layout?.desktop, 'desktop'),
  ].filter(Boolean).join('\n')

  if (!vars) return ''
  return `:root {\n${vars}\n}`
}

// Legacy: kept for ThemeLiveSync compatibility (ThemeSettings now only has layout)
export const buildThemeCSS = buildLayoutCSS
