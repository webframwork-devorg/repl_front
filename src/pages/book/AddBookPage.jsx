import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "@/components/commons/inputs/TextInput";
import TextArea from "@/components/commons/inputs/TextArea";
import FileInput from "@/components/commons/inputs/FileInput";
import TagDropdown from "@/components/commons/dropdowns/TagDropdown";
import { getTags } from "@/api/tags/getTags";
import { postPlaylistItem } from "@/api/books/postBook";
import { supabase } from "@/api/supabaseClient";
import SelectPlaylist from "@/components/commons/dropdowns/SelectPlaylist";
import { getMyPlaylists } from "@/api/playlists/getMyPlaylists";

function AddBookPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "", 
    content: "",
    image: null,
    tags: [],
    playlistId: "", // 선택된 플레이리스트 ID를 저장할 상태
  });

  const [tags, setTags] = useState([]);
  const [playlists, setPlaylists] = useState([]); // 사용자의 플레이리스트 목록 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // 태그와 플레이리스트를 동시에 불러옵니다.
        const [tagsData, playlistsData] = await Promise.all([
          getTags(),
          getMyPlaylists(), // 사용자의 플레이리스트를 가져오는 함수
        ]);
        setTags(tagsData || []);
        setPlaylists(playlistsData || []);
      } catch (err) {
        console.error("데이터 불러오기 오류:", err);
        alert("태그 또는 플레이리스트를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleGoBack = () => {
    navigate(`/`);
  };

  const handleFileChange = (data) =>
    setFormData((prev) => ({ ...prev, image: data }));

  const handleTitleChange = (value) =>
    setFormData((prev) => ({ ...prev, title: value }));

  const handleAuthorChange = (value) =>
    setFormData((prev) => ({ ...prev, author: value }));

  const handleContentChange = (value) =>
    setFormData((prev) => ({ ...prev, content: value }));

  const handleTagsChange = (selectedTags) =>
    setFormData((prev) => ({ ...prev, tags: selectedTags }));

  const handlePlaylistChange = (value) => {
    setFormData((prev) => ({ ...prev, playlistId: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.playlistId || !formData.title || !formData.author || !formData.content || !formData.image
    ) {
      alert("플레이리스트 선택, 제목, 저자, 내용, 이미지를 모두 입력해주세요!");
      return;
    }

    if (formData.tags.length === 0) {
      alert("태그를 하나 이상 선택해주세요!");
      return;
    }

    const tagObjects = tags.filter((t) =>
      formData.tags.includes(t.tag_name || t.name || t.tag)
    );
    const tagIds = tagObjects.map((t) => t.tag_id || t.id);

    if (tagIds.length === 0) {
      alert("선택된 태그의 ID를 찾을 수 없습니다!");
      return;
    }

    setIsSubmitting(true);

    try {
      const tempBookId = `bid_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      const result = await postPlaylistItem({
        playlistId: Number(formData.playlistId),
        bookData: {
          book_id: tempBookId, 
          title: formData.title,
          author: formData.author, 
        },
        userReview: {
          rating: 0, 
          comment: formData.content, 
          readDate: new Date(),
        },
        image: formData.image,
        tags: tagIds,
      });

      if (result.success) {
        alert("책 등록 완료!");
        const newItemId = result.data.item_id;
        navigate(`/list/${formData.playlistId}/book/${newItemId}`);
      } else {
        alert("등록 실패: " + (result.error?.message || "알 수 없는 오류"));
      }
    } catch (err) {
      console.error("등록 오류:", err);
      alert("업로드 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-screen bg-black text-white flex flex-col items-center justify-start gap-8 py-10 px-4"
    >
      <div className="w-full max-w-2xl relative flex flex-col gap-6">
        <button
          type="button"
          onClick={handleGoBack}
          className="absolute -top-8 left-0 text-[20px] font-semibold text-white transition-opacity hover:opacity-75"
        >
          ←
        </button>

        <div className="flex flex-col gap-2">
          <SelectPlaylist
          label="플레이리스트 선택"
          placeholder="책을 추가할 플레이리스트를 선택하세요"
          value={formData.playlistId}
          onChange={handlePlaylistChange}
          disabled={loading}
          options={playlists.map((p) => ({
            value: p.id,
            label: p.title,
          }))}
        />
        </div>

        <TextInput
          onChange={handleTitleChange}
          placeholder="책 제목을 입력하세요..."
          label="책 제목"
          maxLength={50}
        />
        
        <TextInput
          onChange={handleAuthorChange}
          placeholder="저자를 입력하세요..."
          label="저자"
          maxLength={30}
        />

        <div className="flex flex-col gap-2">
          <span className="font-bold text-white text-[18px]">태그 선택</span>
          {loading ? (
            <div className="text-gray-500 text-sm py-2">
              태그 불러오는 중...
            </div>
          ) : (
            <TagDropdown tags={tags} onChange={handleTagsChange} />
          )}
        </div>

        <FileInput onChange={handleFileChange} label="썸네일 선택" />
        
        <TextArea
          onChange={handleContentChange}
          label="한줄평 작성하기"
          maxLength={25}
        />
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
            isSubmitting
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-white text-black hover:bg-[#e5e5e5] active:scale-[0.97]"
          }`}
        >
          {isSubmitting ? "등록 중..." : "등록하기"}
        </button>
      </div>
    </form>
  );
}

export default AddBookPage;