import { Salon, CategoryFilter } from "@/lib/types";

/**
 * 지역 및 카테고리에 따라 업소를 필터링합니다.
 *
 * @param salons - 전체 업소 목록
 * @param city - 시/도 (예: "서울", "경기")
 * @param district - 구/시 (예: "강남구", "수원시")
 * @param category - 카테고리 (예: "미용실", "헤어샵", "살롱", "전체")
 * @returns 필터링된 업소 목록
 */
export function filterSalonsByRegionAndCategory(
  salons: Salon[],
  city: string,
  district: string | null,
  category: CategoryFilter
): Salon[] {
  return salons.filter((salon) => {
    // 지역 필터링: district가 null이면 city만 확인
    const matchesRegion = district
      ? salon.district === district
      : salon.address.includes(city);

    // 카테고리 필터링: "전체"이면 모든 카테고리 포함
    const matchesCategory =
      category === "전체" || salon.category === category;

    return matchesRegion && matchesCategory;
  });
}
