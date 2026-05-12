import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ScrapRepository } from '../../domain/repositories/post.repository';

@Injectable()
export class PrismaScrapRepository implements ScrapRepository {
  constructor(private readonly prisma: PrismaService) {}

  async exists(userId: number, postId: number): Promise<boolean> {
    const found = await this.prisma.scrap.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    return !!found;
  }
}
