import FloatingMenu from "@/components/commons/floating/FloatingMenu";
import QuoteBox from "@/components/commons/textBox/QuoteBox";
import MainCard from "@/components/commons/card/MainCard";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getTags } from "@/api/tags/getTags";
import { getPlaylistById } from "@/api/playlists/getPlaylistById";
import { getPlaylists } from "@/api/playlists/getPlaylists";

function ListPage() {
  const { id } = useParams();
  const [playlistItem, setPlaylistItem] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchPlaylist() {
      setLoading(true);
      try {
        const data = await getPlaylistById(id);
        setPlaylistItem(data);
        console.log("플레이리스트 아이템 데이터:", data);
      } catch (err) {
        console.error("에러:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPlaylist();
  }, [id]);

  const menuItems = [
    { icon: <FaPencilAlt />, label: "수정", path: "/edit" },
    { icon: <FaTrash />, label: "삭제", path: "/delete" },
  ];

  const baseStyle = "bg-black min-h-screen pb-[15px]";

  return (
    <div className={baseStyle}>
      {loading ? (
        <div className="flex justify-center items-center text-gray-400 text-sm py-10">
          로딩 중...
        </div>
      ) : playlistItem ? (
        <div className="flex flex-col gap-3 px-[15px] pt-[20px]">
          <QuoteBox text={playlistid.user_comment} />
        </div>
      ) : null}
      <FloatingMenu menuItems={menuItems} />
    </div>
  );
}

export default ListPage;
