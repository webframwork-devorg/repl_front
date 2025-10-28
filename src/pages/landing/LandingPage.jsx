import React, { useState, useEffect } from "react";
import FeedHeader from "@/components/commons/headers/FeedHeader";
import TagDropdown from "@/components/commons/dropdowns/TagDropdown";
import SortDropdown from "@/components/commons/dropdowns/SortDropdown";

function LandingPage() {
  const [selectedTags, setSelectedTags] = useState([]);
  const [sort, setSort] = useState("latest");

  // 🔹 목데이터 (나중에 fetch로 교체 가능)
  const mockTags = ["감동", "소설", "희망", "여행", "힐링", "일상"];
  const sortOptions = [
    { value: "latest", label: "최신순" },
    { value: "popular", label: "인기순" },
    { value: "title", label: "제목순" },
  ];

  useEffect(() => {
    console.log("✅ 선택된 태그:", selectedTags);
  }, [selectedTags]);

  useEffect(() => {
    console.log("✅ 정렬 기준:", sort);
  }, [sort]);

  return (
    <div className="px-[15px] pt-[15px] bg-[#1F1F1F] min-h-screen">
      <div className="flex flex-col gap-[35px]">
        <FeedHeader />

        <div className="flex justify-between">
          <TagDropdown
            tags={mockTags}
            initialSelected={["감동"]}
            onChange={setSelectedTags}
          />
          <SortDropdown
            options={sortOptions}
            initialValue={sortOptions[0].value}
            onChange={setSort}
          />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
