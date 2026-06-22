const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/HomePage-CO93Equv.js","assets/rolldown-runtime-Cyuzqnbw.js","assets/react-vendor-CCHJtNDw.js","assets/icons-DGyCl_Sg.js","assets/motion-BOXLhlRW.js","assets/ArticleCard-B0iYBTJD.js","assets/GlowCard-Cy59mZzr.js","assets/formatters-gBoZ49Z_.js","assets/LoadingSpinner-DJbC4dsk.js","assets/Tiles-Dt_hWP43.js","assets/api-Bv6meWTe.js","assets/NewsPage-B5e0Uce8.js","assets/Breadcrumb-CTG-KfCg.js","assets/AnimatedFilterDropdown-D37CzivM.js","assets/EventsPage-zg-_FRiV.js","assets/IlkomGalleryPage-BhVzpY7g.js","assets/DetailPage-BHTD-Jxv.js","assets/ProjectDetailPage-qVnr-Lpr.js","assets/GameDetailPage-BxEiptrM.js","assets/MobileDetailPage-DYAaQ7iU.js","assets/UiUxDetailPage-BnXtPn-2.js","assets/WebDetailPage-CmGR0QET.js","assets/SubmitProjectPage-CYJDinAN.js","assets/TrackPage-DwS60Nco.js","assets/LoginPage-BVMqfm4r.js","assets/DashboardPage-DIyvPylH.js","assets/NewsListPage-CtEEXj9v.js","assets/NewsFormPage-JbNkExy1.js","assets/ProjectsListPage-D3kbGTwH.js","assets/ProjectDetailPage-CE3OToPq.js"])))=>i.map(i=>d[i]);
import{a as e}from"./rolldown-runtime-Cyuzqnbw.js";import{A as t,B as n,I as r,J as i,K as a,N as o,O as s,R as c,S as l,at as u,c as d,dt as f,gt as p,l as m,pt as h,x as g,z as _}from"./icons-DGyCl_Sg.js";import{a as v,c as y,f as b,l as x,n as ee,o as te,r as ne,s as S,t as re,u as ie}from"./react-vendor-CCHJtNDw.js";import{a as ae,i as oe,n as se,r as C,t as ce}from"./motion-BOXLhlRW.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var le=e(b(),1),w=e(p(),1),T=ae(),ue=(0,w.createContext)(),de=({children:e})=>{let[t,n]=(0,w.useState)(()=>localStorage.getItem(`ilkom-theme`)||`dark`);return(0,w.useEffect)(()=>{let e=document.documentElement;e.classList.remove(`light`,`dark`),e.classList.add(t),localStorage.setItem(`ilkom-theme`,t)},[t]),(0,T.jsx)(ue.Provider,{value:{theme:t,toggleTheme:()=>n(e=>e===`dark`?`light`:`dark`)},children:e})},fe=()=>(0,w.useContext)(ue),pe=`https://your-domain.com/api`,me=`admin_token`;function he(){return localStorage.getItem(me)}function ge(e){localStorage.setItem(me,e)}function _e(){localStorage.removeItem(me)}async function E(e,t={}){let n=he(),r={"Content-Type":`application/json`,...n&&{Authorization:`Bearer ${n}`},...t.headers},i=await fetch(`${pe}${e}`,{...t,headers:r});if(i.status===401)throw _e(),window.location.href=`/admin/login`,Error(`Unauthorized`);if(!i.ok){let e=await i.json().catch(()=>({}));throw Error(e.message||e.error||`HTTP ${i.status}`)}return i.status===204?null:i.json()}var ve={login(e,t){return E(`/admin/login`,{method:`POST`,body:JSON.stringify({email:e,password:t})}).then(e=>(ge(e.token),e))},logout(){return E(`/admin/logout`,{method:`POST`}).finally(()=>{_e()})},getUser(){return E(`/admin/user`)}},ye={getStats(){return E(`/admin/dashboard`)}},be={getAll(e={}){let t=new URLSearchParams(e).toString();return E(`/admin/news${t?`?${t}`:``}`)},getById(e){return E(`/admin/news/${e}`)},create(e){return E(`/admin/news`,{method:`POST`,body:JSON.stringify(e)})},update(e,t){return E(`/admin/news/${e}`,{method:`PUT`,body:JSON.stringify(t)})},delete(e){return E(`/admin/news/${e}`,{method:`DELETE`})}},xe={getAll(e={}){let t=new URLSearchParams(e).toString();return E(`/admin/projects${t?`?${t}`:``}`)},getById(e){return E(`/admin/projects/${e}`)},accept(e){return E(`/admin/projects/${e}/accept`,{method:`POST`})},reject(e,t){return E(`/admin/projects/${e}/reject`,{method:`POST`,body:JSON.stringify({rejection_reason:t})})}},Se=(0,w.createContext)(null);function Ce({children:e}){let[t,n]=(0,w.useState)(null),[r,i]=(0,w.useState)(()=>localStorage.getItem(`admin_token`)),[a,o]=(0,w.useState)(!0),s=!!(r&&t);(0,w.useEffect)(()=>{if(!r){o(!1);return}ve.getUser().then(e=>n(e.user||e)).catch(()=>{localStorage.removeItem(`admin_token`),i(null)}).finally(()=>o(!1))},[r]);let c=(0,w.useCallback)(async(e,t)=>{let r=await ve.login(e,t);return i(r.token),n(r.user),r},[]),l=(0,w.useCallback)(async()=>{try{await ve.logout()}finally{localStorage.removeItem(`admin_token`),i(null),n(null)}},[]);return(0,T.jsx)(Se.Provider,{value:{user:t,token:r,loading:a,isAuthenticated:s,login:c,logout:l},children:e})}function we(){let e=(0,w.useContext)(Se);if(!e)throw Error(`useAdminAuth must be used within AdminAuthProvider`);return e}function Te({children:e}){let{isAuthenticated:t,loading:n}=we(),r=x();return n?(0,T.jsx)(`div`,{className:`min-h-screen bg-gray-50 flex items-center justify-center`,children:(0,T.jsx)(`div`,{className:`w-10 h-10 border-3 border-purple-600 border-t-transparent rounded-full animate-spin`})}):t?e:(0,T.jsx)(v,{to:`/admin/login`,state:{from:r},replace:!0})}var Ee=[{to:`/admin/dashboard`,label:`Dashboard`,icon:r},{to:`/admin/news`,label:`Berita`,icon:s},{to:`/admin/projects`,label:`Ilkom Gallery`,icon:a}],De=({isActive:e})=>`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${e?`bg-white/10 text-accent`:`text-white/70 hover:bg-white/5 hover:text-white`}`;function Oe(){let{user:e,logout:n}=we(),r=ie(),[i,a]=(0,w.useState)(!1),s=(0,T.jsxs)(`div`,{className:`flex flex-col h-full`,children:[(0,T.jsxs)(`div`,{className:`px-6 py-6 border-b border-white/10`,children:[(0,T.jsxs)(`h1`,{className:`text-xl font-bold text-white tracking-tight`,children:[`ILKOM `,(0,T.jsx)(`span`,{className:`text-accent`,children:`Admin`})]}),e&&(0,T.jsx)(`p`,{className:`text-xs text-white/50 mt-1 truncate`,children:e.email})]}),(0,T.jsx)(`nav`,{className:`flex-1 px-4 py-6 space-y-1`,children:Ee.map(e=>(0,T.jsxs)(ne,{to:e.to,className:De,onClick:()=>a(!1),children:[(0,T.jsx)(e.icon,{size:18}),(0,T.jsx)(`span`,{children:e.label})]},e.to))}),(0,T.jsx)(`div`,{className:`px-4 pb-6`,children:(0,T.jsxs)(`button`,{onClick:async()=>{await n(),r(`/admin/login`)},className:`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-sm font-medium text-white/70 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200`,children:[(0,T.jsx)(o,{size:18}),(0,T.jsx)(`span`,{children:`Keluar`})]})})]});return(0,T.jsxs)(`div`,{className:`min-h-screen bg-gray-50 flex`,children:[(0,T.jsx)(`aside`,{className:`hidden lg:flex lg:flex-col w-[250px] bg-primary fixed inset-y-0 left-0 z-30`,children:s}),(0,T.jsx)(oe,{children:i&&(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(C.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:`fixed inset-0 bg-black/50 z-40 lg:hidden`,onClick:()=>a(!1)}),(0,T.jsx)(C.aside,{initial:{x:-250},animate:{x:0},exit:{x:-250},transition:{type:`tween`,duration:.25},className:`fixed inset-y-0 left-0 w-[250px] bg-primary z-50 lg:hidden`,children:s})]})}),(0,T.jsxs)(`div`,{className:`flex-1 lg:ml-[250px] flex flex-col min-h-screen`,children:[(0,T.jsxs)(`header`,{className:`lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-20`,children:[(0,T.jsx)(`button`,{onClick:()=>a(!0),className:`p-2 rounded-lg hover:bg-gray-100`,children:(0,T.jsx)(t,{size:20,className:`text-primary`})}),(0,T.jsxs)(`h1`,{className:`text-lg font-bold text-primary`,children:[`ILKOM `,(0,T.jsx)(`span`,{className:`text-secondary`,children:`Admin`})]}),(0,T.jsx)(`div`,{className:`w-9`})]}),(0,T.jsx)(`main`,{className:`flex-1 p-6 lg:p-8`,children:(0,T.jsx)(te,{})})]})]})}var ke=({children:e,as:t=`span`,className:n=``,idle:r=!0,hover:i=!0,delay:a=0,staggerDelay:o=.03,duration:s=.5,...c})=>{let l=typeof e==`string`?e:``,u=(0,w.useMemo)(()=>4+Math.random()*2,[]),d=r?{y:[0,-2,0],opacity:[.85,1,.85],transition:{duration:u,repeat:1/0,ease:`easeInOut`,delay:a+l.length*o+s}}:{};if(!l)return(0,T.jsx)(C.span,{className:`inline-block cursor-default ${n}`,initial:{opacity:0,y:10},animate:{opacity:1,y:0,transition:{duration:.6,delay:a}},whileHover:i?{scale:1.05,textShadow:`0 0 20px rgba(122, 71, 166, 0.3)`,transition:{duration:.3}}:void 0,...c,children:e});let f=l.split(` `),p=0;return(0,T.jsx)(C.span,{className:`inline-block cursor-default ${n}`,animate:d,...c,children:f.map((e,t)=>{let n=a+p*o,r=e.split(``);return p+=e.length,(0,T.jsx)(`span`,{className:`inline-block whitespace-nowrap mr-[0.25em]`,children:r.map((e,t)=>(0,T.jsx)(C.span,{className:`inline-block`,initial:{y:20,opacity:0},animate:{y:0,opacity:1,transition:{duration:s,delay:n+t*o,ease:[.25,.46,.45,.94]}},whileHover:i?{scale:1.1,color:`rgba(122, 71, 166, 1)`,textShadow:`0 0 16px rgba(122, 71, 166, 0.4)`,transition:{duration:.2}}:void 0,children:e},t))},t)})})},Ae=`/assets/gedungfasilkom-C59eEUoL.jpg`,je=()=>{let[e,t]=(0,w.useState)(!1),[n,r]=(0,w.useState)(0);return(0,w.useEffect)(()=>{let e=setInterval(()=>{r(t=>t>=100?(clearInterval(e),100):t+2)},35);return()=>clearInterval(e)},[]),(0,w.useEffect)(()=>{if(n===100){let e=setTimeout(()=>t(!0),2e3);return()=>clearTimeout(e)}},[n]),(0,T.jsxs)(`div`,{className:`fixed inset-0 flex items-center justify-center z-50 transition-all duration-700 ${e?`opacity-0 scale-110 pointer-events-none`:`opacity-100 scale-100`}`,children:[(0,T.jsxs)(`div`,{className:`absolute inset-0 w-full h-full`,children:[(0,T.jsx)(`div`,{className:`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat`,style:{backgroundImage:`url(${Ae})`,filter:`blur(16px) scale(1.1)`},children:(0,T.jsx)(`div`,{className:`absolute inset-0 bg-gradient-to-br from-black/95 via-black/90 to-black/95`})}),(0,T.jsx)(`div`,{className:`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-15`,style:{backgroundImage:`url(${Ae})`},children:(0,T.jsx)(`div`,{className:`absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-black/50`})}),(0,T.jsx)(`div`,{className:`absolute inset-0 overflow-hidden`,children:(0,T.jsx)(`div`,{className:`absolute inset-0 opacity-10`,style:{backgroundImage:`linear-gradient(to right, rgba(168, 85, 247, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(168, 85, 247, 0.2) 1px, transparent 1px)`,backgroundSize:`40px 40px`}})})]}),(0,T.jsxs)(`div`,{className:`relative z-10 max-w-7xl mx-auto px-6 py-32 text-center`,children:[(0,T.jsx)(`div`,{className:`mb-8 animate-fade-in`,children:(0,T.jsxs)(`div`,{className:`inline-flex items-center gap-2.5 border border-white/15 rounded-full bg-white/5 backdrop-blur-sm p-1 text-sm text-white mb-8`,children:[(0,T.jsx)(`div`,{className:`bg-white/10 border border-white/15 rounded-2xl px-3 py-1`,children:(0,T.jsx)(`p`,{className:`text-xs font-semibold tracking-wide uppercase`,children:`Fakultas Ilmu Komputer`})}),(0,T.jsx)(`p`,{className:`pr-3 text-xs text-white/50`,children:`Universitas Sriwijaya`})]})}),(0,T.jsx)(`div`,{className:`mb-6 animate-fade-in`,style:{animationDelay:`0.1s`},children:(0,T.jsx)(`h1`,{className:`text-6xl md:text-8xl lg:text-9xl font-bold mb-4`,children:(0,T.jsx)(`span`,{className:`inline-block bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent`,style:{fontFamily:`CustomFont, sans-serif`},children:(0,T.jsx)(ke,{children:`ILKOM NEWS`})})})}),(0,T.jsx)(`div`,{className:`animate-fade-in`,style:{animationDelay:`0.2s`},children:(0,T.jsx)(`div`,{className:`h-0.5 w-24 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-yellow-500 rounded-full`})}),(0,T.jsx)(`div`,{className:`animate-fade-in`,style:{animationDelay:`0.3s`},children:(0,T.jsxs)(`p`,{className:`text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed`,children:[`Informasi terkini untuk mahasiswa Ilmu Komputer`,(0,T.jsx)(`br`,{}),`FASILKOM Universitas Sriwijaya`]})}),(0,T.jsxs)(`div`,{className:`max-w-md mx-auto mt-8 animate-fade-in`,style:{animationDelay:`0.4s`},children:[(0,T.jsx)(`div`,{className:`w-full h-1.5 glass-card rounded-full overflow-hidden mb-3`,children:(0,T.jsx)(`div`,{className:`h-full bg-gradient-to-r from-purple-500 to-yellow-500 rounded-full transition-all duration-100 ease-out`,style:{width:`${n}%`}})}),(0,T.jsxs)(`div`,{className:`flex justify-between items-center text-white/50 text-sm`,children:[(0,T.jsxs)(`span`,{className:`flex items-center gap-2`,children:[(0,T.jsx)(`span`,{className:`w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse`}),`Memuat konten...`]}),(0,T.jsxs)(`span`,{className:`font-mono text-purple-400 font-semibold`,children:[n,`%`]})]})]}),(0,T.jsx)(`div`,{className:`mt-8 flex justify-center gap-2 animate-fade-in`,style:{animationDelay:`0.5s`},children:[0,1,2].map(e=>(0,T.jsx)(`div`,{className:`w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse`,style:{animationDelay:`${e*.2}s`}},e))})]})]})},Me=({isDark:e})=>{let t=.7,n=se(+!!e),r=se(+!e),i=ce(n,[.6,1],[0,1]),a=ce(r,[.6,1],[0,1]);return(0,T.jsx)(C.div,{animate:e?`checked`:`unchecked`,children:(0,T.jsxs)(C.svg,{width:`20`,height:`20`,viewBox:`0 0 25 25`,fill:`none`,children:[[`M12.4058 17.7625C15.1672 17.7625 17.4058 15.5239 17.4058 12.7625C17.4058 10.0011 15.1672 7.76251 12.4058 7.76251C9.64434 7.76251 7.40576 10.0011 7.40576 12.7625C7.40576 15.5239 9.64434 17.7625 12.4058 17.7625Z`,`M12.4058 1.76251V3.76251`,`M12.4058 21.7625V23.7625`,`M4.62598 4.98248L6.04598 6.40248`,`M18.7656 19.1225L20.1856 20.5425`,`M1.40576 12.7625H3.40576`,`M21.4058 12.7625H23.4058`,`M4.62598 20.5425L6.04598 19.1225`,`M18.7656 6.40248L20.1856 4.98248`].map((e,n)=>(0,T.jsx)(C.path,{d:e,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,variants:{checked:{scale:0},unchecked:{scale:1}},transition:{duration:t},style:{pathLength:a,scale:r}},`sun-${n}`)),(0,T.jsx)(C.path,{d:`M21.1918 13.2013C21.0345 14.9035 20.3957 16.5257 19.35 17.8781C18.3044 19.2305 16.8953 20.2571 15.2875 20.8379C13.6797 21.4186 11.9398 21.5294 10.2713 21.1574C8.60281 20.7854 7.07479 19.9459 5.86602 18.7371C4.65725 17.5283 3.81774 16.0003 3.4457 14.3318C3.07367 12.6633 3.18451 10.9234 3.76526 9.31561C4.346 7.70783 5.37263 6.29868 6.72501 5.25307C8.07739 4.20746 9.69959 3.56862 11.4018 3.41132C10.4052 4.75958 9.92564 6.42077 10.0503 8.09273C10.175 9.76469 10.8957 11.3364 12.0812 12.5219C13.2667 13.7075 14.8384 14.4281 16.5104 14.5528C18.1823 14.6775 19.8435 14.1979 21.1918 13.2013Z`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,variants:{checked:{scale:1},unchecked:{scale:0}},transition:{duration:t},style:{pathLength:i,scale:n}})]})})},Ne=({className:e=``})=>{let{theme:t,toggleTheme:n}=fe(),[r,i]=(0,w.useState)(!1);if((0,w.useEffect)(()=>{i(!0)},[]),!r)return(0,T.jsx)(`button`,{className:`p-2 rounded-lg ${e}`,disabled:!0,"aria-label":`Toggle theme`,children:(0,T.jsx)(`div`,{className:`h-5 w-5`})});let a=t===`dark`;return(0,T.jsx)(`button`,{onClick:n,className:`p-2 rounded-lg hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition-all duration-200 cursor-pointer text-current ${e}`,"aria-label":a?`Switch to light mode`:`Switch to dark mode`,children:(0,T.jsx)(Me,{isDark:a})})},Pe=()=>{let[e,t]=(0,w.useState)(!1),n=(0,w.useRef)(null);return(0,w.useEffect)(()=>{let e=e=>{n.current&&!n.current.contains(e.target)&&t(!1)};return document.addEventListener(`mousedown`,e),()=>document.removeEventListener(`mousedown`,e)},[]),(0,T.jsxs)(`div`,{className:`relative`,ref:n,children:[(0,T.jsx)(`button`,{onClick:()=>t(!e),className:`relative p-2 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.1] transition-colors`,children:(0,T.jsx)(f,{size:18,className:`text-black/60 dark:text-white/60`})}),e&&(0,T.jsxs)(`div`,{className:`absolute right-0 top-full mt-2 w-72 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-lg p-0 z-50`,children:[(0,T.jsx)(`div`,{className:`px-4 py-3 border-b border-neutral-100 dark:border-neutral-800`,children:(0,T.jsx)(`p`,{className:`text-sm font-semibold text-black dark:text-white`,children:`Notifications`})}),(0,T.jsx)(`div`,{className:`p-4`,children:(0,T.jsx)(`p`,{className:`text-sm text-neutral-400 text-center py-4`,children:`No new notifications`})})]})]})},Fe=`/assets/BEM-DWPSXzfK.png`,Ie=()=>{let e=x(),[n,r]=(0,w.useState)(`Beranda`),[a,o]=(0,w.useState)(!1),[f,p]=(0,w.useState)(!1),[h,v]=(0,w.useState)(!0),y=(0,w.useRef)(0),b=[{name:`Beranda`,path:`/`,icon:_},{name:`Berita`,path:`/news`,icon:s},{name:`Ilkom Gallery`,path:`/ilkomgallery`,icon:c},{name:`Submit`,path:`/submit`,icon:g},{name:`Track`,path:`/track`,icon:l}],te=[{name:`SAPA`,url:`https://sapa.bemfasilkomunsri.org/`,icon:m},{name:`BEM Official`,url:`https://bemfasilkomunsri.org/`,icon:i}];(0,w.useEffect)(()=>{let t=b.find(t=>t.path===e.pathname);t&&r(t.name)},[e.pathname]);let ne=(0,w.useCallback)(()=>{let e=window.scrollY;e<50?v(!0):e>y.current&&e>100?(v(!1),o(!1),p(!1)):e<y.current-10&&v(!0),y.current=e},[]);return(0,w.useEffect)(()=>(window.addEventListener(`scroll`,ne,{passive:!0}),()=>window.removeEventListener(`scroll`,ne)),[ne]),(0,w.useEffect)(()=>{let e=e=>{a&&!e.target.closest(`[data-dropdown]`)&&o(!1)};return document.addEventListener(`mousedown`,e),()=>document.removeEventListener(`mousedown`,e)},[a]),(0,T.jsx)(oe,{children:h&&(0,T.jsxs)(C.div,{initial:{y:-100,opacity:0},animate:{y:0,opacity:1},exit:{y:-100,opacity:0},transition:{type:`spring`,stiffness:300,damping:30},className:`fixed top-3 left-0 right-0 z-50 flex justify-center px-4`,children:[(0,T.jsxs)(`div`,{className:`hidden md:flex items-center justify-center gap-1 bg-white dark:bg-black py-1.5 px-2 rounded-full border border-black/[0.08] dark:border-white/[0.12] shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(255,255,255,0.05)]`,children:[(0,T.jsxs)(ee,{to:`/`,className:`flex items-center gap-2 px-3 py-1.5 mr-1 shrink-0`,onClick:()=>r(`Beranda`),children:[(0,T.jsx)(`img`,{src:`/assets/BEM-DWPSXzfK.png`,alt:`ILKOM`,className:`h-7 w-auto`}),(0,T.jsx)(`span`,{className:`text-sm font-bold text-black dark:text-white hidden lg:inline`,children:`ILKOM`})]}),b.map(e=>{e.icon;let t=n===e.name;return(0,T.jsxs)(ee,{to:e.path,onClick:()=>r(e.name),className:`relative cursor-pointer px-4 py-2 rounded-full transition-all duration-300 text-[13px] font-semibold tracking-wide uppercase ${t?`bg-black/[0.06] dark:bg-white/[0.12] text-black dark:text-white`:`text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]`}`,children:[(0,T.jsx)(`span`,{className:`hidden md:inline`,children:e.name}),t&&(0,T.jsx)(`span`,{className:`absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-black dark:bg-white rounded-full`})]},e.name)}),(0,T.jsxs)(`div`,{className:`relative`,"data-dropdown":!0,children:[(0,T.jsxs)(`button`,{onClick:()=>o(!a),className:`flex items-center gap-1 cursor-pointer px-4 py-2 rounded-full transition-all text-[13px] font-semibold tracking-wide uppercase text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]`,children:[(0,T.jsx)(`span`,{className:`hidden md:inline`,children:`BEM Apps`}),(0,T.jsx)(u,{size:14,className:`transition-transform ${a?`rotate-180`:``}`})]}),a&&(0,T.jsx)(C.div,{initial:{opacity:0,y:-4,scale:.98},animate:{opacity:1,y:0,scale:1},className:`absolute top-full right-0 mt-2 w-52 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden p-1.5`,children:te.map(e=>{let t=e.icon;return(0,T.jsxs)(`a`,{href:e.url,target:`_blank`,rel:`noopener noreferrer`,className:`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors`,children:[(0,T.jsx)(t,{size:16}),(0,T.jsx)(`span`,{children:e.name}),(0,T.jsx)(i,{size:12,className:`ml-auto opacity-40`})]},e.name)})})]}),(0,T.jsxs)(`div`,{className:`ml-1 pl-2 border-l border-black/[0.08] dark:border-white/[0.12] flex items-center gap-1`,children:[(0,T.jsx)(Pe,{}),(0,T.jsx)(Ne,{})]})]}),(0,T.jsxs)(`div`,{className:`md:hidden flex items-center justify-between w-full bg-white dark:bg-black py-2 px-4 rounded-2xl border border-black/[0.08] dark:border-white/[0.12] shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(255,255,255,0.05)]`,children:[(0,T.jsxs)(ee,{to:`/`,className:`flex items-center gap-2`,children:[(0,T.jsx)(`img`,{src:`/assets/BEM-DWPSXzfK.png`,alt:`ILKOM`,className:`h-7 w-auto`}),(0,T.jsx)(`span`,{className:`text-sm font-bold text-black dark:text-white`,children:`ILKOM NEWS`})]}),(0,T.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,T.jsx)(Pe,{}),(0,T.jsx)(Ne,{}),(0,T.jsx)(`button`,{onClick:()=>p(!f),className:`w-9 h-9 flex items-center justify-center rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.1] transition-colors`,children:f?(0,T.jsx)(d,{size:20,className:`text-black dark:text-white`}):(0,T.jsx)(t,{size:20,className:`text-black dark:text-white`})})]})]}),f&&(0,T.jsxs)(C.div,{initial:{opacity:0,y:-8},animate:{opacity:1,y:0},className:`md:hidden absolute top-full left-4 right-4 mt-2 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl overflow-hidden p-2`,children:[b.map(e=>{let t=e.icon;return(0,T.jsxs)(ee,{to:e.path,onClick:()=>{r(e.name),p(!1)},className:`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${n===e.name?`bg-black/[0.06] dark:bg-white/[0.12] text-black dark:text-white`:`text-black/70 dark:text-white/70 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]`}`,children:[(0,T.jsx)(t,{size:18}),(0,T.jsx)(`span`,{children:e.name})]},e.name)}),(0,T.jsx)(`div`,{className:`border-t border-neutral-200 dark:border-neutral-700 mt-1 pt-1`,children:te.map(e=>{let t=e.icon;return(0,T.jsxs)(`a`,{href:e.url,target:`_blank`,rel:`noopener noreferrer`,className:`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-black/70 dark:text-white/70 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors`,children:[(0,T.jsx)(t,{size:18}),(0,T.jsx)(`span`,{children:e.name}),(0,T.jsx)(i,{size:14,className:`ml-auto opacity-30`})]},e.name)})})]})]})})};function Le(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function Re(e){if(Array.isArray(e))return e}function ze(e){if(Array.isArray(e))return Le(e)}function Be(e,t){if(!(e instanceof t))throw TypeError(`Cannot call a class as a function`)}function Ve(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,`value`in r&&(r.writable=!0),Object.defineProperty(e,Ze(r.key),r)}}function He(e,t,n){return t&&Ve(e.prototype,t),n&&Ve(e,n),Object.defineProperty(e,"prototype",{writable:!1}),e}function Ue(e,t){var n=typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(!n){if(Array.isArray(e)||(n=$e(e))||t&&e&&typeof e.length==`number`){n&&(e=n);var r=0,i=function(){};return{s:i,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:i}}throw TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var a,o=!0,s=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return o=e.done,e},e:function(e){s=!0,a=e},f:function(){try{o||n.return==null||n.return()}finally{if(s)throw a}}}}function D(e,t,n){return(t=Ze(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function We(e){if(typeof Symbol<`u`&&e[Symbol.iterator]!=null||e[`@@iterator`]!=null)return Array.from(e)}function Ge(e,t){var n=e==null?null:typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(n!=null){var r,i,a,o,s=[],c=!0,l=!1;try{if(a=(n=n.call(e)).next,t===0){if(Object(n)!==n)return;c=!1}else for(;!(c=(r=a.call(n)).done)&&(s.push(r.value),s.length!==t);c=!0);}catch(e){l=!0,i=e}finally{try{if(!c&&n.return!=null&&(o=n.return(),Object(o)!==o))return}finally{if(l)throw i}}return s}}function Ke(){throw TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function qe(){throw TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Je(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function O(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?Je(Object(n),!0).forEach(function(t){D(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Je(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function Ye(e,t){return Re(e)||Ge(e,t)||$e(e,t)||Ke()}function k(e){return ze(e)||We(e)||$e(e)||qe()}function Xe(e,t){if(typeof e!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(typeof r!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function Ze(e){var t=Xe(e,`string`);return typeof t==`symbol`?t:t+``}function Qe(e){"@babel/helpers - typeof";return Qe=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},Qe(e)}function $e(e,t){if(e){if(typeof e==`string`)return Le(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Le(e,t):void 0}}var et=function(){},tt={},nt={},rt=null,it={mark:et,measure:et};try{typeof window<`u`&&(tt=window),typeof document<`u`&&(nt=document),typeof MutationObserver<`u`&&(rt=MutationObserver),typeof performance<`u`&&(it=performance)}catch{}var at=(tt.navigator||{}).userAgent,ot=at===void 0?``:at,A=tt,j=nt,st=rt,ct=it;A.document;var M=!!j.documentElement&&!!j.head&&typeof j.addEventListener==`function`&&typeof j.createElement==`function`,lt=~ot.indexOf(`MSIE`)||~ot.indexOf(`Trident/`),ut,dt=/fa(k|kd|s|r|l|t|d|dr|dl|dt|b|slr|slpr|wsb|tl|ns|nds|es|gt|jr|jfr|jdr|usb|ufsb|udsb|cr|ss|sr|sl|st|sds|sdr|sdl|sdt)?[\-\ ]/,ft=/Font ?Awesome ?([567 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit|Notdog Duo|Notdog|Chisel|Etch|Graphite|Thumbprint|Jelly Fill|Jelly Duo|Jelly|Utility|Utility Fill|Utility Duo|Slab Press|Slab|Whiteboard)?.*/i,pt={classic:{fa:`solid`,fas:`solid`,"fa-solid":`solid`,far:`regular`,"fa-regular":`regular`,fal:`light`,"fa-light":`light`,fat:`thin`,"fa-thin":`thin`,fab:`brands`,"fa-brands":`brands`},duotone:{fa:`solid`,fad:`solid`,"fa-solid":`solid`,"fa-duotone":`solid`,fadr:`regular`,"fa-regular":`regular`,fadl:`light`,"fa-light":`light`,fadt:`thin`,"fa-thin":`thin`},sharp:{fa:`solid`,fass:`solid`,"fa-solid":`solid`,fasr:`regular`,"fa-regular":`regular`,fasl:`light`,"fa-light":`light`,fast:`thin`,"fa-thin":`thin`},"sharp-duotone":{fa:`solid`,fasds:`solid`,"fa-solid":`solid`,fasdr:`regular`,"fa-regular":`regular`,fasdl:`light`,"fa-light":`light`,fasdt:`thin`,"fa-thin":`thin`},slab:{"fa-regular":`regular`,faslr:`regular`},"slab-press":{"fa-regular":`regular`,faslpr:`regular`},thumbprint:{"fa-light":`light`,fatl:`light`},whiteboard:{"fa-semibold":`semibold`,fawsb:`semibold`},notdog:{"fa-solid":`solid`,fans:`solid`},"notdog-duo":{"fa-solid":`solid`,fands:`solid`},etch:{"fa-solid":`solid`,faes:`solid`},graphite:{"fa-thin":`thin`,fagt:`thin`},jelly:{"fa-regular":`regular`,fajr:`regular`},"jelly-fill":{"fa-regular":`regular`,fajfr:`regular`},"jelly-duo":{"fa-regular":`regular`,fajdr:`regular`},chisel:{"fa-regular":`regular`,facr:`regular`},utility:{"fa-semibold":`semibold`,fausb:`semibold`},"utility-duo":{"fa-semibold":`semibold`,faudsb:`semibold`},"utility-fill":{"fa-semibold":`semibold`,faufsb:`semibold`}},mt={GROUP:`duotone-group`,SWAP_OPACITY:`swap-opacity`,PRIMARY:`primary`,SECONDARY:`secondary`},ht=[`fa-classic`,`fa-duotone`,`fa-sharp`,`fa-sharp-duotone`,`fa-thumbprint`,`fa-whiteboard`,`fa-notdog`,`fa-notdog-duo`,`fa-chisel`,`fa-etch`,`fa-graphite`,`fa-jelly`,`fa-jelly-fill`,`fa-jelly-duo`,`fa-slab`,`fa-slab-press`,`fa-utility`,`fa-utility-duo`,`fa-utility-fill`],N=`classic`,gt=`duotone`,_t=`sharp`,vt=`sharp-duotone`,yt=`chisel`,bt=`etch`,xt=`graphite`,St=`jelly`,Ct=`jelly-duo`,wt=`jelly-fill`,Tt=`notdog`,Et=`notdog-duo`,Dt=`slab`,Ot=`slab-press`,kt=`thumbprint`,At=`utility`,jt=`utility-duo`,Mt=`utility-fill`,Nt=`whiteboard`,Pt=`Classic`,Ft=`Duotone`,It=`Sharp`,Lt=`Sharp Duotone`,Rt=`Chisel`,zt=`Etch`,Bt=`Graphite`,Vt=`Jelly`,Ht=`Jelly Duo`,Ut=`Jelly Fill`,Wt=`Notdog`,Gt=`Notdog Duo`,Kt=`Slab`,qt=`Slab Press`,Jt=`Thumbprint`,Yt=`Utility`,Xt=`Utility Duo`,Zt=`Utility Fill`,Qt=`Whiteboard`,$t=[N,gt,_t,vt,yt,bt,xt,St,Ct,wt,Tt,Et,Dt,Ot,kt,At,jt,Mt,Nt];ut={},D(D(D(D(D(D(D(D(D(D(ut,N,Pt),gt,Ft),_t,It),vt,Lt),yt,Rt),bt,zt),xt,Bt),St,Vt),Ct,Ht),wt,Ut),D(D(D(D(D(D(D(D(D(ut,Tt,Wt),Et,Gt),Dt,Kt),Ot,qt),kt,Jt),At,Yt),jt,Xt),Mt,Zt),Nt,Qt);var en={classic:{900:`fas`,400:`far`,normal:`far`,300:`fal`,100:`fat`},duotone:{900:`fad`,400:`fadr`,300:`fadl`,100:`fadt`},sharp:{900:`fass`,400:`fasr`,300:`fasl`,100:`fast`},"sharp-duotone":{900:`fasds`,400:`fasdr`,300:`fasdl`,100:`fasdt`},slab:{400:`faslr`},"slab-press":{400:`faslpr`},whiteboard:{600:`fawsb`},thumbprint:{300:`fatl`},notdog:{900:`fans`},"notdog-duo":{900:`fands`},etch:{900:`faes`},graphite:{100:`fagt`},chisel:{400:`facr`},jelly:{400:`fajr`},"jelly-fill":{400:`fajfr`},"jelly-duo":{400:`fajdr`},utility:{600:`fausb`},"utility-duo":{600:`faudsb`},"utility-fill":{600:`faufsb`}},tn={"Font Awesome 7 Free":{900:`fas`,400:`far`},"Font Awesome 7 Pro":{900:`fas`,400:`far`,normal:`far`,300:`fal`,100:`fat`},"Font Awesome 7 Brands":{400:`fab`,normal:`fab`},"Font Awesome 7 Duotone":{900:`fad`,400:`fadr`,normal:`fadr`,300:`fadl`,100:`fadt`},"Font Awesome 7 Sharp":{900:`fass`,400:`fasr`,normal:`fasr`,300:`fasl`,100:`fast`},"Font Awesome 7 Sharp Duotone":{900:`fasds`,400:`fasdr`,normal:`fasdr`,300:`fasdl`,100:`fasdt`},"Font Awesome 7 Jelly":{400:`fajr`,normal:`fajr`},"Font Awesome 7 Jelly Fill":{400:`fajfr`,normal:`fajfr`},"Font Awesome 7 Jelly Duo":{400:`fajdr`,normal:`fajdr`},"Font Awesome 7 Slab":{400:`faslr`,normal:`faslr`},"Font Awesome 7 Slab Press":{400:`faslpr`,normal:`faslpr`},"Font Awesome 7 Thumbprint":{300:`fatl`,normal:`fatl`},"Font Awesome 7 Notdog":{900:`fans`,normal:`fans`},"Font Awesome 7 Notdog Duo":{900:`fands`,normal:`fands`},"Font Awesome 7 Etch":{900:`faes`,normal:`faes`},"Font Awesome 7 Graphite":{100:`fagt`,normal:`fagt`},"Font Awesome 7 Chisel":{400:`facr`,normal:`facr`},"Font Awesome 7 Whiteboard":{600:`fawsb`,normal:`fawsb`},"Font Awesome 7 Utility":{600:`fausb`,normal:`fausb`},"Font Awesome 7 Utility Duo":{600:`faudsb`,normal:`faudsb`},"Font Awesome 7 Utility Fill":{600:`faufsb`,normal:`faufsb`}},nn=new Map([[`classic`,{defaultShortPrefixId:`fas`,defaultStyleId:`solid`,styleIds:[`solid`,`regular`,`light`,`thin`,`brands`],futureStyleIds:[],defaultFontWeight:900}],[`duotone`,{defaultShortPrefixId:`fad`,defaultStyleId:`solid`,styleIds:[`solid`,`regular`,`light`,`thin`],futureStyleIds:[],defaultFontWeight:900}],[`sharp`,{defaultShortPrefixId:`fass`,defaultStyleId:`solid`,styleIds:[`solid`,`regular`,`light`,`thin`],futureStyleIds:[],defaultFontWeight:900}],[`sharp-duotone`,{defaultShortPrefixId:`fasds`,defaultStyleId:`solid`,styleIds:[`solid`,`regular`,`light`,`thin`],futureStyleIds:[],defaultFontWeight:900}],[`chisel`,{defaultShortPrefixId:`facr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`etch`,{defaultShortPrefixId:`faes`,defaultStyleId:`solid`,styleIds:[`solid`],futureStyleIds:[],defaultFontWeight:900}],[`graphite`,{defaultShortPrefixId:`fagt`,defaultStyleId:`thin`,styleIds:[`thin`],futureStyleIds:[],defaultFontWeight:100}],[`jelly`,{defaultShortPrefixId:`fajr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`jelly-duo`,{defaultShortPrefixId:`fajdr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`jelly-fill`,{defaultShortPrefixId:`fajfr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`notdog`,{defaultShortPrefixId:`fans`,defaultStyleId:`solid`,styleIds:[`solid`],futureStyleIds:[],defaultFontWeight:900}],[`notdog-duo`,{defaultShortPrefixId:`fands`,defaultStyleId:`solid`,styleIds:[`solid`],futureStyleIds:[],defaultFontWeight:900}],[`slab`,{defaultShortPrefixId:`faslr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`slab-press`,{defaultShortPrefixId:`faslpr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`thumbprint`,{defaultShortPrefixId:`fatl`,defaultStyleId:`light`,styleIds:[`light`],futureStyleIds:[],defaultFontWeight:300}],[`utility`,{defaultShortPrefixId:`fausb`,defaultStyleId:`semibold`,styleIds:[`semibold`],futureStyleIds:[],defaultFontWeight:600}],[`utility-duo`,{defaultShortPrefixId:`faudsb`,defaultStyleId:`semibold`,styleIds:[`semibold`],futureStyleIds:[],defaultFontWeight:600}],[`utility-fill`,{defaultShortPrefixId:`faufsb`,defaultStyleId:`semibold`,styleIds:[`semibold`],futureStyleIds:[],defaultFontWeight:600}],[`whiteboard`,{defaultShortPrefixId:`fawsb`,defaultStyleId:`semibold`,styleIds:[`semibold`],futureStyleIds:[],defaultFontWeight:600}]]),rn={chisel:{regular:`facr`},classic:{brands:`fab`,light:`fal`,regular:`far`,solid:`fas`,thin:`fat`},duotone:{light:`fadl`,regular:`fadr`,solid:`fad`,thin:`fadt`},etch:{solid:`faes`},graphite:{thin:`fagt`},jelly:{regular:`fajr`},"jelly-duo":{regular:`fajdr`},"jelly-fill":{regular:`fajfr`},notdog:{solid:`fans`},"notdog-duo":{solid:`fands`},sharp:{light:`fasl`,regular:`fasr`,solid:`fass`,thin:`fast`},"sharp-duotone":{light:`fasdl`,regular:`fasdr`,solid:`fasds`,thin:`fasdt`},slab:{regular:`faslr`},"slab-press":{regular:`faslpr`},thumbprint:{light:`fatl`},utility:{semibold:`fausb`},"utility-duo":{semibold:`faudsb`},"utility-fill":{semibold:`faufsb`},whiteboard:{semibold:`fawsb`}},an=[`fak`,`fa-kit`,`fakd`,`fa-kit-duotone`],on={kit:{fak:`kit`,"fa-kit":`kit`},"kit-duotone":{fakd:`kit-duotone`,"fa-kit-duotone":`kit-duotone`}},sn=[`kit`];D(D({},`kit`,`Kit`),`kit-duotone`,`Kit Duotone`);var cn={kit:{"fa-kit":`fak`},"kit-duotone":{"fa-kit-duotone":`fakd`}},ln={"Font Awesome Kit":{400:`fak`,normal:`fak`},"Font Awesome Kit Duotone":{400:`fakd`,normal:`fakd`}},un={kit:{fak:`fa-kit`},"kit-duotone":{fakd:`fa-kit-duotone`}},dn={kit:{kit:`fak`},"kit-duotone":{"kit-duotone":`fakd`}},fn,pn={GROUP:`duotone-group`,SWAP_OPACITY:`swap-opacity`,PRIMARY:`primary`,SECONDARY:`secondary`},mn=[`fa-classic`,`fa-duotone`,`fa-sharp`,`fa-sharp-duotone`,`fa-thumbprint`,`fa-whiteboard`,`fa-notdog`,`fa-notdog-duo`,`fa-chisel`,`fa-etch`,`fa-graphite`,`fa-jelly`,`fa-jelly-fill`,`fa-jelly-duo`,`fa-slab`,`fa-slab-press`,`fa-utility`,`fa-utility-duo`,`fa-utility-fill`];fn={},D(D(D(D(D(D(D(D(D(D(fn,`classic`,`Classic`),`duotone`,`Duotone`),`sharp`,`Sharp`),`sharp-duotone`,`Sharp Duotone`),`chisel`,`Chisel`),`etch`,`Etch`),`graphite`,`Graphite`),`jelly`,`Jelly`),`jelly-duo`,`Jelly Duo`),`jelly-fill`,`Jelly Fill`),D(D(D(D(D(D(D(D(D(fn,`notdog`,`Notdog`),`notdog-duo`,`Notdog Duo`),`slab`,`Slab`),`slab-press`,`Slab Press`),`thumbprint`,`Thumbprint`),`utility`,`Utility`),`utility-duo`,`Utility Duo`),`utility-fill`,`Utility Fill`),`whiteboard`,`Whiteboard`),D(D({},`kit`,`Kit`),`kit-duotone`,`Kit Duotone`);var hn={classic:{"fa-brands":`fab`,"fa-duotone":`fad`,"fa-light":`fal`,"fa-regular":`far`,"fa-solid":`fas`,"fa-thin":`fat`},duotone:{"fa-regular":`fadr`,"fa-light":`fadl`,"fa-thin":`fadt`},sharp:{"fa-solid":`fass`,"fa-regular":`fasr`,"fa-light":`fasl`,"fa-thin":`fast`},"sharp-duotone":{"fa-solid":`fasds`,"fa-regular":`fasdr`,"fa-light":`fasdl`,"fa-thin":`fasdt`},slab:{"fa-regular":`faslr`},"slab-press":{"fa-regular":`faslpr`},whiteboard:{"fa-semibold":`fawsb`},thumbprint:{"fa-light":`fatl`},notdog:{"fa-solid":`fans`},"notdog-duo":{"fa-solid":`fands`},etch:{"fa-solid":`faes`},graphite:{"fa-thin":`fagt`},jelly:{"fa-regular":`fajr`},"jelly-fill":{"fa-regular":`fajfr`},"jelly-duo":{"fa-regular":`fajdr`},chisel:{"fa-regular":`facr`},utility:{"fa-semibold":`fausb`},"utility-duo":{"fa-semibold":`faudsb`},"utility-fill":{"fa-semibold":`faufsb`}},gn={classic:[`fas`,`far`,`fal`,`fat`,`fad`],duotone:[`fadr`,`fadl`,`fadt`],sharp:[`fass`,`fasr`,`fasl`,`fast`],"sharp-duotone":[`fasds`,`fasdr`,`fasdl`,`fasdt`],slab:[`faslr`],"slab-press":[`faslpr`],whiteboard:[`fawsb`],thumbprint:[`fatl`],notdog:[`fans`],"notdog-duo":[`fands`],etch:[`faes`],graphite:[`fagt`],jelly:[`fajr`],"jelly-fill":[`fajfr`],"jelly-duo":[`fajdr`],chisel:[`facr`],utility:[`fausb`],"utility-duo":[`faudsb`],"utility-fill":[`faufsb`]},_n={classic:{fab:`fa-brands`,fad:`fa-duotone`,fal:`fa-light`,far:`fa-regular`,fas:`fa-solid`,fat:`fa-thin`},duotone:{fadr:`fa-regular`,fadl:`fa-light`,fadt:`fa-thin`},sharp:{fass:`fa-solid`,fasr:`fa-regular`,fasl:`fa-light`,fast:`fa-thin`},"sharp-duotone":{fasds:`fa-solid`,fasdr:`fa-regular`,fasdl:`fa-light`,fasdt:`fa-thin`},slab:{faslr:`fa-regular`},"slab-press":{faslpr:`fa-regular`},whiteboard:{fawsb:`fa-semibold`},thumbprint:{fatl:`fa-light`},notdog:{fans:`fa-solid`},"notdog-duo":{fands:`fa-solid`},etch:{faes:`fa-solid`},graphite:{fagt:`fa-thin`},jelly:{fajr:`fa-regular`},"jelly-fill":{fajfr:`fa-regular`},"jelly-duo":{fajdr:`fa-regular`},chisel:{facr:`fa-regular`},utility:{fausb:`fa-semibold`},"utility-duo":{faudsb:`fa-semibold`},"utility-fill":{faufsb:`fa-semibold`}},vn=`fa.fas.far.fal.fat.fad.fadr.fadl.fadt.fab.fass.fasr.fasl.fast.fasds.fasdr.fasdl.fasdt.faslr.faslpr.fawsb.fatl.fans.fands.faes.fagt.fajr.fajfr.fajdr.facr.fausb.faudsb.faufsb`.split(`.`).concat(mn,[`fa-solid`,`fa-regular`,`fa-light`,`fa-thin`,`fa-duotone`,`fa-brands`,`fa-semibold`]),yn=[`solid`,`regular`,`light`,`thin`,`duotone`,`brands`,`semibold`],bn=[1,2,3,4,5,6,7,8,9,10],xn=bn.concat([11,12,13,14,15,16,17,18,19,20]),Sn=[].concat(k(Object.keys(gn)),yn,[`aw`,`fw`,`pull-left`,`pull-right`],[`2xs`,`xs`,`sm`,`lg`,`xl`,`2xl`,`beat`,`border`,`fade`,`beat-fade`,`bounce`,`flip-both`,`flip-horizontal`,`flip-vertical`,`flip`,`inverse`,`layers`,`layers-bottom-left`,`layers-bottom-right`,`layers-counter`,`layers-text`,`layers-top-left`,`layers-top-right`,`li`,`pull-end`,`pull-start`,`pulse`,`rotate-180`,`rotate-270`,`rotate-90`,`rotate-by`,`shake`,`spin-pulse`,`spin-reverse`,`spin`,`stack-1x`,`stack-2x`,`stack`,`ul`,`width-auto`,`width-fixed`,pn.GROUP,pn.SWAP_OPACITY,pn.PRIMARY,pn.SECONDARY],bn.map(function(e){return`${e}x`}),xn.map(function(e){return`w-${e}`})),Cn={"Font Awesome 5 Free":{900:`fas`,400:`far`},"Font Awesome 5 Pro":{900:`fas`,400:`far`,normal:`far`,300:`fal`},"Font Awesome 5 Brands":{400:`fab`,normal:`fab`},"Font Awesome 5 Duotone":{900:`fad`}},P=`___FONT_AWESOME___`,wn=16,Tn=`fa`,En=`svg-inline--fa`,F=`data-fa-i2svg`,Dn=`data-fa-pseudo-element`,On=`data-fa-pseudo-element-pending`,kn=`data-prefix`,An=`data-icon`,jn=`fontawesome-i2svg`,Mn=`async`,Nn=[`HTML`,`HEAD`,`STYLE`,`SCRIPT`],Pn=[`::before`,`::after`,`:before`,`:after`],Fn=function(){try{return!0}catch{return!1}}();function In(e){return new Proxy(e,{get:function(e,t){return t in e?e[t]:e[N]}})}var Ln=O({},pt);Ln[N]=O(O(O(O({},{"fa-duotone":`duotone`}),pt[N]),on.kit),on[`kit-duotone`]);var Rn=In(Ln),zn=O({},rn);zn[N]=O(O(O(O({},{duotone:`fad`}),zn[N]),dn.kit),dn[`kit-duotone`]);var Bn=In(zn),Vn=O({},_n);Vn[N]=O(O({},Vn[N]),un.kit);var Hn=In(Vn),Un=O({},hn);Un[N]=O(O({},Un[N]),cn.kit),In(Un);var Wn=dt,Gn=`fa-layers-text`,Kn=ft;In(O({},en));var qn=[`class`,`data-prefix`,`data-icon`,`data-fa-transform`,`data-fa-mask`],Jn=mt,Yn=[].concat(k(sn),k(Sn)),Xn=A.FontAwesomeConfig||{};function Zn(e){var t=j.querySelector(`script[`+e+`]`);if(t)return t.getAttribute(e)}function Qn(e){return e===``?!0:e===`false`?!1:e===`true`?!0:e}j&&typeof j.querySelector==`function`&&[[`data-family-prefix`,`familyPrefix`],[`data-css-prefix`,`cssPrefix`],[`data-family-default`,`familyDefault`],[`data-style-default`,`styleDefault`],[`data-replacement-class`,`replacementClass`],[`data-auto-replace-svg`,`autoReplaceSvg`],[`data-auto-add-css`,`autoAddCss`],[`data-search-pseudo-elements`,`searchPseudoElements`],[`data-search-pseudo-elements-warnings`,`searchPseudoElementsWarnings`],[`data-search-pseudo-elements-full-scan`,`searchPseudoElementsFullScan`],[`data-observe-mutations`,`observeMutations`],[`data-mutate-approach`,`mutateApproach`],[`data-keep-original-source`,`keepOriginalSource`],[`data-measure-performance`,`measurePerformance`],[`data-show-missing-icons`,`showMissingIcons`]].forEach(function(e){var t=Ye(e,2),n=t[0],r=t[1],i=Qn(Zn(n));i!=null&&(Xn[r]=i)});var $n={styleDefault:`solid`,familyDefault:N,cssPrefix:Tn,replacementClass:En,autoReplaceSvg:!0,autoAddCss:!0,searchPseudoElements:!1,searchPseudoElementsWarnings:!0,searchPseudoElementsFullScan:!1,observeMutations:!0,mutateApproach:`async`,keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};Xn.familyPrefix&&(Xn.cssPrefix=Xn.familyPrefix);var I=O(O({},$n),Xn);I.autoReplaceSvg||(I.observeMutations=!1);var L={};Object.keys($n).forEach(function(e){Object.defineProperty(L,e,{enumerable:!0,set:function(t){I[e]=t,er.forEach(function(e){return e(L)})},get:function(){return I[e]}})}),Object.defineProperty(L,"familyPrefix",{enumerable:!0,set:function(e){I.cssPrefix=e,er.forEach(function(e){return e(L)})},get:function(){return I.cssPrefix}}),A.FontAwesomeConfig=L;var er=[];function tr(e){return er.push(e),function(){er.splice(er.indexOf(e),1)}}var R=wn,z={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function nr(e){if(!(!e||!M)){var t=j.createElement(`style`);t.setAttribute(`type`,`text/css`),t.innerHTML=e;for(var n=j.head.childNodes,r=null,i=n.length-1;i>-1;i--){var a=n[i],o=(a.tagName||``).toUpperCase();[`STYLE`,`LINK`].indexOf(o)>-1&&(r=a)}return j.head.insertBefore(t,r),e}}var rr=`0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`;function ir(){for(var e=12,t=``;e-- >0;)t+=rr[Math.random()*62|0];return t}function B(e){for(var t=[],n=(e||[]).length>>>0;n--;)t[n]=e[n];return t}function ar(e){return e.classList?B(e.classList):(e.getAttribute(`class`)||``).split(` `).filter(function(e){return e})}function or(e){return`${e}`.replace(/&/g,`&amp;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}function sr(e){return Object.keys(e||{}).reduce(function(t,n){return t+`${n}="${or(e[n])}" `},``).trim()}function cr(e){return Object.keys(e||{}).reduce(function(t,n){return t+`${n}: ${e[n].trim()};`},``)}function lr(e){return e.size!==z.size||e.x!==z.x||e.y!==z.y||e.rotate!==z.rotate||e.flipX||e.flipY}function ur(e){var t=e.transform,n=e.containerWidth,r=e.iconWidth;return{outer:{transform:`translate(${n/2} 256)`},inner:{transform:`${`translate(${t.x*32}, ${t.y*32}) `} ${`scale(${t.size/16*(t.flipX?-1:1)}, ${t.size/16*(t.flipY?-1:1)}) `} ${`rotate(${t.rotate} 0 0)`}`},path:{transform:`translate(${r/2*-1} -256)`}}}function dr(e){var t=e.transform,n=e.width,r=n===void 0?wn:n,i=e.height,a=i===void 0?wn:i,o=e.startCentered,s=o===void 0?!1:o,c=``;return s&&lt?c+=`translate(${t.x/R-r/2}em, ${t.y/R-a/2}em) `:s?c+=`translate(calc(-50% + ${t.x/R}em), calc(-50% + ${t.y/R}em)) `:c+=`translate(${t.x/R}em, ${t.y/R}em) `,c+=`scale(${t.size/R*(t.flipX?-1:1)}, ${t.size/R*(t.flipY?-1:1)}) `,c+=`rotate(${t.rotate}deg) `,c}var fr=`:root, :host {
  --fa-font-solid: normal 900 1em/1 'Font Awesome 7 Free';
  --fa-font-regular: normal 400 1em/1 'Font Awesome 7 Free';
  --fa-font-light: normal 300 1em/1 'Font Awesome 7 Pro';
  --fa-font-thin: normal 100 1em/1 'Font Awesome 7 Pro';
  --fa-font-duotone: normal 900 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-regular: normal 400 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-light: normal 300 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-thin: normal 100 1em/1 'Font Awesome 7 Duotone';
  --fa-font-brands: normal 400 1em/1 'Font Awesome 7 Brands';
  --fa-font-sharp-solid: normal 900 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-regular: normal 400 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-light: normal 300 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-thin: normal 100 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-duotone-solid: normal 900 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-regular: normal 400 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-light: normal 300 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-thin: normal 100 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-slab-regular: normal 400 1em/1 'Font Awesome 7 Slab';
  --fa-font-slab-press-regular: normal 400 1em/1 'Font Awesome 7 Slab Press';
  --fa-font-whiteboard-semibold: normal 600 1em/1 'Font Awesome 7 Whiteboard';
  --fa-font-thumbprint-light: normal 300 1em/1 'Font Awesome 7 Thumbprint';
  --fa-font-notdog-solid: normal 900 1em/1 'Font Awesome 7 Notdog';
  --fa-font-notdog-duo-solid: normal 900 1em/1 'Font Awesome 7 Notdog Duo';
  --fa-font-etch-solid: normal 900 1em/1 'Font Awesome 7 Etch';
  --fa-font-graphite-thin: normal 100 1em/1 'Font Awesome 7 Graphite';
  --fa-font-jelly-regular: normal 400 1em/1 'Font Awesome 7 Jelly';
  --fa-font-jelly-fill-regular: normal 400 1em/1 'Font Awesome 7 Jelly Fill';
  --fa-font-jelly-duo-regular: normal 400 1em/1 'Font Awesome 7 Jelly Duo';
  --fa-font-chisel-regular: normal 400 1em/1 'Font Awesome 7 Chisel';
  --fa-font-utility-semibold: normal 600 1em/1 'Font Awesome 7 Utility';
  --fa-font-utility-duo-semibold: normal 600 1em/1 'Font Awesome 7 Utility Duo';
  --fa-font-utility-fill-semibold: normal 600 1em/1 'Font Awesome 7 Utility Fill';
}

.svg-inline--fa {
  box-sizing: content-box;
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285714em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.2em;
}
.svg-inline--fa.fa-xl {
  vertical-align: -0.25em;
}
.svg-inline--fa.fa-2xl {
  vertical-align: -0.3125em;
}
.svg-inline--fa.fa-pull-left,
.svg-inline--fa .fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-pull-right,
.svg-inline--fa .fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  inset-block-start: 0.25em; /* syncing vertical alignment with Web Font rendering */
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.fa-layers .svg-inline--fa {
  inset: 0;
  margin: auto;
  position: absolute;
  transform-origin: center center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
}

.fa-layers-counter {
  background-color: var(--fa-counter-background-color, #ff253a);
  border-radius: var(--fa-counter-border-radius, 1em);
  box-sizing: border-box;
  color: var(--fa-inverse, #fff);
  line-height: var(--fa-counter-line-height, 1);
  max-width: var(--fa-counter-max-width, 5em);
  min-width: var(--fa-counter-min-width, 1.5em);
  overflow: hidden;
  padding: var(--fa-counter-padding, 0.25em 0.5em);
  right: var(--fa-right, 0);
  text-overflow: ellipsis;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-counter-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: var(--fa-bottom, 0);
  right: var(--fa-right, 0);
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: var(--fa-bottom, 0);
  left: var(--fa-left, 0);
  right: auto;
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom left;
}

.fa-layers-top-right {
  top: var(--fa-top, 0);
  right: var(--fa-right, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-top-left {
  left: var(--fa-left, 0);
  right: auto;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top left;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-2xs {
  font-size: calc(10 / 16 * 1em); /* converts a 10px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 10 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 10 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xs {
  font-size: calc(12 / 16 * 1em); /* converts a 12px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 12 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 12 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-sm {
  font-size: calc(14 / 16 * 1em); /* converts a 14px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 14 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 14 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-lg {
  font-size: calc(20 / 16 * 1em); /* converts a 20px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 20 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 20 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xl {
  font-size: calc(24 / 16 * 1em); /* converts a 24px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 24 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 24 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-2xl {
  font-size: calc(32 / 16 * 1em); /* converts a 32px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 32 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 32 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-width-auto {
  --fa-width: auto;
}

.fa-fw,
.fa-width-fixed {
  --fa-width: 1.25em;
}

.fa-ul {
  list-style-type: none;
  margin-inline-start: var(--fa-li-margin, 2.5em);
  padding-inline-start: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

/* Heads Up: Bordered Icons will not be supported in the future!
  - This feature will be deprecated in the next major release of Font Awesome (v8)!
  - You may continue to use it in this version *v7), but it will not be supported in Font Awesome v8.
*/
/* Notes:
* --@{v.$css-prefix}-border-width = 1/16 by default (to render as ~1px based on a 16px default font-size)
* --@{v.$css-prefix}-border-padding =
  ** 3/16 for vertical padding (to give ~2px of vertical whitespace around an icon considering it's vertical alignment)
  ** 4/16 for horizontal padding (to give ~4px of horizontal whitespace around an icon)
*/
.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.0625em);
  box-sizing: var(--fa-border-box-sizing, content-box);
  padding: var(--fa-border-padding, 0.1875em 0.25em);
}

.fa-pull-left,
.fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right,
.fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}

.fa-beat {
  animation-name: fa-beat;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-bounce {
  animation-name: fa-bounce;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}

.fa-fade {
  animation-name: fa-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-beat-fade {
  animation-name: fa-beat-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-flip {
  animation-name: fa-flip;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-shake {
  animation-name: fa-shake;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin {
  animation-name: fa-spin;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 2s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-reverse {
  --fa-animation-direction: reverse;
}

.fa-pulse,
.fa-spin-pulse {
  animation-name: fa-spin;
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, steps(8));
}

@media (prefers-reduced-motion: reduce) {
  .fa-beat,
  .fa-bounce,
  .fa-fade,
  .fa-beat-fade,
  .fa-flip,
  .fa-pulse,
  .fa-shake,
  .fa-spin,
  .fa-spin-pulse {
    animation: none !important;
    transition: none !important;
  }
}
@keyframes fa-beat {
  0%, 90% {
    transform: scale(1);
  }
  45% {
    transform: scale(var(--fa-beat-scale, 1.25));
  }
}
@keyframes fa-bounce {
  0% {
    transform: scale(1, 1) translateY(0);
  }
  10% {
    transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
  }
  30% {
    transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
  }
  50% {
    transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
  }
  57% {
    transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
  }
  64% {
    transform: scale(1, 1) translateY(0);
  }
  100% {
    transform: scale(1, 1) translateY(0);
  }
}
@keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity, 0.4);
  }
}
@keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(var(--fa-beat-fade-scale, 1.125));
  }
}
@keyframes fa-flip {
  50% {
    transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
  }
}
@keyframes fa-shake {
  0% {
    transform: rotate(-15deg);
  }
  4% {
    transform: rotate(15deg);
  }
  8%, 24% {
    transform: rotate(-18deg);
  }
  12%, 28% {
    transform: rotate(18deg);
  }
  16% {
    transform: rotate(-22deg);
  }
  20% {
    transform: rotate(22deg);
  }
  32% {
    transform: rotate(-12deg);
  }
  36% {
    transform: rotate(12deg);
  }
  40%, 100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.fa-rotate-90 {
  transform: rotate(90deg);
}

.fa-rotate-180 {
  transform: rotate(180deg);
}

.fa-rotate-270 {
  transform: rotate(270deg);
}

.fa-flip-horizontal {
  transform: scale(-1, 1);
}

.fa-flip-vertical {
  transform: scale(1, -1);
}

.fa-flip-both,
.fa-flip-horizontal.fa-flip-vertical {
  transform: scale(-1, -1);
}

.fa-rotate-by {
  transform: rotate(var(--fa-rotate-angle, 0));
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}

.svg-inline--fa.fa-inverse {
  fill: var(--fa-inverse, #fff);
}

.fa-stack {
  display: inline-block;
  height: 2em;
  line-height: 2em;
  position: relative;
  vertical-align: middle;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.svg-inline--fa.fa-stack-1x {
  --fa-width: 1.25em;
  height: 1em;
  width: var(--fa-width);
}
.svg-inline--fa.fa-stack-2x {
  --fa-width: 2.5em;
  height: 2em;
  width: var(--fa-width);
}

.fa-stack-1x,
.fa-stack-2x {
  inset: 0;
  margin: auto;
  position: absolute;
  z-index: var(--fa-stack-z-index, auto);
}`;function pr(){var e=Tn,t=En,n=L.cssPrefix,r=L.replacementClass,i=fr;if(n!==e||r!==t){var a=RegExp(`\\.${e}\\-`,`g`),o=RegExp(`\\--${e}\\-`,`g`),s=RegExp(`\\.${t}`,`g`);i=i.replace(a,`.${n}-`).replace(o,`--${n}-`).replace(s,`.${r}`)}return i}var mr=!1;function hr(){L.autoAddCss&&!mr&&(nr(pr()),mr=!0)}var gr={mixout:function(){return{dom:{css:pr,insertCss:hr}}},hooks:function(){return{beforeDOMElementCreation:function(){hr()},beforeI2svg:function(){hr()}}}},V=A||{};V[P]||(V[P]={}),V[P].styles||(V[P].styles={}),V[P].hooks||(V[P].hooks={}),V[P].shims||(V[P].shims=[]);var H=V[P],_r=[],vr=function(){j.removeEventListener(`DOMContentLoaded`,vr),yr=1,_r.map(function(e){return e()})},yr=!1;M&&(yr=(j.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(j.readyState),yr||j.addEventListener(`DOMContentLoaded`,vr));function br(e){M&&(yr?setTimeout(e,0):_r.push(e))}function xr(e){var t=e.tag,n=e.attributes,r=n===void 0?{}:n,i=e.children,a=i===void 0?[]:i;return typeof e==`string`?or(e):`<${t} ${sr(r)}>${a.map(xr).join(``)}</${t}>`}function Sr(e,t,n){if(e&&e[t]&&e[t][n])return{prefix:t,iconName:n,icon:e[t][n]}}var Cr=function(e,t){return function(n,r,i,a){return e.call(t,n,r,i,a)}},wr=function(e,t,n,r){var i=Object.keys(e),a=i.length,o=r===void 0?t:Cr(t,r),s,c,l;for(n===void 0?(s=1,l=e[i[0]]):(s=0,l=n);s<a;s++)c=i[s],l=o(l,e[c],c,e);return l};function Tr(e){return k(e).length===1?e.codePointAt(0).toString(16):null}function Er(e){return Object.keys(e).reduce(function(t,n){var r=e[n];return r.icon?t[r.iconName]=r.icon:t[n]=r,t},{})}function Dr(e,t){var n=(arguments.length>2&&arguments[2]!==void 0?arguments[2]:{}).skipHooks,r=n===void 0?!1:n,i=Er(t);typeof H.hooks.addPack==`function`&&!r?H.hooks.addPack(e,Er(t)):H.styles[e]=O(O({},H.styles[e]||{}),i),e===`fas`&&Dr(`fa`,t)}var Or=H.styles,kr=H.shims,Ar=Object.keys(Hn),jr=Ar.reduce(function(e,t){return e[t]=Object.keys(Hn[t]),e},{}),Mr=null,Nr={},Pr={},Fr={},Ir={},Lr={};function Rr(e){return~Yn.indexOf(e)}function zr(e,t){var n=t.split(`-`),r=n[0],i=n.slice(1).join(`-`);return r===e&&i!==``&&!Rr(i)?i:null}var Br=function(){var e=function(e){return wr(Or,function(t,n,r){return t[r]=wr(n,e,{}),t},{})};Nr=e(function(e,t,n){return t[3]&&(e[t[3]]=n),t[2]&&t[2].filter(function(e){return typeof e==`number`}).forEach(function(t){e[t.toString(16)]=n}),e}),Pr=e(function(e,t,n){return e[n]=n,t[2]&&t[2].filter(function(e){return typeof e==`string`}).forEach(function(t){e[t]=n}),e}),Lr=e(function(e,t,n){var r=t[2];return e[n]=n,r.forEach(function(t){e[t]=n}),e});var t=`far`in Or||L.autoFetchSvg,n=wr(kr,function(e,n){var r=n[0],i=n[1],a=n[2];return i===`far`&&!t&&(i=`fas`),typeof r==`string`&&(e.names[r]={prefix:i,iconName:a}),typeof r==`number`&&(e.unicodes[r.toString(16)]={prefix:i,iconName:a}),e},{names:{},unicodes:{}});Fr=n.names,Ir=n.unicodes,Mr=qr(L.styleDefault,{family:L.familyDefault})};tr(function(e){Mr=qr(e.styleDefault,{family:L.familyDefault})}),Br();function Vr(e,t){return(Nr[e]||{})[t]}function Hr(e,t){return(Pr[e]||{})[t]}function U(e,t){return(Lr[e]||{})[t]}function Ur(e){return Fr[e]||{prefix:null,iconName:null}}function Wr(e){var t=Ir[e],n=Vr(`fas`,e);return t||(n?{prefix:`fas`,iconName:n}:null)||{prefix:null,iconName:null}}function W(){return Mr}var Gr=function(){return{prefix:null,iconName:null,rest:[]}};function Kr(e){var t=N,n=Ar.reduce(function(e,t){return e[t]=`${L.cssPrefix}-${t}`,e},{});return $t.forEach(function(r){(e.includes(n[r])||e.some(function(e){return jr[r].includes(e)}))&&(t=r)}),t}function qr(e){var t=(arguments.length>1&&arguments[1]!==void 0?arguments[1]:{}).family,n=t===void 0?N:t,r=Rn[n][e];if(n===gt&&!e)return`fad`;var i=Bn[n][e]||Bn[n][r],a=e in H.styles?e:null;return i||a||null}function Jr(e){var t=[],n=null;return e.forEach(function(e){var r=zr(L.cssPrefix,e);r?n=r:e&&t.push(e)}),{iconName:n,rest:t}}function Yr(e){return e.sort().filter(function(e,t,n){return n.indexOf(e)===t})}var Xr=vn.concat(an);function Zr(e){var t=(arguments.length>1&&arguments[1]!==void 0?arguments[1]:{}).skipLookups,n=t===void 0?!1:t,r=null,i=Yr(e.filter(function(e){return Xr.includes(e)})),a=Yr(e.filter(function(e){return!Xr.includes(e)})),o=Ye(i.filter(function(e){return r=e,!ht.includes(e)}),1)[0],s=o===void 0?null:o,c=Kr(i),l=O(O({},Jr(a)),{},{prefix:qr(s,{family:c})});return O(O(O({},l),ti({values:e,family:c,styles:Or,config:L,canonical:l,givenPrefix:r})),Qr(n,r,l))}function Qr(e,t,n){var r=n.prefix,i=n.iconName;if(e||!r||!i)return{prefix:r,iconName:i};var a=t===`fa`?Ur(i):{},o=U(r,i);return i=a.iconName||o||i,r=a.prefix||r,r===`far`&&!Or.far&&Or.fas&&!L.autoFetchSvg&&(r=`fas`),{prefix:r,iconName:i}}var $r=$t.filter(function(e){return e!==N||e!==gt}),ei=Object.keys(_n).filter(function(e){return e!==N}).map(function(e){return Object.keys(_n[e])}).flat();function ti(e){var t=e.values,n=e.family,r=e.canonical,i=e.givenPrefix,a=i===void 0?``:i,o=e.styles,s=o===void 0?{}:o,c=e.config,l=c===void 0?{}:c,u=n===gt,d=t.includes(`fa-duotone`)||t.includes(`fad`),f=l.familyDefault===`duotone`,p=r.prefix===`fad`||r.prefix===`fa-duotone`;return!u&&(d||f||p)&&(r.prefix=`fad`),(t.includes(`fa-brands`)||t.includes(`fab`))&&(r.prefix=`fab`),!r.prefix&&$r.includes(n)&&(Object.keys(s).find(function(e){return ei.includes(e)})||l.autoFetchSvg)&&(r.prefix=nn.get(n).defaultShortPrefixId,r.iconName=U(r.prefix,r.iconName)||r.iconName),(r.prefix===`fa`||a===`fa`)&&(r.prefix=W()||`fas`),r}var ni=function(){function e(){Be(this,e),this.definitions={}}return He(e,[{key:`add`,value:function(){var e=this,t=[...arguments].reduce(this._pullDefinitions,{});Object.keys(t).forEach(function(n){e.definitions[n]=O(O({},e.definitions[n]||{}),t[n]),Dr(n,t[n]);var r=Hn[N][n];r&&Dr(r,t[n]),Br()})}},{key:`reset`,value:function(){this.definitions={}}},{key:`_pullDefinitions`,value:function(e,t){var n=t.prefix&&t.iconName&&t.icon?{0:t}:t;return Object.keys(n).map(function(t){var r=n[t],i=r.prefix,a=r.iconName,o=r.icon,s=o[2];e[i]||(e[i]={}),s.length>0&&s.forEach(function(t){typeof t==`string`&&(e[i][t]=o)}),e[i][a]=o}),e}}])}(),ri=[],G={},K={},ii=Object.keys(K);function ai(e,t){var n=t.mixoutsTo;return ri=e,G={},Object.keys(K).forEach(function(e){ii.indexOf(e)===-1&&delete K[e]}),ri.forEach(function(e){var t=e.mixout?e.mixout():{};if(Object.keys(t).forEach(function(e){typeof t[e]==`function`&&(n[e]=t[e]),Qe(t[e])===`object`&&Object.keys(t[e]).forEach(function(r){n[e]||(n[e]={}),n[e][r]=t[e][r]})}),e.hooks){var r=e.hooks();Object.keys(r).forEach(function(e){G[e]||(G[e]=[]),G[e].push(r[e])})}e.provides&&e.provides(K)}),n}function oi(e,t){var n=[...arguments].slice(2);return(G[e]||[]).forEach(function(e){t=e.apply(null,[t].concat(n))}),t}function q(e){var t=[...arguments].slice(1);(G[e]||[]).forEach(function(e){e.apply(null,t)})}function J(){var e=arguments[0],t=Array.prototype.slice.call(arguments,1);return K[e]?K[e].apply(null,t):void 0}function si(e){e.prefix===`fa`&&(e.prefix=`fas`);var t=e.iconName,n=e.prefix||W();if(t)return t=U(n,t)||t,Sr(ci.definitions,n,t)||Sr(H.styles,n,t)}var ci=new ni,Y={noAuto:function(){L.autoReplaceSvg=!1,L.observeMutations=!1,q(`noAuto`)},config:L,dom:{i2svg:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return M?(q(`beforeI2svg`,e),J(`pseudoElements2svg`,e),J(`i2svg`,e)):Promise.reject(Error(`Operation requires a DOM of some kind.`))},watch:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=e.autoReplaceSvgRoot;L.autoReplaceSvg===!1&&(L.autoReplaceSvg=!0),L.observeMutations=!0,br(function(){li({autoReplaceSvgRoot:t}),q(`watch`,e)})}},parse:{icon:function(e){if(e===null)return null;if(Qe(e)===`object`&&e.prefix&&e.iconName)return{prefix:e.prefix,iconName:U(e.prefix,e.iconName)||e.iconName};if(Array.isArray(e)&&e.length===2){var t=e[1].indexOf(`fa-`)===0?e[1].slice(3):e[1],n=qr(e[0]);return{prefix:n,iconName:U(n,t)||t}}if(typeof e==`string`&&(e.indexOf(`${L.cssPrefix}-`)>-1||e.match(Wn))){var r=Zr(e.split(` `),{skipLookups:!0});return{prefix:r.prefix||W(),iconName:U(r.prefix,r.iconName)||r.iconName}}if(typeof e==`string`){var i=W();return{prefix:i,iconName:U(i,e)||e}}}},library:ci,findIconDefinition:si,toHtml:xr},li=function(){var e=(arguments.length>0&&arguments[0]!==void 0?arguments[0]:{}).autoReplaceSvgRoot,t=e===void 0?j:e;(Object.keys(H.styles).length>0||L.autoFetchSvg)&&M&&L.autoReplaceSvg&&Y.dom.i2svg({node:t})};function ui(e,t){return Object.defineProperty(e,"abstract",{get:t}),Object.defineProperty(e,"html",{get:function(){return e.abstract.map(function(e){return xr(e)})}}),Object.defineProperty(e,"node",{get:function(){if(M){var t=j.createElement(`div`);return t.innerHTML=e.html,t.children}}}),e}function di(e){var t=e.children,n=e.main,r=e.mask,i=e.attributes,a=e.styles,o=e.transform;if(lr(o)&&n.found&&!r.found){var s={x:n.width/n.height/2,y:.5};i.style=cr(O(O({},a),{},{"transform-origin":`${s.x+o.x/16}em ${s.y+o.y/16}em`}))}return[{tag:`svg`,attributes:i,children:t}]}function fi(e){var t=e.prefix,n=e.iconName,r=e.children,i=e.attributes,a=e.symbol,o=a===!0?`${t}-${L.cssPrefix}-${n}`:a;return[{tag:`svg`,attributes:{style:`display: none;`},children:[{tag:`symbol`,attributes:O(O({},i),{},{id:o}),children:r}]}]}function pi(e){return[`aria-label`,`aria-labelledby`,`title`,`role`].some(function(t){return t in e})}function mi(e){var t=e.icons,n=t.main,r=t.mask,i=e.prefix,a=e.iconName,o=e.transform,s=e.symbol,c=e.maskId,l=e.extra,u=e.watchable,d=u===void 0?!1:u,f=r.found?r:n,p=f.width,m=f.height,h=[L.replacementClass,a?`${L.cssPrefix}-${a}`:``].filter(function(e){return l.classes.indexOf(e)===-1}).filter(function(e){return e!==``||!!e}).concat(l.classes).join(` `),g={children:[],attributes:O(O({},l.attributes),{},{"data-prefix":i,"data-icon":a,class:h,role:l.attributes.role||`img`,viewBox:`0 0 ${p} ${m}`})};!pi(l.attributes)&&!l.attributes[`aria-hidden`]&&(g.attributes[`aria-hidden`]=`true`),d&&(g.attributes[F]=``);var _=O(O({},g),{},{prefix:i,iconName:a,main:n,mask:r,maskId:c,transform:o,symbol:s,styles:O({},l.styles)}),v=r.found&&n.found?J(`generateAbstractMask`,_)||{children:[],attributes:{}}:J(`generateAbstractIcon`,_)||{children:[],attributes:{}},y=v.children,b=v.attributes;return _.children=y,_.attributes=b,s?fi(_):di(_)}function hi(e){var t=e.content,n=e.width,r=e.height,i=e.transform,a=e.extra,o=e.watchable,s=o===void 0?!1:o,c=O(O({},a.attributes),{},{class:a.classes.join(` `)});s&&(c[F]=``);var l=O({},a.styles);lr(i)&&(l.transform=dr({transform:i,startCentered:!0,width:n,height:r}),l[`-webkit-transform`]=l.transform);var u=cr(l);u.length>0&&(c.style=u);var d=[];return d.push({tag:`span`,attributes:c,children:[t]}),d}function gi(e){var t=e.content,n=e.extra,r=O(O({},n.attributes),{},{class:n.classes.join(` `)}),i=cr(n.styles);i.length>0&&(r.style=i);var a=[];return a.push({tag:`span`,attributes:r,children:[t]}),a}var _i=H.styles;function vi(e){var t=e[0],n=e[1],r=Ye(e.slice(4),1)[0],i=null;return i=Array.isArray(r)?{tag:`g`,attributes:{class:`${L.cssPrefix}-${Jn.GROUP}`},children:[{tag:`path`,attributes:{class:`${L.cssPrefix}-${Jn.SECONDARY}`,fill:`currentColor`,d:r[0]}},{tag:`path`,attributes:{class:`${L.cssPrefix}-${Jn.PRIMARY}`,fill:`currentColor`,d:r[1]}}]}:{tag:`path`,attributes:{fill:`currentColor`,d:r}},{found:!0,width:t,height:n,icon:i}}var yi={found:!1,width:512,height:512};function bi(e,t){!Fn&&!L.showMissingIcons&&e&&console.error(`Icon with name "${e}" and prefix "${t}" is missing.`)}function xi(e,t){var n=t;return t===`fa`&&L.styleDefault!==null&&(t=W()),new Promise(function(r,i){if(n===`fa`){var a=Ur(e)||{};e=a.iconName||e,t=a.prefix||t}if(e&&t&&_i[t]&&_i[t][e]){var o=_i[t][e];return r(vi(o))}bi(e,t),r(O(O({},yi),{},{icon:L.showMissingIcons&&e&&J(`missingIconAbstract`)||{}}))})}var Si=function(){},Ci=L.measurePerformance&&ct&&ct.mark&&ct.measure?ct:{mark:Si,measure:Si},wi=`FA "7.2.0"`,Ti=function(e){return Ci.mark(`${wi} ${e} begins`),function(){return Ei(e)}},Ei=function(e){Ci.mark(`${wi} ${e} ends`),Ci.measure(`${wi} ${e}`,`${wi} ${e} begins`,`${wi} ${e} ends`)},Di={begin:Ti,end:Ei},Oi=function(){};function ki(e){return typeof(e.getAttribute?e.getAttribute(F):null)==`string`}function Ai(e){var t=e.getAttribute?e.getAttribute(kn):null,n=e.getAttribute?e.getAttribute(An):null;return t&&n}function ji(e){return e&&e.classList&&e.classList.contains&&e.classList.contains(L.replacementClass)}function Mi(){return L.autoReplaceSvg===!0?Li.replace:Li[L.autoReplaceSvg]||Li.replace}function Ni(e){return j.createElementNS(`http://www.w3.org/2000/svg`,e)}function Pi(e){return j.createElement(e)}function Fi(e){var t=(arguments.length>1&&arguments[1]!==void 0?arguments[1]:{}).ceFn,n=t===void 0?e.tag===`svg`?Ni:Pi:t;if(typeof e==`string`)return j.createTextNode(e);var r=n(e.tag);return Object.keys(e.attributes||[]).forEach(function(t){r.setAttribute(t,e.attributes[t])}),(e.children||[]).forEach(function(e){r.appendChild(Fi(e,{ceFn:n}))}),r}function Ii(e){var t=` ${e.outerHTML} `;return t=`${t}Font Awesome fontawesome.com `,t}var Li={replace:function(e){var t=e[0];if(t.parentNode)if(e[1].forEach(function(e){t.parentNode.insertBefore(Fi(e),t)}),t.getAttribute(F)===null&&L.keepOriginalSource){var n=j.createComment(Ii(t));t.parentNode.replaceChild(n,t)}else t.remove()},nest:function(e){var t=e[0],n=e[1];if(~ar(t).indexOf(L.replacementClass))return Li.replace(e);var r=RegExp(`${L.cssPrefix}-.*`);if(delete n[0].attributes.id,n[0].attributes.class){var i=n[0].attributes.class.split(` `).reduce(function(e,t){return t===L.replacementClass||t.match(r)?e.toSvg.push(t):e.toNode.push(t),e},{toNode:[],toSvg:[]});n[0].attributes.class=i.toSvg.join(` `),i.toNode.length===0?t.removeAttribute(`class`):t.setAttribute(`class`,i.toNode.join(` `))}var a=n.map(function(e){return xr(e)}).join(`
`);t.setAttribute(F,``),t.innerHTML=a}};function Ri(e){e()}function zi(e,t){var n=typeof t==`function`?t:Oi;if(e.length===0)n();else{var r=Ri;L.mutateApproach===Mn&&(r=A.requestAnimationFrame||Ri),r(function(){var t=Mi(),r=Di.begin(`mutate`);e.map(t),r(),n()})}}var Bi=!1;function Vi(){Bi=!0}function Hi(){Bi=!1}var Ui=null;function Wi(e){if(st&&L.observeMutations){var t=e.treeCallback,n=t===void 0?Oi:t,r=e.nodeCallback,i=r===void 0?Oi:r,a=e.pseudoElementsCallback,o=a===void 0?Oi:a,s=e.observeMutationsRoot,c=s===void 0?j:s;Ui=new st(function(e){if(!Bi){var t=W();B(e).forEach(function(e){if(e.type===`childList`&&e.addedNodes.length>0&&!ki(e.addedNodes[0])&&(L.searchPseudoElements&&o(e.target),n(e.target)),e.type===`attributes`&&e.target.parentNode&&L.searchPseudoElements&&o([e.target],!0),e.type===`attributes`&&ki(e.target)&&~qn.indexOf(e.attributeName))if(e.attributeName===`class`&&Ai(e.target)){var r=Zr(ar(e.target)),a=r.prefix,s=r.iconName;e.target.setAttribute(kn,a||t),s&&e.target.setAttribute(An,s)}else ji(e.target)&&i(e.target)})}}),M&&Ui.observe(c,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}}function Gi(){Ui&&Ui.disconnect()}function Ki(e){var t=e.getAttribute(`style`),n=[];return t&&(n=t.split(`;`).reduce(function(e,t){var n=t.split(`:`),r=n[0],i=n.slice(1);return r&&i.length>0&&(e[r]=i.join(`:`).trim()),e},{})),n}function qi(e){var t=e.getAttribute(`data-prefix`),n=e.getAttribute(`data-icon`),r=e.innerText===void 0?``:e.innerText.trim(),i=Zr(ar(e));return i.prefix||(i.prefix=W()),t&&n&&(i.prefix=t,i.iconName=n),i.iconName&&i.prefix?i:(i.prefix&&r.length>0&&(i.iconName=Hr(i.prefix,e.innerText)||Vr(i.prefix,Tr(e.innerText))),!i.iconName&&L.autoFetchSvg&&e.firstChild&&e.firstChild.nodeType===Node.TEXT_NODE&&(i.iconName=e.firstChild.data),i)}function Ji(e){return B(e.attributes).reduce(function(e,t){return e.name!==`class`&&e.name!==`style`&&(e[t.name]=t.value),e},{})}function Yi(){return{iconName:null,prefix:null,transform:z,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function Xi(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},n=qi(e),r=n.iconName,i=n.prefix,a=n.rest,o=Ji(e),s=oi(`parseNodeAttributes`,{},e);return O({iconName:r,prefix:i,transform:z,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:a,styles:t.styleParser?Ki(e):[],attributes:o}},s)}var Zi=H.styles;function Qi(e){var t=L.autoReplaceSvg===`nest`?Xi(e,{styleParser:!1}):Xi(e);return~t.extra.classes.indexOf(Gn)?J(`generateLayersText`,e,t):J(`generateSvgReplacementMutation`,e,t)}function $i(){return[].concat(k(an),k(vn))}function ea(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!M)return Promise.resolve();var n=j.documentElement.classList,r=function(e){return n.add(`${jn}-${e}`)},i=function(e){return n.remove(`${jn}-${e}`)},a=L.autoFetchSvg?$i():ht.concat(Object.keys(Zi));a.includes(`fa`)||a.push(`fa`);var o=[`.${Gn}:not([${F}])`].concat(a.map(function(e){return`.${e}:not([${F}])`})).join(`, `);if(o.length===0)return Promise.resolve();var s=[];try{s=B(e.querySelectorAll(o))}catch{}if(s.length>0)r(`pending`),i(`complete`);else return Promise.resolve();var c=Di.begin(`onTree`),l=s.reduce(function(e,t){try{var n=Qi(t);n&&e.push(n)}catch(e){Fn||e.name===`MissingIcon`&&console.error(e)}return e},[]);return new Promise(function(e,n){Promise.all(l).then(function(n){zi(n,function(){r(`active`),r(`complete`),i(`pending`),typeof t==`function`&&t(),c(),e()})}).catch(function(e){c(),n(e)})})}function ta(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;Qi(e).then(function(e){e&&zi([e],t)})}function na(e){return function(t){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=(t||{}).icon?t:si(t||{}),i=n.mask;return i&&(i=(i||{}).icon?i:si(i||{})),e(r,O(O({},n),{},{mask:i}))}}var ra=function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.transform,r=n===void 0?z:n,i=t.symbol,a=i===void 0?!1:i,o=t.mask,s=o===void 0?null:o,c=t.maskId,l=c===void 0?null:c,u=t.classes,d=u===void 0?[]:u,f=t.attributes,p=f===void 0?{}:f,m=t.styles,h=m===void 0?{}:m;if(e){var g=e.prefix,_=e.iconName,v=e.icon;return ui(O({type:`icon`},e),function(){return q(`beforeDOMElementCreation`,{iconDefinition:e,params:t}),mi({icons:{main:vi(v),mask:s?vi(s.icon):{found:!1,width:null,height:null,icon:{}}},prefix:g,iconName:_,transform:O(O({},z),r),symbol:a,maskId:l,extra:{attributes:p,styles:h,classes:d}})})}},ia={mixout:function(){return{icon:na(ra)}},hooks:function(){return{mutationObserverCallbacks:function(e){return e.treeCallback=ea,e.nodeCallback=ta,e}}},provides:function(e){e.i2svg=function(e){var t=e.node,n=t===void 0?j:t,r=e.callback;return ea(n,r===void 0?function(){}:r)},e.generateSvgReplacementMutation=function(e,t){var n=t.iconName,r=t.prefix,i=t.transform,a=t.symbol,o=t.mask,s=t.maskId,c=t.extra;return new Promise(function(t,l){Promise.all([xi(n,r),o.iconName?xi(o.iconName,o.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(function(o){var l=Ye(o,2),u=l[0],d=l[1];t([e,mi({icons:{main:u,mask:d},prefix:r,iconName:n,transform:i,symbol:a,maskId:s,extra:c,watchable:!0})])}).catch(l)})},e.generateAbstractIcon=function(e){var t=e.children,n=e.attributes,r=e.main,i=e.transform,a=e.styles,o=cr(a);o.length>0&&(n.style=o);var s;return lr(i)&&(s=J(`generateAbstractTransformGrouping`,{main:r,transform:i,containerWidth:r.width,iconWidth:r.width})),t.push(s||r.icon),{children:t,attributes:n}}}},aa={mixout:function(){return{layer:function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.classes,r=n===void 0?[]:n;return ui({type:`layer`},function(){q(`beforeDOMElementCreation`,{assembler:e,params:t});var n=[];return e(function(e){Array.isArray(e)?e.map(function(e){n=n.concat(e.abstract)}):n=n.concat(e.abstract)}),[{tag:`span`,attributes:{class:[`${L.cssPrefix}-layers`].concat(k(r)).join(` `)},children:n}]})}}}},oa={mixout:function(){return{counter:function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.title,r=n===void 0?null:n,i=t.classes,a=i===void 0?[]:i,o=t.attributes,s=o===void 0?{}:o,c=t.styles,l=c===void 0?{}:c;return ui({type:`counter`,content:e},function(){return q(`beforeDOMElementCreation`,{content:e,params:t}),gi({content:e.toString(),title:r,extra:{attributes:s,styles:l,classes:[`${L.cssPrefix}-layers-counter`].concat(k(a))}})})}}}},sa={mixout:function(){return{text:function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.transform,r=n===void 0?z:n,i=t.classes,a=i===void 0?[]:i,o=t.attributes,s=o===void 0?{}:o,c=t.styles,l=c===void 0?{}:c;return ui({type:`text`,content:e},function(){return q(`beforeDOMElementCreation`,{content:e,params:t}),hi({content:e,transform:O(O({},z),r),extra:{attributes:s,styles:l,classes:[`${L.cssPrefix}-layers-text`].concat(k(a))}})})}}},provides:function(e){e.generateLayersText=function(e,t){var n=t.transform,r=t.extra,i=null,a=null;if(lt){var o=parseInt(getComputedStyle(e).fontSize,10),s=e.getBoundingClientRect();i=s.width/o,a=s.height/o}return Promise.resolve([e,hi({content:e.innerHTML,width:i,height:a,transform:n,extra:r,watchable:!0})])}}},ca=RegExp(`"`,`ug`),la=[1105920,1112319],ua=O(O(O(O({},{FontAwesome:{normal:`fas`,400:`fas`}}),tn),Cn),ln),da=Object.keys(ua).reduce(function(e,t){return e[t.toLowerCase()]=ua[t],e},{}),fa=Object.keys(da).reduce(function(e,t){var n=da[t];return e[t]=n[900]||k(Object.entries(n))[0][1],e},{});function pa(e){return Tr(k(e.replace(ca,``))[0]||``)}function ma(e){var t=e.getPropertyValue(`font-feature-settings`).includes(`ss01`),n=e.getPropertyValue(`content`).replace(ca,``),r=n.codePointAt(0),i=r>=la[0]&&r<=la[1],a=n.length===2?n[0]===n[1]:!1;return i||a||t}function ha(e,t){var n=e.replace(/^['"]|['"]$/g,``).toLowerCase(),r=parseInt(t),i=isNaN(r)?`normal`:r;return(da[n]||{})[i]||fa[n]}function ga(e,t){var n=`${On}${t.replace(`:`,`-`)}`;return new Promise(function(r,i){if(e.getAttribute(n)!==null)return r();var a=B(e.children).filter(function(e){return e.getAttribute(Dn)===t})[0],o=A.getComputedStyle(e,t),s=o.getPropertyValue(`font-family`),c=s.match(Kn),l=o.getPropertyValue(`font-weight`),u=o.getPropertyValue(`content`);if(a&&!c)return e.removeChild(a),r();if(c&&u!==`none`&&u!==``){var d=o.getPropertyValue(`content`),f=ha(s,l),p=pa(d),m=c[0].startsWith(`FontAwesome`),h=ma(o),g=Vr(f,p),_=g;if(m){var v=Wr(p);v.iconName&&v.prefix&&(g=v.iconName,f=v.prefix)}if(g&&!h&&(!a||a.getAttribute(kn)!==f||a.getAttribute(An)!==_)){e.setAttribute(n,_),a&&e.removeChild(a);var y=Yi(),b=y.extra;b.attributes[Dn]=t,xi(g,f).then(function(i){var a=mi(O(O({},y),{},{icons:{main:i,mask:Gr()},prefix:f,iconName:_,extra:b,watchable:!0})),o=j.createElementNS(`http://www.w3.org/2000/svg`,`svg`);t===`::before`?e.insertBefore(o,e.firstChild):e.appendChild(o),o.outerHTML=a.map(function(e){return xr(e)}).join(`
`),e.removeAttribute(n),r()}).catch(i)}else r()}else r()})}function _a(e){return Promise.all([ga(e,`::before`),ga(e,`::after`)])}function va(e){return e.parentNode!==document.head&&!~Nn.indexOf(e.tagName.toUpperCase())&&!e.getAttribute(Dn)&&(!e.parentNode||e.parentNode.tagName!==`svg`)}var ya=function(e){return!!e&&Pn.some(function(t){return e.includes(t)})},ba=function(e){if(!e)return[];var t=new Set,n=e.split(/,(?![^()]*\))/).map(function(e){return e.trim()});n=n.flatMap(function(e){return e.includes(`(`)?e:e.split(`,`).map(function(e){return e.trim()})});var r=Ue(n),i;try{for(r.s();!(i=r.n()).done;){var a=i.value;if(ya(a)){var o=Pn.reduce(function(e,t){return e.replace(t,``)},a);o!==``&&o!==`*`&&t.add(o)}}}catch(e){r.e(e)}finally{r.f()}return t};function xa(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;if(M){var n;if(t)n=e;else if(L.searchPseudoElementsFullScan)n=e.querySelectorAll(`*`);else{var r=new Set,i=Ue(document.styleSheets),a;try{for(i.s();!(a=i.n()).done;){var o=a.value;try{var s=Ue(o.cssRules),c;try{for(s.s();!(c=s.n()).done;){var l=c.value,u=Ue(ba(l.selectorText)),d;try{for(u.s();!(d=u.n()).done;){var f=d.value;r.add(f)}}catch(e){u.e(e)}finally{u.f()}}}catch(e){s.e(e)}finally{s.f()}}catch(e){L.searchPseudoElementsWarnings&&console.warn(`Font Awesome: cannot parse stylesheet: ${o.href} (${e.message})
If it declares any Font Awesome CSS pseudo-elements, they will not be rendered as SVG icons. Add crossorigin="anonymous" to the <link>, enable searchPseudoElementsFullScan for slower but more thorough DOM parsing, or suppress this warning by setting searchPseudoElementsWarnings to false.`)}}}catch(e){i.e(e)}finally{i.f()}if(!r.size)return;var p=Array.from(r).join(`, `);try{n=e.querySelectorAll(p)}catch{}}return new Promise(function(e,t){var r=B(n).filter(va).map(_a),i=Di.begin(`searchPseudoElements`);Vi(),Promise.all(r).then(function(){i(),Hi(),e()}).catch(function(){i(),Hi(),t()})})}}var Sa={hooks:function(){return{mutationObserverCallbacks:function(e){return e.pseudoElementsCallback=xa,e}}},provides:function(e){e.pseudoElements2svg=function(e){var t=e.node,n=t===void 0?j:t;L.searchPseudoElements&&xa(n)}}},Ca=!1,wa={mixout:function(){return{dom:{unwatch:function(){Vi(),Ca=!0}}}},hooks:function(){return{bootstrap:function(){Wi(oi(`mutationObserverCallbacks`,{}))},noAuto:function(){Gi()},watch:function(e){var t=e.observeMutationsRoot;Ca?Hi():Wi(oi(`mutationObserverCallbacks`,{observeMutationsRoot:t}))}}}},Ta=function(e){return e.toLowerCase().split(` `).reduce(function(e,t){var n=t.toLowerCase().split(`-`),r=n[0],i=n.slice(1).join(`-`);if(r&&i===`h`)return e.flipX=!0,e;if(r&&i===`v`)return e.flipY=!0,e;if(i=parseFloat(i),isNaN(i))return e;switch(r){case`grow`:e.size+=i;break;case`shrink`:e.size-=i;break;case`left`:e.x-=i;break;case`right`:e.x+=i;break;case`up`:e.y-=i;break;case`down`:e.y+=i;break;case`rotate`:e.rotate+=i;break}return e},{size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0})},Ea={mixout:function(){return{parse:{transform:function(e){return Ta(e)}}}},hooks:function(){return{parseNodeAttributes:function(e,t){var n=t.getAttribute(`data-fa-transform`);return n&&(e.transform=Ta(n)),e}}},provides:function(e){e.generateAbstractTransformGrouping=function(e){var t=e.main,n=e.transform,r=e.containerWidth,i=e.iconWidth,a={outer:{transform:`translate(${r/2} 256)`},inner:{transform:`${`translate(${n.x*32}, ${n.y*32}) `} ${`scale(${n.size/16*(n.flipX?-1:1)}, ${n.size/16*(n.flipY?-1:1)}) `} ${`rotate(${n.rotate} 0 0)`}`},path:{transform:`translate(${i/2*-1} -256)`}};return{tag:`g`,attributes:O({},a.outer),children:[{tag:`g`,attributes:O({},a.inner),children:[{tag:t.icon.tag,children:t.icon.children,attributes:O(O({},t.icon.attributes),a.path)}]}]}}}},Da={x:0,y:0,width:`100%`,height:`100%`};function Oa(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return e.attributes&&(e.attributes.fill||t)&&(e.attributes.fill=`black`),e}function ka(e){return e.tag===`g`?e.children:[e]}ai([gr,ia,aa,oa,sa,Sa,wa,Ea,{hooks:function(){return{parseNodeAttributes:function(e,t){var n=t.getAttribute(`data-fa-mask`),r=n?Zr(n.split(` `).map(function(e){return e.trim()})):Gr();return r.prefix||(r.prefix=W()),e.mask=r,e.maskId=t.getAttribute(`data-fa-mask-id`),e}}},provides:function(e){e.generateAbstractMask=function(e){var t=e.children,n=e.attributes,r=e.main,i=e.mask,a=e.maskId,o=e.transform,s=r.width,c=r.icon,l=i.width,u=i.icon,d=ur({transform:o,containerWidth:l,iconWidth:s}),f={tag:`rect`,attributes:O(O({},Da),{},{fill:`white`})},p=c.children?{children:c.children.map(Oa)}:{},m={tag:`g`,attributes:O({},d.inner),children:[Oa(O({tag:c.tag,attributes:O(O({},c.attributes),d.path)},p))]},h={tag:`g`,attributes:O({},d.outer),children:[m]},g=`mask-${a||ir()}`,_=`clip-${a||ir()}`,v={tag:`mask`,attributes:O(O({},Da),{},{id:g,maskUnits:`userSpaceOnUse`,maskContentUnits:`userSpaceOnUse`}),children:[f,h]},y={tag:`defs`,children:[{tag:`clipPath`,attributes:{id:_},children:ka(u)},v]};return t.push(y,{tag:`rect`,attributes:O({fill:`currentColor`,"clip-path":`url(#${_})`,mask:`url(#${g})`},Da)}),{children:t,attributes:n}}}},{provides:function(e){var t=!1;A.matchMedia&&(t=A.matchMedia(`(prefers-reduced-motion: reduce)`).matches),e.missingIconAbstract=function(){var e=[],n={fill:`currentColor`},r={attributeType:`XML`,repeatCount:`indefinite`,dur:`2s`};e.push({tag:`path`,attributes:O(O({},n),{},{d:`M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z`})});var i=O(O({},r),{},{attributeName:`opacity`}),a={tag:`circle`,attributes:O(O({},n),{},{cx:`256`,cy:`364`,r:`28`}),children:[]};return t||a.children.push({tag:`animate`,attributes:O(O({},r),{},{attributeName:`r`,values:`28;14;28;28;14;28;`})},{tag:`animate`,attributes:O(O({},i),{},{values:`1;0;1;1;0;1;`})}),e.push(a),e.push({tag:`path`,attributes:O(O({},n),{},{opacity:`1`,d:`M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z`}),children:t?[]:[{tag:`animate`,attributes:O(O({},i),{},{values:`1;0;0;0;0;1;`})}]}),t||e.push({tag:`path`,attributes:O(O({},n),{},{opacity:`0`,d:`M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z`}),children:[{tag:`animate`,attributes:O(O({},i),{},{values:`0;0;1;1;0;0;`})}]}),{tag:`g`,attributes:{class:`missing`},children:e}}}},{hooks:function(){return{parseNodeAttributes:function(e,t){var n=t.getAttribute(`data-fa-symbol`);return e.symbol=n===null?!1:n===``?!0:n,e}}}}],{mixoutsTo:Y}),Y.noAuto;var X=Y.config;Y.library,Y.dom;var Aa=Y.parse;Y.findIconDefinition,Y.toHtml;var ja=Y.icon;Y.layer,Y.text,Y.counter;function Ma(e){return e-=0,e===e}function Na(e){return Ma(e)?e:(e=e.replace(/[_-]+(.)?/g,(e,t)=>t?t.toUpperCase():``),e.charAt(0).toLowerCase()+e.slice(1))}var Pa=(e,t)=>w.createElement(`stop`,{key:`${t}-${e.offset}`,offset:e.offset,stopColor:e.color,...e.opacity!==void 0&&{stopOpacity:e.opacity}});function Fa(e){return e.charAt(0).toUpperCase()+e.slice(1)}var Ia=new Map,La=1e3;function Ra(e){if(Ia.has(e))return Ia.get(e);let t={},n=0,r=e.length;for(;n<r;){let i=e.indexOf(`;`,n),a=i===-1?r:i,o=e.slice(n,a).trim();if(o){let e=o.indexOf(`:`);if(e>0){let n=o.slice(0,e).trim(),r=o.slice(e+1).trim();if(n&&r){let e=Na(n);t[e.startsWith(`webkit`)?Fa(e):e]=r}}}n=a+1}if(Ia.size===La){let e=Ia.keys().next().value;e&&Ia.delete(e)}return Ia.set(e,t),t}function za(e,t,n={}){if(typeof t==`string`)return t;let r=(t.children||[]).map(t=>{let r=t;return(`fill`in n||n.gradientFill)&&t.tag===`path`&&`fill`in t.attributes&&(r={...t,attributes:{...t.attributes,fill:void 0}}),za(e,r)}),i=t.attributes||{},a={};for(let[e,t]of Object.entries(i))switch(!0){case e===`class`:a.className=t;break;case e===`style`:a.style=Ra(String(t));break;case e.startsWith(`aria-`):case e.startsWith(`data-`):a[e.toLowerCase()]=t;break;default:a[Na(e)]=t}let{style:o,role:s,"aria-label":c,gradientFill:l,...u}=n;if(o&&(a.style=a.style?{...a.style,...o}:o),s&&(a.role=s),c&&(a[`aria-label`]=c,a[`aria-hidden`]=`false`),l){a.fill=`url(#${l.id})`;let{type:t,stops:n=[],...i}=l;r.unshift(e(t===`linear`?`linearGradient`:`radialGradient`,{...i,id:l.id},n.map(Pa)))}return e(t.tag,{...a,...u},...r)}var Ba=za.bind(null,w.createElement),Va=(e,t)=>{let n=(0,w.useId)();return e||(t?n:void 0)},Ha=class{constructor(e=`react-fontawesome`){this.enabled=!1;let t=!1;try{t=typeof process<`u`&&!1}catch{}this.scope=e,this.enabled=t}log(...e){this.enabled&&console.log(`[${this.scope}]`,...e)}warn(...e){this.enabled&&console.warn(`[${this.scope}]`,...e)}error(...e){this.enabled&&console.error(`[${this.scope}]`,...e)}};typeof process<`u`&&{}.FA_VERSION;var Ua=`searchPseudoElementsFullScan`in X&&typeof X.searchPseudoElementsFullScan==`boolean`?`7.0.0`:`6.0.0`,Wa=Number.parseInt(Ua)>=7,Ga=()=>Wa,Ka=`fa`,Z={beat:`fa-beat`,fade:`fa-fade`,beatFade:`fa-beat-fade`,bounce:`fa-bounce`,shake:`fa-shake`,spin:`fa-spin`,spinPulse:`fa-spin-pulse`,spinReverse:`fa-spin-reverse`,pulse:`fa-pulse`},qa={left:`fa-pull-left`,right:`fa-pull-right`},Ja={90:`fa-rotate-90`,180:`fa-rotate-180`,270:`fa-rotate-270`},Ya={"2xs":`fa-2xs`,xs:`fa-xs`,sm:`fa-sm`,lg:`fa-lg`,xl:`fa-xl`,"2xl":`fa-2xl`,"1x":`fa-1x`,"2x":`fa-2x`,"3x":`fa-3x`,"4x":`fa-4x`,"5x":`fa-5x`,"6x":`fa-6x`,"7x":`fa-7x`,"8x":`fa-8x`,"9x":`fa-9x`,"10x":`fa-10x`},Q={border:`fa-border`,fixedWidth:`fa-fw`,flip:`fa-flip`,flipHorizontal:`fa-flip-horizontal`,flipVertical:`fa-flip-vertical`,inverse:`fa-inverse`,rotateBy:`fa-rotate-by`,swapOpacity:`fa-swap-opacity`,widthAuto:`fa-width-auto`},Xa={default:`fa-layers`};function Za(e){let t=X.cssPrefix||X.familyPrefix||Ka;return t===Ka?e:e.replace(new RegExp(String.raw`(?<=^|\s)${Ka}-`,`g`),`${t}-`)}function Qa(e){let{beat:t,fade:n,beatFade:r,bounce:i,shake:a,spin:o,spinPulse:s,spinReverse:c,pulse:l,fixedWidth:u,inverse:d,border:f,flip:p,size:m,rotation:h,pull:g,swapOpacity:_,rotateBy:v,widthAuto:y,className:b}=e,x=[];return b&&x.push(...b.split(` `)),t&&x.push(Z.beat),n&&x.push(Z.fade),r&&x.push(Z.beatFade),i&&x.push(Z.bounce),a&&x.push(Z.shake),o&&x.push(Z.spin),c&&x.push(Z.spinReverse),s&&x.push(Z.spinPulse),l&&x.push(Z.pulse),u&&x.push(Q.fixedWidth),d&&x.push(Q.inverse),f&&x.push(Q.border),p===!0&&x.push(Q.flip),(p===`horizontal`||p===`both`)&&x.push(Q.flipHorizontal),(p===`vertical`||p===`both`)&&x.push(Q.flipVertical),m!=null&&x.push(Ya[m]),h!=null&&h!==0&&x.push(Ja[h]),g!=null&&x.push(qa[g]),_&&x.push(Q.swapOpacity),Ga()?(v&&x.push(Q.rotateBy),y&&x.push(Q.widthAuto),(X.cssPrefix||X.familyPrefix||Ka)===Ka?x:x.map(Za)):x}var $a=e=>typeof e==`object`&&`icon`in e&&!!e.icon;function eo(e){if(e)return $a(e)?e:Aa.icon(e)}function to(e){return Object.keys(e)}var no=new Ha(`FontAwesomeIcon`),ro={border:!1,className:``,mask:void 0,maskId:void 0,fixedWidth:!1,inverse:!1,flip:!1,icon:void 0,listItem:!1,pull:void 0,pulse:!1,rotation:void 0,rotateBy:!1,size:void 0,spin:!1,spinPulse:!1,spinReverse:!1,beat:!1,fade:!1,beatFade:!1,bounce:!1,shake:!1,symbol:!1,title:``,titleId:void 0,transform:void 0,swapOpacity:!1,widthAuto:!1},io=new Set(Object.keys(ro)),ao=w.forwardRef((e,t)=>{let n={...ro,...e},{icon:r,mask:i,symbol:a,title:o,titleId:s,maskId:c,transform:l}=n,u=Va(c,!!i),d=Va(s,!!o),f=eo(r);if(!f)return no.error(`Icon lookup is undefined`,r),null;let p=Qa(n),m=typeof l==`string`?Aa.transform(l):l,h=eo(i),g=ja(f,{...p.length>0&&{classes:p},...m&&{transform:m},...h&&{mask:h},symbol:a,title:o,titleId:d,maskId:u});if(!g)return no.error(`Could not find icon`,f),null;let{abstract:_}=g,v={ref:t};for(let e of to(n))io.has(e)||(v[e]=n[e]);return Ba(_[0],v)});ao.displayName=`FontAwesomeIcon`,`${Xa.default}${Q.fixedWidth}`;var oo=[{icon:{prefix:`fab`,iconName:`instagram`,icon:[448,512,[],`f16d`,`M224.3 141a115 115 0 1 0 -.6 230 115 115 0 1 0 .6-230zm-.6 40.4a74.6 74.6 0 1 1 .6 149.2 74.6 74.6 0 1 1 -.6-149.2zm93.4-45.1a26.8 26.8 0 1 1 53.6 0 26.8 26.8 0 1 1 -53.6 0zm129.7 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM399 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z`]},href:`#`,label:`Instagram`,color:`hover:bg-pink-500/20 hover:border-pink-400/40 hover:text-pink-400`},{icon:{prefix:`fab`,iconName:`youtube`,icon:[576,512,[61802],`f167`,`M549.7 124.1C543.5 100.4 524.9 81.8 501.4 75.5 458.9 64 288.1 64 288.1 64S117.3 64 74.7 75.5C51.2 81.8 32.7 100.4 26.4 124.1 15 167 15 256.4 15 256.4s0 89.4 11.4 132.3c6.3 23.6 24.8 41.5 48.3 47.8 42.6 11.5 213.4 11.5 213.4 11.5s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zM232.2 337.6l0-162.4 142.7 81.2-142.7 81.2z`]},href:`#`,label:`YouTube`,color:`hover:bg-red-500/20 hover:border-red-400/40 hover:text-red-400`},{icon:{prefix:`fab`,iconName:`twitter`,icon:[512,512,[],`f099`,`M459.4 151.7c.3 4.5 .3 9.1 .3 13.6 0 138.7-105.6 298.6-298.6 298.6-59.5 0-114.7-17.2-161.1-47.1 8.4 1 16.6 1.3 25.3 1.3 49.1 0 94.2-16.6 130.3-44.8-46.1-1-84.8-31.2-98.1-72.8 6.5 1 13 1.6 19.8 1.6 9.4 0 18.8-1.3 27.6-3.6-48.1-9.7-84.1-52-84.1-103l0-1.3c14 7.8 30.2 12.7 47.4 13.3-28.3-18.8-46.8-51-46.8-87.4 0-19.5 5.2-37.4 14.3-53 51.7 63.7 129.3 105.3 216.4 109.8-1.6-7.8-2.6-15.9-2.6-24 0-57.8 46.8-104.9 104.9-104.9 30.2 0 57.5 12.7 76.7 33.1 23.7-4.5 46.5-13.3 66.6-25.3-7.8 24.4-24.4 44.8-46.1 57.8 21.1-2.3 41.6-8.1 60.4-16.2-14.3 20.8-32.2 39.3-52.6 54.3z`]},href:`#`,label:`Twitter`,color:`hover:bg-sky-500/20 hover:border-sky-400/40 hover:text-sky-400`},{icon:{prefix:`fab`,iconName:`facebook-f`,icon:[320,512,[],`f39e`,`M80 299.3l0 212.7 116 0 0-212.7 86.5 0 18-97.8-104.5 0 0-34.6c0-51.7 20.3-71.5 72.7-71.5 16.3 0 29.4 .4 37 1.2l0-88.7C291.4 4 256.4 0 236.2 0 129.3 0 80 50.5 80 159.4l0 42.1-66 0 0 97.8 66 0z`]},href:`#`,label:`Facebook`,color:`hover:bg-blue-500/20 hover:border-blue-400/40 hover:text-blue-400`}],so=[{href:`/`,label:`Beranda`},{href:`/news`,label:`Berita`},{href:`/ilkomgallery`,label:`Ilkom Gallery`}],co=[{href:`#`,label:`SAPA`},{href:`#`,label:`BEM Official`},{href:`#`,label:`Unsri`}],lo={hidden:{},show:{transition:{staggerChildren:.06}}},uo={hidden:{opacity:0,y:12},show:{opacity:1,y:0,transition:{duration:.5,ease:[.25,.46,.45,.94]}}};function fo(){return(0,T.jsxs)(`footer`,{className:`relative overflow-hidden`,children:[(0,T.jsx)(`div`,{className:`absolute inset-0 bg-gradient-to-br from-[#1A0533] via-[#300B55] to-[#1a0533]`}),(0,T.jsx)(`div`,{className:`absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(122,71,166,0.15),transparent_60%)]`}),(0,T.jsx)(`div`,{className:`absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(191,148,255,0.08),transparent_60%)]`}),(0,T.jsx)(C.div,{variants:lo,initial:`hidden`,whileInView:`show`,viewport:{once:!0,margin:`-80px`},className:`relative z-10 px-4 lg:px-8 pt-16 pb-8 lg:pt-24 lg:pb-10`,children:(0,T.jsxs)(`div`,{className:`max-w-7xl mx-auto`,children:[(0,T.jsxs)(C.div,{variants:uo,className:`md:flex md:items-start md:justify-between mb-10`,children:[(0,T.jsxs)(ee,{to:`/`,className:`flex items-center gap-x-3 group`,"aria-label":`ILKOM NEWS`,children:[(0,T.jsx)(`img`,{src:Fe,alt:`ILKOM`,className:`h-9 w-auto group-hover:scale-105 transition-transform`}),(0,T.jsx)(`span`,{className:`font-bold text-xl font-header text-white`,children:`ILKOM NEWS`})]}),(0,T.jsx)(`ul`,{className:`flex list-none mt-6 md:mt-0 gap-2`,children:oo.map((e,t)=>(0,T.jsx)(C.li,{variants:uo,children:(0,T.jsx)(`a`,{href:e.href,target:`_blank`,rel:`noopener noreferrer`,"aria-label":e.label,className:`inline-flex items-center justify-center h-10 w-10 rounded-xl bg-white/5 border border-white/10 text-white/50 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-lg ${e.color}`,children:(0,T.jsx)(ao,{icon:e.icon,className:`text-sm`})})},t))})]}),(0,T.jsx)(C.div,{variants:uo,className:`h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8`}),(0,T.jsxs)(`div`,{className:`md:flex md:items-center md:justify-between gap-6`,children:[(0,T.jsxs)(C.div,{variants:uo,className:`text-white/30 text-sm leading-6`,children:[(0,T.jsxs)(`div`,{children:[`© `,new Date().getFullYear(),` ILKOM NEWS`]}),(0,T.jsx)(`div`,{className:`text-white/20 text-xs mt-0.5`,children:`BEM FASILKOM UNSRI — Hak cipta dilindungi`})]}),(0,T.jsx)(C.nav,{variants:uo,className:`mt-4 md:mt-0`,children:(0,T.jsxs)(`ul`,{className:`list-none flex flex-wrap gap-4`,children:[so.map((e,t)=>(0,T.jsx)(`li`,{children:(0,T.jsxs)(ee,{to:e.href,className:`text-sm text-white/50 hover:text-white transition-colors duration-200 inline-flex items-center gap-1 group`,children:[e.label,(0,T.jsx)(h,{size:12,className:`opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all`})]})},t)),(0,T.jsx)(`li`,{className:`text-white/15`,children:`|`}),co.map((e,t)=>(0,T.jsx)(`li`,{children:(0,T.jsx)(`a`,{href:e.href,className:`text-sm text-white/30 hover:text-white/70 transition-colors duration-200`,children:e.label})},t))]})})]}),(0,T.jsxs)(C.div,{variants:uo,className:`mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-1.5 text-white/20 text-xs`,children:[(0,T.jsx)(`span`,{children:`Dibuat dengan`}),(0,T.jsx)(n,{size:10,className:`text-pink-400/60 fill-pink-400/60`}),(0,T.jsx)(`span`,{children:`oleh FASILKOM UNSRI`})]})]})})]})}var po=()=>((0,w.useEffect)(()=>{},[]),null);function mo(e){"@babel/helpers - typeof";return mo=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},mo(e)}function ho(e,t){if(mo(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(mo(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function go(e){var t=ho(e,`string`);return mo(t)==`symbol`?t:t+``}function _o(e,t,n){return(t=go(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var vo=class extends w.Component{constructor(...e){super(...e),_o(this,`state`,{error:null})}static getDerivedStateFromError(e){return{error:e}}render(){return this.state.error?(0,T.jsx)(`div`,{className:`min-h-screen bg-white dark:bg-black flex items-center justify-center p-8`,children:(0,T.jsxs)(`div`,{className:`max-w-md w-full text-center`,children:[(0,T.jsx)(`h1`,{className:`text-2xl font-bold text-red-500 mb-4`,children:`Something went wrong`}),(0,T.jsx)(`p`,{className:`text-neutral-600 dark:text-neutral-400 mb-4 text-sm font-mono break-all`,children:this.state.error.message}),(0,T.jsx)(`pre`,{className:`text-xs text-neutral-500 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-900 p-4 rounded-xl overflow-auto text-left max-h-64`,children:this.state.error.stack}),(0,T.jsx)(`button`,{onClick:()=>window.location.reload(),className:`mt-6 px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700`,children:`Reload`})]})}):this.props.children}},yo=`modulepreload`,bo=function(e){return`/`+e},xo={},$=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}r=o(t.map(t=>{if(t=bo(t,n),t in xo)return;xo[t]=!0;let r=t.endsWith(`.css`),i=r?`[rel="stylesheet"]`:``;if(n)for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${t}"]${i}`))return;let o=document.createElement(`link`);if(o.rel=r?`stylesheet`:yo,r||(o.as=`script`),o.crossOrigin=``,o.href=t,a&&o.setAttribute(`nonce`,a),document.head.appendChild(o),r)return new Promise((e,n)=>{o.addEventListener(`load`,e),o.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},So=(0,w.lazy)(()=>$(()=>import(`./HomePage-CO93Equv.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10]))),Co=(0,w.lazy)(()=>$(()=>import(`./NewsPage-B5e0Uce8.js`),__vite__mapDeps([11,1,4,3,5,2,6,7,12,8,13,9,10]))),wo=(0,w.lazy)(()=>$(()=>import(`./EventsPage-zg-_FRiV.js`),__vite__mapDeps([14,1,2,3,4,12,7,8,6,10]))),To=(0,w.lazy)(()=>$(()=>import(`./IlkomGalleryPage-BhVzpY7g.js`),__vite__mapDeps([15,1,2,3,4,12,7,13,9,6,10]))),Eo=(0,w.lazy)(()=>$(()=>import(`./DetailPage-BHTD-Jxv.js`),__vite__mapDeps([16,1,2,3,4,12,7,8,10]))),Do=(0,w.lazy)(()=>$(()=>import(`./ProjectDetailPage-qVnr-Lpr.js`),__vite__mapDeps([17,1,2,3,4]))),Oo=(0,w.lazy)(()=>$(()=>import(`./GameDetailPage-BxEiptrM.js`),__vite__mapDeps([18,1,2,3,4]))),ko=(0,w.lazy)(()=>$(()=>import(`./MobileDetailPage-DYAaQ7iU.js`),__vite__mapDeps([19,1,2,3,4]))),Ao=(0,w.lazy)(()=>$(()=>import(`./UiUxDetailPage-BnXtPn-2.js`),__vite__mapDeps([20,1,2,3,4]))),jo=(0,w.lazy)(()=>$(()=>import(`./WebDetailPage-CmGR0QET.js`),__vite__mapDeps([21,1,2,3,4]))),Mo=(0,w.lazy)(()=>$(()=>import(`./SubmitProjectPage-CYJDinAN.js`),__vite__mapDeps([22,1,2,3,4,12,7,6,9]))),No=(0,w.lazy)(()=>$(()=>import(`./TrackPage-DwS60Nco.js`),__vite__mapDeps([23,1,2,3,4,12,7,6,9]))),Po=(0,w.lazy)(()=>$(()=>import(`./LoginPage-BVMqfm4r.js`),__vite__mapDeps([24,1,2,3,4]))),Fo=(0,w.lazy)(()=>$(()=>import(`./DashboardPage-DIyvPylH.js`),__vite__mapDeps([25,1,2,3,4]))),Io=(0,w.lazy)(()=>$(()=>import(`./NewsListPage-CtEEXj9v.js`),__vite__mapDeps([26,1,2,3,4]))),Lo=(0,w.lazy)(()=>$(()=>import(`./NewsFormPage-JbNkExy1.js`),__vite__mapDeps([27,1,2,3,4]))),Ro=(0,w.lazy)(()=>$(()=>import(`./ProjectsListPage-D3kbGTwH.js`),__vite__mapDeps([28,1,2,3,4]))),zo=(0,w.lazy)(()=>$(()=>import(`./ProjectDetailPage-CE3OToPq.js`),__vite__mapDeps([29,1,2,3,4]))),Bo=()=>(0,T.jsx)(`div`,{className:`min-h-screen bg-white dark:bg-black flex items-center justify-center`,children:(0,T.jsxs)(`div`,{className:`text-center`,children:[(0,T.jsx)(`div`,{className:`w-10 h-10 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3`}),(0,T.jsx)(`p`,{className:`text-neutral-500 text-sm`,children:`Memuat...`})]})});function Vo(){let[e,t]=(0,w.useState)(!0),n=x().pathname.startsWith(`/admin`);return(0,w.useEffect)(()=>{let e=setTimeout(()=>t(!1),2e3);return()=>clearTimeout(e)},[]),(0,T.jsx)(vo,{children:(0,T.jsx)(de,{children:(0,T.jsxs)(Ce,{children:[e&&(0,T.jsx)(je,{}),(0,T.jsxs)(`div`,{className:`min-h-screen flex flex-col bg-white dark:bg-black transition-colors duration-300`,children:[(0,T.jsx)(po,{}),!n&&(0,T.jsx)(Ie,{}),(0,T.jsx)(`main`,{className:`flex-grow`,children:(0,T.jsx)(w.Suspense,{fallback:(0,T.jsx)(Bo,{}),children:(0,T.jsxs)(y,{children:[(0,T.jsx)(S,{path:`/`,element:(0,T.jsx)(So,{})}),(0,T.jsx)(S,{path:`/news`,element:(0,T.jsx)(Co,{})}),(0,T.jsx)(S,{path:`/news/:slug`,element:(0,T.jsx)(Eo,{type:`news`})}),(0,T.jsx)(S,{path:`/events`,element:(0,T.jsx)(wo,{})}),(0,T.jsx)(S,{path:`/events/:slug`,element:(0,T.jsx)(Eo,{type:`events`})}),(0,T.jsx)(S,{path:`/ilkomgallery`,element:(0,T.jsx)(To,{})}),(0,T.jsx)(S,{path:`/ilkomgallery/project/:slug`,element:(0,T.jsx)(Do,{})}),(0,T.jsx)(S,{path:`/ilkomgallery/game/:slug`,element:(0,T.jsx)(Oo,{})}),(0,T.jsx)(S,{path:`/ilkomgallery/mobile/:slug`,element:(0,T.jsx)(ko,{})}),(0,T.jsx)(S,{path:`/ilkomgallery/uiux/:slug`,element:(0,T.jsx)(Ao,{})}),(0,T.jsx)(S,{path:`/ilkomgallery/web/:slug`,element:(0,T.jsx)(jo,{})}),(0,T.jsx)(S,{path:`/submit`,element:(0,T.jsx)(Mo,{})}),(0,T.jsx)(S,{path:`/track`,element:(0,T.jsx)(No,{})}),(0,T.jsx)(S,{path:`/admin/login`,element:(0,T.jsx)(Po,{})}),(0,T.jsxs)(S,{path:`/admin`,element:(0,T.jsx)(Te,{children:(0,T.jsx)(Oe,{})}),children:[(0,T.jsx)(S,{index:!0,element:(0,T.jsx)(Fo,{})}),(0,T.jsx)(S,{path:`dashboard`,element:(0,T.jsx)(Fo,{})}),(0,T.jsx)(S,{path:`news`,element:(0,T.jsx)(Io,{})}),(0,T.jsx)(S,{path:`news/create`,element:(0,T.jsx)(Lo,{})}),(0,T.jsx)(S,{path:`news/:id/edit`,element:(0,T.jsx)(Lo,{})}),(0,T.jsx)(S,{path:`projects`,element:(0,T.jsx)(Ro,{})}),(0,T.jsx)(S,{path:`projects/:id`,element:(0,T.jsx)(zo,{})})]}),(0,T.jsx)(S,{path:`*`,element:(0,T.jsx)(So,{})})]})})}),!n&&(0,T.jsx)(fo,{})]})]})})})}`serviceWorker`in navigator&&window.addEventListener(`load`,()=>{navigator.serviceWorker.register(`/sw.js`).catch(()=>{})}),le.createRoot(document.getElementById(`root`)).render((0,T.jsx)(w.StrictMode,{children:(0,T.jsx)(re,{children:(0,T.jsx)(Vo,{})})}));export{be as a,ye as i,ke as n,xe as o,we as r,Ae as t};