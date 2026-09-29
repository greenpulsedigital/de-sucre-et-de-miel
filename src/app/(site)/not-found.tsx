import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="section">
      <div className="container-x text-center">
        <svg viewBox="0 0 120 90" width="120" height="90" aria-hidden="true" className="mx-auto text-honey-deep" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 60c0-22 22-40 50-40s50 18 50 40z" />
          <path d="M22 60l6 18h64l6-18" />
          <path d="M60 20V8" />
          <circle cx="60" cy="6" r="3" />
        </svg>
        <p className="eyebrow mt-6">Erreur 404</p>
        <h1 className="mt-2">Cette tartelette a filé.</h1>
        <p className="mx-auto mt-4 max-w-md text-lg">La page que vous cherchez n’est pas là où elle devrait être. Les créations, elles, vous attendent.</p>
        <p className="mt-8"><Link href="/creations" className="btn btn-primary">Retourner aux créations</Link></p>
      </div>
    </section>
  )
}
