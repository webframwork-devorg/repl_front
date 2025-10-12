import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("세션 가져오기 실패:", error);
      } else {
        console.log("로그인 성공 세션:", data);
        navigate("/");
      }
    };

    handleSession();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen text-white bg-[#1F1F1F]">
      <p>로그인 중입니다... 잠시만 기다려주세요.</p>
    </div>
  );
}

export default AuthCallback;
