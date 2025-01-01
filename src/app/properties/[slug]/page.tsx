
interface Props {
   params: {
      slug: string
   }
}

const Page = ({ params }: Props) => {
   return (
      <p>{params.slug}</p>
   )
}

export default Page