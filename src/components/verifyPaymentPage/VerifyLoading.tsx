export default function CheckoutLoading() {
  return (
    <div className="flex items-center min-h-screen justify-center py-20">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 md:w-12 md:h-12 rounded-full border-b-2 border-primary animate-spin" />
        <p className="text-sm text-gray-500">Loading payment verification…</p>
      </div>
    </div>
  );
}
