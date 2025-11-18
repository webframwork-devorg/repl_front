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
  const [isLikeLoading, setIsLikeLoading] = useState(false); // 중복 클릭 방지용);

  const sortOptions = [
    { value: "latest", label: "최신순" },
    { value: "likes", label: "인기순" },
    { value: "title", label: "제목순" },
  ];

  const sortedItems = useMemo(() => {
    // 플레이리스트 아이템이 없으면 빈 배열 반환
  if (!playlistItem || !playlistItem.items) {
   return [];
  }
  
  const itemsToSort = [...playlistItem.items];

  if (sort === "latest") {
      // API에서 받아온 createdAt(아이템 추가일)  기준으로 내림차순 정렬
      itemsToSort.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === "likes") {
      // API에서 받아온 likeCount(아이템 좋아요 수)  기준으로 내림차순 정렬
      itemsToSort.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
    } else if (sort === "title") {
      // 책 제목(b_title) [cite: 14] 기준으로 오름차순(가나다순) 정렬
      itemsToSort.sort((a, b) => {
        const titleA = a.book?.title || "";
        const titleB = b.book?.title || "";
        return titleA.localeCompare(titleB);
      });
    }
    // 정렬된 배열 반환
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

    const originalIsLiked = isLiked;  // 롤백을 위해 현재 상태를 백업
    setIsLiked(!originalIsLiked);

    try {
      await togglePlaylistLike(id, originalIsLiked);  
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
      alert("좋아요 처리에 실패했습니다. 다시 시도해주세요.");
      setIsLiked(originalIsLiked); // 상태를 원상 복구
    } finally {
      // 성공/실패 여부와 관계없이 로딩 상태 해제
      setIsLikeLoading(false);
    }
  };

  const handleShare = () => {
    // 웹 표준 공유 API 사용
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
      // 공유 API 미지원 시 클립보드 복사
      navigator.clipboard.writeText(window.location.href);
      alert("링크가 클립보드에 복사되었습니다.");
    }
  };

  const handleGoBack = () => {
    // ListPage로 이동
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
          {/* 썸네일 카드 */}
            <ThumbnailCard 
              image={playlistItem.image} 
              title={playlistItem.title} 
            />
          </div>
          <div className="px-[15px] py-[5px] flex flex-col gap-3">  
          {/* 태그 표시 */}
          <p className="font-bold text-[15px] px-1 text-[#828282]">
            {Array.isArray(playlistItem.tags) 
              ? playlistItem.tags.map(tag => `#${tag.name}`).join(' ') 
              : ''}
          </p>
          
          {/* QuoteBox */}
          <QuoteBox class
            text={playlistItem.description} />

          <div className="flex justify-between items-center px-1">
            <HeartShareButton
              isLiked={isLiked}
              onHeartClick={handleLikeToggle} // 하트 로직 연결
              onShareClick={handleShare} // 공유 로직 연결
            />
            <div className="flex items-center gap-4">
              <SortDropdown
                key={sort}
                options={sortOptions}
                initialValue={sort}
                onChange={setSort}
              />
              {/* 책 개수 표시 */}
              <span className="text-sm font-bold text-[15px] text-[#828282]">
                책: {playlistItem.items?.length || 0}개
              </span>
            </div>
          </div>
          
          {/* 플레이리스트에 포함된 책 목록 */}
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