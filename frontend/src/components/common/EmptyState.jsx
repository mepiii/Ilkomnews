import { Inbox } from 'lucide-react'

const EmptyState = ({ title, message }) => (
  <div className="text-center py-12">
    <Inbox size={64} className="mx-auto text-theme-muted mb-4" />
    <h3 className="text-xl font-semibold text-theme-primary mb-2">{title}</h3>
    <p className="text-theme-muted">{message}</p>
  </div>
)

export default EmptyState
