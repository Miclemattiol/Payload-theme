import { ImageWithTextBlock, Media } from "@/payload-types"

export const ImageWithText = ({ title, description, image }: ImageWithTextBlock) => {

  const media = image as Media | undefined
  return <div className="ThemeImageWithText">
    {media?.url && <img src={media.url} alt={media.alt ?? ''} />}
    <h1>{title}</h1>
    <p>{description}</p>
  </div>
}