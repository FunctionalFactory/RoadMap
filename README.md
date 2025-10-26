# RouteHair - 영업 동선 최적화 웹앱

서울·경기 지역의 미용실/헤어샵 대상 영업 동선을 최적화하는 웹 애플리케이션입니다.

## 🎯 주요 기능

- **지역 필터링**: 서울/경기 지역의 구/시 단위로 업소 검색
- **카테고리 필터**: 미용실, 헤어샵, 살롱 등 업종별 필터링
- **지도 표시**: 카카오 지도를 통한 업소 위치 시각화 (placeholder)
- **업소 리스트**: 선택 가능한 업소 목록 및 상세 정보
- **동선 최적화**: 5~10개 업소 선택 후 최적 방문 순서 제안 (UI만 구현)
- **방문 체크리스트**: 방문 완료 체크 및 메모 기능
- **방문 기록**: 날짜별 방문 내역 조회

## 🛠️ 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (Radix UI 기반)
- **Icons**: Lucide React

## 📁 프로젝트 구조

```
├── app/
│   ├── layout.tsx          # Root 레이아웃
│   ├── page.tsx            # 메인 대시보드
│   ├── history/
│   │   └── page.tsx        # 방문 기록 페이지
│   └── globals.css         # 글로벌 스타일
├── components/
│   ├── layout/             # 레이아웃 컴포넌트
│   │   └── header.tsx      # 헤더
│   ├── filters/            # 필터 컴포넌트
│   │   └── region-filter.tsx
│   ├── map/                # 지도 컴포넌트
│   │   └── kakao-map.tsx   # 카카오 맵 placeholder
│   ├── salon/              # 업소 관련 컴포넌트
│   │   └── salon-list.tsx
│   ├── route/              # 동선 최적화 컴포넌트
│   │   └── route-optimizer.tsx
│   ├── visit/              # 방문 관리 컴포넌트
│   │   └── visit-checklist.tsx
│   └── ui/                 # Shadcn UI 컴포넌트
├── lib/
│   ├── types.ts            # TypeScript 타입 정의
│   ├── utils.ts            # 유틸리티 함수
│   └── mock-data/          # Mock 데이터
│       ├── salons.ts       # 업소 샘플 데이터
│       ├── visits.ts       # 방문 기록 샘플 데이터
│       └── regions.ts      # 지역 데이터
└── ...
```

## 🚀 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
npm run build
```

### 프로덕션 실행

```bash
npm start
```

## 📋 구현 현황

### ✅ 완료된 기능 (UI)

- NextJS 14+ App Router 구조
- Shadcn UI 컴포넌트 통합
- 블루 계열 테마 적용
- 반응형 레이아웃 (3단 구조)
- 지역/카테고리 필터 UI
- 업소 리스트 표시
- 지도 영역 placeholder
- 동선 최적화 패널
- 방문 체크리스트
- 방문 기록 페이지
- Mock 데이터 (서울/경기 25개 업소)

### ⏳ 향후 구현 필요

- 카카오 지도 API 연동
- 실제 업소 데이터 API 연동 (카카오/네이버 로컬 API)
- TSP 기반 동선 최적화 알고리즘
- 경로 시각화 (폴리라인)
- 방문 체크/메모 저장 기능 (백엔드 연동)
- 로컬 스토리지 또는 데이터베이스 연동

## 🎨 디자인 특징

- **블루 계열 테마**: 비즈니스 친화적인 전문적인 느낌
- **3단 레이아웃**: 필터 | 지도 | 리스트/상세
- **Server Components 우선**: Next.js App Router의 Server Components를 기본으로 사용
- **Client Components**: 상호작용이 필요한 부분만 "use client" 지시어 사용

## 📝 라이선스

이 프로젝트는 개인 사용 목적으로 제작되었습니다.

## 🔗 관련 링크

- [Next.js 문서](https://nextjs.org/docs)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [카카오 지도 API](https://apis.map.kakao.com/)
# RoadMap
