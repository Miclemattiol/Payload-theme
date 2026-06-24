import { HeroBlock, Media } from "@/payload-types"

export const Hero = ({ title, description, image }: HeroBlock) => {

  const media = image as Media | undefined
  return <div className="ThemeHero">
    {media?.url && <img src={media.url} alt={media.alt ?? ''} />}
    <h1>{title}</h1>
    <p>{description}</p>
  </div>
}