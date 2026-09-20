import BouquetGrowth from "./scenes/BouquetGrowth.jsx";

export default function App() {
  return (
    <>
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <h1 className="hero-title">Hola Cami</h1>
        <div className="scroll-hint">
          <span>scrolleá</span>
          <span className="scroll-arrow">⌄</span>
        </div>
      </section>

      <BouquetGrowth />
    </>
  );
}
