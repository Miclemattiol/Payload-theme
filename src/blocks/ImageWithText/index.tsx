import { ImageWithTextBlock, Media } from "@/payload-types"

export const ImageWithText = ({ title, description, image }: ImageWithTextBlock) => {

  return <div className="ThemeImageWithText">
    <img src={(image as Media).url!} alt={(image as Media).alt} />
    <h1>{title}</h1>
    <p>{description}</p>
  </div>
}