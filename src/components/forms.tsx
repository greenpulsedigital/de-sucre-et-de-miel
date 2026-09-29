'use client'

import { useActionState, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import type { FormState } from '@/lib/forms'
import { EVENT_TYPES, PRO_TYPES } from '@/lib/forms'
import { submitContact, submitEvent, submitOrder, submitPro } from '@/app/(site)/actions'

const initial: FormState = { ok: false }

type FieldProps = {
  name: string
  label: string
  state: FormState
  required?: boolean
  hint?: string
  children: (a: { id: string; describedBy?: string; invalid: boolean; defaultValue?: string }) => ReactNode
}

function Field({ name, label, state, required, hint, children }: FieldProps) {
  const id = useId()
  const error = state.errors?.[name]
  const hintId = hint ? `${id}-hint` : undefined
  const errId = error ? `${id}-err` : undefined
  return (
    <div className="field" data-field={name}>
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
        {hint && <span id={hintId} className="hint">{hint}</span>}
      </label>
      {children({ id, describedBy: [hintId, errId].filter(Boolean).join(' ') || undefined, invalid: Boolean(error), defaultValue: state.values?.[name] })}
      {error && <p id={errId} className="field-error">{error}</p>}
    </div>
  )
}

function Text({ name, label, type = 'text', state, required, hint, autoComplete, inputMode, min, max }: { name: string; label: string; type?: string; state: FormState; required?: boolean; hint?: string; autoComplete?: string; inputMode?: 'numeric' | 'tel' | 'email'; min?: string | number; max?: number }) {
  return (
    <Field name={name} label={label} state={state} required={required} hint={hint}>
      {({ id, describedBy, invalid, defaultValue }) => (
        <input id={id} name={name} type={type} className="input" required={required} defaultValue={defaultValue} autoComplete={autoComplete} inputMode={inputMode} min={min} max={max} aria-invalid={invalid || undefined} aria-describedby={describedBy} />
      )}
    </Field>
  )
}

function Area({ name, label, state, required, hint, rows = 4 }: { name: string; label: string; state: FormState; required?: boolean; hint?: string; rows?: number }) {
  return (
    <Field name={name} label={label} state={state} required={required} hint={hint}>
      {({ id, describedBy, invalid, defaultValue }) => (
        <textarea id={id} name={name} rows={rows} className="input" required={required} defaultValue={defaultValue} aria-invalid={invalid || undefined} aria-describedby={describedBy} />
      )}
    </Field>
  )
}

function Select({ name, label, options, state, required, placeholder = 'Choisir…' }: { name: string; label: string; options: { value: string; label: string }[]; state: FormState; required?: boolean; placeholder?: string }) {
  return (
    <Field name={name} label={label} state={state} required={required}>
      {({ id, describedBy, invalid, defaultValue }) => (
        <select id={id} name={name} className="input" required={required} defaultValue={defaultValue ?? ''} aria-invalid={invalid || undefined} aria-describedby={describedBy}>
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )}
    </Field>
  )
}

function Identity({ state }: { state: FormState }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Text name="firstName" label="Prénom" state={state} required autoComplete="given-name" />
      <Text name="lastName" label="Nom" state={state} required autoComplete="family-name" />
      <Text name="email" label="Email" type="email" state={state} required autoComplete="email" />
      <Text name="phone" label="Téléphone" type="tel" state={state} required autoComplete="tel" inputMode="tel" />
    </div>
  )
}

const today = () => new Date().toISOString().slice(0, 10)

/** Coquille commune : récapitulatif d'erreurs accessible, confirmation annoncée, champ piège anti-spam. */
function FormShell({ action, children, submitLabel, success, multipart }: { action: (s: FormState, fd: FormData) => Promise<FormState>; children: (state: FormState) => ReactNode; submitLabel: string; success: { title: string; text: string }; multipart?: boolean }) {
  const [state, formAction, pending] = useActionState(action, initial)
  const summary = useRef<HTMLDivElement>(null)
  const done = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (state.ok) done.current?.focus()
    else if (state.message) summary.current?.focus()
  }, [state])

  if (state.ok) {
    return (
      <div ref={done} tabIndex={-1} role="status" className="rounded-sm border-2 border-honey bg-white p-8 outline-none">
        <h2 className="!text-3xl">{success.title}</h2>
        <p className="mt-3 text-lg">{success.text}</p>
      </div>
    )
  }

  const errorEntries = Object.entries(state.errors ?? {})
  return (
    <form action={formAction} noValidate={false} encType={multipart ? 'multipart/form-data' : undefined} className="space-y-6">
      {state.message && (
        <div ref={summary} tabIndex={-1} role="alert" className="rounded-sm border-2 border-[#a32020] bg-white p-4 outline-none">
          <p className="font-semibold text-[#a32020]">{state.message}</p>
          {errorEntries.length > 0 && (
            <ul className="mt-2 list-disc pl-5">
              {errorEntries.map(([k, v]) => (
                <li key={k}><a href={`#${k}`} onClick={(e) => { e.preventDefault(); (document.querySelector(`[data-field="${k}"] input, [data-field="${k}"] select, [data-field="${k}"] textarea`) as HTMLElement | null)?.focus() }} className="underline">{v}</a></li>
              ))}
            </ul>
          )}
        </div>
      )}
      {/* Champ piège: invisible pour les humains et les lecteurs d'écran */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Ne pas remplir<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      {children(state)}
      <p className="text-sm text-charcoal">Les champs marqués d’un * sont obligatoires. Vos données servent uniquement à traiter votre demande (<a href="/confidentialite" className="underline">confidentialité</a>).</p>
      <button type="submit" className="btn btn-primary" disabled={pending}>{pending ? 'Envoi…' : submitLabel}</button>
    </form>
  )
}

export type OrderProduct = { slug: string; name: string; formats: string[] }

export function OrderForm({ products, preselected }: { products: OrderProduct[]; preselected?: string }) {
  const [slug, setSlug] = useState(products.some((p) => p.slug === preselected) ? preselected! : '')
  const current = products.find((p) => p.slug === slug)
  return (
    <FormShell action={submitOrder} submitLabel="Envoyer ma demande" success={{ title: 'Demande envoyée', text: 'Merci ! Nous vérifions la disponibilité et revenons vers vous rapidement pour confirmer. Rien n’est facturé à ce stade.' }}>
      {(state) => (
        <>
          <fieldset className="space-y-5">
            <legend className="mb-4 font-display text-2xl text-cocoa">1. Choisir une création</legend>
            <Field name="creation" label="Création" state={state} required>
              {({ id, describedBy, invalid }) => (
                <select id={id} name="creation" required className="input" value={slug} onChange={(e) => setSlug(e.target.value)} aria-invalid={invalid || undefined} aria-describedby={describedBy}>
                  <option value="" disabled>Choisir une création…</option>
                  {products.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
                  <option value="sur-mesure">Autre / création sur mesure</option>
                </select>
              )}
            </Field>
          </fieldset>

          <fieldset className="space-y-5">
            <legend className="mb-4 font-display text-2xl text-cocoa">2. Votre demande</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <Text name="quantity" label="Quantité" type="number" state={state} required min={1} max={200} inputMode="numeric" />
              <Text name="date" label="Date souhaitée" type="date" state={state} required min={today()} hint="Retrait ou livraison" />
            </div>
            {current && current.formats.length > 0 ? (
              <Field name="format" label="Format" state={state}>
                {({ id, describedBy }) => (
                  <select id={id} name="format" className="input" defaultValue="" aria-describedby={describedBy}>
                    <option value="">À définir avec vous</option>
                    {current.formats.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                )}
              </Field>
            ) : (
              <Text name="format" label="Format" state={state} hint="Nombre de parts, taille… (facultatif)" />
            )}
            <Area name="personalization" label="Personnalisation" state={state} hint="Message, décor, régime alimentaire, allergies… (facultatif)" />
          </fieldset>

          <fieldset className="space-y-5">
            <legend className="mb-4 font-display text-2xl text-cocoa">3. Vos coordonnées</legend>
            <Identity state={state} />
            <Area name="message" label="Un mot pour l’atelier" state={state} rows={3} />
          </fieldset>
        </>
      )}
    </FormShell>
  )
}

export function EventForm() {
  return (
    <FormShell multipart action={submitEvent} submitLabel="Envoyer ma demande" success={{ title: 'Demande reçue', text: 'Merci ! Nous étudions votre projet et vous répondons rapidement avec une première proposition.' }}>
      {(state) => (
        <>
          <Identity state={state} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Select name="eventType" label="Type d’événement" options={EVENT_TYPES} state={state} required />
            <Text name="date" label="Date de l’événement" type="date" state={state} required min={today()} />
            <Text name="guests" label="Nombre de personnes" type="number" state={state} required min={1} max={1000} inputMode="numeric" />
            <Text name="creationType" label="Type de création" state={state} hint="Gâteau, pièce montée, buffet de desserts…" />
          </div>
          <Text name="budget" label="Budget indicatif" state={state} hint="Facultatif — nous aide à proposer la bonne pièce" />
          <Area name="message" label="Message" state={state} />
          <Field name="inspiration" label="Ajouter une inspiration" state={state} hint="Facultatif — JPEG, PNG ou WebP, 5 Mo maximum">
            {({ id, describedBy, invalid }) => (
              <input id={id} name="inspiration" type="file" accept="image/jpeg,image/png,image/webp" className="input !py-2" aria-invalid={invalid || undefined} aria-describedby={describedBy} />
            )}
          </Field>
        </>
      )}
    </FormShell>
  )
}

export function ProForm() {
  return (
    <FormShell action={submitPro} submitLabel="Parler de mon projet" success={{ title: 'Message envoyé', text: 'Merci ! Nous revenons vers vous rapidement pour échanger sur vos besoins.' }}>
      {(state) => (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Text name="company" label="Établissement" state={state} required autoComplete="organization" />
            <Select name="proType" label="Type de structure" options={PRO_TYPES} state={state} required />
          </div>
          <Identity state={state} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Text name="volume" label="Volumes envisagés" state={state} hint="Ex. 30 desserts par semaine" />
            <Text name="frequency" label="Fréquence" state={state} hint="Ponctuel, hebdomadaire…" />
          </div>
          <Area name="message" label="Votre projet" state={state} required hint="Personnalisation, conditionnement, livraison ou retrait…" />
        </>
      )}
    </FormShell>
  )
}

export function ContactForm() {
  return (
    <FormShell action={submitContact} submitLabel="Envoyer" success={{ title: 'Message envoyé', text: 'Merci, nous vous répondons dès que possible.' }}>
      {(state) => (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Text name="firstName" label="Prénom" state={state} required autoComplete="given-name" />
            <Text name="lastName" label="Nom" state={state} required autoComplete="family-name" />
            <Text name="email" label="Email" type="email" state={state} required autoComplete="email" />
            <Text name="phone" label="Téléphone" type="tel" state={state} autoComplete="tel" inputMode="tel" />
          </div>
          <Area name="message" label="Message" state={state} required />
        </>
      )}
    </FormShell>
  )
}
