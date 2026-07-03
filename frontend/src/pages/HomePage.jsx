import HeroSection from '../components/home/HeroSection'
import LatestNews from '../components/home/LatestNews'
import TalkingMascot from '../components/home/TalkingMascot'
import IlkomGallery from '../components/home/IlkomGallery'
import AnimatedSeparator from '../components/common/AnimatedSeparator'
import { Tiles } from '../components/ui/Tiles'

const HomePage = () => {
  return (
    <div className="relative">
      <Tiles fixed rows={100} cols={16} />
      <HeroSection />
      <AnimatedSeparator variant="purple" />
      <LatestNews />
      <AnimatedSeparator variant="line" />
      <IlkomGallery />
      <AnimatedSeparator variant="line" />
      <TalkingMascot />
    </div>
  )
}

export default HomePage
