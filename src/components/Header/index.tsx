import type { Header as HeaderType, Media } from '@/payload-types'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { resolveHref } from '@/utils/resolveHref'

type NavItem = {
  id?: string | null
  label?: string | null
  linkType?: 'internal' | 'external' | null
  page?: { slug?: string | null } | string | null
  url?: string | null
  newTab?: boolean | null
}

const Header = ({ header, locale }: { header: HeaderType; locale: string }) => {
  const logo = (header as any).logo as Media | undefined
  const nav = (header as any).nav as NavItem[] | undefined

  return (
    <header>
      {logo?.url && (
        <a href={`/${locale}`}>
          <img src={logo.url} alt={logo.alt ?? ''} />
        </a>
      )}
      <nav>
        {nav?.map((item) => (
          <a
            key={item.id}
            href={resolveHref(item, locale)}
            target={item.newTab ? '_blank' : undefined}
            rel={item.newTab ? 'noopener noreferrer' : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <ThemeSwitcher />
    </header>
  )
}

export default Header