import { type Sponsor } from '@/features/shared/types/media.types'

import { createAdminCrudService } from './crud.factory'

export const SponsorsAdminService = createAdminCrudService<Sponsor>('/admin/sponsors')
