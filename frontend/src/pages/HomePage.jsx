import { motion } from 'framer-motion'
import HeroSection from '../components/home/HeroSection'
import LatestNews from '../components/home/LatestNews'
import TalkingMascot from '../components/home/TalkingMascot'
import IlkomGallery from '../components/home/IlkomGallery'
import AnimatedSeparator from '../components/common/AnimatedSeparator'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { 
      duration: 0.3,
      staggerChildren: 0.1 
    }
  }
}

const sectionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: [0.25, 0.46, 0.45, 0.94] 
    }
  }
}

const HomePage = () => {
  return (
    <motion.div 
      className="relative"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <HeroSection />
      <AnimatedSeparator variant="purple" />
      <motion.section variants={sectionVariants}>
        <TalkingMascot />
      </motion.section>
      <AnimatedSeparator variant="line" />
      <motion.section variants={sectionVariants}>
        <LatestNews />
      </motion.section>
      <AnimatedSeparator variant="line" />
      <motion.section variants={sectionVariants}>
        <IlkomGallery />
      </motion.section>
    </motion.div>
  )
}

export default HomePage
