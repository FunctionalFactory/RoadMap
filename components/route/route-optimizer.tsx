"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Route as RouteIcon, Navigation, Clock, Loader2 } from "lucide-react";
import type { OptimizationMode } from "@/lib/utils/route-optimizer";

interface RouteOptimizerProps {
  selectedCount: number;
  startAddress: string;
  onStartAddressChange: (address: string) => void;
  optimizationMode: OptimizationMode;
  onOptimizationModeChange: (mode: OptimizationMode) => void;
  onOptimize: () => void;
  totalDistanceKm?: number;
  totalDurationMin?: number;
  isOptimizing?: boolean;
}

export function RouteOptimizer({
  selectedCount,
  startAddress,
  onStartAddressChange,
  optimizationMode,
  onOptimizationModeChange,
  onOptimize,
  totalDistanceKm,
  totalDurationMin,
  isOptimizing = false,
}: RouteOptimizerProps) {
  const isDisabled = selectedCount < 5 || selectedCount > 10 || isOptimizing;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">동선 최적화</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="start-location">출발지</Label>
          <Input
            id="start-location"
            placeholder="예: 현재 위치, 회사 주소 등"
            value={startAddress}
            onChange={(e) => onStartAddressChange(e.target.value)}
          />
        </div>

        <Tabs
          value={optimizationMode}
          onValueChange={(value) => onOptimizationModeChange(value as OptimizationMode)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="time">
              <Clock className="h-4 w-4 mr-1" />
              시간 최소
            </TabsTrigger>
            <TabsTrigger value="distance">
              <RouteIcon className="h-4 w-4 mr-1" />
              거리 최소
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">선택된 방문지</span>
          <Badge variant="secondary">{selectedCount}개</Badge>
        </div>

        <Separator />

        <Button className="w-full" size="lg" disabled={isDisabled} onClick={onOptimize}>
          {isOptimizing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              동선 계산 중...
            </>
          ) : (
            <>
              <Navigation className="h-4 w-4 mr-2" />
              동선 만들기
            </>
          )}
        </Button>
        {isDisabled && selectedCount > 0 && !isOptimizing && (
          <p className="text-xs text-muted-foreground text-center">
            5~10개의 방문지를 선택해주세요
          </p>
        )}

        <div className="space-y-2 pt-2">
          <div className="text-sm font-medium">예상 결과</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="p-2 rounded-md bg-muted">
              <div className="text-xs text-muted-foreground">총 거리</div>
              <div className="font-medium">
                {totalDistanceKm !== undefined ? `${totalDistanceKm} km` : "-"}
              </div>
            </div>
            <div className="p-2 rounded-md bg-muted">
              <div className="text-xs text-muted-foreground">소요 시간</div>
              <div className="font-medium">
                {totalDurationMin !== undefined ? `${totalDurationMin} 분` : "-"}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
