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
          <title>Linkareer Onboarding Community</title>
      </head>
      <body class="bg-slate-50 flex items-center justify-center min-h-screen">
          <div class="max-w-md w-full bg-white shadow-2xl rounded-3xl p-8 text-center border border-slate-100">
              <div class="mb-6 inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                  <span class="text-3xl text-white">🚀</span>
              </div>
              <h1 class="text-2xl font-bold text-slate-800 mb-2">Welcome Back!</h1>
              <p class="text-slate-500 mb-8">Linkareer Onboarding Community의<br>API 서버가 정상적으로 작동 중입니다.</p>

              <div class="space-y-3">
                  <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <span class="text-sm font-medium text-slate-600">GraphQL Playground</span>
                      <a href="/graphql" class="text-sm font-bold text-blue-600 hover:underline">이동하기 &rarr;</a>
                  </div>
                  <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <span class="text-sm font-medium text-slate-600">Server Status</span>
                      <span class="flex h-2 w-2 rounded-full bg-green-500"></span>
                  </div>
              </div>

              <footer class="mt-8 text-xs text-slate-400">
                  © 2026 Linkareer 123 | Onboarding Project
              </footer>
          </div>
      </body>
      </html>
    `;
  }
}
