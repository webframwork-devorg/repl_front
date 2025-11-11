import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FeedHeader from "@/components/commons/headers/FeedHeader";
import TagDropdown from "@/components/commons/dropdowns/TagDropdown";
import SortDropdown from "@/components/commons/dropdowns/SortDropdown";
import CardList from "@/components/commons/cardList/CardList";
import FloatingMenu from "@/components/commons/floating/FloatingMenu";
import { FaPencilAlt, FaTrash } from "react-icons/fa";

import { getPlaylists } from "@/api/playlists/getPlaylists";
import { getTags } from "@/api/tags/getTags";

function LandingPage() {
  const navigate = useNavigate();
  const [sort, setSort] = useState("latest");
  const [selectedTags, setSelectedTags] = useState([]);

  const [data, setData] = useState({
    playlists: [],
    tags: [],
    loading: false,
  });

  const sortOptions = [
    { value: "latest", label: "최신순" },
    { value: "likes", label: "인기순" },
    { value: "title", label: "제목순" },
  ];

  useEffect(() => {
    async function fetchData() {
      setData((prev) => ({ ...prev, loading: true }));
      try {
        const [playlistsData, tagsData] = await Promise.all([
          getPlaylists(sort, selectedTags),
          getTags(sort),
        ]);
        setData({
          playlists: playlistsData,
          tags: tagsData,
          loading: false,
        });
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
        setData((prev) => ({ ...prev, loading: false }));
      }
    }

    fetchData();
  }, [sort, selectedTags]);

  return (
    <div className="pb-[15px] bg-black min-h-screen">
      <div>
        <div className="flex flex-col gap-[10px] sticky top-0 z-50 px-[15px] pt-[20px] pb-[20px] bg-black">
          <FeedHeader />
          <div className="flex justify-between">
            <TagDropdown tags={data.tags} onChange={setSelectedTags} />
            <SortDropdown
              options={sortOptions}
              initialValue="latest"
              onChange={setSort}
            />
          </div>
        </div>

        {data.loading ? (
          <div className="flex justify-center items-center text-gray-400 text-sm py-10">
            로딩 중...
          </div>
        ) : (
          <div className="flex flex-col gap-5 px-[15px]">
            {data.playlists.map((item, idx) => (
              <CardList
                key={idx}
                username={item.username}
                count={item.subCards.length + 1}
                mainCard={{
                  image: item.image,
                  title: item.title,
                  tags: item.tags,
                }}
                subCards={item.subCards}
                onClick={() => navigate(`/list/${item.id}`)}
              />
            ))}
          </div>
        )}
      </div>
      <FloatingMenu />
    </div>
  );
}

export default LandingPage;
