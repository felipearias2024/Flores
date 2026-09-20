export function FlowerVariant({ variant }) {
  switch (variant) {
    /* FLORES AMARILLAS ORIGINALES */
    case "rose":
      return (
        <g filter="url(#drop-shadow)">
          <circle r="22" fill="url(#rose-dark)" />
          <path d="M-15,-10 C-5,-25 15,-25 20,-5 C10,-15 -5,-15 -15,-10 Z" fill="url(#rose-light)" />
          <path d="M15,10 C25,0 25,-20 5,-20 C15,-10 15,5 15,10 Z" fill="url(#rose-light)" />
          <path d="M-10,15 C-25,5 -25,-15 -5,-20 C-15,-10 -15,5 -10,15 Z" fill="url(#rose-light)" />
          <path d="M-5,18 C10,25 20,10 15,-5 C5,10 -10,15 -5,18 Z" fill="url(#rose-light)" />
          <circle r="12" fill="url(#rose-mid)" />
          <path d="M-8,-5 C0,-15 10,-10 10,0 C5,-8 -5,-8 -8,-5 Z" fill="url(#rose-light)" />
          <path d="M8,5 C10,-5 0,-10 -8,0 C0,5 5,0 8,5 Z" fill="url(#rose-light)" />
          <path d="M-5,8 C-10,0 0,-10 8,-2 C0,5 -5,0 -5,8 Z" fill="url(#rose-light)" />
          <circle r="5" fill="#ECA214" />
        </g>
      );
    case "carnation":
      return (
        <g filter="url(#drop-shadow)">
          <circle r="18" fill="#F4C01E" />
          <path d="M0,-18 l3,4 l4,-3 l2,5 l5,-2 l1,5 l5,1 l-2,5 l4,3 l-4,3 l2,5 l-5,2 l-1,5 l-5,-1 l2,-5 l-4,-3 l4,-3 l-2,-5 Z" fill="#FFD54A" transform="rotate(15)" />
          <path d="M0,-14 l2,3 l3,-2 l1,4 l4,-1 l1,4 l4,1 l-1,4 l3,2 l-3,2 l1,4 l-4,1 l-1,4 l-4,-1 l1,-4 l-3,-2 l3,-2 l-1,-4 Z" fill="#F9C82A" transform="rotate(45)" />
          <circle r="8" fill="#DFA810" />
        </g>
      );
    case "tulip":
      return (
        <g filter="url(#drop-shadow)">
          <path d="M-12,2 C-16,-20 -5,-30 0,-30 C5,-30 16,-20 12,2 C8,10 -8,10 -12,2 Z" fill="url(#rose-dark)" />
          <path d="M-12,4 C-25,-10 -15,-30 0,-25 C-5,-10 -5,5 -12,4 Z" fill="url(#rose-mid)" />
          <path d="M12,4 C25,-10 15,-30 0,-25 C5,-10 5,5 12,4 Z" fill="url(#rose-light)" />
          <path d="M-6,8 C-12,-10 12,-10 6,8 C4,16 -4,16 -6,8 Z" fill="#FFE159" />
        </g>
      );
    case "daisy": {
      const angles = Array.from({ length: 14 }, (_, i) => (360 / 14) * i);
      return (
        <g filter="url(#drop-shadow)">
          <circle r="18" fill="#D98A00" opacity="0.4" />
          {angles.map((a) => (
            <g key={a} transform={`rotate(${a})`}>
              <ellipse cx="0" cy="-14" rx="3.5" ry="11" fill="url(#rose-light)" />
              <ellipse cx="0" cy="-14" rx="1.5" ry="9" fill="#FFF2A8" />
            </g>
          ))}
          <circle r="7" fill="#D98A00" />
          <circle r="5" fill="#A05A00" stroke="#F4B41A" strokeWidth="1" strokeDasharray="2 2" />
          <circle r="2" fill="#5B3A1C" />
        </g>
      );
    }

    /* BLACK BACCARAS REALISTAS Y ORGÁNICAS */
    case "baccara1":
      return (
        <g filter="url(#drop-shadow)">
          <circle r="23" fill="url(#baccara-dark)" />
          <path d="M-10,-12 C-20,-30 15,-30 22,-10 C10,-20 -5,-20 -10,-12 Z" fill="url(#baccara-mid)" />
          <path d="M18,-5 C30,5 25,25 5,22 C18,15 15,0 18,-5 Z" fill="url(#baccara-mid)" />
          <path d="M5,18 C-10,30 -25,20 -22,0 C-10,18 5,15 5,18 Z" fill="url(#baccara-mid)" />
          <path d="M-18,5 C-30,-10 -20,-25 -5,-20 C-15,-5 -10,10 -18,5 Z" fill="url(#baccara-mid)" />
          
          <circle r="14" fill="url(#baccara-dark)" />
          <path d="M-8,-8 C-10,-22 10,-22 15,-5 C5,-15 -5,-10 -8,-8 Z" fill="url(#baccara-light)" />
          <path d="M12,-2 C22,5 15,20 2,15 C12,10 10,0 12,-2 Z" fill="url(#baccara-light)" />
          <path d="M2,12 C-10,22 -20,12 -12,2 C-5,12 5,10 2,12 Z" fill="url(#baccara-light)" />
          <path d="M-12,2 C-22,-5 -15,-20 -2,-15 C-12,-10 -10,0 -12,2 Z" fill="url(#baccara-light)" />

          <circle r="8" fill="url(#baccara-mid)" />
          <path d="M-5,-4 C-5,-12 5,-12 8,-2 C2,-8 -2,-6 -5,-4 Z" fill="url(#baccara-core)" />
          <path d="M6,-1 C10,5 5,12 -1,8 C5,6 4,1 6,-1 Z" fill="url(#baccara-core)" />
          <path d="M-1,6 C-8,10 -10,2 -6,-2 C-4,4 1,4 -1,6 Z" fill="url(#baccara-core)" />
          
          <circle r="3" fill="#0A0000" />
          <path d="M-2,0 C-2,-3 2,-3 3,0 C1,-2 -1,-1 -2,0 Z" fill="url(#baccara-light)" />
        </g>
      );
    case "baccara2":
      return (
        <g filter="url(#drop-shadow)" transform="rotate(75) scale(0.95)">
          <circle r="22" fill="url(#baccara-dark)" />
          <path d="M-5,-14 C-15,-28 20,-25 20,-5 C10,-18 -2,-18 -5,-14 Z" fill="url(#baccara-mid)" />
          <path d="M16,0 C28,12 15,28 0,20 C15,12 12,2 16,0 Z" fill="url(#baccara-mid)" />
          <path d="M-2,16 C-18,28 -28,12 -18,-2 C-12,15 2,12 -2,16 Z" fill="url(#baccara-mid)" />
          
          <circle r="15" fill="url(#baccara-dark)" />
          <path d="M-10,-5 C-15,-20 5,-20 12,-8 C0,-15 -8,-10 -10,-5 Z" fill="url(#baccara-light)" />
          <path d="M10,6 C20,15 5,22 -5,12 C10,10 8,2 10,6 Z" fill="url(#baccara-light)" />
          <path d="M-8,10 C-20,15 -18,-5 -5,-10 C-12,0 -8,5 -8,10 Z" fill="url(#baccara-light)" />

          <circle r="9" fill="url(#baccara-mid)" />
          <path d="M-6,-2 C-5,-10 6,-8 8,2 C0,-6 -4,-4 -6,-2 Z" fill="url(#baccara-core)" />
          <path d="M4,4 C8,10 -2,12 -6,6 C0,10 2,6 4,4 Z" fill="url(#baccara-core)" />
          
          <circle r="4" fill="#0A0000" />
        </g>
      );
    case "baccara3":
      return (
        <g filter="url(#drop-shadow)" transform="rotate(-40) scale(1.05)">
          <circle r="21" fill="url(#baccara-dark)" />
          <path d="M-15,-10 C-10,-28 18,-25 22,-5 C10,-20 -5,-20 -15,-10 Z" fill="url(#baccara-mid)" />
          
          {/* Empujado a la izquierda (x bajó a 15 y 13) para no sobresalir */}
          <path d="M15,10 C15,10 13,22 5,22 C16,15 15,0 15,10 Z" fill="url(#baccara-mid)" />
          
          <path d="M-5,18 C-20,28 -28,10 -18,-5 C-12,15 2,15 -5,18 Z" fill="url(#baccara-mid)" />
          
          <circle r="13" fill="url(#baccara-dark)" />
          <path d="M-8,-8 C-10,-20 10,-20 12,-5 C2,-15 -5,-10 -8,-8 Z" fill="url(#baccara-light)" />
          
          {/* Pétalo de luz también empujado a la izquierda (x bajó a 12 y 8) */}
          <path d="M8,8 C12,10 8,18 -2,15 C10,12 8,2 8,8 Z" fill="url(#baccara-light)" />
          
          <path d="M-8,8 C-20,10 -15,-10 -2,-12 C-10,0 -8,5 -8,8 Z" fill="url(#baccara-light)" />

          <circle r="7" fill="url(#baccara-mid)" />
          <path d="M-4,-4 C-5,-10 5,-10 6,-2 C0,-6 -2,-4 -4,-4 Z" fill="url(#baccara-core)" />
          <path d="M4,4 C5,10 -5,10 -6,2 C0,6 2,4 4,4 Z" fill="url(#baccara-core)" />
          <circle r="2" fill="#050000" />
        </g>
      );
    case "baccara4": 
      return (
        <g filter="url(#drop-shadow)" transform="rotate(120) scale(0.9)">
          <circle r="23" fill="url(#baccara-dark)" />
          <path d="M-12,-15 C-15,-30 20,-28 24,-8 C10,-22 -5,-22 -12,-15 Z" fill="url(#baccara-mid)" />
          <path d="M20,0 C32,15 20,30 0,22 C18,18 12,2 20,0 Z" fill="url(#baccara-mid)" />
          <path d="M0,22 C-18,30 -30,15 -20,-2 C-12,18 2,18 0,22 Z" fill="url(#baccara-mid)" />
          
          <circle r="14" fill="url(#baccara-dark)" />
          <path d="M-8,-10 C-10,-22 12,-20 15,-5 C5,-16 -5,-12 -8,-10 Z" fill="url(#baccara-light)" />
          <path d="M10,8 C22,12 12,22 0,16 C12,12 8,2 10,8 Z" fill="url(#baccara-light)" />
          <path d="M-10,5 C-22,12 -15,-8 -2,-12 C-12,-2 -8,6 -10,5 Z" fill="url(#baccara-light)" />

          <circle r="8" fill="url(#baccara-mid)" />
          <path d="M-5,-5 C-5,-12 5,-10 8,-2 C2,-8 -2,-6 -5,-5 Z" fill="url(#baccara-core)" />
          <path d="M5,5 C5,12 -5,10 -8,2 C-2,8 2,6 5,5 Z" fill="url(#baccara-core)" />
          
          <circle r="3" fill="#0A0000" />
        </g>
      );

    /* FOLLAJE BASE */
    case "eucalyptus":
      return (
        <g filter="url(#drop-shadow)">
          <path d="M0,0 C-10,-10 -25,-5 -20,5 C-15,10 0,0 0,0 Z" fill="#8B9B8E" />
          <path d="M0,0 C10,-10 25,-5 20,5 C15,10 0,0 0,0 Z" fill="#798A7D" />
          <path d="M0,-15 C-12,-25 -22,-15 -18,-5 C-12,0 0,-15 0,-15 Z" fill="#8B9B8E" />
          <path d="M0,-15 C12,-25 22,-15 18,-5 C12,0 0,-15 0,-15 Z" fill="#798A7D" />
          <path d="M0,-30 C-8,-40 -15,-30 -12,-20 C-8,-15 0,-30 0,-30 Z" fill="#8B9B8E" />
          <path d="M0,-30 C8,-40 15,-30 12,-20 C8,-15 0,-30 0,-30 Z" fill="#798A7D" />
        </g>
      );
    default:
      return null;
  }
}