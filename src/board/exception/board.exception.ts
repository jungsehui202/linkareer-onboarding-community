import { NotFoundException } from '@nestjs/common';

export class BoardNotFoundException extends NotFoundException {
  constructor(identifier: number | string) {
    if (typeof identifier === 'number') {
      super(`Board ID: ${identifier} Not Found Exception !`);
    } else {
      super(`Board Slug: ${identifier} Not Found Exception !`);
    }
  }
}
