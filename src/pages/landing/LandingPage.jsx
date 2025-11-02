import React, { useEffect, useState } from "react";
import FeedHeader from "@/components/commons/headers/FeedHeader";
import TagDropdown from "@/components/commons/dropdowns/TagDropdown";
import SortDropdown from "@/components/commons/dropdowns/SortDropdown";
import CardList from "@/components/commons/cardList/CardList";

import { getPlaylists } from "@/api/playlists/getPlaylists";

function LandingPage() {
  const [playlists, setPlaylists] = useState([]); 
  const [feedList, setFeedList] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sort, setSort] = useState("latest");

  const sortOptions = [
    { value: "latest", label: "최신순" },
    { value: "likes", label: "인기순" },
    { value: "title", label: "제목순" },
  ];

  const mockTags = ["감동", "소설", "희망", "여행", "힐링", "일상"];

    useEffect(() => {
      async function fetchPlaylists() {
        try {
          const data = await getPlaylists(); 
          setPlaylists(data);
          console.log("플레이리스트 데이터:", data);
        } catch (err) {
          console.error("에러:", err);
        } finally {
          console.log("플레이리스트 데이터 로드 완료");}
      }

      fetchPlaylists();
    }, []);

  useEffect(() => {
    const mockData = [
      {
        username: "min3eo",
        count: 3,
        likes: 58,
        createdAt: "2025-10-30T21:00:00Z",
        mainCard: {
          imageUrl:
            "https://i.pinimg.com/1200x/1b/ac/72/1bac72e8122561301951ab0b3b4e8f49.jpg",
          title: "주인장이 끓여온 힙한 책들",
          tags: ["감동", "희망", "활기"],
        },
        subCards: [
          {
            imageUrl:
              "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788932475783.jpg",
          },
          {
            imageUrl:
              "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788932475059.jpg",
          },
          {
            imageUrl:
              "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791198931337.jpg",
          },
        ],
      },
      {
        username: "zoeunie",
        count: 2,
        likes: 120,
        createdAt: "2025-10-26T14:30:00Z",
        mainCard: {
          imageUrl:
            "https://i.pinimg.com/736x/25/50/ac/2550ac334cdae714441fa29be0399ded.jpg",
          title: "달달한게 땡길때 읽어봐",
          tags: ["감동", "희망"],
        },
        subCards: [
          {
            imageUrl:
              "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788925566146.jpg",
          },
          {
            imageUrl:
              "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791167552389.jpg",
          },
        ],
      },
      {
        username: "mynameisJisu",
        count: 5,
        likes: 5,
        createdAt: "2025-10-29T09:00:00Z",
        mainCard: {
          imageUrl:
            "https://i.pinimg.com/736x/2a/68/12/2a6812055e7bb758d4153a94c934dad5.jpg",
          title: "아무 생각도 하기 싫을 때",
          tags: ["힐링", "희망"],
        },
        subCards: [
          {
            imageUrl:
              "https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/9788954657129.jpg",
          },
          {
            imageUrl:
              "https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/9791191369458.jpg",
          },
        ],
      },
    ];

    let sorted = [...mockData];

    if (sort === "latest") {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === "popular") {
      sorted.sort((a, b) => b.count - a.count);
    } else if (sort === "likes") {
      sorted.sort((a, b) => b.likes - a.likes);
    } else if (sort === "title") {
      sorted.sort((a, b) =>
        a.mainCard.title.localeCompare(b.mainCard.title, "ko")
      );
    }

    if (selectedTags.length > 0) {
      sorted = sorted.filter((feed) =>
        feed.mainCard.tags.some((tag) => selectedTags.includes(tag))
      );
    }

    setFeedList(sorted);
  }, [sort, selectedTags]);

  useEffect(() => {
    console.log("I정렬 기준:", sort);
    console.log("선택된 태그:", selectedTags);
    console.log(
      " 피드 목록:",
      feedList.map((f) => f.mainCard.title)
    );
  }, [sort, selectedTags, feedList]);

  return (
    <div className="pb-[15px] bg-black min-h-screen">
      <div>
        <div className="flex flex-col gap-[10px] sticky top-0 z-50 px-[15px] pt-[20px] pb-[20px] bg-[#0f0f0f]">
          <FeedHeader />
          <div className="flex justify-between">
            <TagDropdown
              tags={mockTags}
              initialSelected={["감동"]}
              onChange={setSelectedTags}
            />
            <SortDropdown
              options={sortOptions}
              initialValue="latest"
              onChange={setSort}
            />
          </div>
        </div>

        {/* 갭 간격 고민중 */}
        <div className="flex flex-col gap-3 px-[15px]">
          {feedList.map((feed, idx) => (
            <CardList key={idx} {...feed} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
