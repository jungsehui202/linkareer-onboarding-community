// prisma/seed.ts
import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log('🌱 시드 데이터 생성을 시작합니다...\n');

  // 1. 기존 데이터 초기화
  console.log('🗑️  기존 데이터 삭제 중...');
  await prisma.scrap.deleteMany();
  await prisma.post.deleteMany();
  await prisma.board.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ 삭제 완료\n');

  // 2. 사용자 생성
  console.log('👤 사용자 생성 중...');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@linkareer.com',
      password: await hashPassword('admin123'),
      name: '관리자',
      userRole: UserRole.ADMIN,
    },
  });

  const user = await prisma.user.create({
    data: {
      email: 'user@test.com',
      password: await hashPassword('password123'),
      name: '테스터',
      userRole: UserRole.USER,
    },
  });
  console.log('✅ 사용자 생성 완료\n');

  // 3. 게시판 생성
  console.log('📋 게시판 생성 중...');
  const mentorBoard = await prisma.board.create({
    data: {
      name: '멘토 게시판',
      slug: 'mentor',
      description: '커리어 멘토링 질문',
      requiredRole: UserRole.USER,
    },
  });

  const communityBoard = await prisma.board.create({
    data: {
      name: '자유게시판',
      slug: 'community',
      description: '자유로운 소통 공간',
      requiredRole: UserRole.USER,
    },
  });

  const careerBoard = await prisma.board.create({
    data: {
      name: '커리어 고민',
      slug: 'mentor-career',
      description: '커리어 전환 및 고민',
      parentId: mentorBoard.id,
      requiredRole: UserRole.USER,
    },
  });

  const jobBoard = await prisma.board.create({
    data: {
      name: '취업 준비',
      slug: 'mentor-job',
      description: '면접, 이력서, 자소서',
      parentId: mentorBoard.id,
      requiredRole: UserRole.USER,
    },
  });
  console.log('✅ 게시판 생성 완료\n');

  // 4. 소량 테스트 데이터 (100개)
  console.log('📝 테스트 게시글 생성 중...');
  const testPosts = [];
  for (let i = 0; i < 100; i++) {
    const hasKeyword = i % 5 === 0;
    const viewCount = Math.floor(Math.random() * 200);
    const scrapCount = Math.floor(Math.random() * 50);

    testPosts.push({
      title: hasKeyword
        ? `[NestJS] ${i}번째 백엔드 개발 꿀팁`
        : `${i}번째 이야기`,
      content: hasKeyword
        ? `NestJS와 Prisma를 활용한 백엔드 개발 팁입니다.`
        : `일반 게시글 본문 ${i}`,
      viewCount,
      scrapCount,
      popularityScore: viewCount * 5 + scrapCount * 50,
      authorId: i % 2 === 0 ? admin.id : user.id,
      boardId: i % 2 === 0 ? careerBoard.id : jobBoard.id,
      deletedAt: i % 20 === 0 ? new Date() : null, // 5% 삭제
    });
  }
  await prisma.post.createMany({ data: testPosts });
  console.log('✅ 테스트 게시글 100개 생성 완료\n');

  // 5. 대량 데이터 생성 (선택)
  const CREATE_LARGE_DATASET = process.env.LARGE_SEED === 'true';

  if (CREATE_LARGE_DATASET) {
    const TOTAL_POST_COUNT = 30000;
    const CHUNK_SIZE = 5000;

    console.log(`📝 대량 게시글 생성 중 (${TOTAL_POST_COUNT}개)...`);

    for (let i = 0; i < TOTAL_POST_COUNT; i += CHUNK_SIZE) {
      const posts = [];
      for (let j = 0; j < CHUNK_SIZE; j++) {
        const index = i + j + 100; // 테스트 데이터 이후부터
        const hasKeyword = index % 5 === 0;
        const viewCount = Math.floor(Math.random() * 500);
        const scrapCount = Math.floor(Math.random() * 100);

        posts.push({
          title: hasKeyword
            ? `[NestJS] ${index}번째 백엔드 개발 꿀팁`
            : `${index}번째 이야기`,
          content: hasKeyword
            ? `NestJS와 Prisma 전문 검색 테스트 키워드 포함`
            : `평범한 게시글 본문 ${index}`,
          viewCount,
          scrapCount,
          popularityScore: viewCount * 5 + scrapCount * 50,
          authorId: user.id,
          boardId: index % 2 === 0 ? mentorBoard.id : communityBoard.id,
          deletedAt: index % 50 === 0 ? new Date() : null,
          createdAt: new Date(
            Date.now() - Math.floor(Math.random() * 1000000000),
          ),
        });
      }

      await prisma.post.createMany({ data: posts });
      console.log(`  ⏳ [${i + CHUNK_SIZE}/${TOTAL_POST_COUNT}] 진행 중...`);
    }
    console.log('✅ 대량 게시글 생성 완료\n');
  }

  // 6. 스크랩 데이터
  console.log('⭐ 스크랩 데이터 생성 중...');
  const popularPosts = await prisma.post.findMany({
    take: 20,
    orderBy: { viewCount: 'desc' },
    where: { deletedAt: null },
    select: { id: true },
  });

  await prisma.scrap.createMany({
    data: popularPosts.map((p) => ({
      userId: user.id,
      postId: p.id,
    })),
    skipDuplicates: true,
  });
  console.log('✅ 스크랩 생성 완료\n');

  // 7. 요약
  const stats = {
    users: await prisma.user.count(),
    boards: await prisma.board.count(),
    posts: await prisma.post.count(),
    scraps: await prisma.scrap.count(),
  };

  console.log('📊 시딩 결과:');
  console.log(`  - 사용자: ${stats.users}명`);
  console.log(`  - 게시판: ${stats.boards}개`);
  console.log(`  - 게시글: ${stats.posts}개`);
  console.log(`  - 스크랩: ${stats.scraps}개`);

  console.log('\n🔑 로그인 정보:');
  console.log('  - 관리자: admin@linkareer.com / admin123');
  console.log('  - 사용자: user@test.com / password123');

  console.log('\n🎉 시딩 완료!');

  if (!CREATE_LARGE_DATASET) {
    console.log('\n💡 Tip: 대량 데이터 생성 원하면 LARGE_SEED=true 설정');
  }
}

main()
  .catch((e) => {
    console.error('❌ 시딩 실패:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
