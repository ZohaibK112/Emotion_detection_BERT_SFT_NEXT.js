// pages/_app.tsx
import type { AppProps } from 'next/app'
// Adjust the path if your globals.css lives elsewhere
import '../src/app/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
