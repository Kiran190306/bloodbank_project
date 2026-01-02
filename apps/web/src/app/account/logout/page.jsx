import { useEffect } from "react";
import useAuth from "@/utils/useAuth";
import { Droplet } from "lucide-react";

export default function LogoutPage() {
  const { signOut } = useAuth();

  useEffect(() => {
    const handleSignOut = async () => {
      await signOut({
        callbackUrl: "/",
        redirect: true,
      });
    };
    handleSignOut();
  }, [signOut]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-red-50 to-white p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-gray-100 text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-red-600 p-3 rounded-full">
            <Droplet className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="mb-4 text-2xl font-bold text-gray-800">
          Signing out...
        </h1>
        <p className="text-gray-600">Please wait while we sign you out.</p>
      </div>
    </div>
  );
}
