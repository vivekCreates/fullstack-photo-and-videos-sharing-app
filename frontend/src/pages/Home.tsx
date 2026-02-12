import Navbar from '../components/Navbar'
import PostSection from '../components/PostSection'

function Home() {
  return (
    <div className='w-full flex flex-col gap-20 items-center'>
      <Navbar/>
      <PostSection/>
    </div>
  )
}

export default Home