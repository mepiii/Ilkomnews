import { LazyMotion, domAnimation, m } from 'framer-motion'
import { WordBounce } from '../ui/WordBounce'
import { SectionPill } from '../ui/SectionPill'
import { sectionIntro } from './motionPresets'

const HomeSectionHeading = ({ label, caption, title, description, className = '' }) => (
  <LazyMotion features={domAnimation}>
    <m.div
      className={`text-center mb-16 ${className}`}
      initial={sectionIntro.initial}
      whileInView={sectionIntro.whileInView}
      viewport={sectionIntro.viewport}
      transition={sectionIntro.transition}
      style={{ willChange: 'transform, opacity' }}
    >
      <SectionPill label={label} caption={caption} />
      <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4 font-header">
        <WordBounce text={title} gradient />
      </h2>
      <div className="w-20 h-0.5 mx-auto rounded-full mb-5" style={{ background: 'linear-gradient(to right, rgb(48,11,85), rgb(122,71,166))' }} />
      <p className="text-theme-muted text-base max-w-2xl mx-auto">{description}</p>
    </m.div>
  </LazyMotion>
)

export default HomeSectionHeading
