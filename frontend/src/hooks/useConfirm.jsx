import { useState, useCallback } from 'react'
import SlideConfirm from '../components/ui/SlideConfirm'

// Wraps the animated SlideConfirm modal in a promise so destructive actions
// get a smooth confirm instead of the blocking native window.confirm().
// usage: const { confirm, dialog } = useConfirm()
//        if (await confirm({ title, message, confirmText })) { ... }
//        return <>{dialog}</>
export function useConfirm() {
  const [opts, setOpts] = useState(null)

  const confirm = useCallback(
    (config) => new Promise((resolve) => setOpts({ ...config, resolve })),
    []
  )

  const close = useCallback(() => setOpts((p) => {
    if (!p) return null
    p.resolve(false)
    return null
  }), [])

  const accept = useCallback(() => setOpts((p) => {
    if (!p) return null
    p.resolve(true)
    return null
  }), [])

  const dialog =
    opts &&
    (() => {
      // Resolve is consumed by close/accept; strip it before passing to the modal.
      const { resolve, ...rest } = opts
      void resolve
      return (
        <SlideConfirm
          isOpen
          title={rest.title || 'Konfirmasi'}
          message={rest.message || 'Apakah kamu yakin?'}
          confirmText={rest.confirmText || 'Ya'}
          cancelText={rest.cancelText || 'Batal'}
          onClose={close}
          onConfirm={accept}
        />
      )
    })()

  return { confirm, dialog }
}
