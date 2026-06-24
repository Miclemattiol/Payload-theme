import type { Header as HeaderType, Media } from '@/payload-types'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { resolveHref } from '@/utils/resolveHref'

type NavItem = NonNullable<HeaderType['nav']>[number]

const Header = ({ header, locale }: { header: HeaderType; locale: string }) => {
  const logo = header.logo as Media | null | undefined

  return (
    <header>
      {logo && typeof logo === 'object' && logo.url && (
        <a href={`/${locale}`}>
          <img src={logo.url} alt={logo.alt ?? ''} />
        </a>
      )}
      <nav>
        {header.nav?.map((item: NavItem) => (
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
