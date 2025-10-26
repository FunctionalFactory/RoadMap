// 업소 타입
export interface Salon {
  id: string;
  name: string;
  phone?: string;
  address: string;
  lat: number;
  lng: number;
  district: string; // 구 (예: 강남구)
  dong?: string; // 동 (선택)
  category: string; // 미용실, 헤어샵, 살롱
  source: "kakao" | "naver" | "google";
  updatedAt: Date;
}

// 경로/동선 타입
export interface Route {
  id: string;
  date: string; // YYYY-MM-DD
  startLat: number;
  startLng: number;
  startName?: string; // 출발지 이름 (예: 회사, 집)
  endLat?: number;
  endLng?: number;
  endName?: string; // 도착지 이름
  stops: RouteStop[]; // 경유지 (순서대로)
  totalDistanceKm: number;
  totalDurationMin: number;
  optimizationMode: "time" | "distance";
}

export interface RouteStop {
  order: number; // 방문 순서
  salon: Salon;
}

// 방문 기록 타입
export interface Visit {
  id: string;
  salonId: string;
  salon?: Salon; // populated 데이터
  date: string; // YYYY-MM-DD
  checked: boolean; // 방문 완료 여부
  memo?: string; // 메모 (담당자, 반응, 후속 액션 등)
  timestamp: Date; // 체크한 시간
}

// 지역 필터 타입
export interface RegionFilter {
  city: string; // 시 (예: 서울, 경기)
  district?: string; // 구 (예: 강남구)
  dong?: string; // 동 (선택)
}

// 카테고리 필터 타입
export type CategoryFilter = "미용실" | "헤어샵" | "살롱" | "전체";

// 지도 마커 타입
export interface MapMarker {
  salon: Salon;
  order?: number; // 동선에 포함된 경우 순서
  selected?: boolean; // 선택 여부
}
