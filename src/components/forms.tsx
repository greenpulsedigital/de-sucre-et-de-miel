'use client'

import { useActionState, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import type { FormState } from '@/lib/forms'
import { PRO_TYPES } from '@/lib/forms'
import { submitContact, submitPro } from '@/app/(site)/actions'

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

/** Coquille commune : récapitulatif d'erreurs accessible, confirmation annoncée, champ piège anti-spam. */
function FormShell({ action, children, submitLabel, success }: { action: (s: FormState, fd: FormData) => Promise<FormState>; children: (state: FormState) => ReactNode; submitLabel: string; success: { title: string; text: string } }) {
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
    <form action={formAction} noValidate={false} className="space-y-6">
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

export function ProForm({ interest }: { interest?: string }) {
  return (
    <FormShell action={submitPro} submitLabel="Envoyer ma demande" success={{ title: 'Demande envoyée', text: 'Merci ! Nous revenons vers vous rapidement avec nos conditions professionnelles.' }}>
      {(state) => (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Text name="company" label="Établissement" state={state} required autoComplete="organization" />
            <Select name="proType" label="Type de structure" options={PRO_TYPES} state={state} required />
          </div>
          <Text name="siret" label="Numéro de SIRET" state={state} required inputMode="numeric" autoComplete="off" hint="14 chiffres. Nos produits sont réservés aux professionnels." />
          <Identity state={state} />
          <Field name="interest" label="Tartes qui vous intéressent" state={state} hint="Ex. myrtille, noix, citron ; tailles 28, 24 ou 14 cm">
            {({ id, describedBy, invalid, defaultValue }) => (
              <input id={id} name="interest" type="text" className="input" defaultValue={defaultValue ?? interest} aria-invalid={invalid || undefined} aria-describedby={describedBy} />
            )}
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Text name="volume" label="Volumes envisagés" state={state} hint="Ex. 20 tartes par semaine" />
            <Text name="frequency" label="Fréquence" state={state} hint="Ponctuel, hebdomadaire, saisonnier…" />
          </div>
          <Area name="message" label="Votre projet" state={state} required hint="Lieu, livraison ou retrait, questions…" />
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
          <Text name="siret" label="Numéro de SIRET" state={state} required inputMode="numeric" autoComplete="off" hint="14 chiffres. Nos produits sont réservés aux professionnels." />
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
