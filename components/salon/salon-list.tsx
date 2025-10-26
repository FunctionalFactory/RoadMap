"use client";

import { Salon } from "@/lib/types";
import type { OptimizationResult } from "@/lib/utils/route-optimizer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Phone, MapPin, CheckCircle2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SalonListProps {
  salons: Salon[];
  selectedIds: string[];
  onToggleSelect: (salonId: string) => void;
  onSalonClick: (salon: Salon) => void;
  optimizationResult?: OptimizationResult | null;
  visitedSalonIds?: Set<string>;
}

export function SalonList({
  salons,
  selectedIds,
  onToggleSelect,
  onSalonClick,
  optimizationResult,
  visitedSalonIds = new Set(),
}: SalonListProps) {
  // 순서 번호 매핑
  const orderMap = new Map<string, number>();
  if (optimizationResult) {
    optimizationResult.orderedSalons.forEach((stop) => {
      orderMap.set(stop.salon.id, stop.order);
    });
  }
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">업소 목록</CardTitle>
          <Badge variant="secondary">{salons.length}개</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full px-6 pb-6">
          <div className="space-y-2">
            {salons.map((salon) => {
              const isSelected = selectedIds.includes(salon.id);
              const isVisited = visitedSalonIds.has(salon.id);
              const order = orderMap.get(salon.id);
              return (
                <div
                  key={salon.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-primary/10 border-primary/50"
                      : "hover:bg-accent/50"
                  } ${isVisited ? "opacity-70" : ""}`}
                  onClick={() => onSalonClick(salon)}
                >
                  {order !== undefined && (
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold mt-1">
                      {order}
                    </div>
                  )}
                  <Checkbox
                    id={`salon-${salon.id}`}
                    className="mt-1"
                    checked={isSelected}
                    onCheckedChange={() => onToggleSelect(salon.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor={`salon-${salon.id}`}
                        className="font-medium text-sm cursor-pointer"
                      >
                        {salon.name}
                      </label>
                      {isVisited && (
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{salon.address}</span>
                    </div>
                    {salon.phone && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{salon.phone}</span>
                      </div>
                    )}
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">
                        {salon.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
