import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        return;
      }

      if (!session) {
        setTimeout(handleSession, 500);
        return;
      }

      const user = session.user;
      const metadata = user.user_metadata;

      const profile_image =
        metadata?.picture ||
        metadata?.avatar_url ||
        metadata?.thumbnail_image_url ||
        null;

      const { error: upsertError } = await supabase.from("users").upsert({
        user_id: user.id,
        email: user.email,
        profile_nickname: metadata?.name || metadata?.nickname || "사용자",
        profile_image_url: profile_image,
        created_at: new Date().toISOString(),
      });

      if (upsertError) {
        console.error("유저 정보 저장 실패:", upsertError);
      } else {
        navigate("/");
      }
    };

    handleSession();
  }, [navigate]);

  return (
    <div className="flex font-bold items-center justify-center min-h-screen text-white bg-black">
      <p>로그인 중입니다... 잠시만 기다려주세요.</p>
    </div>
  );
}

export default AuthCallback;
