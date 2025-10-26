import { Visit } from "@/lib/types";

const STORAGE_KEY = "routehair_visits";

/**
 * Visit 객체를 직렬화 가능한 형태로 변환
 */
function serializeVisit(visit: Visit): object {
  return {
    ...visit,
    timestamp: visit.timestamp.toISOString(),
  };
}

/**
 * 직렬화된 데이터를 Visit 객체로 변환
 */
function deserializeVisit(data: any): Visit {
  return {
    ...data,
    timestamp: new Date(data.timestamp),
  };
}

/**
 * 로컬 스토리지에서 모든 방문 기록을 불러옴
 */
export function getVisits(): Visit[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return [];
    }

    const parsed = JSON.parse(data);
    return parsed.map(deserializeVisit);
  } catch (error) {
    console.error("Failed to load visits from localStorage:", error);
    return [];
  }
}

/**
 * 로컬 스토리지에 방문 기록을 저장
 */
export function saveVisits(visits: Visit[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const serialized = visits.map(serializeVisit);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  } catch (error) {
    console.error("Failed to save visits to localStorage:", error);
  }
}

/**
 * 특정 업소의 방문 기록을 가져옴
 */
export function getVisitBySalonId(salonId: string): Visit | undefined {
  const visits = getVisits();
  return visits.find((visit) => visit.salonId === salonId);
}

/**
 * 방문 기록을 추가하거나 업데이트
 */
export function upsertVisit(visit: Visit): void {
  const visits = getVisits();
  const index = visits.findIndex((v) => v.id === visit.id);

  if (index >= 0) {
    visits[index] = visit;
  } else {
    visits.push(visit);
  }

  saveVisits(visits);
}

/**
 * 특정 방문 기록을 삭제
 */
export function deleteVisit(visitId: string): void {
  const visits = getVisits();
  const filtered = visits.filter((v) => v.id !== visitId);
  saveVisits(filtered);
}

/**
 * 날짜 범위로 방문 기록을 필터링
 */
export function getVisitsByDateRange(
  startDate: string,
  endDate: string
): Visit[] {
  const visits = getVisits();
  return visits.filter(
    (visit) => visit.date >= startDate && visit.date <= endDate
  );
}

/**
 * 모든 방문 기록을 삭제
 */
export function clearAllVisits(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear visits from localStorage:", error);
  }
}
