// Original shared sprites keep lesson scenes, catalog cards, and builder previews identical.
// Every joint has a neutral drawing pose so the illustration also works without JavaScript.
export const CHARACTER_ART = Object.freeze({
  kern: /* HTML */ `<g data-character-art="kern">
    <g data-rig-part="shadow">
      <ellipse cx="1" cy="37" rx="51" ry="12" fill="#071014" opacity=".3" />
      <ellipse cx="3" cy="37" rx="32" ry="7" fill="#071014" opacity=".22" />
    </g>
    <g data-rig-part="facing">
      <g data-rig-part="elevation" stroke="#18272e" stroke-width="2.4" stroke-linejoin="round">
        <g data-rig-part="foot-back">
          <path d="M -26 13 L -8 14 L -8 29 L -3 35 L -6 40 L -31 40 L -33 34 Z" fill="#35464c" />
          <path d="M -26 15 L -13 17 L -15 31 L -29 32 Z" fill="#52646a" stroke="none" />
          <path d="M -32 35 L -11 35 L -4 38 L -7 41 L -32 40 Z" fill="#26383f" />
        </g>
        <g data-rig-part="foot-front">
          <path d="M 9 12 L 29 11 L 32 28 L 43 33 L 43 40 L 12 42 L 5 36 Z" fill="#52656b" />
          <path d="M 13 16 L 27 15 L 29 30 L 13 32 Z" fill="#77898b" stroke="none" />
          <path d="M 11 34 L 31 32 L 43 35 L 43 40 L 13 42 L 7 37 Z" fill="#34494f" />
          <path
            d="M 17 37 L 26 36 M 31 36 L 37 36"
            fill="none"
            stroke="#819695"
            stroke-width="1.5"
          />
        </g>
        <g data-rig-part="body">
          <g data-rig-part="cape">
            <path d="M -29 -34 L -39 -17 L -34 12 L -22 25 L -10 18 L -15 -25 Z" fill="#293e45" />
            <path d="M -31 -25 L -29 11 L -23 18 L -20 -22 Z" fill="#36535a" stroke="none" />
          </g>
          <g data-rig-part="arm-back">
            <path d="M -30 -35 L -46 -30 L -53 -14 L -47 -1 L -36 -3 L -25 -19 Z" fill="#40545c" />
            <path
              d="M -46 -29 L -34 -32 L -30 -21 L -44 -15 L -51 -17 Z"
              fill="#72868b"
              stroke="none"
            />
            <path
              d="M -48 -7 L -57 5 L -55 18 L -44 22 L -34 16 L -33 4 L -39 -7 Z"
              fill="#445b63"
            />
            <path d="M -54 6 L -44 2 L -38 9 L -39 15 L -51 16 Z" fill="#698089" stroke="none" />
            <path
              d="M -50 10 L -48 18 M -43 9 L -42 18"
              fill="none"
              stroke="#253d45"
              stroke-width="1.7"
            />
          </g>
          <g data-rig-part="torso">
            <path
              d="M -31 -37 L -8 -45 L 21 -39 L 38 -25 L 30 8 L 16 24 L -14 24 L -32 11 L -38 -17 Z"
              fill="#465d65"
            />
            <path
              d="M -29 -32 L -9 -38 L 16 -33 L 29 -23 L 6 -14 L -29 -21 Z"
              fill="#819497"
              stroke="none"
            />
            <path d="M -28 -17 L 2 -9 L 5 12 L -13 17 L -28 6 Z" fill="#354c56" stroke="none" />
            <path d="M 9 -13 L 30 -22 L 24 6 L 12 17 L 4 12 Z" fill="#627c83" stroke="none" />
            <path
              d="M -26 15 L -9 18 L 7 15 L 25 9 L 20 26 L 6 31 L -12 27 L -26 24 Z"
              fill="#2e444c"
            />
            <path
              d="M -21 17 L -10 21 L -12 27 M 0 20 L 1 28 M 12 18 L 11 27"
              fill="none"
              stroke="#657d80"
              stroke-width="1.6"
            />
            <g data-rig-part="front-core">
              <path d="M -9 -25 L 9 -25 L 20 -13 L 7 3 L -9 -4 L -15 -15 Z" fill="#1c3743" />
              <path
                d="M -5 -21 L 7 -22 L 14 -13 L 5 -3 L -5 -8 L -9 -15 Z"
                fill="#50c5d0"
                stroke="none"
              />
              <path d="M 2 -20 L 9 -13 L 3 -7 L -3 -12 Z" fill="#c1f5ed" stroke="none" />
              <path
                d="M -19 -20 L -21 -8 L -16 -4 M 21 -6 L 18 2"
                fill="none"
                stroke="#72c3c7"
                stroke-width="1.6"
              />
            </g>
            <g data-rig-part="back-torso" opacity="0">
              <path
                d="M -29 -29 L -7 -38 L 18 -32 L 29 -21 L 24 9 L 11 20 L -12 19 L -28 7 Z"
                fill="#3f5660"
              />
              <path
                d="M -26 -28 L -7 -34 L 12 -30 L 22 -23 L 4 -18 L -25 -21 Z"
                fill="#809597"
                stroke="none"
              />
              <path
                d="M -23 -17 L -7 -14 L -7 14 L -21 7 Z M 2 -14 L 22 -19 L 18 7 L 4 16 Z"
                fill="#596f77"
              />
              <path
                d="M -5 -28 L -1 -24 L -1 14 M -21 -4 L -9 -1 M 5 -1 L 19 -6"
                fill="none"
                stroke="#243e49"
                stroke-width="3"
              />
              <path d="M -4 -26 L -1 -23 L -1 -15" fill="none" stroke="#74b8ba" stroke-width="2" />
            </g>
          </g>
          <g data-rig-part="head">
            <path
              d="M -16 -37 L -22 -50 L -13 -61 L 1 -64 L 18 -59 L 26 -48 L 23 -35 L 12 -27 L -5 -30 Z"
              fill="#526a73"
            />
            <path
              d="M -19 -49 L -11 -58 L 0 -60 L 14 -56 L 19 -49 L 0 -47 Z"
              fill="#9aaba9"
              stroke="none"
            />
            <path
              d="M -17 -52 L -24 -62 L -15 -59 L -8 -53 M 12 -57 L 19 -65 L 23 -56 L 23 -49"
              fill="#7d9395"
            />
            <g data-rig-part="front-face">
              <path d="M -9 -45 L 17 -47 L 23 -43 L 18 -35 L 0 -35 L -9 -39 Z" fill="#162b35" />
              <path d="M 1 -42 L 19 -44 L 16 -39 L 4 -38 Z" fill="#8aeee8" stroke="none" />
              <path
                d="M -8 -38 L 0 -32 L 12 -31 L 20 -35"
                fill="none"
                stroke="#91a5a6"
                stroke-width="2"
              />
            </g>
            <path
              d="M -12 -54 L -9 -47 M -2 -59 L 2 -51"
              fill="none"
              stroke="#506c75"
              stroke-width="1.5"
            />
            <g data-rig-part="back-head" opacity="0">
              <path
                d="M -16 -48 L -7 -55 L 9 -54 L 22 -46 L 20 -36 L 10 -30 L -4 -33 L -13 -40 Z"
                fill="#637c85"
              />
              <path
                d="M -13 -48 L -6 -52 L 8 -51 L 17 -46 L 3 -43 Z"
                fill="#98aaa9"
                stroke="none"
              />
              <path
                d="M 2 -49 L 3 -35 M -7 -38 L 3 -35 L 15 -39"
                fill="none"
                stroke="#304e5a"
                stroke-width="2.2"
              />
              <path d="M -5 -34 L 3 -31 L 12 -33" fill="none" stroke="#a1b3af" stroke-width="1.5" />
            </g>
          </g>
          <g data-rig-part="arm-front">
            <path
              d="M 27 -37 L 42 -35 L 51 -26 L 48 -10 L 35 -4 L 23 -14 L 20 -26 Z"
              fill="#627b83"
            />
            <path
              d="M 25 -28 L 30 -34 L 41 -31 L 47 -25 L 41 -21 L 29 -22 Z"
              fill="#a0afab"
              stroke="none"
            />
            <path d="M 30 -20 L 43 -18 L 46 -9 L 35 -5 L 27 -12 Z" fill="#3c5963" stroke="none" />
            <path d="M 36 -8 L 51 -9 L 58 1 L 57 16 L 45 23 L 32 16 L 30 4 Z" fill="#5a747c" />
            <path
              d="M 36 -2 L 48 -4 L 54 3 L 51 10 L 35 12 L 33 5 Z"
              fill="#91a7a6"
              stroke="none"
            />
            <path
              d="M 37 12 L 39 20 M 44 11 L 47 20 M 51 9 L 54 16"
              fill="none"
              stroke="#2b4955"
              stroke-width="2"
            />
            <path d="M 40 -3 L 47 -3 L 50 2 L 42 4 Z" fill="#67d4d9" stroke="none" />
            <g data-equipment-slot="front-fist"></g>
          </g>
        </g>
      </g>
    </g>
  </g>`,
  tavi: /* HTML */ `<g data-character-art="tavi">
    <g data-rig-part="shadow">
      <ellipse cx="1" cy="36" rx="27" ry="8" fill="#071014" opacity=".3" />
      <ellipse cx="2" cy="36" rx="17" ry="4.5" fill="#071014" opacity=".2" />
    </g>
    <g data-rig-part="facing">
      <g data-rig-part="elevation" stroke="#1a302d" stroke-width="2" stroke-linejoin="round">
        <g data-rig-part="foot-back">
          <path d="M -13 18 L -2 20 L -4 31 L -1 36 L -5 40 L -18 39 L -20 35 Z" fill="#54473d" />
          <path d="M -14 23 L -7 24 L -9 33 L -17 34 Z" fill="#80654c" stroke="none" />
          <path d="M -18 35 L -8 35 L -3 38 L -6 40 L -19 39 Z" fill="#302f2b" stroke="none" />
        </g>
        <g data-rig-part="foot-front">
          <path d="M 4 18 L 15 17 L 17 29 L 24 33 L 24 38 L 9 40 L 3 35 Z" fill="#68523f" />
          <path d="M 8 22 L 14 22 L 15 31 L 9 33 Z" fill="#a18056" stroke="none" />
          <path d="M 7 35 L 16 33 L 23 35 L 23 38 L 9 40 Z" fill="#38342d" stroke="none" />
        </g>
        <g data-rig-part="body">
          <g data-rig-part="cape">
            <path
              d="M -15 -19 L -24 -9 L -29 12 L -34 23 L -23 21 L -21 29 L -7 24 L 2 12 L -2 -13 Z"
              fill="#405b4d"
            />
            <path
              d="M -16 -13 L -21 9 L -27 19 L -22 16 L -19 23 L -13 19 L -9 -8 Z"
              fill="#6c8962"
              stroke="none"
            />
            <path d="M -22 20 L -12 13 L -7 0" fill="none" stroke="#2d443d" stroke-width="1.5" />
          </g>
          <g data-rig-part="arm-back">
            <path d="M -13 -10 L -21 -6 L -24 8 L -19 15 L -13 11 L -10 -1 Z" fill="#5a7560" />
            <path d="M -22 6 L -27 12 L -24 19 L -18 18 L -16 12 Z" fill="#715844" />
            <path d="M -21 -5 L -16 -7 L -16 1 L -23 4 Z" fill="#a2ae80" stroke="none" />
          </g>
          <g data-rig-part="torso">
            <path
              d="M -13 -15 L 11 -16 L 19 -2 L 16 10 L 20 23 L 6 29 L -12 26 L -18 20 L -13 7 L -17 -4 Z"
              fill="#6d8861"
            />
            <path
              d="M -10 -11 L 3 -9 L 0 5 L -10 16 L -15 21 L -14 5 Z"
              fill="#8ca477"
              stroke="none"
            />
            <path
              d="M 7 -10 L 14 -6 L 12 10 L 17 21 L 7 25 L 3 10 Z"
              fill="#455f50"
              stroke="none"
            />
            <path d="M -14 9 L 14 7 L 16 13 L -14 15 Z" fill="#65513d" />
            <path d="M -2 8 L 5 8 L 5 14 L -2 14 Z" fill="#dbad57" stroke-width="1.5" />
            <path d="M -11 -12 L 8 8" fill="none" stroke="#32493e" stroke-width="5" />
            <path d="M -11 -12 L 8 8" fill="none" stroke="#b79a64" stroke-width="2.5" />
            <path
              d="M -9 17 L -12 24 M 1 18 L 0 27"
              fill="none"
              stroke="#b1bc85"
              stroke-width="1.4"
            />
          </g>
          <g data-rig-part="rear-cape" opacity="0">
            <path
              d="M -14 -15 L 9 -17 L 16 -7 L 15 8 L 22 25 L 12 27 L 8 31 L -4 27 L -14 29 L -22 23 L -17 4 Z"
              fill="#617d58"
            />
            <path
              d="M -10 -11 L -1 -13 L -4 9 L -11 24 L -17 22 L -12 5 Z"
              fill="#91a476"
              stroke="none"
            />
            <path d="M 5 -12 L 11 -9 L 10 9 L 16 24 L 9 26 L 2 12 Z" fill="#3e5a47" stroke="none" />
            <path
              d="M -2 -8 L 0 8 L -3 22 M -13 20 L -6 24 L 7 26 L 14 23"
              fill="none"
              stroke="#a0b183"
              stroke-width="1.5"
            />
            <path
              d="M -17 -6 L -13 -12 L 10 -14 L 14 -8"
              fill="none"
              stroke="#364f40"
              stroke-width="2"
            />
          </g>
          <g data-rig-part="head">
            <path
              d="M -19 -17 L -21 -29 L -13 -39 L 0 -46 L 13 -40 L 21 -29 L 19 -15 L 8 -8 L -6 -9 Z"
              fill="#617e59"
            />
            <path
              d="M -18 -28 L -11 -37 L 1 -42 L 11 -37 L 16 -29 L 1 -32 L -9 -25 Z"
              fill="#97ad7c"
              stroke="none"
            />
            <g data-rig-part="front-face">
              <path d="M -10 -25 L 3 -31 L 17 -28 L 17 -17 L 8 -12 L -4 -14 Z" fill="#1c3230" />
              <path d="M 1 -24 L 13 -25 L 11 -20 L 4 -19 Z" fill="#f5c66d" stroke="none" />
            </g>
            <path
              d="M -17 -17 L -7 -11 L 8 -10 L 17 -16 L 13 -8 L 2 -5 L -11 -9 Z"
              fill="#829967"
            />
            <path d="M -18 -19 L -23 -10 L -31 -13 L -25 -19 L -20 -24" fill="#b5aa70" />
            <g data-rig-part="back-head" opacity="0">
              <path
                d="M -19 -17 L -21 -29 L -13 -39 L 0 -46 L 13 -40 L 21 -29 L 19 -15 L 8 -8 L -6 -9 Z"
                fill="#718c62"
              />
              <path
                d="M -17 -28 L -10 -37 L 0 -42 L 9 -37 L 13 -29 L 1 -31 L -8 -21 L -13 -14 Z"
                fill="#9baf7c"
                stroke="none"
              />
              <path
                d="M 4 -32 L 15 -29 L 15 -18 L 8 -12 L -3 -14 L -4 -23 Z"
                fill="#577449"
                stroke="none"
              />
              <path
                d="M 1 -40 L 4 -32 L 1 -23 L 3 -14 M -11 -13 L -1 -10 L 10 -12"
                fill="none"
                stroke="#425f42"
                stroke-width="1.7"
              />
            </g>
          </g>
          <g data-rig-part="arm-front">
            <path d="M 10 -11 L 19 -8 L 24 1 L 21 10 L 14 11 L 12 3 L 7 -4 Z" fill="#7b9568" />
            <path d="M 17 -6 L 21 0 L 17 4 L 12 -2 Z" fill="#b5bd84" stroke="none" />
            <path d="M 18 5 L 24 5 L 28 12 L 24 18 L 17 16 L 15 10 Z" fill="#806044" />
            <g data-rig-part="weapon">
              <path
                d="M 24 11 L 39 -12 L 46 -18 L 44 -8 L 29 16 Z"
                fill="#a7c2c3"
                stroke="#293f42"
                stroke-width="1.7"
              />
              <path d="M 28 11 L 41 -11 L 46 -18 L 41 -6 Z" fill="#e3e9d5" stroke="none" />
              <path
                d="M 20 10 L 31 17"
                fill="none"
                stroke="#d6ad61"
                stroke-width="3"
                stroke-linecap="round"
              />
              <path
                d="M 23 15 L 19 21"
                fill="none"
                stroke="#453c31"
                stroke-width="4"
                stroke-linecap="round"
              />
              <path d="M 21 16 L 19 19" fill="none" stroke="#a98950" stroke-width="2" />
            </g>
          </g>
        </g>
      </g>
    </g>
  </g>`,
});
