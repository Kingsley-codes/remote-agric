import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-75 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          className="w-full h-full object-cover"
          src="/contact.jpg"
          fill
          sizes="100vw"
          priority
          alt="Farmland"
        />
        <div className="absolute inset-0 bg-primary/40 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-linear-to-t from-background-light via-transparent to-transparent"></div>
      </div>
      <div className="relative z-10 text-center px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-wide drop-shadow-lg">
          Get in Touch
        </h2>
        <p className="text-white/90 text-lg max-w-2xl mx-auto font-medium">
          Empowering the remote farmer through direct connection and transparent
          growth.
        </p>
      </div>
    </section>
  );
}
