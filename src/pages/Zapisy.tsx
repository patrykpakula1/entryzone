import { Navbar } from '../components/nav/Navbar'
import { Registration } from '../components/registration/Registration'
import { Footer } from '../components/layout/Footer'

export function Zapisy() {
  return (
    <>
      <Navbar mode="page" />
      <Registration />
      <Footer />
    </>
  )
}
