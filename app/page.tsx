"use client";

import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { RegionFilter } from "@/components/filters/region-filter";
import { KakaoMap } from "@/components/map/kakao-map";
import { SalonList } from "@/components/salon/salon-list";
import { RouteOptimizer } from "@/components/route/route-optimizer";
import { VisitChecklist } from "@/components/visit/visit-checklist";
import { mockSalons } from "@/lib/mock-data";
import { CategoryFilter, Salon, Visit } from "@/lib/types";
import { filterSalonsByRegionAndCategory } from "@/lib/utils/filters";
import {
  optimizeRoute,
  OptimizationMode,
  OptimizationResult,
} from "@/lib/utils/route-optimizer";
import { getVisits, upsertVisit } from "@/lib/utils/storage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Filter, X, Map as MapIcon, List as ListIcon } from "lucide-react";

export default function Home() {
  // 필터 상태 관리
  const [city, setCity] = useState<string>("서울");
  const [district, setDistrict] = useState<string>("강남구");
  const [category, setCategory] = useState<CategoryFilter>("전체");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 선택된 업소 상태 관리
  const [selectedSalonIds, setSelectedSalonIds] = useState<string[]>([]);
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  const [focusSalonId, setFocusSalonId] = useState<string | undefined>(undefined);

  // 동선 최적화 관련 상태
  const [startAddress, setStartAddress] = useState<string>("서울 강남구 테헤란로 123");
  const [optimizationMode, setOptimizationMode] = useState<OptimizationMode>("time");
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // 방문 기록 상태 관리
  const [visits, setVisits] = useState<Visit[]>([]);

  // 모바일 UI 상태
  const [mobileTab, setMobileTab] = useState<"map" | "list">("map");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // 로컬 스토리지에서 방문 기록 불러오기
  useEffect(() => {
    const loadedVisits = getVisits();
    setVisits(loadedVisits);
  }, []);

  // 방문 완료된 업소 ID Set
  const visitedSalonIds = useMemo(() => {
    const visitedSet = new Set<string>();
    visits.forEach((visit) => {
      if (visit.checked) {
        visitedSet.add(visit.salonId);
      }
    });
    return visitedSet;
  }, [visits]);

  // 현재 선택된 업소의 방문 기록 가져오기
  const currentVisit = useMemo(() => {
    if (!selectedSalon) return undefined;
    return visits.find((v) => v.salonId === selectedSalon.id);
  }, [visits, selectedSalon]);

  // 필터링된 업소 목록 계산
  const filteredSalons = useMemo(() => {
    let salons = filterSalonsByRegionAndCategory(mockSalons, city, district, category);

    // 검색어가 있으면 추가 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      salons = salons.filter(
        (salon) =>
          salon.name.toLowerCase().includes(query) ||
          salon.address.toLowerCase().includes(query)
      );
    }

    return salons;
  }, [city, district, category, searchQuery]);

  // 지도에 표시할 업소 목록 (필터링된 업소 + 선택된 업소)
  const mapSalons = useMemo(() => {
    const selectedSalons = mockSalons.filter((salon) =>
      selectedSalonIds.includes(salon.id)
    );

    // 중복 제거: 필터링된 업소에 선택된 업소 추가
    const salonMap = new Map<string, Salon>();
    filteredSalons.forEach((salon) => salonMap.set(salon.id, salon));
    selectedSalons.forEach((salon) => salonMap.set(salon.id, salon));

    return Array.from(salonMap.values());
  }, [filteredSalons, selectedSalonIds]);

  // 최적화 결과가 있을 때 업소 리스트를 최적화된 순서로 재정렬
  const displaySalons = useMemo(() => {
    if (!optimizationResult) {
      return filteredSalons;
    }

    // 최적화 결과가 있는 업소들을 순서대로 정렬
    const orderedSalonIds = optimizationResult.orderedSalons.map(
      (stop) => stop.salon.id
    );

    // 선택된 업소들을 최적화된 순서로, 그 외 업소들은 뒤에 배치
    const orderedSalons = orderedSalonIds
      .map((id) => mockSalons.find((salon) => salon.id === id))
      .filter((salon): salon is Salon => salon !== undefined);

    const unorderedSalons = filteredSalons.filter(
      (salon) => !orderedSalonIds.includes(salon.id)
    );

    return [...orderedSalons, ...unorderedSalons];
  }, [filteredSalons, optimizationResult]);

  // 체크박스 토글 핸들러 (5~10개 제약)
  const handleToggleSelect = (salonId: string) => {
    setSelectedSalonIds((prev) => {
      const isSelected = prev.includes(salonId);

      if (isSelected) {
        // 선택 해제
        return prev.filter((id) => id !== salonId);
      } else {
        // 선택 추가 (최대 10개 제한)
        if (prev.length >= 10) {
          alert("최대 10개까지만 선택할 수 있습니다.");
          return prev;
        }
        return [...prev, salonId];
      }
    });
  };

  // 업소 클릭 핸들러 (방문 상세 패널에 표시 + 지도 중심 이동)
  const handleSalonClick = (salon: Salon) => {
    setSelectedSalon(salon);
    setFocusSalonId(salon.id);
  };

  // 동선 최적화 핸들러
  const handleOptimize = () => {
    // 전체 업소 목록에서 선택된 업소 가져오기 (필터 상관없이)
    const selectedSalons = mockSalons.filter((salon) =>
      selectedSalonIds.includes(salon.id)
    );

    if (selectedSalons.length < 5 || selectedSalons.length > 10) {
      return;
    }

    setIsOptimizing(true);

    // 비동기 처리를 시뮬레이션하여 로딩 스피너 표시
    setTimeout(() => {
      // 기본 출발지 좌표 (서울 강남구 중심)
      const startLat = 37.4979;
      const startLng = 127.0276;

      // 경로 최적화 실행
      const result = optimizeRoute(startLat, startLng, selectedSalons, optimizationMode);
      setOptimizationResult(result);
      setIsOptimizing(false);
    }, 500);
  };

  // 방문 기록 업데이트 핸들러
  const handleVisitUpdate = (visit: Visit) => {
    // 로컬 스토리지에 저장
    upsertVisit(visit);

    // 상태 업데이트
    setVisits((prev) => {
      const index = prev.findIndex((v) => v.id === visit.id);
      if (index >= 0) {
        const newVisits = [...prev];
        newVisits[index] = visit;
        return newVisits;
      } else {
        return [...prev, visit];
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6">
        {/* 데스크톱 레이아웃 (lg 이상) */}
        <div className="hidden lg:grid grid-cols-12 gap-6 h-[calc(100vh-7rem)]">
          {/* 왼쪽 패널: 필터 + 동선 최적화 */}
          <div className="col-span-3 space-y-4 overflow-y-auto">
            <RegionFilter
              city={city}
              district={district}
              category={category}
              searchQuery={searchQuery}
              onCityChange={setCity}
              onDistrictChange={setDistrict}
              onCategoryChange={setCategory}
              onSearchQueryChange={setSearchQuery}
            />
            <RouteOptimizer
              selectedCount={selectedSalonIds.length}
              startAddress={startAddress}
              onStartAddressChange={setStartAddress}
              optimizationMode={optimizationMode}
              onOptimizationModeChange={setOptimizationMode}
              onOptimize={handleOptimize}
              totalDistanceKm={optimizationResult?.totalDistanceKm}
              totalDurationMin={optimizationResult?.totalDurationMin}
              isOptimizing={isOptimizing}
            />
          </div>

          {/* 중앙: 지도 */}
          <div className="col-span-5 h-full">
            <KakaoMap
              salons={mapSalons}
              selectedSalonIds={selectedSalonIds}
              onSalonClick={handleSalonClick}
              focusSalonId={focusSalonId}
              optimizationResult={optimizationResult}
              visitedSalonIds={visitedSalonIds}
            />
          </div>

          {/* 오른쪽 패널: 업소 리스트 + 방문 상세 */}
          <div className="col-span-4 space-y-4 h-full flex flex-col">
            <div className="flex-1 min-h-0">
              <SalonList
                salons={displaySalons}
                selectedIds={selectedSalonIds}
                onToggleSelect={handleToggleSelect}
                onSalonClick={handleSalonClick}
                optimizationResult={optimizationResult}
                visitedSalonIds={visitedSalonIds}
              />
            </div>
            <div className="flex-shrink-0">
              <VisitChecklist
                salonId={selectedSalon?.id}
                salonName={selectedSalon?.name}
                salonAddress={selectedSalon?.address}
                salonPhone={selectedSalon?.phone}
                visit={currentVisit}
                onVisitUpdate={handleVisitUpdate}
              />
            </div>
          </div>
        </div>

        {/* 모바일 레이아웃 (lg 미만) */}
        <div className="lg:hidden space-y-4">
          {/* 필터 토글 버튼 */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {filtersOpen ? "필터" : "업소 검색"}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              {filtersOpen ? (
                <>
                  <X className="h-4 w-4 mr-1" />
                  닫기
                </>
              ) : (
                <>
                  <Filter className="h-4 w-4 mr-1" />
                  필터
                </>
              )}
            </Button>
          </div>

          {/* 필터 영역 */}
          {filtersOpen && (
            <div className="space-y-4">
              <RegionFilter
                city={city}
                district={district}
                category={category}
                searchQuery={searchQuery}
                onCityChange={setCity}
                onDistrictChange={setDistrict}
                onCategoryChange={setCategory}
                onSearchQueryChange={setSearchQuery}
              />
              <RouteOptimizer
                selectedCount={selectedSalonIds.length}
                startAddress={startAddress}
                onStartAddressChange={setStartAddress}
                optimizationMode={optimizationMode}
                onOptimizationModeChange={setOptimizationMode}
                onOptimize={handleOptimize}
                totalDistanceKm={optimizationResult?.totalDistanceKm}
                totalDurationMin={optimizationResult?.totalDurationMin}
                isOptimizing={isOptimizing}
              />
            </div>
          )}

          {/* 지도/리스트 탭 */}
          <Tabs value={mobileTab} onValueChange={(v) => setMobileTab(v as "map" | "list")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="map">
                <MapIcon className="h-4 w-4 mr-1" />
                지도
              </TabsTrigger>
              <TabsTrigger value="list">
                <ListIcon className="h-4 w-4 mr-1" />
                목록
              </TabsTrigger>
            </TabsList>

            <TabsContent value="map" className="mt-4">
              <div className="h-[60vh]">
                <KakaoMap
                  salons={mapSalons}
                  selectedSalonIds={selectedSalonIds}
                  onSalonClick={handleSalonClick}
                  focusSalonId={focusSalonId}
                  optimizationResult={optimizationResult}
                  visitedSalonIds={visitedSalonIds}
                />
              </div>
            </TabsContent>

            <TabsContent value="list" className="mt-4 space-y-4">
              <div className="h-[50vh] overflow-hidden">
                <SalonList
                  salons={displaySalons}
                  selectedIds={selectedSalonIds}
                  onToggleSelect={handleToggleSelect}
                  onSalonClick={handleSalonClick}
                  optimizationResult={optimizationResult}
                  visitedSalonIds={visitedSalonIds}
                />
              </div>
              <VisitChecklist
                salonId={selectedSalon?.id}
                salonName={selectedSalon?.name}
                salonAddress={selectedSalon?.address}
                salonPhone={selectedSalon?.phone}
                visit={currentVisit}
                onVisitUpdate={handleVisitUpdate}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
