import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getPlaylistById, togglePlaylistLike } from '@/api/playlists/getPlaylistById';
import SortDropdown from "@/components/commons/dropdowns/SortDropdown";
import FloatingMenu from "@/components/commons/floating/FloatingMenu";
import ThumbnailCard from "@/components/commons/card/ThumbnailCard";
import HeartShareButton from "@/components/commons/buttons/HeartShareButton";
import QuoteBox from "@/components/commons/textBox/QuoteBox";

function ListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [playlistItem, setPlaylistItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("latest"); 

  const [isLiked, setIsLiked] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false); 

  const sortOptions = [
    { value: "latest", label: "최신순" },
    { value: "likes", label: "인기순" },
    { value: "title", label: "제목순" },
  ];

  const sortedItems = useMemo(() => {
  if (!playlistItem || !playlistItem.items) {
   return [];
  }
  
  const itemsToSort = [...playlistItem.items];

  if (sort === "latest") {
      itemsToSort.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === "likes") {
      itemsToSort.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
    } else if (sort === "title") {
      itemsToSort.sort((a, b) => {
        const titleA = a.book?.title || "";
        const titleB = b.book?.title || "";
        return titleA.localeCompare(titleB);
      });
    }

  return itemsToSort;
 }, [playlistItem, sort]);

  useEffect(() => {
    async function fetchPlaylist() {
      setLoading(true); 
      try {
        const playlistData = await getPlaylistById(id);

        if (playlistData) {
        setPlaylistItem(playlistData);
        setIsLiked(playlistData.isLikedByUser || false);
        } else {
          setPlaylistItem(null);
        }
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

  const baseStyle = "bg-black min-h-screen";

  const handleLikeToggle = async () => {
    if (isLikeLoading) return;
    setIsLikeLoading(true);

    const originalIsLiked = isLiked;  
    setIsLiked(!originalIsLiked);

    try {
      await togglePlaylistLike(id, originalIsLiked);  
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
      alert("좋아요 처리에 실패했습니다. 다시 시도해주세요.");
      setIsLiked(originalIsLiked); 
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleShare = () => {
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
      navigator.clipboard.writeText(window.location.href);
      alert("링크가 클립보드에 복사되었습니다.");
    }
  };

  const handleGoBack = () => {
    navigate(`/`);
  };

  return (
    <div className={baseStyle}>
      {loading ? (
        <div className="flex justify-center items-center text-gray-400 text-sm py-10">
          Loading...
        </div>
      ) : playlistItem ? (
        <div className="flex flex-col gap-3">
          <div className = "relative">
          <button onClick={handleGoBack}
          className="absolute px-4 py-2 z-20 text-[20px] font-semibold text-white transition-opacity hover:opacity-75">
            ←
          </button>
            <ThumbnailCard 
              image={playlistItem.image} 
              title={playlistItem.title} 
            />
          </div>
          <div className="px-[15px] py-[5px] flex flex-col gap-2">  
          <p className="font-bold text-[15px] px-1 text-[#828282]">
            {Array.isArray(playlistItem.tags) 
              ? playlistItem.tags.map(tag => `#${tag.name}`).join(' ') 
              : ''}
          </p>
          
          <QuoteBox class
            text={playlistItem.description} />

          <div className="flex justify-between items-center px-1">
            <HeartShareButton
              isLiked={isLiked}
              onHeartClick={handleLikeToggle} 
              onShareClick={handleShare}
            />
            <div className="flex items-center gap-4">
              <SortDropdown
                key={sort}
                options={sortOptions}
                initialValue={sort}
                onChange={setSort}
              />
              
              <span className="text-sm font-bold text-[15px] text-[#828282]">
                책: {playlistItem.items?.length || 0}개
              </span>
            </div>
          </div>
          
          {sortedItems.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
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
        </div>
      ) : (
        <div className="flex justify-center items-center text-gray-400 text-sm py-10">
          Playlist not found.
        </div>
      )}
      <FloatingMenu />
      <FloatingMenu />
    </div>
  ); 
}
export default ListPage;