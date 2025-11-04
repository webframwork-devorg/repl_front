import { useState, useEffect } from "react";
import TextInput from "@/components/commons/inputs/TextInput";
import Area from "@/components/commons/inputsArea";
import FileInput from "@/components/commons/inputs/FileInput";
import TagDropdown from "@/components/commons/dropdowns/TagDropdown";
import { getTags } from "@/api/tags/getTags";
import { postPlayList } from "@/api/playlist/postPlaylist";
import { supabase } from "@/api/supabaseClient";
import { useNavigate } from "react-router-dom";

function EditListPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
    tags: [],
  });

  const [tags, setTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTags() {
      setLoading(true);
      try {
        const data = await getTags();
        setTags(data || []);
        console.log("불러온 태그:", data);
      } catch (err) {
        console.error("태그 불러오기 오류:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTags();
  }, []);

  const handleFileChange = (data) =>
    setFormData((prev) => ({ ...prev, image: data }));

  const handleTitleChange = (value) =>
    setFormData((prev) => ({ ...prev, title: value }));

  const handleContentChange = (value) =>
    setFormData((prev) => ({ ...prev, content: value }));

  const handleTagsChange = (selectedTags) =>
    setFormData((prev) => ({ ...prev, tags: selectedTags }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.image) {
      alert("제목, 내용, 이미지를 모두 입력해주세요!");
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

    console.log("선택된 태그:", formData.tags);
    console.log("불러온 태그 목록:", tags);
    console.log("변환된 tagIds:", tagIds);

    if (tagIds.length === 0) {
      alert("선택된 태그의 ID를 찾을 수 없습니다!");
      return;
    }

    setIsSubmitting(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("로그인된 사용자를 찾을 수 없습니다.");

      const result = await postPlayList({
        user,
        title: formData.title,
        summary: formData.content,
        image: formData.image,
        tags: tagIds, 
      });

      if (result.success) {
        alert("플레이리스트 등록 완료!");
        navigate("/");
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
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <TextInput
          onChange={handleTitleChange}
          placeholder="제목을 입력하세요..."
          label="플레이리스트 제목"
          maxLength={50}
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

export default EditListPage;
