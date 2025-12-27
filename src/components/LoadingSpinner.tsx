export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#4B2C5E] to-[#6B4C7E]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-[#FFFDF5] border-t-transparent rounded-full animate-spin"></div>
        <div className="mt-4 text-[#FFFDF5] text-center font-medium">Loading...</div>
      </div>
    </div>
  );
}
