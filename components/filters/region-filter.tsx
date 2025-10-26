"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { regions, seoulDistricts, gyeonggiCities } from "@/lib/mock-data";
import { CategoryFilter } from "@/lib/types";
import { Search } from "lucide-react";

interface RegionFilterProps {
  city: string;
  district: string;
  category: CategoryFilter;
  searchQuery?: string;
  onCityChange: (city: string) => void;
  onDistrictChange: (district: string) => void;
  onCategoryChange: (category: CategoryFilter) => void;
  onSearchQueryChange?: (query: string) => void;
}

export function RegionFilter({
  city,
  district,
  category,
  searchQuery = "",
  onCityChange,
  onDistrictChange,
  onCategoryChange,
  onSearchQueryChange,
}: RegionFilterProps) {
  // 시/도에 따라 구/시 목록 결정
  const districtList = city === "서울" ? seoulDistricts : gyeonggiCities;

  // 시/도 변경 시 첫 번째 구/시로 자동 설정
  const handleCityChange = (newCity: string) => {
    onCityChange(newCity);
    const newDistrictList = newCity === "서울" ? seoulDistricts : gyeonggiCities;
    onDistrictChange(newDistrictList[0]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">지역 필터</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">검색</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="업소명 또는 주소 검색..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange?.(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">시/도</Label>
          <Select value={city} onValueChange={handleCityChange}>
            <SelectTrigger id="city">
              <SelectValue placeholder="시/도 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="서울">서울</SelectItem>
              <SelectItem value="경기">경기</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="district">구/시</Label>
          <Select value={district} onValueChange={onDistrictChange}>
            <SelectTrigger id="district">
              <SelectValue placeholder="구/시 선택" />
            </SelectTrigger>
            <SelectContent>
              {districtList.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">카테고리</Label>
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger id="category">
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="전체">전체</SelectItem>
              <SelectItem value="미용실">미용실</SelectItem>
              <SelectItem value="헤어샵">헤어샵</SelectItem>
              <SelectItem value="살롱">살롱</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
