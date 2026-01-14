import AnimatedBackground from "@/components/AnimatedBackground";

const NotFound = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <AnimatedBackground />
      <div className="grain-overlay" />
      <div
        className="relative z-10 text-center px-6"
        style={{ fontFamily: "'Caveat', cursive" }}
      >
        <h1
          className="mb-4 text-7xl font-bold"
          style={{ color: "#e8dff5" }}
        >
          404
        </h1>
        <p
          className="mb-6 text-2xl"
          style={{ color: "#c9b8e0" }}
        >
          Oops! This page wandered off...
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 text-xl rounded-lg transition-all duration-200 hover:scale-105"
          style={{
            background: "rgba(45, 38, 64, 0.8)",
            border: "2px solid #a78bda",
            color: "#e8dff5",
          }}
        >
           Back to Motivation
        </a>
      </div>
    </div>
  );
};

export default NotFound;
