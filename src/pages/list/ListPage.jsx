import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlaylistById } from '@/api/playlists/getPlaylistById';
import { getTags } from "@/api/tags/getTags";
import FloatingMenu from "@/components/commons/floating/FloatingMenu";
import ThumbnailCard from "@/components/commons/card/ThumbnailCard";
import QuoteBox from "@/components/commons/textBox/QuoteBox";
import MainCard from '@/components/commons/card/MainCard';

function ListPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [playlistItem, setPlaylistItem] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    async function fetchPlaylist() {
      setLoading(true); 
      try {
        const playlistData = await getPlaylistById(id);
        setPlaylistItem(playlistData); 
      } catch (error) {
        console.error("Error fetching playlist:", error);
      } finally {
        setLoading(false); 
      }
    }

    if (id) {
      fetchPlaylist();
    }
  }, [id]);

  const baseStyle = "bg-black min-h-screen pb-[15px]";

  return (
    <div className={baseStyle}>
      {loading ? (
        <div className="flex justify-center items-center text-gray-400 text-sm py-10">
          Loading...
        </div>
      ) : playlistItem ? (
        <div className="flex flex-col gap-3 px-[15px] pt-[20px]">

        <div className="flex flex-col gap-5 px-[15px]">
          <MainCard image={playlistItem.image} />
        </div>

          <h2 className="text-white text-2xl font-bold">{playlistItem.title}</h2>

          {/* tags가 배열인 경우, 각 태그를 #과 함께 표시합니다. */}
          <p className="text-gray-300">
            {Array.isArray(playlistItem.tags) ? playlistItem.tags.map(tag => `#${tag}`).join(' ') : playlistItem.tags}
          </p>
          
          <QuoteBox text={playlistItem.description} />
          
          {/* 플레이리스트에 포함된 책 목록 */}
          {playlistItem.items && playlistItem.items.length > 0 ? (
            playlistItem.items.map(item => (
              <div key={item.id} className="text-white mt-4">
                {item.book && <img src={item.book.cover} alt={item.book.title} className="w-full" />}
                <h3 className="text-lg font-bold mt-2">{item.book?.title}</h3>
                <p className="text-sm text-gray-400">{item.comment}</p>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center text-gray-400 text-sm py-10">
              이 플레이리스트에 담긴 책이 없습니다.
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center text-gray-400 text-sm py-10">
          Playlist not found.
        </div>
      )}
      <FloatingMenu />
      <ThumbnailCard 
      title = {quoteText}
      />
    </div>
  );
}

export default ListPage;