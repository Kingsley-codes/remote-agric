export default function Hero() {
  return (
    <section className="relative h-[300px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9jj_VsV1MIcQ_jbkQ1jvyKQkCV8E3l4UggLlsoVB_P0qd-yP-cwyY0acoFQKtnKPSkQCiOl0M5evZt0b0hPkHQRxjyI37PWMtzldiKOPbpz3Vts3sN09ByAxshnJPI-BgbfWxZ4dI0DcNBvVoQlj2HTrE7S_TpmEMaZv-VsMzlhUSSq_dpe0AtNb9PtuLpquOkDXDkOtot_LrXb-_Ft9jKlrj6jUgKquQTBhgS4_4qNSiEJ-dVyTYMA9S9cN_m7WP98iQEqTsnf40"
          alt="Farmland"
        />
        <div className="absolute inset-0 bg-primary/40 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background-light via-transparent to-transparent"></div>
      </div>
      <div className="relative z-10 text-center px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-wide drop-shadow-lg">Get in Touch</h2>
        <p className="text-white/90 text-lg max-w-2xl mx-auto font-medium">
          Empowering the remote farmer through direct connection and transparent growth.
        </p>
      </div>
    </section>
  );
}