import { Navbar } from '../components/nav/Navbar'
import { About } from '../components/about/About'
import { Footer } from '../components/layout/Footer'

export function ONas() {
  return (
    <>
      <Navbar mode="page" />
      <About />
      <Footer />
    </>
  )
}
