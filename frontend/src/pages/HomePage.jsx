import HeroSection from '../components/home/HeroSection'
import LatestNews from '../components/home/LatestNews'
import TalkingMascot from '../components/home/TalkingMascot'
import IlkomGallery from '../components/home/IlkomGallery'
import AnimatedSeparator from '../components/common/AnimatedSeparator'

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <AnimatedSeparator variant="purple" />
      <LatestNews />
      <TalkingMascot />
      <IlkomGallery />
    </div>
  )
}

export default HomePage
