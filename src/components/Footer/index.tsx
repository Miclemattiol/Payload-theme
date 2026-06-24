import type { Footer as FooterType } from '@/payload-types'
import { resolveHref } from '@/utils/resolveHref'

type NavLink = {
  id?: string | null
  label?: string | null
  linkType?: 'internal' | 'external' | null
  page?: { slug?: string | null } | string | null
  url?: string | null
  newTab?: boolean | null
}

type Column = {
  id?: string | null
  title?: string | null
  links?: NavLink[] | null
}

type SocialLink = {
  id?: string | null
  platform?: string | null
  url?: string | null
}

const Footer = ({ footer, locale }: { footer: FooterType; locale: string }) => {
  const columns = (footer as any).columns as Column[] | undefined
  const socialLinks = (footer as any).socialLinks as SocialLink[] | undefined
  const copyright = (footer as any).copyright as string | undefined

  return (
    <footer>
      {columns?.map((col) => (
        <div key={col.id}>
          {col.title && <p><strong>{col.title}</strong></p>}
          <ul>
            {col.links?.map((link) => (
              <li key={link.id}>
                <a
                  href={resolveHref(link, locale)}
                  target={link.newTab ? '_blank' : undefined}
                  rel={link.newTab ? 'noopener noreferrer' : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {socialLinks && socialLinks.length > 0 && (
        <div>
          {socialLinks.map((social) => (
            <a key={social.id} href={social.url ?? '#'} target="_blank" rel="noopener noreferrer">
              {social.platform}
            </a>
          ))}
        </div>
      )}
      {copyright && <p>{copyright}</p>}
    </footer>
  )
}

export default Footer
