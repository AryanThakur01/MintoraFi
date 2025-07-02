import React, { useEffect, useState } from 'react'

type Props = {
  cid: string
  alt: string
}

export const InvoiceCoverImg: React.FC<Props> = ({ cid, alt }) => {
  const [type, setType] = useState<'image' | 'pdf' | 'fallback' | null>(null)

  useEffect(() => {
    const checkFileType = async () => {
      try {
        const res = await fetch(`https://ipfs.io/ipfs/${cid}`, { method: 'HEAD' })
        const contentType = res.headers.get('Content-Type')

        if (contentType?.startsWith('image/')) {
          setType('image')
        } else if (contentType === 'application/pdf') {
          setType('pdf')
        } else {
          setType('fallback')
        }
      } catch (e) {
        setType('fallback')
      }
    }

    checkFileType()
  }, [cid])

  if (type === null) {
    return <div className="w-full h-full bg-muted animate-pulse" /> // loading placeholder
  }

  if (type === 'image') {
    return (
      <img src={`https://ipfs.io/ipfs/${cid}`} alt={alt} className="object-cover w-full h-full" />
    )
  }

  if (type === 'pdf') {
    return (
      <div className="flex items-center justify-center w-full h-full bg-muted rounded-xl">
        <span className="text-sm text-muted-foreground">PDF File</span>
      </div>
    )
  }

  // fallback
  return (
    <div className="flex items-center justify-center w-full h-full bg-muted rounded-xl">
      <span className="text-sm text-muted-foreground">Unknown File</span>
    </div>
  )
}
