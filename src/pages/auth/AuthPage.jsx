import { supabase } from "@/lib/supabaseClient";
import BasicButton from "@/components/commons/buttons/BasicButton";

function AuthPage() {
  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "kakao",
        options: {
          redirectTo: "http://localhost:5173/auth/callback",
        },
      });

      if (error) {
        console.error("카카오 로그인 실패", error);
        alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      } else {
        console.log("카카오 로그인 시도", data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-end min-h-screen bg-[#1F1F1F] text-white px-[35px] py-[75px]">
      <section className="flex flex-col gap-[300px] justify-end w-full">
        <h1 className="flex justify-center w-full text-[64px] font-bold">
          re:pl
        </h1>
        <div className="w-full h-[50px]">
          <BasicButton
            children="카카오 로그인하기"
            variant="white"
            onClick={handleLogin}
          />
        </div>
      </section>
    </div>
  );
}

export default AuthPage;
