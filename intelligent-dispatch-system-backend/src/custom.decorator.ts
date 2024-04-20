import { SetMetadata } from '@nestjs/common';

export const requireLogin = () => SetMetadata('requireLogin', true);
