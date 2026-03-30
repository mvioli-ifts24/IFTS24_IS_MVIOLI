import { type Banner } from '@/features/shared/types/media.types'

import { createAdminCrudService } from './crud.factory'

export const BannersAdminService = createAdminCrudService<Banner>('/admin/banners')
