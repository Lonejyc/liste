// pages/_app.js
import '../styles/globals.css'
import { SessionProvider as Provider } from 'next-auth/react'

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
