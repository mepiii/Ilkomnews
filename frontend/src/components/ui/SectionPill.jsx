/**
 * SectionPill — pill badge used above every section title (home + page headers).
 * Single source of truth so all section pills share identical sizing/alignment.
 */
const SectionPill = ({ label, caption }) => (
  <div className="inline-flex items-center gap-2.5 border border-theme rounded-full bg-theme-secondary p-1.5 text-sm text-theme-primary">
    <div className="inline-flex items-center bg-theme-card border border-theme rounded-2xl px-4 py-1.5">
      <span className="text-sm font-semibold uppercase tracking-wider leading-none">{label}</span>
    </div>
    <p className="pr-3 text-sm text-theme-muted leading-none">{caption}</p>
  </div>
)

export { SectionPill }
