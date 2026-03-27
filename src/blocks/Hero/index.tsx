import { HeroBlock, Media } from "@/payload-types"

export const Hero = ({ title, description, image }: HeroBlock) => {

  return <div className="ThemeHero">
    <img src={(image as Media).url!} alt={(image as Media).alt} />
    <h1>{title}</h1>
    <p>{description}</p>
  </div>
}