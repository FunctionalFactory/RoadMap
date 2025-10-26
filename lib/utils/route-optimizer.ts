import type { Salon, RouteStop } from "@/lib/types";

/**
 * Haversine 공식을 사용하여 두 좌표 간의 거리를 계산합니다 (km 단위)
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // 지구 반지름 (km)
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

/**
 * 각도를 라디안으로 변환
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * 최적화 모드 타입
 */
export type OptimizationMode = "distance" | "time";

/**
 * 최적화 결과 타입
 */
export interface OptimizationResult {
  orderedSalons: RouteStop[];
  totalDistanceKm: number;
  totalDurationMin: number;
}

/**
 * Nearest Neighbor 알고리즘을 사용하여 최적 경로를 계산합니다
 *
 * @param startLat 출발지 위도
 * @param startLng 출발지 경도
 * @param salons 방문할 업소 목록
 * @param mode 최적화 모드 (distance: 거리 기준, time: 시간 기준)
 * @returns 최적화된 경로 결과
 */
export function optimizeRoute(
  startLat: number,
  startLng: number,
  salons: Salon[],
  mode: OptimizationMode = "distance"
): OptimizationResult {
  if (salons.length === 0) {
    return {
      orderedSalons: [],
      totalDistanceKm: 0,
      totalDurationMin: 0,
    };
  }

  // 방문하지 않은 업소 목록
  const unvisited = [...salons];
  const orderedSalons: RouteStop[] = [];

  // 현재 위치 (처음에는 출발지)
  let currentLat = startLat;
  let currentLng = startLng;
  let totalDistance = 0;

  // Nearest Neighbor 알고리즘: 가장 가까운 업소를 순차적으로 선택
  while (unvisited.length > 0) {
    let nearestIndex = 0;
    let minDistance = Infinity;

    // 현재 위치에서 가장 가까운 업소 찾기
    unvisited.forEach((salon, index) => {
      const distance = calculateDistance(
        currentLat,
        currentLng,
        salon.lat,
        salon.lng
      );

      // 시간 모드일 경우 거리에 1.2 가중치 적용
      const weight = mode === "time" ? 1.2 : 1.0;
      const weightedDistance = distance * weight;

      if (weightedDistance < minDistance) {
        minDistance = weightedDistance;
        nearestIndex = index;
      }
    });

    // 가장 가까운 업소를 방문 목록에 추가
    const nearestSalon = unvisited[nearestIndex];
    const actualDistance = calculateDistance(
      currentLat,
      currentLng,
      nearestSalon.lat,
      nearestSalon.lng
    );

    orderedSalons.push({
      order: orderedSalons.length + 1,
      salon: nearestSalon,
    });

    totalDistance += actualDistance;
    currentLat = nearestSalon.lat;
    currentLng = nearestSalon.lng;
    unvisited.splice(nearestIndex, 1);
  }

  // 총 소요 시간 계산 (평균 시속 30km 가정, 각 업소 방문 시간 10분 추가)
  const travelTimeMin = (totalDistance / 30) * 60;
  const visitTimeMin = salons.length * 10;
  const totalDurationMin = Math.round(travelTimeMin + visitTimeMin);

  return {
    orderedSalons,
    totalDistanceKm: Math.round(totalDistance * 100) / 100,
    totalDurationMin,
  };
}
