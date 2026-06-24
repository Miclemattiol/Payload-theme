import type { Footer as FooterType, Page } from '@/payload-types'
import { resolveHref } from '@/utils/resolveHref'

type Column = NonNullable<FooterType['columns']>[number]
type NavLink = NonNullable<Column['links']>[number]
type SocialLink = NonNullable<FooterType['socialLinks']>[number]

const Footer = ({ footer, locale }: { footer: FooterType; locale: string }) => {
  return (
    <footer>
      {footer.columns?.map((col: Column) => (
        <div key={col.id}>
          {col.title && <p><strong>{col.title}</strong></p>}
          <ul>
            {col.links?.map((link: NavLink) => (
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
      {footer.socialLinks && footer.socialLinks.length > 0 && (
        <div>
          {footer.socialLinks.map((social: SocialLink) => (
            <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer">
              {social.platform}
            </a>
          ))}
        </div>
      )}
      {footer.copyright && <p>{footer.copyright}</p>}
    </footer>
  )
}

export default Footer
