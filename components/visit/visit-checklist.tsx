"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, MapPin, CheckCircle2, Copy, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Visit } from "@/lib/types";
import { toast } from "sonner";

interface VisitChecklistProps {
  salonId?: string;
  salonName?: string;
  salonAddress?: string;
  salonPhone?: string;
  visit?: Visit;
  onVisitUpdate?: (visit: Visit) => void;
}

export function VisitChecklist({
  salonId,
  salonName = "선택된 업소 없음",
  salonAddress,
  salonPhone,
  visit,
  onVisitUpdate,
}: VisitChecklistProps) {
  const [checked, setChecked] = useState(false);
  const [memo, setMemo] = useState("");
  const [copied, setCopied] = useState(false);

  // Visit 데이터로부터 상태 초기화
  useEffect(() => {
    if (visit) {
      setChecked(visit.checked);
      setMemo(visit.memo || "");
    } else {
      setChecked(false);
      setMemo("");
    }
  }, [visit]);

  const handleSave = () => {
    if (!salonId || !onVisitUpdate) return;

    const updatedVisit: Visit = {
      id: visit?.id || `visit-${salonId}-${Date.now()}`,
      salonId,
      date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      checked,
      memo: memo.trim() || undefined,
      timestamp: new Date(),
    };

    onVisitUpdate(updatedVisit);
    toast.success("방문 기록이 저장되었습니다.", {
      description: checked ? "방문 완료로 표시되었습니다." : undefined,
    });
  };

  const handleCopyAddress = async () => {
    if (!salonAddress) return;

    try {
      await navigator.clipboard.writeText(salonAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("주소가 복사되었습니다.");
    } catch (error) {
      console.error("Failed to copy address:", error);
      toast.error("주소 복사에 실패했습니다.");
    }
  };

  const hasVisitData = salonId && salonName !== "선택된 업소 없음";

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">방문 상세</CardTitle>
          <Badge
            variant={checked ? "default" : "outline"}
            className={checked ? "bg-green-600" : ""}
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            {checked ? "완료" : "대기"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="space-y-3">
          <div>
            <div className="font-medium">{salonName}</div>
          </div>
          {salonAddress && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="flex-1">{salonAddress}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={handleCopyAddress}
              >
                {copied ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          )}
          {salonPhone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{salonPhone}</span>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto"
                asChild
              >
                <a href={`tel:${salonPhone}`}>전화 걸기</a>
              </Button>
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="visit-completed"
              checked={checked}
              onCheckedChange={(value) => setChecked(value === true)}
              disabled={!hasVisitData}
            />
            <label
              htmlFor="visit-completed"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              방문 완료
            </label>
          </div>

          <div className="space-y-2">
            <label htmlFor="visit-memo" className="text-sm font-medium">
              메모
            </label>
            <Textarea
              id="visit-memo"
              placeholder="담당자, 반응, 후속 액션 등을 기록하세요..."
              rows={4}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              disabled={!hasVisitData}
            />
          </div>

          <Button
            className="w-full"
            onClick={handleSave}
            disabled={!hasVisitData}
          >
            저장
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
