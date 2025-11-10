import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getPlaylistById } from '@/api/playlists/getPlaylistById';
import SortDropdown from "@/components/commons/dropdowns/SortDropdown";
import FloatingMenu from "@/components/commons/floating/FloatingMenu";
import ThumbnailCard from "@/components/commons/card/ThumbnailCard";
import HeartShareButton from "@/components/commons/buttons/HeartShareButton";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { useState } from "react";
import QuoteBox from "@/components/commons/textBox/QuoteBox";


function ListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [playlistItem, setPlaylistItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("latest"); // ✅ 추가

  const [isLiked, setIsLiked] = useState(false);

  const menuItems = [
    { icon: <FaPencilAlt />, label: "수정", path: "/edit" },
    { icon: <FaTrash />, label: "삭제", path: "/delete" },
  const sortOptions = [
    { value: "latest", label: "최신순" },
    { value: "likes", label: "인기순" },
    { value: "title", label: "제목순" },
  ];
  
  useEffect(() => {
    async function fetchPlaylist() {
      setLoading(true); 
      try {
        const playlistData = await getPlaylistById(id);
        setPlaylistItem(playlistData);
      } catch (error) {
        console.error("Error fetching playlist:", error);
        setPlaylistItem(null);
      } finally {
        setLoading(false); 
      }
    }

    if (id) {
      fetchPlaylist();
    }
  }, [id, location.state?.key]);

  const sortedItems = useMemo(() => {
    if (!playlistItem || !playlistItem.items) {
      return [];
    }

    const itemsToSort = [...playlistItem.items];

    switch (sort) {
      case 'latest':
        // playlist_items에 아이템이 추가된 최신순으로 정렬
        return itemsToSort.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'likes':
        // 책의 좋아요(인기) 순으로 정렬
        return itemsToSort.sort((a, b) => b.book.likes - a.book.likes);
      case 'title':
        // 책 제목의 가나다순으로 정렬
        return itemsToSort.sort((a, b) => a.book.title.localeCompare(b.book.title));
      default:
        return itemsToSort;
    }
  }, [playlistItem, sort]);

  const baseStyle = "bg-black min-h-screen pb-[15px]";

  // 1. 하트 버튼 로직 (API 연동 없이 상태만 변경)
  const handleLikeToggle = () => {
    setIsLiked((prevIsLiked) => !prevIsLiked);
  };

  const handleShare = () => {
    // 예: 웹 표준 공유 API 사용
    if (navigator.share) {
      navigator
        .share({
          title: "게시물 제목",
          text: "이 게시물을 확인해보세요!",
          url: window.location.href,
        })
        .then(() => console.log("공유 성공"))
        .catch((error) => console.log("공유 실패", error));
    } else {
      // 공유 API 미지원 시 (예: PC) 클립보드 복사
      navigator.clipboard.writeText(window.location.href);
      alert("링크가 클립보드에 복사되었습니다.");
    }
  };

  return (
    <div className={baseStyle}>
      {loading ? (
        <div className="flex justify-center items-center text-gray-400 text-sm py-10">
          Loading...
        </div>
      ) : playlistItem ? (
        <div className="flex flex-col gap-3 px-[15px] pt-[20px]">
          {/* 썸네일 카드 */}
          <div>
            <ThumbnailCard 
              image={playlistItem.image} 
              title={playlistItem.title} 
            />
          </div>

          {/* 태그 표시 */}
          <p className="text-gray-300">
            {Array.isArray(playlistItem.tags) 
              ? playlistItem.tags.map(tag => `#${tag.name}`).join(' ') 
              : ''}
          </p>
          
          {/* QuoteBox */}
          <QuoteBox text={playlistItem.description} />
          
          {/* ✅ SortDropdown을 QuoteBox 바로 아래 왼쪽에 배치 */}
          <div className="flex justify-start items-center mt-2 gap-4">
            <SortDropdown
              options={sortOptions}
              initialValue={sort}
              onChange={setSort}
            />
            {/* 책 개수 표시 */}
            <span className="text-sm text-gray-400">
              {playlistItem.items?.length || 0}권의 책
            </span>
          </div>
          
          {/* 플레이리스트에 포함된 책 목록 */}
          {sortedItems.length > 0 ? (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {sortedItems.map(item => (
                <div key={item.id} className="text-white">
                  {item.book && (
                    <img 
                      src={item.book.cover} 
                      className="w-full h-auto object-cover cursor-pointer rounded hover:opacity-80 transition-opacity" 
                      alt={item.book.title} 
                      onClick={() => navigate(`/list/${id}/book/${item.bookId}`)}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center text-gray-400 text-sm py-10">
              No items in this playlist.
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center text-gray-400 text-sm py-10">
          Playlist not found.
        </div>
      )}
      
      {/* FloatingMenu는 항상 표시 */}
      <FloatingMenu />
    </div>
    <div className="fixed bottom-28 right-10">
      <HeartShareButton
        isLiked={isLiked}
        onHeartClick={handleLikeToggle} // 하트 로직 연결
        onShareClick={handleShare} // 공유 로직 연결
      />
    </div>
    </>
  ); 
  );
}

export default ListPage;