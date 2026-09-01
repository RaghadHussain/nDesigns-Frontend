import useDocumentTitle from '../../hooks/useDocumentTitle'
import logoFull from '../../assets/logo-full.png'

function About() {
  useDocumentTitle('About')

  return (
    <main className='about'>
      <section className='about-identity'>
        <div className='about-identity__quote'>
          <p>
            "The visual identity for ndesign is built on a singular, powerful
            monogram. I utilized the letter 'n' as the foundational icon,
            seamlessly integrating the silhouette of a sewing needle into its
            form. This fusion communicates that fashion is not just about
            aesthetics, but about construction, detail, and the physical act
            of creation. The negative space and sharp angles of the 'n' echo
            the sharpness of a needle and the clean lines of high-end garment
            design."
          </p>
        </div>
      </section>
      <section className='about-image'>
        <img src={logoFull} alt='ndesign logo' />
      </section>
    </main>
  )
}

export default About
