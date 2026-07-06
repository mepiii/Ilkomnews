import HeroSection from '../components/home/HeroSection'
import LatestNews from '../components/home/LatestNews'
import TalkingMascot from '../components/home/TalkingMascot'
import IlkomGallery from '../components/home/IlkomGallery'
import AnimatedSeparator from '../components/common/AnimatedSeparator'

const HomePage = () => {
  return (
    <div className="relative">
      <HeroSection />
      <AnimatedSeparator variant="purple" />
      <TalkingMascot />
      <AnimatedSeparator variant="line" />
      <LatestNews />
      <AnimatedSeparator variant="line" />
      <IlkomGallery />
    </div>
  )
}

export default HomePage
