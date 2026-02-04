import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
      <!DOCTYPE html>
      <html lang="ko">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
          <title>Linkareer Onboarding Community - Refactored</title>
      </head>
      <body class="bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center min-h-screen">
          <div class="max-w-2xl w-full bg-white shadow-2xl rounded-3xl p-8 text-center border border-slate-200">
              <div class="mb-6 inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                  <span class="text-4xl text-white">🚀</span>
              </div>

              <h1 class="text-3xl font-bold text-slate-800 mb-2">Welcome to Linkareer Community!</h1>
              <p class="text-slate-600 mb-8">GraphQL + NestJS + Prisma 기반 커뮤니티 API 서버</p>

              <div class="space-y-3 mb-8">
                  <div class="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <div class="flex items-center gap-3">
                          <span class="text-2xl">📊</span>
                          <span class="text-sm font-medium text-slate-700">GraphQL Playground</span>
                      </div>
                      <a href="/graphql" class="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition">
                          이동하기 →
                      </a>
                  </div>

                  <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div class="flex items-center gap-3">
                          <span class="text-2xl">⚡</span>
                          <span class="text-sm font-medium text-slate-700">Server Status</span>
                      </div>
                      <div class="flex items-center gap-2">
                          <span class="flex h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>
                          <span class="text-sm font-semibold text-green-600">Active</span>
                      </div>
                  </div>

                  <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div class="flex items-center gap-3">
                          <span class="text-2xl">🏗️</span>
                          <span class="text-sm font-medium text-slate-700">Architecture</span>
                      </div>
                      <span class="text-sm text-slate-600">NestJS + GraphQL</span>
                  </div>
              </div>

              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
                  <h2 class="text-lg font-bold text-slate-800 mb-3">✨ 주요 리팩토링 사항</h2>
                  <ul class="text-left text-sm text-slate-700 space-y-2">
                      <li>✅ Prisma 직접 사용 (Repository 패턴 제거)</li>
                      <li>✅ GraphQL 표준 네이밍 (Input/ObjectType)</li>
                      <li>✅ Filter + FieldResolver 패턴</li>
                      <li>✅ Soft Delete + Partial Index</li>
                      <li>✅ 환경별 보안 설정 (Playground/Introspection)</li>
                  </ul>
              </div>

              <footer class="text-xs text-slate-400 border-t border-slate-200 pt-4">
                  <p>© 2026 Linkareer Onboarding Project</p>
                  <p class="mt-1">Refactored for GraphQL Best Practices 🎯</p>
              </footer>
          </div>
      </body>
      </html>
    `;
  }
}
