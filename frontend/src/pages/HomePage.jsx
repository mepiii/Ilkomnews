import HeroSection from '../components/home/HeroSection'
import LatestNews from '../components/home/LatestNews'
import TalkingMascot from '../components/home/TalkingMascot'
import IlkomGallery from '../components/home/IlkomGallery'
import AnimatedSeparator from '../components/common/AnimatedSeparator'
import { Tiles } from '../components/ui/Tiles'

const HomePage = () => {
  return (
    <div>
      <HeroSection />

      <AnimatedSeparator variant="purple" />

      <div className="relative">
        <div className="absolute inset-0 pointer-events-none">
          <Tiles rows={40} cols={8} tileSize="sm" className="opacity-40" />
        </div>
        <LatestNews />
      </div>

      <div className="relative">
        <div className="absolute inset-0 pointer-events-none">
          <Tiles rows={30} cols={6} tileSize="sm" className="opacity-40" />
        </div>
        <TalkingMascot />
      </div>

      <div className="relative">
        <div className="absolute inset-0 pointer-events-none">
          <Tiles rows={40} cols={8} tileSize="sm" className="opacity-40" />
        </div>
        <IlkomGallery />
      </div>
    </div>
  )
}

export default HomePage
