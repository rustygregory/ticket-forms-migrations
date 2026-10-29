import { CONTENT_DESIGN_UPDATE_COUNT, contentDesignBadgeTooltip } from './contentUpdates'

export const VERSIONS = [
  {
    id: 'v4',
    label: 'V4',
    description: 'Content design updates',
    badge: CONTENT_DESIGN_UPDATE_COUNT,
    badgeTooltip: contentDesignBadgeTooltip(),
  },
  {
    id: 'v3',
    label: 'V3',
    description: 'Flora audit applied',
  },
  {
    id: 'v2',
    label: 'V2',
    description: 'Filter drawer',
    archived: true,
  },
  {
    id: 'v1',
    label: 'V1',
    description: 'Legacy filter',
    archived: true,
  },
]
