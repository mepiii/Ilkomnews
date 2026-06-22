import{a as e}from"./rolldown-runtime-Cyuzqnbw.js";import{lt as t}from"./icons-RIp44hA4.js";import{a as n}from"./motion-D46yhfG7.js";var r=e(t(),1),i=n(),a={blue:{base:220,spread:200},purple:{base:280,spread:300},green:{base:120,spread:200},red:{base:0,spread:200},orange:{base:30,spread:200}},o=({children:e,className:t=``,glowColor:n=`purple`,width:o,height:s})=>{let c=(0,r.useRef)(null),[l,u]=(0,r.useState)(!1);(0,r.useEffect)(()=>{let e=()=>u(document.documentElement.classList.contains(`dark`));e();let t=new MutationObserver(e);return t.observe(document.documentElement,{attributes:!0,attributeFilter:[`class`]}),()=>t.disconnect()},[]),(0,r.useEffect)(()=>{let e=e=>{c.current&&(c.current.style.setProperty(`--x`,e.clientX.toFixed(2)),c.current.style.setProperty(`--xp`,(e.clientX/window.innerWidth).toFixed(2)),c.current.style.setProperty(`--y`,e.clientY.toFixed(2)),c.current.style.setProperty(`--yp`,(e.clientY/window.innerHeight).toFixed(2)))};return document.addEventListener(`pointermove`,e),()=>document.removeEventListener(`pointermove`,e)},[]);let{base:d,spread:f}=a[n]||a.purple,p={"--base":d,"--spread":f,"--radius":`14`,"--border":l?`1`:`3`,"--backdrop":l?`hsl(280 10% 12% / 0.4)`:`hsl(0 0% 60% / 0.12)`,"--backup-border":l?`rgba(255, 255, 255, 0.06)`:`var(--backdrop)`,"--size":`200`,"--outer":l?`0.5`:`1`,"--border-size":`calc(var(--border, 2) * 1px)`,"--spotlight-size":`calc(var(--size, 150) * 1px)`,"--hue":`calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))`,backgroundImage:`radial-gradient(var(--spotlight-size) var(--spotlight-size) at calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px), hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.1)), transparent)`,backgroundColor:l?`rgba(10, 5, 20, 0.6)`:`var(--backdrop, transparent)`,backgroundSize:`calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))`,backgroundPosition:`50% 50%`,backgroundAttachment:`fixed`,border:`var(--border-size) solid var(--backup-border)`,position:`relative`,touchAction:`none`};return o!==void 0&&(p.width=typeof o==`number`?`${o}px`:o),s!==void 0&&(p.height=typeof s==`number`?`${s}px`:s),(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(`style`,{children:`
        [data-glow]::before, [data-glow]::after {
          pointer-events: none;
          content: "";
          position: absolute;
          inset: calc(var(--border-size) * -1);
          border: var(--border-size) solid transparent;
          border-radius: calc(var(--radius) * 1px);
          background-attachment: fixed;
          background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
          background-repeat: no-repeat;
          background-position: 50% 50%;
          mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
          mask-clip: padding-box, border-box;
          mask-composite: intersect;
        }
        [data-glow]::before {
          background-image: radial-gradient(calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px), hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 50) * 1%) / var(--border-spot-opacity, 1)), transparent 100%);
          filter: brightness(2);
        }
        [data-glow]::after {
          background-image: radial-gradient(calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px), hsl(0 100% 100% / var(--border-light-opacity, 1)), transparent 100%);
        }
        [data-glow] > [data-glow] {
          position: absolute;
          inset: 0;
          will-change: filter;
          opacity: var(--outer, 1);
          border-radius: calc(var(--radius) * 1px);
          border-width: calc(var(--border-size) * 20);
          filter: blur(calc(var(--border-size) * 10));
          background: none;
          pointer-events: none;
          border: none;
        }
        [data-glow] > [data-glow]::before { inset: -10px; border-width: 10px; }
      `}),(0,i.jsxs)(`div`,{ref:c,"data-glow":!0,style:p,className:`rounded-2xl relative shadow-[0_1rem_2rem_-1rem_black] backdrop-blur-[5px] ${t}`,children:[(0,i.jsx)(`div`,{"data-glow":!0}),e]})]})};export{o as t};