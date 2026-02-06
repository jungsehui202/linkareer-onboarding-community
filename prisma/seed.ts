import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log('🌱 Seeding database...');

  // 1. 사용자 생성
  console.log('\n📝 Creating users...');

  // ✅ upsert 대신 findFirst + create 패턴 사용
  const existingUser1 = await prisma.user.findFirst({
    where: { email: 'user@example.com', isDeleted: false },
  });

  const user1 =
    existingUser1 ||
    (await prisma.user.create({
      data: {
        email: 'user@example.com',
        password: await hashPassword('password123'),
        name: '일반 유저',
        userRole: UserRole.USER,
      },
    }));

  const existingAdmin = await prisma.user.findFirst({
    where: { email: 'admin@example.com', isDeleted: false },
  });

  const admin =
    existingAdmin ||
    (await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: await hashPassword('admin123'),
        name: '관리자',
        userRole: UserRole.ADMIN,
        subscribeEmail: true,
        subscribeSMS: true,
      },
    }));

  const existingUser2 = await prisma.user.findFirst({
    where: { email: 'user2@example.com', isDeleted: false },
  });

  const user2 =
    existingUser2 ||
    (await prisma.user.create({
      data: {
        email: 'user2@example.com',
        password: await hashPassword('password456'),
        name: '김링커',
        userRole: UserRole.USER,
        subscribeEmail: false,
        subscribeSMS: false,
      },
    }));

  console.log('✅ Users created');

  // 2. 게시판 생성
  console.log('\n📝 Creating boards...');

  const mentorBoard = await prisma.board.upsert({
    where: { slug: 'mentor' },
    update: {},
    create: {
      name: '멘토 게시판',
      slug: 'mentor',
      description: '멘토 관련 모든 게시글을 확인할 수 있는 게시판',
      requiredRole: UserRole.USER,
    },
  });

  const communityBoard = await prisma.board.upsert({
    where: { slug: 'community' },
    update: {},
    create: {
      name: '커뮤니티',
      slug: 'community',
      description: '자유로운 소통 공간',
      requiredRole: UserRole.USER,
    },
  });

  const careerBoard = await prisma.board.upsert({
    where: { slug: 'mentor-career' },
    update: {},
    create: {
      name: '커리어 고민',
      slug: 'mentor-career',
      description: '커리어 관련 고민을 나누는 공간',
      parentId: mentorBoard.id,
      requiredRole: UserRole.USER,
    },
  });

  const jobBoard = await prisma.board.upsert({
    where: { slug: 'mentor-job' },
    update: {},
    create: {
      name: '취업 준비',
      slug: 'mentor-job',
      description: '취업 준비 관련 정보 공유',
      parentId: mentorBoard.id,
      requiredRole: UserRole.USER,
    },
  });

  const adminBoard = await prisma.board.upsert({
    where: { slug: 'linkareer-member' },
    update: {},
    create: {
      name: '링커리어 회원 게시판',
      slug: 'linkareer-member',
      description: '관리자 전용 게시판',
      requiredRole: UserRole.ADMIN,
    },
  });

  console.log('✅ Boards created');

  // 3. 게시글 생성
  console.log('\n📝 Creating posts...');

  await prisma.post.createMany({
    data: [
      {
        title: '첫 번째 게시글입니다',
        content: '안녕하세요! 링커리어 커뮤니티에 오신 것을 환영합니다.',
        authorId: user1.id,
        boardId: careerBoard.id,
        viewCount: 5,
      },
      {
        title: '취업 준비 어떻게 하시나요?',
        content:
          '취업 준비 중인데 이력서 작성이 막막합니다. 조언 부탁드립니다!',
        authorId: user2.id,
        boardId: jobBoard.id,
        viewCount: 3,
      },
      {
        title: '신입 개발자 면접 후기',
        content:
          '오늘 대기업 신입 개발자 면접을 봤습니다. 기술 면접 질문 공유합니다!',
        authorId: user1.id,
        boardId: careerBoard.id,
        viewCount: 15,
        scrapCount: 3,
      },
      {
        title: '포트폴리오 작성 가이드',
        content: '신입 개발자를 위한 포트폴리오 작성 팁을 정리했습니다.',
        authorId: user2.id,
        boardId: jobBoard.id,
        viewCount: 25,
        scrapCount: 8,
      },
      {
        title: '대기업 합격 후기 총정리',
        content: '삼성, 네이버, 카카오 최종 합격한 과정을 상세히 공유합니다.',
        authorId: user1.id,
        boardId: careerBoard.id,
        viewCount: 150,
        scrapCount: 12,
      },
      {
        title: '링커리어 신규 기능 안내',
        content: '링커리어에 새로운 기능이 추가되었습니다.',
        authorId: admin.id,
        boardId: adminBoard.id,
        viewCount: 50,
      },
      {
        title: '오늘 점심 뭐 먹을까요?',
        content: '점심 메뉴 추천 부탁드립니다!',
        authorId: user2.id,
        boardId: communityBoard.id,
        viewCount: 8,
      },
      {
        title: '주말에 뭐하세요?',
        content: '주말 계획 공유해요~',
        authorId: user1.id,
        boardId: communityBoard.id,
        viewCount: 12,
        scrapCount: 2,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Posts created');

  // 4. 스크랩 생성
  console.log('\n📝 Creating scraps...');

  await prisma.scrap.createMany({
    data: [
      { userId: user1.id, postId: 4 },
      { userId: user1.id, postId: 5 },
      { userId: user2.id, postId: 3 },
      { userId: user2.id, postId: 5 },
      { userId: admin.id, postId: 5 },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Scraps created');

  // 요약
  const userCount = await prisma.user.count();
  const boardCount = await prisma.board.count();
  const postCount = await prisma.post.count();
  const scrapCount = await prisma.scrap.count();

  console.log('\n📊 Summary:');
  console.log(`  - Users: ${userCount}`);
  console.log(`  - Boards: ${boardCount}`);
  console.log(`  - Posts: ${postCount}`);
  console.log(`  - Scraps: ${scrapCount}`);

  console.log('\n🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
