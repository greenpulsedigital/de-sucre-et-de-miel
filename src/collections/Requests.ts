import type { CollectionConfig } from 'payload'

const staff = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

export const Requests: CollectionConfig = {
  slug: 'requests',
  labels: { singular: 'Demande', plural: 'Demandes' },
  admin: {
    useAsTitle: 'summary',
    defaultColumns: ['summary', 'kind', 'status', 'desiredDate', 'createdAt'],
    group: 'Demandes',
  },
  access: { read: staff, create: staff, update: staff, delete: staff },
  defaultSort: '-createdAt',
  fields: [
    { name: 'summary', type: 'text', label: 'Résumé', admin: { readOnly: true } },
    {
      name: 'kind',
      type: 'select',
      label: 'Type',
      required: true,
      options: [
        { label: 'Commande', value: 'order' },
        { label: 'Événement', value: 'event' },
        { label: 'Professionnel', value: 'pro' },
        { label: 'Contact', value: 'contact' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Statut',
      defaultValue: 'new',
      options: [
        { label: 'Nouvelle', value: 'new' },
        { label: 'En discussion', value: 'discussing' },
        { label: 'Confirmée', value: 'confirmed' },
        { label: 'Refusée / impossible', value: 'declined' },
        { label: 'Terminée', value: 'done' },
      ],
    },
    { name: 'firstName', type: 'text', label: 'Prénom' },
    { name: 'lastName', type: 'text', label: 'Nom' },
    { name: 'email', type: 'email', label: 'Email' },
    { name: 'phone', type: 'text', label: 'Téléphone' },
    { name: 'desiredDate', type: 'date', label: 'Date souhaitée' },
    { name: 'product', type: 'relationship', relationTo: 'products', label: 'Création demandée' },
    { name: 'details', type: 'json', label: 'Détails de la demande' },
    { name: 'message', type: 'textarea', label: 'Message' },
    { name: 'attachment', type: 'upload', relationTo: 'request-files', label: 'Inspiration jointe' },
  ],
}
