import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error("getUser error:", error);
          setUser(null);
        } else {
          if (isMounted) setUser(data.user ?? null);
        }
      } catch (err) {
        console.error("unexpected getUser error:", err);
        setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setUser(session.user);
      else setUser(null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111827] text-white">
        <div>로딩 중입니다… 잠시만 기다려 주세요.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      <div className="max-w-3xl mx-auto bg-[#111827] rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4">re:pl입니다</h1>

        {!user ? (
          <div className="space-y-4">
            <p className="text-gray-300">
              로그인되어 있지 않습니다. <br />
              카카오 로그인을 통해 계속하세요.
            </p>
            <button
              onClick={() => navigate("/auth")} 
              className="px-4 py-2 bg-yellow-400 text-black rounded-md font-medium"
            >
              카카오로 로그인
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img
                src={
                  user.user_metadata?.avatar_url ||
                  user.user_metadata?.avatar ||
                  user.user_metadata?.picture ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.user_metadata?.full_name ||
                      user.user_metadata?.nickname ||
                      user.email ||
                      "User"
                  )}&background=111827&color=fff`
                }
                alt="avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-700"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://ui-avatars.com/api/?name=User&background=111827&color=fff";
                }}
              />

              <div>
                <div className="text-xl font-semibold">
                  {user.user_metadata?.full_name ||
                    user.user_metadata?.nickname ||
                    user.email ||
                    "Anonymous"}
                </div>
                <div className="text-sm text-gray-400">
                  {user.email ?? "이메일 없음"}
                </div>
                <div className="text-xs text-gray-500 mt-1">id: {user.id}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#0b1220] p-4 rounded-md">
                <div className="text-sm text-gray-400">Provider</div>
                <div className="font-medium">
                  {user.app_metadata?.provider || "unknown"}
                </div>
              </div>

              <div className="bg-[#0b1220] p-4 rounded-md">
                <div className="text-sm text-gray-400">회원가입일</div>
                <div className="font-medium">
                  {new Date(user.created_at).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 rounded-md text-white font-medium"
              >
                로그아웃
              </button>

              <button
                onClick={() => {
                  const token = localStorage.getItem("supabase.auth.token");
                  console.log("local supabase token:", token);
                  alert(token ? "토큰이 콘솔에 출력됩니다." : "토큰 없음");
                }}
                className="px-4 py-2 bg-gray-700 rounded-md text-gray-200"
              >
                토큰 디버그
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
