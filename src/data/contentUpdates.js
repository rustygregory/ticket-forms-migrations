/**
 * Content design copy changes for V4.
 * Menu label is Duplicate (not Clone) — not listed here.
 */
export const CONTENT_DESIGN_UPDATES = [
  {
    id: 'create-ticket-form',
    from: 'Add ticket form',
    to: 'Create ticket form',
  },
  {
    id: 'blocked-done',
    from: 'Close',
    to: 'Done',
  },
  {
    id: 'end-user-editing',
    from: 'Editable for end users',
    to: 'Turn on end-user editing',
  },
  {
    id: 'all-brands',
    from: 'Apply to all brands',
    to: 'Apply this form to all brands',
  },
  {
    id: 'form-saved',
    from: 'Your changes have been saved.',
    to: 'The ticket form has been saved.',
  },
  {
    id: 'default-form-toast',
    from: 'Default form updated',
    to: 'Default ticket form updated',
  },
  {
    id: 'filter-empty',
    from: 'No forms match your search or filters.',
    to: 'No forms match the search or filters. Clear filters to see all forms.',
  },
  {
    id: 'blocked-deactivate-body',
    from: 'You cannot deactivate a default form.',
    to: 'A default form cannot be deactivated. Make another form the default first.',
  },
  {
    id: 'blocked-delete-body',
    from: 'You cannot delete a default form.',
    to: 'A default form cannot be deleted. Make another form the default first.',
  },
]

export const CONTENT_DESIGN_UPDATE_COUNT = CONTENT_DESIGN_UPDATES.length

/** Hover copy for the V4 count badge — unique string changes (not every UI surface). */
export function contentDesignBadgeTooltip() {
  const lines = CONTENT_DESIGN_UPDATES.map(
    (entry, index) => `${index + 1}. “${entry.from}” → “${entry.to}”`,
  )
  return [
    `${CONTENT_DESIGN_UPDATE_COUNT} unique copy updates:`,
    ...lines,
    '',
    'Same change reused in multiple places still counts once.',
  ].join('\n')
}

export function contentUpdate(id) {
  return CONTENT_DESIGN_UPDATES.find(entry => entry.id === id)
}
