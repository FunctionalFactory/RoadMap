import { Visit } from "@/lib/types";

export const mockVisits: Visit[] = [
  {
    id: "v1",
    salonId: "1",
    date: "2025-10-24",
    checked: true,
    memo: "담당자: 김사장님, 관심 보임. 다음주 재방문 예정",
    timestamp: new Date("2025-10-24T10:30:00"),
  },
  {
    id: "v2",
    salonId: "2",
    date: "2025-10-24",
    checked: true,
    memo: "부재중, 명함만 남김",
    timestamp: new Date("2025-10-24T11:15:00"),
  },
  {
    id: "v3",
    salonId: "3",
    date: "2025-10-24",
    checked: false,
    timestamp: new Date("2025-10-24T12:00:00"),
  },
  {
    id: "v4",
    salonId: "6",
    date: "2025-10-23",
    checked: true,
    memo: "제품 샘플 제공, 긍정적 반응",
    timestamp: new Date("2025-10-23T14:20:00"),
  },
  {
    id: "v5",
    salonId: "7",
    date: "2025-10-23",
    checked: true,
    memo: "견적 요청함. 이메일로 발송 완료",
    timestamp: new Date("2025-10-23T15:45:00"),
  },
  {
    id: "v6",
    salonId: "9",
    date: "2025-10-22",
    checked: true,
    timestamp: new Date("2025-10-22T10:00:00"),
  },
  {
    id: "v7",
    salonId: "14",
    date: "2025-10-22",
    checked: true,
    memo: "담당자 출장 중, 다음주 재방문",
    timestamp: new Date("2025-10-22T13:30:00"),
  },
];
