
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'HALORA - Sahi Safar',
    short_name: 'HALORA',
    description: 'India’s Premier Heritage Travel Network. Sahi Safar, Sahi Nivesh.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0d1b2a',
    theme_color: '#004488',
    icons: [
      {
        src: 'https://picsum.photos/seed/halora-brand/192/192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'https://picsum.photos/seed/halora-brand/512/512',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
