import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { Board } from '../../domain/entities/board.entity';
import {
  BoardQuery,
  BoardRepository,
} from '../../domain/repositories/board.repository';
import { BoardMapper } from './board.mapper';

@Injectable()
export class PrismaBoardRepository implements BoardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(query?: BoardQuery): Promise<Board[]> {
    const where: Prisma.BoardWhereInput = {};

    if (query?.requiredRoles && query.requiredRoles.length > 0) {
      where.requiredRole = {
        in: query.requiredRoles.map(BoardMapper.toPersistenceRole),
      };
    }

    if (query?.parentId !== undefined) {
      where.parentId = query.parentId;
    }

    if (query?.slug) {
      where.slug = query.slug;
    }

    if (query?.searchKeyword) {
      where.OR = [
        { name: { contains: query.searchKeyword } },
        { description: { contains: query.searchKeyword } },
      ];
    }

    const records = await this.prisma.board.findMany({
      where,
      orderBy: { id: 'asc' },
    });
    return records.map(BoardMapper.toDomain);
  }

  async findById(id: number): Promise<Board | null> {
    const record = await this.prisma.board.findUnique({ where: { id } });
    return record ? BoardMapper.toDomain(record) : null;
  }

  async findByIds(ids: number[]): Promise<Board[]> {
    if (ids.length === 0) return [];
    const records = await this.prisma.board.findMany({
      where: { id: { in: ids } },
    });
    return records.map(BoardMapper.toDomain);
  }

  async findBySlug(slug: string): Promise<Board | null> {
    const record = await this.prisma.board.findUnique({ where: { slug } });
    return record ? BoardMapper.toDomain(record) : null;
  }

  async findChildrenOf(parentId: number): Promise<Board[]> {
    const records = await this.prisma.board.findMany({
      where: { parentId },
      orderBy: { id: 'asc' },
    });
    return records.map(BoardMapper.toDomain);
  }

  async findChildrenOfMany(parentIds: number[]): Promise<Map<number, Board[]>> {
    if (parentIds.length === 0) return new Map();

    const records = await this.prisma.board.findMany({
      where: { parentId: { in: parentIds } },
      orderBy: { id: 'asc' },
    });

    const grouped = new Map<number, Board[]>();
    parentIds.forEach((id) => grouped.set(id, []));

    records.forEach((record) => {
      if (record.parentId !== null) {
        const list = grouped.get(record.parentId) ?? [];
        list.push(BoardMapper.toDomain(record));
        grouped.set(record.parentId, list);
      }
    });

    return grouped;
  }
}
