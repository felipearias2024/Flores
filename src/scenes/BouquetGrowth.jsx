import { useEffect, useRef, useState } from "react";
import { clamp01, mapRange, lerp, easeOutCubic, easeOutBack, lerpColor } from "./animUtils";
import { FlowerVariant } from "./flowerVariants";

function getGroundY(x) {
  const t = x / 320;
  return Math.pow(1 - t, 2) * 580 + 2 * (1 - t) * t * 545 + Math.pow(t, 2) * 580;
}

const STEMS = [
  { x: 80, topY: 200, variant: "eucalyptus", sway: 30 },
  { x: 160, topY: 120, variant: "eucalyptus", sway: 5 },
  { x: 240, topY: 200, variant: "eucalyptus", sway: -35 },
  { x: 130, topY: 150, variant: "daisy", sway: -10 },
  { x: 190, topY: 160, variant: "daisy", sway: 15 },
  { x: 105, topY: 190, variant: "tulip", sway: -15 },
  { x: 215, topY: 180, variant: "tulip", sway: 20 },
  { x: 170, topY: 210, variant: "rose", sway: 10 },
  { x: 140, topY: 250, variant: "rose", sway: -5 },
  { x: 115, topY: 240, variant: "carnation", sway: 5 },
  { x: 205, topY: 230, variant: "carnation", sway: -20 },
].map(s => {
  const baseY = getGroundY(s.x);
  return {
    ...s,
    baseY,
    len: Math.abs(baseY - s.topY) * 1.1 + Math.abs(s.sway)
  };
});

export default function BouquetGrowth() {
  const [theme, setTheme] = useState("yellow"); 
  
  const wrapperRef = useRef(null);
  const R = useRef({}).current;
  const stemRefs = useRef([]).current;
  const budRefs = useRef([]).current;
  const flowerRefs = useRef([]).current;
  const leafRefs = useRef([]).current;
  const dropRefs = useRef([]).current;
  const seedRefs = useRef([]).current;
  const bumpRefs = useRef([]).current;

  const ribbonCol = theme === "baccara" 
    ? { base: "#5E0A0A", shadow: "#3A0202", main: "#7A0A0A", dark: "#4A0404", dot: "#A31212" }
    : { base: "#E6B435", shadow: "#C99723", main: "#F4C01E", dark: "#DFA810", dot: "#F9C82A" };

  useEffect(() => {
    function applyFrame(progress) {
      const baseP = mapRange(progress, 0, 0.70);
      const vaseP = easeOutCubic(mapRange(progress, 0.80, 1));

      STEMS.forEach((s, i) => {
        const stagger = i * 0.015;
        const seedT = easeOutCubic(mapRange(baseP, 0.0 + stagger, 0.10 + stagger));
        const buryT = mapRange(baseP, 0.12 + stagger, 0.18 + stagger);
        
        if (seedRefs[i]) {
          seedRefs[i].setAttribute("cy", String(lerp(-800, s.baseY, seedT)));
          seedRefs[i].style.opacity = String(clamp01(1 - buryT));
        }
        if (bumpRefs[i]) {
          bumpRefs[i].setAttribute("rx", String(lerp(0, 14, buryT)));
          bumpRefs[i].setAttribute("ry", String(lerp(0, 6, buryT)));
        }
      });

      const waterT = mapRange(baseP, 0.20, 0.40);
      const elementsFadeOut = mapRange(baseP, 0.80, 0.88);
      
      let picoGlobalX, picoGlobalY;

      if (R.can) {
        const enterT = easeOutCubic(mapRange(baseP, 0.2, 0.25));
        const leaveT = easeOutCubic(mapRange(baseP, 0.35, 0.40));
        
        const tx = lerp(400, 60, enterT) + lerp(0, 340, leaveT);
        const ty = lerp(-100, 50, enterT) - lerp(0, 150, leaveT);
        const rot = lerp(0, 65, mapRange(baseP, 0.23, 0.28)) - lerp(0, 65, mapRange(baseP, 0.32, 0.37));
        
        const scale = 1.4;
        const picoLocal = { x: 80, y: -25 }; 
        const rotRad = (rot * Math.PI) / 180;
        picoGlobalX = tx + scale * (picoLocal.x * Math.cos(rotRad) - picoLocal.y * Math.sin(rotRad));
        picoGlobalY = ty + scale * (picoLocal.x * Math.sin(rotRad) + picoLocal.y * Math.cos(rotRad));

        R.can.setAttribute("transform", `translate(${tx}, ${ty}) scale(${scale}) rotate(${rot})`);
        
        const canFadeOut = mapRange(baseP, 0.42, 0.45);
        R.can.style.opacity = String(clamp01(1 - canFadeOut));
      }
      
      dropRefs.forEach((drop, i) => {
        if (!drop) return;
        const col = i % 3;
        const row = Math.floor(i / 3);
        const stagger = col * 0.015 + row * 0.025;
        const dStart = 0.24 + stagger;
        const dEnd = dStart + 0.08;
        const t = mapRange(baseP, dStart, dEnd);
        
        if (t <= 0 || t >= 1 || !picoGlobalY) {
          drop.style.opacity = "0";
        } else {
          const dropX = picoGlobalX + (col - 1) * 9; 
          const dropY = lerp(picoGlobalY, getGroundY(dropX), t);
          drop.setAttribute("transform", `translate(${dropX}, ${dropY}) scale(${1 - t * 0.5})`);
          drop.style.opacity = String(clamp01(1 - mapRange(t, 0.7, 1)));
        }
      });
      
      if (R.groundGroup) {
        const wetColor = lerpColor("#D4B48F", "#825A36", waterT);
        if (R.ground) R.ground.setAttribute("fill", wetColor);
        if (R.wetPatch) R.wetPatch.style.opacity = String(clamp01(waterT * 0.8));
        R.groundGroup.style.opacity = String(clamp01(1 - elementsFadeOut));
      }

      const paperT = easeOutBack(mapRange(baseP, 0.78, 0.88));
      const pinchT = easeOutCubic(mapRange(baseP, 0.88, 0.95));
      
      STEMS.forEach((s, i) => {
        const stagger = i * 0.025;
        const growT = easeOutCubic(mapRange(baseP, 0.40 + stagger, 0.65 + stagger));
        const bloomT = easeOutBack(mapRange(baseP, 0.60 + stagger, 0.78 + stagger));
        const isGrowing = baseP > (0.40 + stagger);

        const gatherX = lerp(s.x, 160 + (s.x - 160) * 0.25, paperT);
        const gatherY = lerp(s.baseY, 570, paperT); 
        const normalCtrlX = gatherX + lerp(s.sway, s.sway * 0.4, paperT);
        const normalCtrlY = (gatherY + s.topY) / 2;
        const waistX = 160 + (s.x - 160) * 0.1;
        const waistY = 480;
        const ctrlX = lerp(normalCtrlX, waistX, pinchT);
        const ctrlY = lerp(normalCtrlY, waistY, pinchT);

        const finalGatherX = lerp(gatherX, 160 + (s.x - 160) * 0.12, vaseP);
        const finalGatherY = lerp(gatherY, 605, vaseP);
        const finalCtrlX = lerp(ctrlX, 160 + (s.x - 160) * 0.12, vaseP);
        const finalCtrlY = lerp(ctrlY, 480, vaseP);

        if (stemRefs[i]) {
          const pathD = `M ${finalGatherX},${finalGatherY} Q ${finalCtrlX},${finalCtrlY} ${s.x},${s.topY}`;
          stemRefs[i].setAttribute("d", pathD);
          stemRefs[i].setAttribute("stroke-dashoffset", String(s.len * (1 - growT)));
          stemRefs[i].style.opacity = isGrowing ? "1" : "0";
        }
        
        if (leafRefs[i]) {
          if (!isGrowing) {
            leafRefs[i].style.opacity = "0";
          } else {
            const curveT = 0.8; 
            const invT = 1 - curveT;
            const leafX = invT * invT * finalGatherX + 2 * invT * curveT * finalCtrlX + curveT * curveT * s.x;
            const leafY = invT * invT * finalGatherY + 2 * invT * curveT * finalCtrlY + curveT * curveT * s.topY;
            
            leafRefs[i].setAttribute("transform", `translate(${leafX}, ${leafY}) scale(${growT})`);
            leafRefs[i].style.opacity = String(growT);
          }
        }

        if (flowerRefs[i]) {
          if (bloomT <= 0) {
            flowerRefs[i].style.opacity = "0";
          } else {
            flowerRefs[i].setAttribute("transform", `translate(${s.x}, ${s.topY}) scale(${bloomT}) rotate(${s.sway * (1 - bloomT)})`);
            flowerRefs[i].style.opacity = String(clamp01(Math.min(1, bloomT * 2)));
          }
        }
        
        if (budRefs[i]) {
          if (!isGrowing) {
            budRefs[i].style.opacity = "0";
          } else {
            const budIn = mapRange(growT, 0.6, 1);
            budRefs[i].style.opacity = String(clamp01(budIn * (1 - mapRange(bloomT, 0, 0.5))));
          }
        }
      });

      const paperFadeOut = mapRange(vaseP, 0, 0.2);
      const paperBaseOpacity = clamp01(mapRange(baseP, 0.78, 0.83));
      const currentPaperOp = String(clamp01(paperBaseOpacity - paperFadeOut));

      const paperY = lerp(150, 0, paperT);
      const bL = lerp(120, 140, pinchT); const bR = lerp(200, 180, pinchT); 
      const cL1 = lerp(90, 135, pinchT); const cR1 = lerp(230, 185, pinchT);
      const cL2 = lerp(70, 125, pinchT); const cR2 = lerp(250, 195, pinchT);
      const topL = lerp(50, 75, pinchT); const topR = lerp(270, 245, pinchT);
      
      if (R.paperFront) {
        R.paperFront.setAttribute("transform", `translate(0, ${paperY}) scale(${lerp(0.8, 1, paperT)})`);
        R.paperFront.style.transformOrigin = "160px 560px";
        R.paperFront.style.opacity = currentPaperOp;
        if (R.paperFrontPath) R.paperFrontPath.setAttribute("d", `M ${bL},600 C ${cL1},520 ${cL2},420 ${topL},340 C 130,420 190,420 ${topR},340 C ${cR2},420 ${cR1},520 ${bR},600 Z`);
        if (R.paperFold1) R.paperFold1.setAttribute("d", `M 160,480 C ${lerp(120, 135, pinchT)},440 ${lerp(90, 115, pinchT)},380 ${lerp(70, 95, pinchT)},360 C 160,400 160,480 160,480 Z`);
        if (R.paperFold2) R.paperFold2.setAttribute("d", `M 160,480 C ${lerp(200, 185, pinchT)},440 ${lerp(230, 205, pinchT)},380 ${lerp(250, 225, pinchT)},360 C 160,400 160,480 160,480 Z`);
      }

      if (R.paperBack) {
        R.paperBack.setAttribute("transform", `translate(0, ${paperY}) scale(${lerp(0.8, 1, paperT)})`);
        R.paperBack.style.transformOrigin = "160px 560px";
        R.paperBack.style.opacity = currentPaperOp;
        if (R.paperBackPath) {
          const pbTopL = lerp(30, 45, pinchT); const pbTopR = lerp(290, 275, pinchT);
          R.paperBackPath.setAttribute("d", `M ${bL},600 C ${cL1},520 ${cL2},420 ${topL},340 L ${pbTopL},220 L 160,170 L ${pbTopR},220 L ${topR},340 C ${cR2},420 ${cR1},520 ${bR},600 Z`);
        }
      }

      if (R.ribbon) {
        R.ribbon.setAttribute("transform", `translate(160, 480) scale(${paperT}) translate(-160, -480)`);
        R.ribbon.style.opacity = currentPaperOp;
      }

      const vaseOp = String(mapRange(vaseP, 0.2, 0.6));
      if (R.vaseBack) R.vaseBack.style.opacity = vaseOp;
      if (R.vaseFront) R.vaseFront.style.opacity = vaseOp;

      const camT = easeOutCubic(mapRange(baseP, 0.88, 0.95));
      if (R.scene) {
        const yShift = lerp(0, 60, camT) - lerp(0, 60, vaseP);
        R.scene.setAttribute("transform", `translate(160, 320) scale(${lerp(1, 0.75, camT)}) translate(-160, -320) translate(0, ${yShift})`);
      }
      
      if (R.warmOverlay) {
        R.warmOverlay.style.opacity = String(clamp01(camT * 0.4));
      }

      const uiFadeOut = mapRange(vaseP, 0, 0.2);
      
      if (R.finalText) {
        const textT = easeOutCubic(mapRange(baseP, 0.92, 1));
        const textOp = clamp01(textT - uiFadeOut);
        R.finalText.style.opacity = String(textOp);
        R.finalText.style.transform = `translate(-50%, ${lerp(20, 0, textT)}px)`;
        
        if (R.selector) {
          R.selector.style.opacity = String(textOp);
          R.selector.style.transform = `translate(-50%, ${lerp(20, 0, textT)}px)`;
          R.selector.style.pointerEvents = (textT > 0.95 && uiFadeOut === 0) ? "auto" : "none";
        }
        
        if (R.scrollHint) {
          R.scrollHint.style.opacity = String(textOp);
          R.scrollHint.style.transform = `translate(-50%, ${lerp(20, 0, textT)}px)`;
        }
      }

      if (R.downloadBtn) {
        const btnIn = easeOutCubic(mapRange(vaseP, 0.6, 1));
        R.downloadBtn.style.opacity = String(btnIn);
        R.downloadBtn.style.transform = `translate(-50%, ${lerp(20, 0, btnIn)}px)`;
        R.downloadBtn.style.pointerEvents = btnIn > 0.95 ? "auto" : "none";
      }

      if (R.vaseText) {
        const textIn = easeOutCubic(mapRange(vaseP, 0.6, 1));
        R.vaseText.style.opacity = String(textIn);
        R.vaseText.style.transform = `translate(-50%, ${lerp(20, 0, textIn)}px)`;
      }
    }

    let frame = null;
    function update() {
      frame = null;
      const el = wrapperRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const rect = el.getBoundingClientRect();
      const progress = total > 0 ? clamp01(-rect.top / total) : 0;
      applyFrame(progress);
    }
    function onScroll() {
      if (frame == null) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [R, stemRefs, budRefs, flowerRefs, leafRefs, dropRefs, seedRefs, bumpRefs, theme]);

  const downloadImage = () => {
    const svg = document.querySelector('.bouquet-svg');
    if (!svg) return;

    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);

    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
    
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 2160;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = "#F5EBE0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const grad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height * 0.7, 0,
        canvas.width / 2, canvas.height * 0.7, canvas.height * 0.6
      );
      grad.addColorStop(0, "rgba(255, 184, 119, 0.4)");
      grad.addColorStop(1, "rgba(255, 184, 119, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const a = document.createElement("a");
      a.download = theme === "baccara" ? "mis-baccaras.png" : "mis-flores.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = url;
  };

  return (
    <div ref={wrapperRef} className="bouquet-wrapper" style={{ height: "800vh" }}>
      <div className="bouquet-sticky">
        
        <div ref={(el) => (R.warmOverlay = el)} className="bouquet-warm-overlay" style={{ zIndex: 0 }} />

        <svg className="bouquet-svg" viewBox="0 0 320 640" preserveAspectRatio="xMidYMax meet" style={{ overflow: "visible", position: "relative", zIndex: 1 }}>
          <defs>
            <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
            </filter>
            
            <radialGradient id="rose-dark" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ECA214"/>
              <stop offset="100%" stopColor="#D98A00"/>
            </radialGradient>
            <radialGradient id="rose-mid" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFC82A"/>
              <stop offset="100%" stopColor="#ECA214"/>
            </radialGradient>
            <radialGradient id="rose-light" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFE159"/>
              <stop offset="100%" stopColor="#FFCA28"/>
            </radialGradient>

            <radialGradient id="baccara-dark" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2A0202"/>
              <stop offset="100%" stopColor="#0A0000"/>
            </radialGradient>
            <radialGradient id="baccara-mid" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#5C0808"/>
              <stop offset="100%" stopColor="#1A0000"/>
            </radialGradient>
            <radialGradient id="baccara-light" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#8C0F0F"/>
              <stop offset="100%" stopColor="#3D0303"/>
            </radialGradient>
            <radialGradient id="baccara-core" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#C21A1A"/>
              <stop offset="100%" stopColor="#4A0404"/>
            </radialGradient>

            <linearGradient id="paper-translucent" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255, 252, 242, 0.95)" />
              <stop offset="50%" stopColor="rgba(240, 230, 200, 0.75)" />
              <stop offset="100%" stopColor="rgba(230, 215, 175, 0.85)" />
            </linearGradient>
            <linearGradient id="paper-back-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E8D9C0" />
              <stop offset="100%" stopColor="#D1BE9C" />
            </linearGradient>
            <linearGradient id="copper" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9C4A11" />
              <stop offset="25%" stopColor="#D97A35" />
              <stop offset="50%" stopColor="#F5B47D" />
              <stop offset="75%" stopColor="#D97A35" />
              <stop offset="100%" stopColor="#75350A" />
            </linearGradient>
            <linearGradient id="water" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(190, 235, 255, 0.9)" />
              <stop offset="100%" stopColor="rgba(100, 190, 240, 0.4)" />
            </linearGradient>
          </defs>

          <g ref={(el) => (R.scene = el)}>
            <g ref={(el) => (R.groundGroup = el)}>
              <path ref={(el) => (R.ground = el)} d="M-2000,580 L0,580 Q160,545 320,580 L2320,580 L2320,640 L-2000,640 Z" fill="#D4B48F" />
              <ellipse ref={(el) => (R.wetPatch = el)} cx="160" cy="580" rx="140" ry="18" fill="#4A3420" opacity="0" />
              {STEMS.map((s, i) => (
                <ellipse key={`bump-${i}`} ref={(el) => (bumpRefs[i] = el)} cx={s.x} cy={s.baseY - 2} rx="0" ry="0" fill="#A8815B" />
              ))}
              {STEMS.map((s, i) => (
                <circle key={`seed-${i}`} ref={(el) => (seedRefs[i] = el)} cx={s.x} cy="-800" r="4.5" fill="#5B3A1C" />
              ))}
            </g>

            <g ref={(el) => (R.can = el)} transform="translate(400, -100)">
              <path d="M -15,-10 C -50,-30 -40,40 -15,30" stroke="url(#copper)" strokeWidth="6" fill="none" strokeLinecap="round" />
              <path d="M -25,-20 L 25,-20 Q 30,10 25,40 L -25,40 Q -30,10 -25,-20 Z" fill="url(#copper)" />
              <ellipse cx="0" cy="-20" rx="25" ry="6" fill="#75350A" stroke="#F5B47D" strokeWidth="1.5" />
              <ellipse cx="0" cy="40" rx="25" ry="6" fill="url(#copper)" />
              <path d="M -15,-20 C -15,-50 15,-50 15,-20" stroke="url(#copper)" strokeWidth="5" fill="none" />
              <path d="M 20,25 C 50,25 70,-10 80,-25" stroke="url(#copper)" strokeWidth="10" fill="none" strokeLinecap="round" />
              <ellipse cx="80" cy="-25" rx="6" ry="14" fill="#F5B47D" transform="rotate(30 80 -25)" />
              {(() => {
                const cxHole = 80; const cyHole = -25;
                const rotateHole = 30;
                const rotateRadHole = (rotateHole * Math.PI) / 180;
                const holes = [];
                const addRing = (rx, ry, count, offsetAngle = 0) => {
                  for (let i = 0; i < count; i++) {
                    const angle = (i * 2 * Math.PI) / count + offsetAngle;
                    const localX = rx * Math.cos(angle);
                    const localY = ry * Math.sin(angle);
                    const rotatedX = localX * Math.cos(rotateRadHole) - localY * Math.sin(rotateRadHole);
                    const rotatedY = localX * Math.sin(rotateRadHole) + localY * Math.cos(rotateRadHole);
                    holes.push({ x: cxHole + rotatedX, y: cyHole + rotatedY });
                  }
                };
                holes.push({ x: cxHole, y: cyHole });
                addRing(2, 5, 4);
                addRing(4.5, 11, 8, Math.PI / 8);
                return holes.map((hole, j) => (
                  <circle key={`hole-${j}`} cx={hole.x} cy={hole.y} r="0.8" fill="#4A1E03" />
                ));
              })()}
            </g>

            {Array.from({ length: 18 }).map((_, i) => (
              <path key={`drop-${i}`} ref={(el) => (dropRefs[i] = el)} d="M0,0 C2,4 3,7 2,10 C0,12 -2,12 -2,10 C-3,7 -2,4 0,0 Z" fill="url(#water)" opacity="0" />
            ))}

            <g ref={(el) => (R.vaseBack = el)} opacity="0">
              <path d="M 125,450 C 125,580 135,620 160,620 C 185,620 195,580 195,450 Z" fill="rgba(255, 255, 255, 0.1)" />
              <ellipse cx="160" cy="480" rx="33" ry="5" fill="rgba(150, 200, 255, 0.2)" />
            </g>

            <g ref={(el) => (R.paperBack = el)} opacity="0">
              <path ref={(el) => (R.paperBackPath = el)} d="" fill="url(#paper-back-grad)" opacity="0.9" />
            </g>

            {STEMS.map((s, i) => {
              let actualVariant = s.variant;
              if (theme === "baccara" && s.variant !== "eucalyptus") {
                const baccaras = ["baccara1", "baccara2", "baccara3", "baccara4"];
                actualVariant = baccaras[i % 4];
              }

              return (
                <g key={`stem-${i}`}>
                  <path
                    ref={(el) => (stemRefs[i] = el)}
                    d="" stroke="#638C65" strokeWidth="5" fill="none" strokeLinecap="round" 
                    strokeDasharray={s.len} strokeDashoffset={s.len} opacity="0"
                  />
                  <g ref={(el) => (leafRefs[i] = el)} opacity="0">
                    <ellipse cx="-12" cy="0" rx="12" ry="6" fill="#719C74" transform="rotate(-30 -12 0)" />
                    <ellipse cx="12" cy="8" rx="10" ry="5" fill="#587A5A" transform="rotate(25 12 8)" />
                  </g>
                  <ellipse ref={(el) => (budRefs[i] = el)} cx={s.x} cy={s.topY + 6} rx="6" ry="10" fill="#85A687" opacity="0" />
                  <g ref={(el) => (flowerRefs[i] = el)} opacity="0">
                    <FlowerVariant variant={actualVariant} />
                  </g>
                </g>
              );
            })}

            <g ref={(el) => (R.vaseFront = el)} opacity="0">
              <path d="M 127,480 C 127,580 137,616 160,616 C 183,616 193,580 193,480 Z" fill="rgba(150, 200, 255, 0.25)" />
              <path d="M 125,450 C 125,580 135,620 160,620 C 185,620 195,580 195,450 Z" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2" fill="none" />
              <path d="M 135,470 C 135,570 142,610 150,610" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="3" strokeLinecap="round" fill="none" />
            </g>

            <g ref={(el) => (R.paperFront = el)} opacity="0">
              <path ref={(el) => (R.paperFrontPath = el)} d="" fill="url(#paper-translucent)" filter="url(#drop-shadow)" />
              <path ref={(el) => (R.paperFold1 = el)} d="" fill="rgba(255, 255, 255, 0.4)" />
              <path ref={(el) => (R.paperFold2 = el)} d="" fill="rgba(255, 255, 255, 0.2)" />
            </g>

            <g ref={(el) => (R.ribbon = el)} opacity="0" filter="url(#drop-shadow)">
              <path d="M 160,485 Q 140,550 135,580 Q 150,560 160,490" fill={ribbonCol.base} />
              <path d="M 160,485 Q 180,560 190,590 Q 170,550 160,490" fill={ribbonCol.shadow} />
              <path d="M 160,480 C 120,450 120,490 160,485 Z" fill={ribbonCol.main} />
              <path d="M 160,480 C 200,460 190,500 160,485 Z" fill={ribbonCol.dark} />
              <circle cx="160" cy="482" r="6" fill={ribbonCol.dot} />
            </g>
          </g>
        </svg>

        <div 
          ref={(el) => (R.finalText = el)}
          style={{
            position: "absolute",
            top: "8%",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#6B4A2B",
            fontFamily: "system-ui, -apple-system, sans-serif",
            textShadow: "0px 2px 15px rgba(255,255,255,0.8)",
            opacity: 0,
            pointerEvents: "none",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            width: "90%",
          }}
        >
          <span style={{ fontSize: "clamp(1.8rem, 6vw, 2.8rem)", fontWeight: "700", whiteSpace: "nowrap" }}>Esto es para vos 😊</span>
          <span style={{ fontSize: "clamp(1.1rem, 3.5vw, 1.6rem)", fontWeight: "500", marginTop: "4px", whiteSpace: "nowrap" }}>Espero que te gusten</span>
        </div>

        <div
          ref={(el) => (R.selector = el)}
          style={{
            position: "absolute",
            top: "17%",
            left: "50%",
            transform: "translateX(-50%)",
            opacity: 0,
            pointerEvents: "none",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            width: "95%",
          }}
        >
          <span style={{
            fontSize: "clamp(0.7rem, 3.2vw, 0.85rem)",
            color: "#825A36",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: "500",
            opacity: 0.8,
            whiteSpace: "nowrap"
          }}>
            (pueden ser black baccaras si preferís)
          </span>
          <div style={{
            display: "flex",
            gap: "1rem",
            background: "rgba(255, 255, 255, 0.4)",
            padding: "0.5rem 1rem",
            borderRadius: "2rem",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            backdropFilter: "blur(5px)",
          }}>
            <button
              onClick={() => setTheme("yellow")}
              style={{
                width: "26px", height: "26px", borderRadius: "50%", padding: 0,
                border: theme === "yellow" ? "3px solid #6B4A2B" : "3px solid transparent", 
                backgroundColor: "#FFD54A", cursor: "pointer", transition: "border 0.3s ease"
              }}
              aria-label="Ramo Original Amarillos"
            />
            <button
              onClick={() => setTheme("baccara")}
              style={{
                width: "26px", height: "26px", borderRadius: "50%", padding: 0,
                border: theme === "baccara" ? "3px solid #6B4A2B" : "3px solid transparent", 
                backgroundColor: "#4A0404", cursor: "pointer", transition: "border 0.3s ease"
              }}
              aria-label="Ramo Black Baccara"
            />
          </div>
        </div>

        <div
          ref={(el) => (R.scrollHint = el)}
          style={{
            position: "absolute",
            bottom: "3%",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#825A36",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: "500",
            opacity: 0,
            pointerEvents: "none",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.3rem",
            textShadow: "0px 2px 10px rgba(255,255,255,0.8)",
            width: "90%",
            textAlign: "center"
          }}
        >
          <span style={{ whiteSpace: "nowrap", fontSize: "clamp(0.8rem, 3.5vw, 0.9rem)" }}>Seguí bajando un poquito más</span>
        </div>

        <div 
          ref={(el) => (R.vaseText = el)}
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#6B4A2B",
            fontFamily: "system-ui, -apple-system, sans-serif",
            width: "95%",
            textShadow: "0px 2px 15px rgba(255,255,255,0.8)",
            opacity: 0,
            pointerEvents: "none",
            zIndex: 10,
            textAlign: "center",
            lineHeight: "1.4"
          }}
        >
          <span style={{ fontSize: "clamp(1rem, 3.8vw, 1.6rem)", fontWeight: "600", whiteSpace: "nowrap" }}>
            Podés guardar una foto si querés
          </span>
        </div>

        <div
          ref={(el) => (R.downloadBtn = el)}
          style={{
            position: "absolute",
            bottom: "4%",
            left: "50%",
            transform: "translateX(-50%)",
            opacity: 0,
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <button
            onClick={downloadImage}
            style={{
              padding: "1rem 2rem",
              borderRadius: "3rem",
              background: "#6B4A2B",
              color: "#FFF",
              border: "none",
              fontSize: "1.1rem",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(107, 74, 43, 0.3)",
              fontFamily: "system-ui, -apple-system, sans-serif",
              whiteSpace: "nowrap"
            }}
          >
            Guardar recuerdo
          </button>
        </div>
      </div>
    </div>
  );
}