# AllenCare AI Hub — 프로젝트 설정 메모

## 사이트 주소

| 버전 | URL | 설명 |
|------|-----|------|
| 신규 (라이트 테마) | https://allen-ai-hub.vercel.app | 현재 메인 운영 버전 |
| 구버전 (다크 테마) | allencare-ai-hub.vercel.app | v1-dark-blue 브랜치 기반 (별도 Vercel 프로젝트로 분리 필요 — 아래 참고) |

---

## Git 브랜치

- `main` — 현재 라이트 테마 (Apple HIG 기반)
- `v1-dark-blue` — 기존 다크 남색 테마 (초기 버전)

---

## 구버전(v1) Vercel 배포 방법

allencare-ai-hub.vercel.app 에서 구버전이 보이도록 하려면:

1. Vercel 대시보드 → **Add New Project**
2. 같은 GitHub 레포 (`choi-JG/allencare-ai-hub`) 연결
3. **Branch** 설정에서 `v1-dark-blue` 선택
4. 프로젝트 이름 `allencare-ai-hub` 으로 설정
5. Deploy
6. 프로젝트 이름 중복 시 → Settings → Domains → `allencare-ai-hub.vercel.app` 수동 추가

---

## 환경변수 (Vercel에 등록 필요)

| 변수명 | 값 | 설명 |
|--------|-----|------|
| `SUPABASE_URL` | `https://irzqwyofjlftohcwsfho.supabase.co` | Supabase 프로젝트 URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 대시보드 → Settings → API → service_role | 회원 관리용 서비스 키 |
| `ADMIN_PASSWORD` | `aitest!@#$1234` | 관리자 페이지 접근 비밀번호 |
| `RESEND_API_KEY` | Resend 대시보드에서 확인 | 이메일 발송 API 키 |
| `ADMIN_EMAIL` | `jingue90@gmail.com` | 사례 등록 시 알림 받을 이메일 |

> **주의**: SUPABASE_SERVICE_ROLE_KEY 는 오타 없이 정확히 입력 (끝에 Y 포함)

---

## 관리자 페이지

- 파일: `admin-panel.html`
- 접속: `https://allen-ai-hub.vercel.app/admin-panel.html`
- 비밀번호: `aitest!@#$1234`
- 기능:
  - 사례 공유(커뮤니티) 게시글 관리 (삭제)
  - 회원 관리 (활성/비활성, 비밀번호 초기화, 삭제)

---

## API 파일 목록

| 파일 | 설명 |
|------|------|
| `api/admin-users.js` | 전체 회원 목록 조회 |
| `api/admin-user-update.js` | 회원 활성/비활성 (ban) |
| `api/admin-user-delete.js` | 회원 삭제 |
| `api/admin-user-reset-pw.js` | 임시 비밀번호 발급 |
| `api/submit-case.js` | 사례 등록 시 이메일 발송 |

---

## Vercel 재배포 방법

GitHub에 push하면 자동 재배포됨.

```bash
git add index.html
git commit -m "변경 내용"
git push origin main
```

---

## 주요 이슈 해결 이력

### 이메일 미수신 문제
- **원인**: Resend `onboarding@resend.dev` 도메인은 Resend 계정 소유자 이메일로만 발송 가능
- **해결**: `ADMIN_EMAIL` 을 `jingue90@gmail.com` 으로 변경

### 회원 관리 API 오류
- **원인**: Vercel 환경변수 `SUPABASE_SERVICE_ROLE_KE` (Y 누락 오타)
- **해결**: Vercel 대시보드에서 삭제 후 `SUPABASE_SERVICE_ROLE_KEY` 로 재등록

### 디자인 개편 (v1 → v2)
- **v1**: 전체 다크 남색 테마 (가독성 낮음)
- **v2**: Apple HIG 기반 라이트 테마
  - body 17px, letter-spacing -0.374px
  - 히어로만 다크(`#0f172a`), 콘텐츠는 흰색/퍼치먼트(`#f5f7ff`)
  - 카드: 18px 라운드, hairline 보더, 그림자 없음
  - 버튼: pill 형태 (border-radius 9999px)
