"use client";

import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/layout/header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockSalons } from "@/lib/mock-data";
import { CheckCircle2, Circle } from "lucide-react";
import { getVisits } from "@/lib/utils/storage";
import { Visit } from "@/lib/types";

type DateFilter = "all" | "today" | "yesterday" | "last7days";

export default function HistoryPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");

  // 로컬 스토리지에서 방문 기록 불러오기
  useEffect(() => {
    const loadedVisits = getVisits();
    setVisits(loadedVisits);
  }, []);

  // 날짜 필터링 함수
  const getFilteredVisits = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split("T")[0];

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];

    switch (dateFilter) {
      case "today":
        return visits.filter((v) => v.date === todayStr);
      case "yesterday":
        return visits.filter((v) => v.date === yesterdayStr);
      case "last7days":
        return visits.filter((v) => v.date >= sevenDaysAgoStr);
      default:
        return visits;
    }
  }, [visits, dateFilter]);

  // 방문 기록에 업소 정보 추가
  const visitsWithSalon = useMemo(
    () =>
      getFilteredVisits.map((visit) => ({
        ...visit,
        salon: mockSalons.find((s) => s.id === visit.salonId),
      })),
    [getFilteredVisits]
  );

  // 통계 계산
  const totalVisits = visits.length;
  const completedVisits = visits.filter((v) => v.checked).length;
  const completionRate =
    totalVisits > 0 ? Math.round((completedVisits / totalVisits) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">방문 기록</h1>
            <p className="text-muted-foreground">
              날짜별 방문 내역 및 메모를 확인할 수 있습니다.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  총 방문 기록
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalVisits}건</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  완료된 방문
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedVisits}건</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">완료율</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completionRate}%</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>방문 내역</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={dateFilter === "today" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateFilter("today")}
                  >
                    오늘
                  </Button>
                  <Button
                    variant={dateFilter === "yesterday" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateFilter("yesterday")}
                  >
                    어제
                  </Button>
                  <Button
                    variant={dateFilter === "last7days" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateFilter("last7days")}
                  >
                    지난 7일
                  </Button>
                  <Button
                    variant={dateFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateFilter("all")}
                  >
                    전체
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">날짜</TableHead>
                    <TableHead>업소명</TableHead>
                    <TableHead>주소</TableHead>
                    <TableHead className="w-[100px]">상태</TableHead>
                    <TableHead>메모</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visitsWithSalon.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-24 text-center text-muted-foreground"
                      >
                        방문 기록이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    visitsWithSalon.map((visit) => (
                      <TableRow key={visit.id}>
                        <TableCell className="font-medium">
                          {visit.date}
                        </TableCell>
                        <TableCell>{visit.salon?.name || "-"}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {visit.salon?.address || "-"}
                        </TableCell>
                        <TableCell>
                          {visit.checked ? (
                            <Badge
                              variant="default"
                              className="flex items-center gap-1 w-fit bg-green-600"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              완료
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1 w-fit"
                            >
                              <Circle className="h-3 w-3" />
                              미완료
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {visit.memo || "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
