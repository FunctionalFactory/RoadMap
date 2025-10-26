"use client";

import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import type { Salon } from "@/lib/types";
import type { OptimizationResult } from "@/lib/utils/route-optimizer";

interface KakaoMapProps {
  salons: Salon[];
  selectedSalonIds: string[];
  onSalonClick?: (salon: Salon) => void;
  focusSalonId?: string;
  optimizationResult?: OptimizationResult | null;
  visitedSalonIds?: Set<string>;
}

export function KakaoMap({
  salons,
  selectedSalonIds,
  onSalonClick,
  focusSalonId,
  optimizationResult,
  visitedSalonIds = new Set(),
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<kakao.maps.Map | null>(null);
  const markersRef = useRef<{ marker: kakao.maps.Marker; salon: Salon; infoWindow: kakao.maps.InfoWindow }[]>([]);
  const polylineRef = useRef<kakao.maps.Polyline | null>(null);
  const overlaysRef = useRef<kakao.maps.CustomOverlay[]>([]);

  // 지도 초기화
  useEffect(() => {
    if (!mapRef.current || typeof window === "undefined" || !window.kakao) return;

    kakao.maps.load(() => {
      const container = mapRef.current;
      if (!container) return;

      // 기본 중심 좌표 (서울 강남구)
      const center = new kakao.maps.LatLng(37.4979, 127.0276);
      const options = {
        center,
        level: 5,
      };

      const map = new kakao.maps.Map(container, options);
      mapInstanceRef.current = map;
    });
  }, []);

  // 마커 생성 및 업데이트
  useEffect(() => {
    if (!mapInstanceRef.current || salons.length === 0) return;

    // 기존 마커 및 오버레이 제거
    markersRef.current.forEach(({ marker, infoWindow }) => {
      marker.setMap(null);
      infoWindow.close();
    });
    markersRef.current = [];

    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    overlaysRef.current = [];

    // 새 마커 생성
    const bounds = new kakao.maps.LatLngBounds();

    // 최적화 결과가 있는지 확인
    const orderMap = new Map<string, number>();
    if (optimizationResult) {
      optimizationResult.orderedSalons.forEach((stop) => {
        orderMap.set(stop.salon.id, stop.order);
      });
    }

    salons.forEach((salon) => {
      const position = new kakao.maps.LatLng(salon.lat, salon.lng);
      const isSelected = selectedSalonIds.includes(salon.id);
      const isVisited = visitedSalonIds.has(salon.id);
      const order = orderMap.get(salon.id);

      // 마커 이미지 설정
      // 방문 완료: 회색, 선택됨: 파란색, 일반: 빨간색
      let imageSrc: string;
      if (isVisited) {
        imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
      } else if (isSelected) {
        imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_blue.png";
      } else {
        imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png";
      }
      const imageSize = new kakao.maps.Size(24, 35);
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

      const marker = new kakao.maps.Marker({
        position,
        image: markerImage,
      });

      marker.setMap(mapInstanceRef.current);
      bounds.extend(position);

      // 순서 번호 오버레이 (최적화 결과가 있고 순서가 있을 때만)
      if (order !== undefined) {
        const overlayContent = document.createElement("div");
        overlayContent.style.cssText = `
          background: #2563eb;
          color: white;
          border: 2px solid white;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        `;
        overlayContent.textContent = order.toString();

        const customOverlay = new kakao.maps.CustomOverlay({
          position,
          content: overlayContent,
          yAnchor: 2.3,
        });

        customOverlay.setMap(mapInstanceRef.current);
        overlaysRef.current.push(customOverlay);
      }

      // 인포윈도우 생성
      const content = `
        <div style="padding: 10px; min-width: 200px;">
          <h3 style="font-size: 14px; font-weight: bold; margin: 0 0 8px 0;">${order !== undefined ? `${order}. ` : ""}${salon.name}</h3>
          <p style="font-size: 12px; margin: 4px 0; color: #666;">${salon.address}</p>
          ${salon.phone ? `<p style="font-size: 12px; margin: 4px 0; color: #666;">${salon.phone}</p>` : ""}
        </div>
      `;

      const infoWindow = new kakao.maps.InfoWindow({
        content,
      });

      // 마커 클릭 이벤트
      kakao.maps.event.addListener(marker, "click", () => {
        // 다른 인포윈도우 모두 닫기
        markersRef.current.forEach(({ infoWindow: iw }) => iw.close());

        // 현재 인포윈도우 열기
        infoWindow.open(mapInstanceRef.current!, marker);

        // 상위 컴포넌트에 클릭 이벤트 전달
        onSalonClick?.(salon);
      });

      markersRef.current.push({ marker, salon, infoWindow });
    });

    // 모든 마커가 보이도록 지도 범위 조정
    if (salons.length > 0) {
      mapInstanceRef.current.setBounds(bounds);
    }
  }, [salons, selectedSalonIds, onSalonClick, optimizationResult, visitedSalonIds]);

  // 포커스할 업소로 지도 이동
  useEffect(() => {
    if (!mapInstanceRef.current || !focusSalonId) return;

    const targetMarker = markersRef.current.find(
      ({ salon }) => salon.id === focusSalonId
    );

    if (targetMarker) {
      const position = targetMarker.marker.getPosition();
      mapInstanceRef.current.panTo(position);

      // 인포윈도우 열기
      markersRef.current.forEach(({ infoWindow }) => infoWindow.close());
      targetMarker.infoWindow.open(mapInstanceRef.current!, targetMarker.marker);
    }
  }, [focusSalonId]);

  // 경로 폴리라인 그리기
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // 기존 폴리라인 제거
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    // 최적화 결과가 있을 때만 폴리라인 그리기
    if (optimizationResult && optimizationResult.orderedSalons.length > 0) {
      const path = optimizationResult.orderedSalons.map((stop) =>
        new kakao.maps.LatLng(stop.salon.lat, stop.salon.lng)
      );

      const polyline = new kakao.maps.Polyline({
        path,
        strokeWeight: 4,
        strokeColor: "#2563eb",
        strokeOpacity: 0.8,
        strokeStyle: "solid",
      });

      polyline.setMap(mapInstanceRef.current);
      polylineRef.current = polyline;
    }
  }, [optimizationResult]);

  return (
    <Card className="h-full">
      <div ref={mapRef} className="h-full w-full rounded-lg" />
    </Card>
  );
}
