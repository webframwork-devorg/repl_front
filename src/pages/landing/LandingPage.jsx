import React, { useEffect, useState } from "react";
import FeedHeader from "@/components/commons/headers/FeedHeader";
import TagDropdown from "@/components/commons/dropdowns/TagDropdown";
import SortDropdown from "@/components/commons/dropdowns/SortDropdown";
import CardList from "@/components/commons/cardList/CardList";

import { getPlaylists } from "@/api/playlists/getPlaylists";
import { getTags } from "@/api/tags/getTags";

function LandingPage() {
  const [playlists, setPlaylists] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sort, setSort] = useState("latest");
  const [loading, setLoading] = useState(false);

  const sortOptions = [
    { value: "latest", label: "최신순" },
    { value: "likes", label: "인기순" },
    { value: "title", label: "제목순" },
  ];

useEffect(() => {
  async function fetchPlaylists() {
    setLoading(true);
    try {
      const data = await getPlaylists(sort, selectedTags); // ✅ 태그도 전달
      setPlaylists(data);
      console.log("플레이리스트 데이터:", data);
    } catch (err) {
      console.error("에러:", err);
    } finally {
      setLoading(false);
    }
  }

  fetchPlaylists();
}, [sort, selectedTags]);

  useEffect(() => {
    async function fetchTags() {
      setLoading(true);
      try {
        const data = await getTags(sort);
        setTags(data);
        console.log("태그 데이터:", data);
      } catch (err) {
        console.error("에러:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTags();
  }, [sort, selectedTags]);

  return (
    <div className="pb-[15px] bg-black min-h-screen">
      <div>
        <div className="flex flex-col gap-[10px] sticky top-0 z-50 px-[15px] pt-[20px] pb-[20px] bg-black">
          <FeedHeader />
          <div className="flex justify-between">
            <TagDropdown
              tags={tags}
              onChange={setSelectedTags}
            />
            <SortDropdown
              options={sortOptions}
              initialValue="latest"
              onChange={setSort}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center text-gray-400 text-sm py-10">
            로딩 중...
          </div>
        ) : (
          <div className="flex flex-col gap-3 px-[15px]">
            {playlists.map((item, idx) => (
              <CardList
                key={idx}
                username={item.username}
                count={1}
                mainCard={{
                  image: item.image,
                  title: item.title,
                  tags: item.tags,
                }}
                subCards={[]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
