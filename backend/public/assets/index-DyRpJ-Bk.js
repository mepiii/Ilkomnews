const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/HomePage-QnETdSp2.js","assets/rolldown-runtime-Cyuzqnbw.js","assets/react-vendor-CCHJtNDw.js","assets/icons-DGyCl_Sg.js","assets/motion-BOXLhlRW.js","assets/ArticleCard-B0iYBTJD.js","assets/GlowCard-Cy59mZzr.js","assets/formatters-gBoZ49Z_.js","assets/LoadingSpinner-DJbC4dsk.js","assets/Tiles-Dt_hWP43.js","assets/api-Bv6meWTe.js","assets/NewsPage-B5e0Uce8.js","assets/Breadcrumb-CTG-KfCg.js","assets/AnimatedFilterDropdown-D37CzivM.js","assets/EventsPage-zg-_FRiV.js","assets/IlkomGalleryPage-BhVzpY7g.js","assets/DetailPage-BHTD-Jxv.js","assets/ProjectDetailPage-qVnr-Lpr.js","assets/GameDetailPage-BxEiptrM.js","assets/MobileDetailPage-DYAaQ7iU.js","assets/UiUxDetailPage-BnXtPn-2.js","assets/WebDetailPage-CmGR0QET.js","assets/SubmitProjectPage-Dzv2QtYm.js","assets/TrackPage-DwS60Nco.js","assets/LoginPage-D03lkdL2.js","assets/DashboardPage-O12kAcKR.js","assets/NewsListPage-CMX0E5td.js","assets/NewsFormPage-BHMTvvSj.js","assets/ProjectsListPage-DA71z7Mg.js","assets/ProjectDetailPage-Bdi0hPxs.js"])))=>i.map(i=>d[i]);
import{a as e}from"./rolldown-runtime-Cyuzqnbw.js";import{A as t,B as n,I as r,J as i,K as a,N as o,O as s,R as c,S as l,at as u,c as d,dt as f,gt as p,l as m,nt as h,pt as g,tt as _,x as v,z as y}from"./icons-DGyCl_Sg.js";import{a as b,c as x,f as ee,l as te,n as S,o as ne,r as re,s as C,t as ie,u as ae}from"./react-vendor-CCHJtNDw.js";import{a as oe,i as se,n as ce,r as w,t as le}from"./motion-BOXLhlRW.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var ue=e(ee(),1),T=e(p(),1),E=oe(),de=(0,T.createContext)(),fe=({children:e})=>{let[t,n]=(0,T.useState)(()=>localStorage.getItem(`ilkom-theme`)||`dark`);return(0,T.useEffect)(()=>{let e=document.documentElement;e.classList.remove(`light`,`dark`),e.classList.add(t),localStorage.setItem(`ilkom-theme`,t)},[t]),(0,E.jsx)(de.Provider,{value:{theme:t,toggleTheme:()=>n(e=>e===`dark`?`light`:`dark`)},children:e})},pe=()=>(0,T.useContext)(de),me=`https://your-domain.com/api`,he=`admin_token`;function ge(){return localStorage.getItem(he)}function _e(e){localStorage.setItem(he,e)}function ve(){localStorage.removeItem(he)}async function D(e,t={}){let n=ge(),r={"Content-Type":`application/json`,...n&&{Authorization:`Bearer ${n}`},...t.headers},i=await fetch(`${me}${e}`,{...t,headers:r});if(i.status===401)throw ve(),window.location.href=`/admin/login`,Error(`Unauthorized`);if(!i.ok){let e=await i.json().catch(()=>({}));throw Error(e.message||e.error||`HTTP ${i.status}`)}return i.status===204?null:i.json()}var ye={login(e,t){return D(`/admin/login`,{method:`POST`,body:JSON.stringify({email:e,password:t})}).then(e=>(_e(e.token),e))},logout(){return D(`/admin/logout`,{method:`POST`}).finally(()=>{ve()})},getUser(){return D(`/admin/user`)}},be={getStats(){return D(`/admin/dashboard`)}},xe={getAll(e={}){let t=new URLSearchParams(e).toString();return D(`/admin/news${t?`?${t}`:``}`)},getById(e){return D(`/admin/news/${e}`)},create(e){return D(`/admin/news`,{method:`POST`,body:JSON.stringify(e)})},update(e,t){return D(`/admin/news/${e}`,{method:`PUT`,body:JSON.stringify(t)})},delete(e){return D(`/admin/news/${e}`,{method:`DELETE`})}},Se={getAll(e={}){let t=new URLSearchParams(e).toString();return D(`/admin/projects${t?`?${t}`:``}`)},getById(e){return D(`/admin/projects/${e}`)},accept(e){return D(`/admin/projects/${e}/accept`,{method:`POST`})},reject(e,t){return D(`/admin/projects/${e}/reject`,{method:`POST`,body:JSON.stringify({rejection_reason:t})})}},Ce=(0,T.createContext)(null);function we({children:e}){let[t,n]=(0,T.useState)(null),[r,i]=(0,T.useState)(()=>localStorage.getItem(`admin_token`)),[a,o]=(0,T.useState)(!0),s=!!(r&&t);(0,T.useEffect)(()=>{if(!r){o(!1);return}ye.getUser().then(e=>n(e.user||e)).catch(()=>{localStorage.removeItem(`admin_token`),i(null)}).finally(()=>o(!1))},[r]);let c=(0,T.useCallback)(async(e,t)=>{let r=await ye.login(e,t);return i(r.token),n(r.user),r},[]),l=(0,T.useCallback)(async()=>{try{await ye.logout()}finally{localStorage.removeItem(`admin_token`),i(null),n(null)}},[]);return(0,E.jsx)(Ce.Provider,{value:{user:t,token:r,loading:a,isAuthenticated:s,login:c,logout:l},children:e})}function Te(){let e=(0,T.useContext)(Ce);if(!e)throw Error(`useAdminAuth must be used within AdminAuthProvider`);return e}function Ee({children:e}){let{isAuthenticated:t,loading:n}=Te(),r=te();return n?(0,E.jsx)(`div`,{className:`min-h-screen bg-gray-50 flex items-center justify-center`,children:(0,E.jsx)(`div`,{className:`w-10 h-10 border-3 border-purple-600 border-t-transparent rounded-full animate-spin`})}):t?e:(0,E.jsx)(b,{to:`/admin/login`,state:{from:r},replace:!0})}var De=[{to:`/admin/dashboard`,label:`Dashboard`,icon:r},{to:`/admin/news`,label:`Berita`,icon:s},{to:`/admin/projects`,label:`Ilkom Gallery`,icon:a}],Oe=({isActive:e})=>`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${e?`bg-white/10 text-accent`:`text-white/70 hover:bg-white/5 hover:text-white`}`;function ke(){let{user:e,logout:n}=Te(),r=ae(),[i,a]=(0,T.useState)(!1),s=(0,E.jsxs)(`div`,{className:`flex flex-col h-full`,children:[(0,E.jsxs)(`div`,{className:`px-6 py-6 border-b border-white/10`,children:[(0,E.jsxs)(`h1`,{className:`text-xl font-bold text-white tracking-tight`,children:[`ILKOM `,(0,E.jsx)(`span`,{className:`text-accent`,children:`Admin`})]}),e&&(0,E.jsx)(`p`,{className:`text-xs text-white/50 mt-1 truncate`,children:e.email})]}),(0,E.jsx)(`nav`,{className:`flex-1 px-4 py-6 space-y-1`,children:De.map(e=>(0,E.jsxs)(re,{to:e.to,className:Oe,onClick:()=>a(!1),children:[(0,E.jsx)(e.icon,{size:18}),(0,E.jsx)(`span`,{children:e.label})]},e.to))}),(0,E.jsx)(`div`,{className:`px-4 pb-6`,children:(0,E.jsxs)(`button`,{onClick:async()=>{await n(),r(`/admin/login`)},className:`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-sm font-medium text-white/70 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200`,children:[(0,E.jsx)(o,{size:18}),(0,E.jsx)(`span`,{children:`Keluar`})]})})]});return(0,E.jsxs)(`div`,{className:`min-h-screen bg-gray-50 flex`,children:[(0,E.jsx)(`aside`,{className:`hidden lg:flex lg:flex-col w-[250px] bg-primary fixed inset-y-0 left-0 z-30`,children:s}),(0,E.jsx)(se,{children:i&&(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(w.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:`fixed inset-0 bg-black/50 z-40 lg:hidden`,onClick:()=>a(!1)}),(0,E.jsx)(w.aside,{initial:{x:-250},animate:{x:0},exit:{x:-250},transition:{type:`tween`,duration:.25},className:`fixed inset-y-0 left-0 w-[250px] bg-primary z-50 lg:hidden`,children:s})]})}),(0,E.jsxs)(`div`,{className:`flex-1 lg:ml-[250px] flex flex-col min-h-screen`,children:[(0,E.jsxs)(`header`,{className:`lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-20`,children:[(0,E.jsx)(`button`,{onClick:()=>a(!0),className:`p-2 rounded-lg hover:bg-gray-100`,children:(0,E.jsx)(t,{size:20,className:`text-primary`})}),(0,E.jsxs)(`h1`,{className:`text-lg font-bold text-primary`,children:[`ILKOM `,(0,E.jsx)(`span`,{className:`text-secondary`,children:`Admin`})]}),(0,E.jsx)(`div`,{className:`w-9`})]}),(0,E.jsx)(`main`,{className:`flex-1 p-6 lg:p-8`,children:(0,E.jsx)(ne,{})})]})]})}var Ae=({children:e,as:t=`span`,className:n=``,idle:r=!0,hover:i=!0,delay:a=0,staggerDelay:o=.03,duration:s=.5,...c})=>{let l=typeof e==`string`?e:``,u=(0,T.useMemo)(()=>4+Math.random()*2,[]),d=r?{y:[0,-2,0],opacity:[.85,1,.85],transition:{duration:u,repeat:1/0,ease:`easeInOut`,delay:a+l.length*o+s}}:{};if(!l)return(0,E.jsx)(w.span,{className:`inline-block cursor-default ${n}`,initial:{opacity:0,y:10},animate:{opacity:1,y:0,transition:{duration:.6,delay:a}},whileHover:i?{scale:1.05,textShadow:`0 0 20px rgba(122, 71, 166, 0.3)`,transition:{duration:.3}}:void 0,...c,children:e});let f=l.split(` `),p=0;return(0,E.jsx)(w.span,{className:`inline-block cursor-default ${n}`,animate:d,...c,children:f.map((e,t)=>{let n=a+p*o,r=e.split(``);return p+=e.length,(0,E.jsx)(`span`,{className:`inline-block whitespace-nowrap mr-[0.25em]`,children:r.map((e,t)=>(0,E.jsx)(w.span,{className:`inline-block`,initial:{y:20,opacity:0},animate:{y:0,opacity:1,transition:{duration:s,delay:n+t*o,ease:[.25,.46,.45,.94]}},whileHover:i?{scale:1.1,color:`rgba(122, 71, 166, 1)`,textShadow:`0 0 16px rgba(122, 71, 166, 0.4)`,transition:{duration:.2}}:void 0,children:e},t))},t)})})},je=`/assets/gedungfasilkom-C59eEUoL.jpg`,Me=()=>{let[e,t]=(0,T.useState)(!1),[n,r]=(0,T.useState)(0);return(0,T.useEffect)(()=>{let e=setInterval(()=>{r(t=>t>=100?(clearInterval(e),100):t+2)},35);return()=>clearInterval(e)},[]),(0,T.useEffect)(()=>{if(n===100){let e=setTimeout(()=>t(!0),2e3);return()=>clearTimeout(e)}},[n]),(0,E.jsxs)(`div`,{className:`fixed inset-0 flex items-center justify-center z-50 transition-all duration-700 ${e?`opacity-0 scale-110 pointer-events-none`:`opacity-100 scale-100`}`,children:[(0,E.jsxs)(`div`,{className:`absolute inset-0 w-full h-full`,children:[(0,E.jsx)(`div`,{className:`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat`,style:{backgroundImage:`url(${je})`,filter:`blur(16px) scale(1.1)`},children:(0,E.jsx)(`div`,{className:`absolute inset-0 bg-gradient-to-br from-black/95 via-black/90 to-black/95`})}),(0,E.jsx)(`div`,{className:`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-15`,style:{backgroundImage:`url(${je})`},children:(0,E.jsx)(`div`,{className:`absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-black/50`})}),(0,E.jsx)(`div`,{className:`absolute inset-0 overflow-hidden`,children:(0,E.jsx)(`div`,{className:`absolute inset-0 opacity-10`,style:{backgroundImage:`linear-gradient(to right, rgba(168, 85, 247, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(168, 85, 247, 0.2) 1px, transparent 1px)`,backgroundSize:`40px 40px`}})})]}),(0,E.jsxs)(`div`,{className:`relative z-10 max-w-7xl mx-auto px-6 py-32 text-center`,children:[(0,E.jsx)(`div`,{className:`mb-8 animate-fade-in`,children:(0,E.jsxs)(`div`,{className:`inline-flex items-center gap-2.5 border border-white/15 rounded-full bg-white/5 backdrop-blur-sm p-1 text-sm text-white mb-8`,children:[(0,E.jsx)(`div`,{className:`bg-white/10 border border-white/15 rounded-2xl px-3 py-1`,children:(0,E.jsx)(`p`,{className:`text-xs font-semibold tracking-wide uppercase`,children:`Fakultas Ilmu Komputer`})}),(0,E.jsx)(`p`,{className:`pr-3 text-xs text-white/50`,children:`Universitas Sriwijaya`})]})}),(0,E.jsx)(`div`,{className:`mb-6 animate-fade-in`,style:{animationDelay:`0.1s`},children:(0,E.jsx)(`h1`,{className:`text-6xl md:text-8xl lg:text-9xl font-bold mb-4`,children:(0,E.jsx)(`span`,{className:`inline-block bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent`,style:{fontFamily:`CustomFont, sans-serif`},children:(0,E.jsx)(Ae,{children:`ILKOM NEWS`})})})}),(0,E.jsx)(`div`,{className:`animate-fade-in`,style:{animationDelay:`0.2s`},children:(0,E.jsx)(`div`,{className:`h-0.5 w-24 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-yellow-500 rounded-full`})}),(0,E.jsx)(`div`,{className:`animate-fade-in`,style:{animationDelay:`0.3s`},children:(0,E.jsxs)(`p`,{className:`text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed`,children:[`Informasi terkini untuk mahasiswa Ilmu Komputer`,(0,E.jsx)(`br`,{}),`FASILKOM Universitas Sriwijaya`]})}),(0,E.jsxs)(`div`,{className:`max-w-md mx-auto mt-8 animate-fade-in`,style:{animationDelay:`0.4s`},children:[(0,E.jsx)(`div`,{className:`w-full h-1.5 glass-card rounded-full overflow-hidden mb-3`,children:(0,E.jsx)(`div`,{className:`h-full bg-gradient-to-r from-purple-500 to-yellow-500 rounded-full transition-all duration-100 ease-out`,style:{width:`${n}%`}})}),(0,E.jsxs)(`div`,{className:`flex justify-between items-center text-white/50 text-sm`,children:[(0,E.jsxs)(`span`,{className:`flex items-center gap-2`,children:[(0,E.jsx)(`span`,{className:`w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse`}),`Memuat konten...`]}),(0,E.jsxs)(`span`,{className:`font-mono text-purple-400 font-semibold`,children:[n,`%`]})]})]}),(0,E.jsx)(`div`,{className:`mt-8 flex justify-center gap-2 animate-fade-in`,style:{animationDelay:`0.5s`},children:[0,1,2].map(e=>(0,E.jsx)(`div`,{className:`w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse`,style:{animationDelay:`${e*.2}s`}},e))})]})]})},Ne=({isDark:e})=>{let t=.7,n=ce(+!!e),r=ce(+!e),i=le(n,[.6,1],[0,1]),a=le(r,[.6,1],[0,1]);return(0,E.jsx)(w.div,{animate:e?`checked`:`unchecked`,children:(0,E.jsxs)(w.svg,{width:`20`,height:`20`,viewBox:`0 0 25 25`,fill:`none`,children:[[`M12.4058 17.7625C15.1672 17.7625 17.4058 15.5239 17.4058 12.7625C17.4058 10.0011 15.1672 7.76251 12.4058 7.76251C9.64434 7.76251 7.40576 10.0011 7.40576 12.7625C7.40576 15.5239 9.64434 17.7625 12.4058 17.7625Z`,`M12.4058 1.76251V3.76251`,`M12.4058 21.7625V23.7625`,`M4.62598 4.98248L6.04598 6.40248`,`M18.7656 19.1225L20.1856 20.5425`,`M1.40576 12.7625H3.40576`,`M21.4058 12.7625H23.4058`,`M4.62598 20.5425L6.04598 19.1225`,`M18.7656 6.40248L20.1856 4.98248`].map((e,n)=>(0,E.jsx)(w.path,{d:e,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,variants:{checked:{scale:0},unchecked:{scale:1}},transition:{duration:t},style:{pathLength:a,scale:r}},`sun-${n}`)),(0,E.jsx)(w.path,{d:`M21.1918 13.2013C21.0345 14.9035 20.3957 16.5257 19.35 17.8781C18.3044 19.2305 16.8953 20.2571 15.2875 20.8379C13.6797 21.4186 11.9398 21.5294 10.2713 21.1574C8.60281 20.7854 7.07479 19.9459 5.86602 18.7371C4.65725 17.5283 3.81774 16.0003 3.4457 14.3318C3.07367 12.6633 3.18451 10.9234 3.76526 9.31561C4.346 7.70783 5.37263 6.29868 6.72501 5.25307C8.07739 4.20746 9.69959 3.56862 11.4018 3.41132C10.4052 4.75958 9.92564 6.42077 10.0503 8.09273C10.175 9.76469 10.8957 11.3364 12.0812 12.5219C13.2667 13.7075 14.8384 14.4281 16.5104 14.5528C18.1823 14.6775 19.8435 14.1979 21.1918 13.2013Z`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,variants:{checked:{scale:1},unchecked:{scale:0}},transition:{duration:t},style:{pathLength:i,scale:n}})]})})},Pe=({className:e=``})=>{let{theme:t,toggleTheme:n}=pe(),[r,i]=(0,T.useState)(!1);if((0,T.useEffect)(()=>{i(!0)},[]),!r)return(0,E.jsx)(`button`,{className:`p-2 rounded-lg ${e}`,disabled:!0,"aria-label":`Toggle theme`,children:(0,E.jsx)(`div`,{className:`h-5 w-5`})});let a=t===`dark`;return(0,E.jsx)(`button`,{onClick:n,className:`p-2 rounded-lg hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition-all duration-200 cursor-pointer text-current ${e}`,"aria-label":a?`Switch to light mode`:`Switch to dark mode`,children:(0,E.jsx)(Ne,{isDark:a})})},Fe=`https://your-domain.com/api`,Ie={accepted:{icon:h,color:`text-green-500`,label:`Diterima`},rejected:{icon:_,color:`text-red-500`,label:`Ditolak`}},Le=()=>{let[e,t]=(0,T.useState)(!1),[n,r]=(0,T.useState)([]),[i,a]=(0,T.useState)(0),[o,s]=(0,T.useState)(!1),c=(0,T.useRef)(null),l=!!localStorage.getItem(`admin_token`),u=(0,T.useCallback)(async()=>{s(!0);try{if(l){let e=await D(`/admin/notifications`);r(e.data),a(e.unread_count)}else{let e=localStorage.getItem(`tracking_id`);if(e){let t=await fetch(`${Fe}/notifications/${e}`);if(t.ok){let e=await t.json();r(e.data),a(e.data.filter(e=>!e.read).length)}}}}catch{}finally{s(!1)}},[l]);(0,T.useEffect)(()=>{u()},[u]),(0,T.useEffect)(()=>{let e=e=>{c.current&&!c.current.contains(e.target)&&t(!1)};return document.addEventListener(`mousedown`,e),()=>document.removeEventListener(`mousedown`,e)},[]);let d=async e=>{if(l)try{await D(`/admin/notifications/${e}/read`,{method:`POST`}),r(t=>t.map(t=>t.id===e?{...t,read:!0}:t)),a(e=>Math.max(0,e-1))}catch{}};return(0,E.jsxs)(`div`,{className:`relative`,ref:c,children:[(0,E.jsxs)(`button`,{onClick:()=>t(!e),className:`relative p-2 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.1] transition-colors`,children:[(0,E.jsx)(f,{size:18,className:`text-black/60 dark:text-white/60`}),i>0&&(0,E.jsx)(`span`,{className:`absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white`,children:i>9?`9+`:i})]}),e&&(0,E.jsxs)(`div`,{className:`absolute right-0 top-full mt-2 w-80 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-lg z-50`,children:[(0,E.jsxs)(`div`,{className:`px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between`,children:[(0,E.jsx)(`p`,{className:`text-sm font-semibold text-black dark:text-white`,children:`Notifikasi`}),l&&i>0&&(0,E.jsx)(`button`,{onClick:async()=>{if(l)try{await D(`/admin/notifications/read-all`,{method:`POST`}),r(e=>e.map(e=>({...e,read:!0}))),a(0)}catch{}},className:`text-xs text-blue-500 hover:text-blue-700 transition-colors`,children:`Tandai semua dibaca`})]}),(0,E.jsx)(`div`,{className:`max-h-80 overflow-y-auto`,children:o?(0,E.jsx)(`div`,{className:`p-4 text-center`,children:(0,E.jsx)(`p`,{className:`text-sm text-neutral-400`,children:`Memuat...`})}):n.length===0?(0,E.jsx)(`div`,{className:`p-4`,children:(0,E.jsx)(`p`,{className:`text-sm text-neutral-400 text-center py-4`,children:`Tidak ada notifikasi`})}):n.map(e=>{let t=Ie[e.type]||Ie.accepted,n=t.icon;return(0,E.jsx)(`button`,{onClick:()=>d(e.id),className:`w-full text-left px-4 py-3 border-b border-neutral-50 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors ${e.read?``:`bg-blue-50/50 dark:bg-blue-900/10`}`,children:(0,E.jsxs)(`div`,{className:`flex items-start gap-3`,children:[(0,E.jsx)(n,{size:18,className:`mt-0.5 flex-shrink-0 ${t.color}`}),(0,E.jsxs)(`div`,{className:`min-w-0 flex-1`,children:[(0,E.jsx)(`p`,{className:`text-sm font-medium text-black dark:text-white truncate`,children:e.title}),(0,E.jsx)(`p`,{className:`text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-2`,children:e.message}),(0,E.jsx)(`p`,{className:`text-[10px] text-neutral-400 dark:text-neutral-500 mt-1`,children:new Date(e.created_at).toLocaleString(`id-ID`)})]}),!e.read&&(0,E.jsx)(`span`,{className:`h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5`})]})},e.id)})})]})]})},Re=`/assets/BEM-DWPSXzfK.png`,ze=()=>{let e=te(),[n,r]=(0,T.useState)(`Beranda`),[a,o]=(0,T.useState)(!1),[f,p]=(0,T.useState)(!1),[h,g]=(0,T.useState)(!0),_=(0,T.useRef)(0),b=[{name:`Beranda`,path:`/`,icon:y},{name:`Berita`,path:`/news`,icon:s},{name:`Ilkom Gallery`,path:`/ilkomgallery`,icon:c},{name:`Submit`,path:`/submit`,icon:v},{name:`Track`,path:`/track`,icon:l}],x=[{name:`SAPA`,url:`https://sapa.bemfasilkomunsri.org/`,icon:m},{name:`BEM Official`,url:`https://bemfasilkomunsri.org/`,icon:i}];(0,T.useEffect)(()=>{let t=b.find(t=>t.path===e.pathname);t&&r(t.name)},[e.pathname]);let ee=(0,T.useCallback)(()=>{let e=window.scrollY;e<50?g(!0):e>_.current&&e>100?(g(!1),o(!1),p(!1)):e<_.current-10&&g(!0),_.current=e},[]);return(0,T.useEffect)(()=>(window.addEventListener(`scroll`,ee,{passive:!0}),()=>window.removeEventListener(`scroll`,ee)),[ee]),(0,T.useEffect)(()=>{let e=e=>{a&&!e.target.closest(`[data-dropdown]`)&&o(!1)};return document.addEventListener(`mousedown`,e),()=>document.removeEventListener(`mousedown`,e)},[a]),(0,E.jsx)(se,{children:h&&(0,E.jsxs)(w.div,{initial:{y:-100,opacity:0},animate:{y:0,opacity:1},exit:{y:-100,opacity:0},transition:{type:`spring`,stiffness:300,damping:30},className:`fixed top-3 left-0 right-0 z-50 flex justify-center px-4`,children:[(0,E.jsxs)(`div`,{className:`hidden md:flex items-center justify-center gap-1 bg-white dark:bg-black py-1.5 px-2 rounded-full border border-black/[0.08] dark:border-white/[0.12] shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(255,255,255,0.05)]`,children:[(0,E.jsxs)(S,{to:`/`,className:`flex items-center gap-2 px-3 py-1.5 mr-1 shrink-0`,onClick:()=>r(`Beranda`),children:[(0,E.jsx)(`img`,{src:`/assets/BEM-DWPSXzfK.png`,alt:`ILKOM`,className:`h-7 w-auto`}),(0,E.jsx)(`span`,{className:`text-sm font-bold text-black dark:text-white hidden lg:inline`,children:`ILKOM`})]}),b.map(e=>{e.icon;let t=n===e.name;return(0,E.jsxs)(S,{to:e.path,onClick:()=>r(e.name),className:`relative cursor-pointer px-4 py-2 rounded-full transition-all duration-300 text-[13px] font-semibold tracking-wide uppercase ${t?`bg-black/[0.06] dark:bg-white/[0.12] text-black dark:text-white`:`text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]`}`,children:[(0,E.jsx)(`span`,{className:`hidden md:inline`,children:e.name}),t&&(0,E.jsx)(`span`,{className:`absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-black dark:bg-white rounded-full`})]},e.name)}),(0,E.jsxs)(`div`,{className:`relative`,"data-dropdown":!0,children:[(0,E.jsxs)(`button`,{onClick:()=>o(!a),className:`flex items-center gap-1 cursor-pointer px-4 py-2 rounded-full transition-all text-[13px] font-semibold tracking-wide uppercase text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]`,children:[(0,E.jsx)(`span`,{className:`hidden md:inline`,children:`BEM Apps`}),(0,E.jsx)(u,{size:14,className:`transition-transform ${a?`rotate-180`:``}`})]}),a&&(0,E.jsx)(w.div,{initial:{opacity:0,y:-4,scale:.98},animate:{opacity:1,y:0,scale:1},className:`absolute top-full right-0 mt-2 w-52 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden p-1.5`,children:x.map(e=>{let t=e.icon;return(0,E.jsxs)(`a`,{href:e.url,target:`_blank`,rel:`noopener noreferrer`,className:`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors`,children:[(0,E.jsx)(t,{size:16}),(0,E.jsx)(`span`,{children:e.name}),(0,E.jsx)(i,{size:12,className:`ml-auto opacity-40`})]},e.name)})})]}),(0,E.jsxs)(`div`,{className:`ml-1 pl-2 border-l border-black/[0.08] dark:border-white/[0.12] flex items-center gap-1`,children:[(0,E.jsx)(Le,{}),(0,E.jsx)(Pe,{})]})]}),(0,E.jsxs)(`div`,{className:`md:hidden flex items-center justify-between w-full bg-white dark:bg-black py-2 px-4 rounded-2xl border border-black/[0.08] dark:border-white/[0.12] shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(255,255,255,0.05)]`,children:[(0,E.jsxs)(S,{to:`/`,className:`flex items-center gap-2`,children:[(0,E.jsx)(`img`,{src:`/assets/BEM-DWPSXzfK.png`,alt:`ILKOM`,className:`h-7 w-auto`}),(0,E.jsx)(`span`,{className:`text-sm font-bold text-black dark:text-white`,children:`ILKOM NEWS`})]}),(0,E.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,E.jsx)(Le,{}),(0,E.jsx)(Pe,{}),(0,E.jsx)(`button`,{onClick:()=>p(!f),className:`w-9 h-9 flex items-center justify-center rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.1] transition-colors`,children:f?(0,E.jsx)(d,{size:20,className:`text-black dark:text-white`}):(0,E.jsx)(t,{size:20,className:`text-black dark:text-white`})})]})]}),f&&(0,E.jsxs)(w.div,{initial:{opacity:0,y:-8},animate:{opacity:1,y:0},className:`md:hidden absolute top-full left-4 right-4 mt-2 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl overflow-hidden p-2`,children:[b.map(e=>{let t=e.icon;return(0,E.jsxs)(S,{to:e.path,onClick:()=>{r(e.name),p(!1)},className:`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${n===e.name?`bg-black/[0.06] dark:bg-white/[0.12] text-black dark:text-white`:`text-black/70 dark:text-white/70 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]`}`,children:[(0,E.jsx)(t,{size:18}),(0,E.jsx)(`span`,{children:e.name})]},e.name)}),(0,E.jsx)(`div`,{className:`border-t border-neutral-200 dark:border-neutral-700 mt-1 pt-1`,children:x.map(e=>{let t=e.icon;return(0,E.jsxs)(`a`,{href:e.url,target:`_blank`,rel:`noopener noreferrer`,className:`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-black/70 dark:text-white/70 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors`,children:[(0,E.jsx)(t,{size:18}),(0,E.jsx)(`span`,{children:e.name}),(0,E.jsx)(i,{size:14,className:`ml-auto opacity-30`})]},e.name)})})]})]})})};function Be(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function Ve(e){if(Array.isArray(e))return e}function He(e){if(Array.isArray(e))return Be(e)}function Ue(e,t){if(!(e instanceof t))throw TypeError(`Cannot call a class as a function`)}function We(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,`value`in r&&(r.writable=!0),Object.defineProperty(e,et(r.key),r)}}function Ge(e,t,n){return t&&We(e.prototype,t),n&&We(e,n),Object.defineProperty(e,"prototype",{writable:!1}),e}function Ke(e,t){var n=typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(!n){if(Array.isArray(e)||(n=nt(e))||t&&e&&typeof e.length==`number`){n&&(e=n);var r=0,i=function(){};return{s:i,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:i}}throw TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var a,o=!0,s=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return o=e.done,e},e:function(e){s=!0,a=e},f:function(){try{o||n.return==null||n.return()}finally{if(s)throw a}}}}function O(e,t,n){return(t=et(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function qe(e){if(typeof Symbol<`u`&&e[Symbol.iterator]!=null||e[`@@iterator`]!=null)return Array.from(e)}function Je(e,t){var n=e==null?null:typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(n!=null){var r,i,a,o,s=[],c=!0,l=!1;try{if(a=(n=n.call(e)).next,t===0){if(Object(n)!==n)return;c=!1}else for(;!(c=(r=a.call(n)).done)&&(s.push(r.value),s.length!==t);c=!0);}catch(e){l=!0,i=e}finally{try{if(!c&&n.return!=null&&(o=n.return(),Object(o)!==o))return}finally{if(l)throw i}}return s}}function Ye(){throw TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Xe(){throw TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Ze(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function k(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?Ze(Object(n),!0).forEach(function(t){O(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Ze(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function Qe(e,t){return Ve(e)||Je(e,t)||nt(e,t)||Ye()}function A(e){return He(e)||qe(e)||nt(e)||Xe()}function $e(e,t){if(typeof e!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(typeof r!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function et(e){var t=$e(e,`string`);return typeof t==`symbol`?t:t+``}function tt(e){"@babel/helpers - typeof";return tt=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},tt(e)}function nt(e,t){if(e){if(typeof e==`string`)return Be(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Be(e,t):void 0}}var rt=function(){},it={},at={},ot=null,st={mark:rt,measure:rt};try{typeof window<`u`&&(it=window),typeof document<`u`&&(at=document),typeof MutationObserver<`u`&&(ot=MutationObserver),typeof performance<`u`&&(st=performance)}catch{}var ct=(it.navigator||{}).userAgent,lt=ct===void 0?``:ct,j=it,M=at,ut=ot,dt=st;j.document;var N=!!M.documentElement&&!!M.head&&typeof M.addEventListener==`function`&&typeof M.createElement==`function`,ft=~lt.indexOf(`MSIE`)||~lt.indexOf(`Trident/`),pt,mt=/fa(k|kd|s|r|l|t|d|dr|dl|dt|b|slr|slpr|wsb|tl|ns|nds|es|gt|jr|jfr|jdr|usb|ufsb|udsb|cr|ss|sr|sl|st|sds|sdr|sdl|sdt)?[\-\ ]/,ht=/Font ?Awesome ?([567 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit|Notdog Duo|Notdog|Chisel|Etch|Graphite|Thumbprint|Jelly Fill|Jelly Duo|Jelly|Utility|Utility Fill|Utility Duo|Slab Press|Slab|Whiteboard)?.*/i,gt={classic:{fa:`solid`,fas:`solid`,"fa-solid":`solid`,far:`regular`,"fa-regular":`regular`,fal:`light`,"fa-light":`light`,fat:`thin`,"fa-thin":`thin`,fab:`brands`,"fa-brands":`brands`},duotone:{fa:`solid`,fad:`solid`,"fa-solid":`solid`,"fa-duotone":`solid`,fadr:`regular`,"fa-regular":`regular`,fadl:`light`,"fa-light":`light`,fadt:`thin`,"fa-thin":`thin`},sharp:{fa:`solid`,fass:`solid`,"fa-solid":`solid`,fasr:`regular`,"fa-regular":`regular`,fasl:`light`,"fa-light":`light`,fast:`thin`,"fa-thin":`thin`},"sharp-duotone":{fa:`solid`,fasds:`solid`,"fa-solid":`solid`,fasdr:`regular`,"fa-regular":`regular`,fasdl:`light`,"fa-light":`light`,fasdt:`thin`,"fa-thin":`thin`},slab:{"fa-regular":`regular`,faslr:`regular`},"slab-press":{"fa-regular":`regular`,faslpr:`regular`},thumbprint:{"fa-light":`light`,fatl:`light`},whiteboard:{"fa-semibold":`semibold`,fawsb:`semibold`},notdog:{"fa-solid":`solid`,fans:`solid`},"notdog-duo":{"fa-solid":`solid`,fands:`solid`},etch:{"fa-solid":`solid`,faes:`solid`},graphite:{"fa-thin":`thin`,fagt:`thin`},jelly:{"fa-regular":`regular`,fajr:`regular`},"jelly-fill":{"fa-regular":`regular`,fajfr:`regular`},"jelly-duo":{"fa-regular":`regular`,fajdr:`regular`},chisel:{"fa-regular":`regular`,facr:`regular`},utility:{"fa-semibold":`semibold`,fausb:`semibold`},"utility-duo":{"fa-semibold":`semibold`,faudsb:`semibold`},"utility-fill":{"fa-semibold":`semibold`,faufsb:`semibold`}},_t={GROUP:`duotone-group`,SWAP_OPACITY:`swap-opacity`,PRIMARY:`primary`,SECONDARY:`secondary`},vt=[`fa-classic`,`fa-duotone`,`fa-sharp`,`fa-sharp-duotone`,`fa-thumbprint`,`fa-whiteboard`,`fa-notdog`,`fa-notdog-duo`,`fa-chisel`,`fa-etch`,`fa-graphite`,`fa-jelly`,`fa-jelly-fill`,`fa-jelly-duo`,`fa-slab`,`fa-slab-press`,`fa-utility`,`fa-utility-duo`,`fa-utility-fill`],P=`classic`,yt=`duotone`,bt=`sharp`,xt=`sharp-duotone`,St=`chisel`,Ct=`etch`,wt=`graphite`,Tt=`jelly`,Et=`jelly-duo`,Dt=`jelly-fill`,Ot=`notdog`,kt=`notdog-duo`,At=`slab`,jt=`slab-press`,Mt=`thumbprint`,Nt=`utility`,Pt=`utility-duo`,Ft=`utility-fill`,It=`whiteboard`,Lt=`Classic`,Rt=`Duotone`,zt=`Sharp`,Bt=`Sharp Duotone`,Vt=`Chisel`,Ht=`Etch`,Ut=`Graphite`,Wt=`Jelly`,Gt=`Jelly Duo`,Kt=`Jelly Fill`,qt=`Notdog`,Jt=`Notdog Duo`,Yt=`Slab`,Xt=`Slab Press`,Zt=`Thumbprint`,Qt=`Utility`,$t=`Utility Duo`,en=`Utility Fill`,tn=`Whiteboard`,nn=[P,yt,bt,xt,St,Ct,wt,Tt,Et,Dt,Ot,kt,At,jt,Mt,Nt,Pt,Ft,It];pt={},O(O(O(O(O(O(O(O(O(O(pt,P,Lt),yt,Rt),bt,zt),xt,Bt),St,Vt),Ct,Ht),wt,Ut),Tt,Wt),Et,Gt),Dt,Kt),O(O(O(O(O(O(O(O(O(pt,Ot,qt),kt,Jt),At,Yt),jt,Xt),Mt,Zt),Nt,Qt),Pt,$t),Ft,en),It,tn);var rn={classic:{900:`fas`,400:`far`,normal:`far`,300:`fal`,100:`fat`},duotone:{900:`fad`,400:`fadr`,300:`fadl`,100:`fadt`},sharp:{900:`fass`,400:`fasr`,300:`fasl`,100:`fast`},"sharp-duotone":{900:`fasds`,400:`fasdr`,300:`fasdl`,100:`fasdt`},slab:{400:`faslr`},"slab-press":{400:`faslpr`},whiteboard:{600:`fawsb`},thumbprint:{300:`fatl`},notdog:{900:`fans`},"notdog-duo":{900:`fands`},etch:{900:`faes`},graphite:{100:`fagt`},chisel:{400:`facr`},jelly:{400:`fajr`},"jelly-fill":{400:`fajfr`},"jelly-duo":{400:`fajdr`},utility:{600:`fausb`},"utility-duo":{600:`faudsb`},"utility-fill":{600:`faufsb`}},an={"Font Awesome 7 Free":{900:`fas`,400:`far`},"Font Awesome 7 Pro":{900:`fas`,400:`far`,normal:`far`,300:`fal`,100:`fat`},"Font Awesome 7 Brands":{400:`fab`,normal:`fab`},"Font Awesome 7 Duotone":{900:`fad`,400:`fadr`,normal:`fadr`,300:`fadl`,100:`fadt`},"Font Awesome 7 Sharp":{900:`fass`,400:`fasr`,normal:`fasr`,300:`fasl`,100:`fast`},"Font Awesome 7 Sharp Duotone":{900:`fasds`,400:`fasdr`,normal:`fasdr`,300:`fasdl`,100:`fasdt`},"Font Awesome 7 Jelly":{400:`fajr`,normal:`fajr`},"Font Awesome 7 Jelly Fill":{400:`fajfr`,normal:`fajfr`},"Font Awesome 7 Jelly Duo":{400:`fajdr`,normal:`fajdr`},"Font Awesome 7 Slab":{400:`faslr`,normal:`faslr`},"Font Awesome 7 Slab Press":{400:`faslpr`,normal:`faslpr`},"Font Awesome 7 Thumbprint":{300:`fatl`,normal:`fatl`},"Font Awesome 7 Notdog":{900:`fans`,normal:`fans`},"Font Awesome 7 Notdog Duo":{900:`fands`,normal:`fands`},"Font Awesome 7 Etch":{900:`faes`,normal:`faes`},"Font Awesome 7 Graphite":{100:`fagt`,normal:`fagt`},"Font Awesome 7 Chisel":{400:`facr`,normal:`facr`},"Font Awesome 7 Whiteboard":{600:`fawsb`,normal:`fawsb`},"Font Awesome 7 Utility":{600:`fausb`,normal:`fausb`},"Font Awesome 7 Utility Duo":{600:`faudsb`,normal:`faudsb`},"Font Awesome 7 Utility Fill":{600:`faufsb`,normal:`faufsb`}},on=new Map([[`classic`,{defaultShortPrefixId:`fas`,defaultStyleId:`solid`,styleIds:[`solid`,`regular`,`light`,`thin`,`brands`],futureStyleIds:[],defaultFontWeight:900}],[`duotone`,{defaultShortPrefixId:`fad`,defaultStyleId:`solid`,styleIds:[`solid`,`regular`,`light`,`thin`],futureStyleIds:[],defaultFontWeight:900}],[`sharp`,{defaultShortPrefixId:`fass`,defaultStyleId:`solid`,styleIds:[`solid`,`regular`,`light`,`thin`],futureStyleIds:[],defaultFontWeight:900}],[`sharp-duotone`,{defaultShortPrefixId:`fasds`,defaultStyleId:`solid`,styleIds:[`solid`,`regular`,`light`,`thin`],futureStyleIds:[],defaultFontWeight:900}],[`chisel`,{defaultShortPrefixId:`facr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`etch`,{defaultShortPrefixId:`faes`,defaultStyleId:`solid`,styleIds:[`solid`],futureStyleIds:[],defaultFontWeight:900}],[`graphite`,{defaultShortPrefixId:`fagt`,defaultStyleId:`thin`,styleIds:[`thin`],futureStyleIds:[],defaultFontWeight:100}],[`jelly`,{defaultShortPrefixId:`fajr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`jelly-duo`,{defaultShortPrefixId:`fajdr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`jelly-fill`,{defaultShortPrefixId:`fajfr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`notdog`,{defaultShortPrefixId:`fans`,defaultStyleId:`solid`,styleIds:[`solid`],futureStyleIds:[],defaultFontWeight:900}],[`notdog-duo`,{defaultShortPrefixId:`fands`,defaultStyleId:`solid`,styleIds:[`solid`],futureStyleIds:[],defaultFontWeight:900}],[`slab`,{defaultShortPrefixId:`faslr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`slab-press`,{defaultShortPrefixId:`faslpr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`thumbprint`,{defaultShortPrefixId:`fatl`,defaultStyleId:`light`,styleIds:[`light`],futureStyleIds:[],defaultFontWeight:300}],[`utility`,{defaultShortPrefixId:`fausb`,defaultStyleId:`semibold`,styleIds:[`semibold`],futureStyleIds:[],defaultFontWeight:600}],[`utility-duo`,{defaultShortPrefixId:`faudsb`,defaultStyleId:`semibold`,styleIds:[`semibold`],futureStyleIds:[],defaultFontWeight:600}],[`utility-fill`,{defaultShortPrefixId:`faufsb`,defaultStyleId:`semibold`,styleIds:[`semibold`],futureStyleIds:[],defaultFontWeight:600}],[`whiteboard`,{defaultShortPrefixId:`fawsb`,defaultStyleId:`semibold`,styleIds:[`semibold`],futureStyleIds:[],defaultFontWeight:600}]]),sn={chisel:{regular:`facr`},classic:{brands:`fab`,light:`fal`,regular:`far`,solid:`fas`,thin:`fat`},duotone:{light:`fadl`,regular:`fadr`,solid:`fad`,thin:`fadt`},etch:{solid:`faes`},graphite:{thin:`fagt`},jelly:{regular:`fajr`},"jelly-duo":{regular:`fajdr`},"jelly-fill":{regular:`fajfr`},notdog:{solid:`fans`},"notdog-duo":{solid:`fands`},sharp:{light:`fasl`,regular:`fasr`,solid:`fass`,thin:`fast`},"sharp-duotone":{light:`fasdl`,regular:`fasdr`,solid:`fasds`,thin:`fasdt`},slab:{regular:`faslr`},"slab-press":{regular:`faslpr`},thumbprint:{light:`fatl`},utility:{semibold:`fausb`},"utility-duo":{semibold:`faudsb`},"utility-fill":{semibold:`faufsb`},whiteboard:{semibold:`fawsb`}},cn=[`fak`,`fa-kit`,`fakd`,`fa-kit-duotone`],ln={kit:{fak:`kit`,"fa-kit":`kit`},"kit-duotone":{fakd:`kit-duotone`,"fa-kit-duotone":`kit-duotone`}},un=[`kit`];O(O({},`kit`,`Kit`),`kit-duotone`,`Kit Duotone`);var dn={kit:{"fa-kit":`fak`},"kit-duotone":{"fa-kit-duotone":`fakd`}},fn={"Font Awesome Kit":{400:`fak`,normal:`fak`},"Font Awesome Kit Duotone":{400:`fakd`,normal:`fakd`}},pn={kit:{fak:`fa-kit`},"kit-duotone":{fakd:`fa-kit-duotone`}},mn={kit:{kit:`fak`},"kit-duotone":{"kit-duotone":`fakd`}},hn,gn={GROUP:`duotone-group`,SWAP_OPACITY:`swap-opacity`,PRIMARY:`primary`,SECONDARY:`secondary`},_n=[`fa-classic`,`fa-duotone`,`fa-sharp`,`fa-sharp-duotone`,`fa-thumbprint`,`fa-whiteboard`,`fa-notdog`,`fa-notdog-duo`,`fa-chisel`,`fa-etch`,`fa-graphite`,`fa-jelly`,`fa-jelly-fill`,`fa-jelly-duo`,`fa-slab`,`fa-slab-press`,`fa-utility`,`fa-utility-duo`,`fa-utility-fill`];hn={},O(O(O(O(O(O(O(O(O(O(hn,`classic`,`Classic`),`duotone`,`Duotone`),`sharp`,`Sharp`),`sharp-duotone`,`Sharp Duotone`),`chisel`,`Chisel`),`etch`,`Etch`),`graphite`,`Graphite`),`jelly`,`Jelly`),`jelly-duo`,`Jelly Duo`),`jelly-fill`,`Jelly Fill`),O(O(O(O(O(O(O(O(O(hn,`notdog`,`Notdog`),`notdog-duo`,`Notdog Duo`),`slab`,`Slab`),`slab-press`,`Slab Press`),`thumbprint`,`Thumbprint`),`utility`,`Utility`),`utility-duo`,`Utility Duo`),`utility-fill`,`Utility Fill`),`whiteboard`,`Whiteboard`),O(O({},`kit`,`Kit`),`kit-duotone`,`Kit Duotone`);var vn={classic:{"fa-brands":`fab`,"fa-duotone":`fad`,"fa-light":`fal`,"fa-regular":`far`,"fa-solid":`fas`,"fa-thin":`fat`},duotone:{"fa-regular":`fadr`,"fa-light":`fadl`,"fa-thin":`fadt`},sharp:{"fa-solid":`fass`,"fa-regular":`fasr`,"fa-light":`fasl`,"fa-thin":`fast`},"sharp-duotone":{"fa-solid":`fasds`,"fa-regular":`fasdr`,"fa-light":`fasdl`,"fa-thin":`fasdt`},slab:{"fa-regular":`faslr`},"slab-press":{"fa-regular":`faslpr`},whiteboard:{"fa-semibold":`fawsb`},thumbprint:{"fa-light":`fatl`},notdog:{"fa-solid":`fans`},"notdog-duo":{"fa-solid":`fands`},etch:{"fa-solid":`faes`},graphite:{"fa-thin":`fagt`},jelly:{"fa-regular":`fajr`},"jelly-fill":{"fa-regular":`fajfr`},"jelly-duo":{"fa-regular":`fajdr`},chisel:{"fa-regular":`facr`},utility:{"fa-semibold":`fausb`},"utility-duo":{"fa-semibold":`faudsb`},"utility-fill":{"fa-semibold":`faufsb`}},yn={classic:[`fas`,`far`,`fal`,`fat`,`fad`],duotone:[`fadr`,`fadl`,`fadt`],sharp:[`fass`,`fasr`,`fasl`,`fast`],"sharp-duotone":[`fasds`,`fasdr`,`fasdl`,`fasdt`],slab:[`faslr`],"slab-press":[`faslpr`],whiteboard:[`fawsb`],thumbprint:[`fatl`],notdog:[`fans`],"notdog-duo":[`fands`],etch:[`faes`],graphite:[`fagt`],jelly:[`fajr`],"jelly-fill":[`fajfr`],"jelly-duo":[`fajdr`],chisel:[`facr`],utility:[`fausb`],"utility-duo":[`faudsb`],"utility-fill":[`faufsb`]},bn={classic:{fab:`fa-brands`,fad:`fa-duotone`,fal:`fa-light`,far:`fa-regular`,fas:`fa-solid`,fat:`fa-thin`},duotone:{fadr:`fa-regular`,fadl:`fa-light`,fadt:`fa-thin`},sharp:{fass:`fa-solid`,fasr:`fa-regular`,fasl:`fa-light`,fast:`fa-thin`},"sharp-duotone":{fasds:`fa-solid`,fasdr:`fa-regular`,fasdl:`fa-light`,fasdt:`fa-thin`},slab:{faslr:`fa-regular`},"slab-press":{faslpr:`fa-regular`},whiteboard:{fawsb:`fa-semibold`},thumbprint:{fatl:`fa-light`},notdog:{fans:`fa-solid`},"notdog-duo":{fands:`fa-solid`},etch:{faes:`fa-solid`},graphite:{fagt:`fa-thin`},jelly:{fajr:`fa-regular`},"jelly-fill":{fajfr:`fa-regular`},"jelly-duo":{fajdr:`fa-regular`},chisel:{facr:`fa-regular`},utility:{fausb:`fa-semibold`},"utility-duo":{faudsb:`fa-semibold`},"utility-fill":{faufsb:`fa-semibold`}},xn=`fa.fas.far.fal.fat.fad.fadr.fadl.fadt.fab.fass.fasr.fasl.fast.fasds.fasdr.fasdl.fasdt.faslr.faslpr.fawsb.fatl.fans.fands.faes.fagt.fajr.fajfr.fajdr.facr.fausb.faudsb.faufsb`.split(`.`).concat(_n,[`fa-solid`,`fa-regular`,`fa-light`,`fa-thin`,`fa-duotone`,`fa-brands`,`fa-semibold`]),Sn=[`solid`,`regular`,`light`,`thin`,`duotone`,`brands`,`semibold`],Cn=[1,2,3,4,5,6,7,8,9,10],wn=Cn.concat([11,12,13,14,15,16,17,18,19,20]),Tn=[].concat(A(Object.keys(yn)),Sn,[`aw`,`fw`,`pull-left`,`pull-right`],[`2xs`,`xs`,`sm`,`lg`,`xl`,`2xl`,`beat`,`border`,`fade`,`beat-fade`,`bounce`,`flip-both`,`flip-horizontal`,`flip-vertical`,`flip`,`inverse`,`layers`,`layers-bottom-left`,`layers-bottom-right`,`layers-counter`,`layers-text`,`layers-top-left`,`layers-top-right`,`li`,`pull-end`,`pull-start`,`pulse`,`rotate-180`,`rotate-270`,`rotate-90`,`rotate-by`,`shake`,`spin-pulse`,`spin-reverse`,`spin`,`stack-1x`,`stack-2x`,`stack`,`ul`,`width-auto`,`width-fixed`,gn.GROUP,gn.SWAP_OPACITY,gn.PRIMARY,gn.SECONDARY],Cn.map(function(e){return`${e}x`}),wn.map(function(e){return`w-${e}`})),En={"Font Awesome 5 Free":{900:`fas`,400:`far`},"Font Awesome 5 Pro":{900:`fas`,400:`far`,normal:`far`,300:`fal`},"Font Awesome 5 Brands":{400:`fab`,normal:`fab`},"Font Awesome 5 Duotone":{900:`fad`}},F=`___FONT_AWESOME___`,Dn=16,On=`fa`,kn=`svg-inline--fa`,I=`data-fa-i2svg`,An=`data-fa-pseudo-element`,jn=`data-fa-pseudo-element-pending`,Mn=`data-prefix`,Nn=`data-icon`,Pn=`fontawesome-i2svg`,Fn=`async`,In=[`HTML`,`HEAD`,`STYLE`,`SCRIPT`],Ln=[`::before`,`::after`,`:before`,`:after`],Rn=function(){try{return!0}catch{return!1}}();function zn(e){return new Proxy(e,{get:function(e,t){return t in e?e[t]:e[P]}})}var Bn=k({},gt);Bn[P]=k(k(k(k({},{"fa-duotone":`duotone`}),gt[P]),ln.kit),ln[`kit-duotone`]);var Vn=zn(Bn),Hn=k({},sn);Hn[P]=k(k(k(k({},{duotone:`fad`}),Hn[P]),mn.kit),mn[`kit-duotone`]);var Un=zn(Hn),Wn=k({},bn);Wn[P]=k(k({},Wn[P]),pn.kit);var Gn=zn(Wn),Kn=k({},vn);Kn[P]=k(k({},Kn[P]),dn.kit),zn(Kn);var qn=mt,Jn=`fa-layers-text`,Yn=ht;zn(k({},rn));var Xn=[`class`,`data-prefix`,`data-icon`,`data-fa-transform`,`data-fa-mask`],Zn=_t,Qn=[].concat(A(un),A(Tn)),$n=j.FontAwesomeConfig||{};function er(e){var t=M.querySelector(`script[`+e+`]`);if(t)return t.getAttribute(e)}function tr(e){return e===``?!0:e===`false`?!1:e===`true`?!0:e}M&&typeof M.querySelector==`function`&&[[`data-family-prefix`,`familyPrefix`],[`data-css-prefix`,`cssPrefix`],[`data-family-default`,`familyDefault`],[`data-style-default`,`styleDefault`],[`data-replacement-class`,`replacementClass`],[`data-auto-replace-svg`,`autoReplaceSvg`],[`data-auto-add-css`,`autoAddCss`],[`data-search-pseudo-elements`,`searchPseudoElements`],[`data-search-pseudo-elements-warnings`,`searchPseudoElementsWarnings`],[`data-search-pseudo-elements-full-scan`,`searchPseudoElementsFullScan`],[`data-observe-mutations`,`observeMutations`],[`data-mutate-approach`,`mutateApproach`],[`data-keep-original-source`,`keepOriginalSource`],[`data-measure-performance`,`measurePerformance`],[`data-show-missing-icons`,`showMissingIcons`]].forEach(function(e){var t=Qe(e,2),n=t[0],r=t[1],i=tr(er(n));i!=null&&($n[r]=i)});var nr={styleDefault:`solid`,familyDefault:P,cssPrefix:On,replacementClass:kn,autoReplaceSvg:!0,autoAddCss:!0,searchPseudoElements:!1,searchPseudoElementsWarnings:!0,searchPseudoElementsFullScan:!1,observeMutations:!0,mutateApproach:`async`,keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};$n.familyPrefix&&($n.cssPrefix=$n.familyPrefix);var L=k(k({},nr),$n);L.autoReplaceSvg||(L.observeMutations=!1);var R={};Object.keys(nr).forEach(function(e){Object.defineProperty(R,e,{enumerable:!0,set:function(t){L[e]=t,rr.forEach(function(e){return e(R)})},get:function(){return L[e]}})}),Object.defineProperty(R,"familyPrefix",{enumerable:!0,set:function(e){L.cssPrefix=e,rr.forEach(function(e){return e(R)})},get:function(){return L.cssPrefix}}),j.FontAwesomeConfig=R;var rr=[];function ir(e){return rr.push(e),function(){rr.splice(rr.indexOf(e),1)}}var z=Dn,B={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function ar(e){if(!(!e||!N)){var t=M.createElement(`style`);t.setAttribute(`type`,`text/css`),t.innerHTML=e;for(var n=M.head.childNodes,r=null,i=n.length-1;i>-1;i--){var a=n[i],o=(a.tagName||``).toUpperCase();[`STYLE`,`LINK`].indexOf(o)>-1&&(r=a)}return M.head.insertBefore(t,r),e}}var or=`0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`;function sr(){for(var e=12,t=``;e-- >0;)t+=or[Math.random()*62|0];return t}function V(e){for(var t=[],n=(e||[]).length>>>0;n--;)t[n]=e[n];return t}function cr(e){return e.classList?V(e.classList):(e.getAttribute(`class`)||``).split(` `).filter(function(e){return e})}function lr(e){return`${e}`.replace(/&/g,`&amp;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}function ur(e){return Object.keys(e||{}).reduce(function(t,n){return t+`${n}="${lr(e[n])}" `},``).trim()}function dr(e){return Object.keys(e||{}).reduce(function(t,n){return t+`${n}: ${e[n].trim()};`},``)}function fr(e){return e.size!==B.size||e.x!==B.x||e.y!==B.y||e.rotate!==B.rotate||e.flipX||e.flipY}function pr(e){var t=e.transform,n=e.containerWidth,r=e.iconWidth;return{outer:{transform:`translate(${n/2} 256)`},inner:{transform:`${`translate(${t.x*32}, ${t.y*32}) `} ${`scale(${t.size/16*(t.flipX?-1:1)}, ${t.size/16*(t.flipY?-1:1)}) `} ${`rotate(${t.rotate} 0 0)`}`},path:{transform:`translate(${r/2*-1} -256)`}}}function mr(e){var t=e.transform,n=e.width,r=n===void 0?Dn:n,i=e.height,a=i===void 0?Dn:i,o=e.startCentered,s=o===void 0?!1:o,c=``;return s&&ft?c+=`translate(${t.x/z-r/2}em, ${t.y/z-a/2}em) `:s?c+=`translate(calc(-50% + ${t.x/z}em), calc(-50% + ${t.y/z}em)) `:c+=`translate(${t.x/z}em, ${t.y/z}em) `,c+=`scale(${t.size/z*(t.flipX?-1:1)}, ${t.size/z*(t.flipY?-1:1)}) `,c+=`rotate(${t.rotate}deg) `,c}var hr=`:root, :host {
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
}`;function gr(){var e=On,t=kn,n=R.cssPrefix,r=R.replacementClass,i=hr;if(n!==e||r!==t){var a=RegExp(`\\.${e}\\-`,`g`),o=RegExp(`\\--${e}\\-`,`g`),s=RegExp(`\\.${t}`,`g`);i=i.replace(a,`.${n}-`).replace(o,`--${n}-`).replace(s,`.${r}`)}return i}var _r=!1;function vr(){R.autoAddCss&&!_r&&(ar(gr()),_r=!0)}var yr={mixout:function(){return{dom:{css:gr,insertCss:vr}}},hooks:function(){return{beforeDOMElementCreation:function(){vr()},beforeI2svg:function(){vr()}}}},H=j||{};H[F]||(H[F]={}),H[F].styles||(H[F].styles={}),H[F].hooks||(H[F].hooks={}),H[F].shims||(H[F].shims=[]);var U=H[F],br=[],xr=function(){M.removeEventListener(`DOMContentLoaded`,xr),Sr=1,br.map(function(e){return e()})},Sr=!1;N&&(Sr=(M.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(M.readyState),Sr||M.addEventListener(`DOMContentLoaded`,xr));function Cr(e){N&&(Sr?setTimeout(e,0):br.push(e))}function wr(e){var t=e.tag,n=e.attributes,r=n===void 0?{}:n,i=e.children,a=i===void 0?[]:i;return typeof e==`string`?lr(e):`<${t} ${ur(r)}>${a.map(wr).join(``)}</${t}>`}function Tr(e,t,n){if(e&&e[t]&&e[t][n])return{prefix:t,iconName:n,icon:e[t][n]}}var Er=function(e,t){return function(n,r,i,a){return e.call(t,n,r,i,a)}},Dr=function(e,t,n,r){var i=Object.keys(e),a=i.length,o=r===void 0?t:Er(t,r),s,c,l;for(n===void 0?(s=1,l=e[i[0]]):(s=0,l=n);s<a;s++)c=i[s],l=o(l,e[c],c,e);return l};function Or(e){return A(e).length===1?e.codePointAt(0).toString(16):null}function kr(e){return Object.keys(e).reduce(function(t,n){var r=e[n];return r.icon?t[r.iconName]=r.icon:t[n]=r,t},{})}function Ar(e,t){var n=(arguments.length>2&&arguments[2]!==void 0?arguments[2]:{}).skipHooks,r=n===void 0?!1:n,i=kr(t);typeof U.hooks.addPack==`function`&&!r?U.hooks.addPack(e,kr(t)):U.styles[e]=k(k({},U.styles[e]||{}),i),e===`fas`&&Ar(`fa`,t)}var jr=U.styles,Mr=U.shims,Nr=Object.keys(Gn),Pr=Nr.reduce(function(e,t){return e[t]=Object.keys(Gn[t]),e},{}),Fr=null,Ir={},Lr={},Rr={},zr={},Br={};function Vr(e){return~Qn.indexOf(e)}function Hr(e,t){var n=t.split(`-`),r=n[0],i=n.slice(1).join(`-`);return r===e&&i!==``&&!Vr(i)?i:null}var Ur=function(){var e=function(e){return Dr(jr,function(t,n,r){return t[r]=Dr(n,e,{}),t},{})};Ir=e(function(e,t,n){return t[3]&&(e[t[3]]=n),t[2]&&t[2].filter(function(e){return typeof e==`number`}).forEach(function(t){e[t.toString(16)]=n}),e}),Lr=e(function(e,t,n){return e[n]=n,t[2]&&t[2].filter(function(e){return typeof e==`string`}).forEach(function(t){e[t]=n}),e}),Br=e(function(e,t,n){var r=t[2];return e[n]=n,r.forEach(function(t){e[t]=n}),e});var t=`far`in jr||R.autoFetchSvg,n=Dr(Mr,function(e,n){var r=n[0],i=n[1],a=n[2];return i===`far`&&!t&&(i=`fas`),typeof r==`string`&&(e.names[r]={prefix:i,iconName:a}),typeof r==`number`&&(e.unicodes[r.toString(16)]={prefix:i,iconName:a}),e},{names:{},unicodes:{}});Rr=n.names,zr=n.unicodes,Fr=Xr(R.styleDefault,{family:R.familyDefault})};ir(function(e){Fr=Xr(e.styleDefault,{family:R.familyDefault})}),Ur();function Wr(e,t){return(Ir[e]||{})[t]}function Gr(e,t){return(Lr[e]||{})[t]}function W(e,t){return(Br[e]||{})[t]}function Kr(e){return Rr[e]||{prefix:null,iconName:null}}function qr(e){var t=zr[e],n=Wr(`fas`,e);return t||(n?{prefix:`fas`,iconName:n}:null)||{prefix:null,iconName:null}}function G(){return Fr}var Jr=function(){return{prefix:null,iconName:null,rest:[]}};function Yr(e){var t=P,n=Nr.reduce(function(e,t){return e[t]=`${R.cssPrefix}-${t}`,e},{});return nn.forEach(function(r){(e.includes(n[r])||e.some(function(e){return Pr[r].includes(e)}))&&(t=r)}),t}function Xr(e){var t=(arguments.length>1&&arguments[1]!==void 0?arguments[1]:{}).family,n=t===void 0?P:t,r=Vn[n][e];if(n===yt&&!e)return`fad`;var i=Un[n][e]||Un[n][r],a=e in U.styles?e:null;return i||a||null}function Zr(e){var t=[],n=null;return e.forEach(function(e){var r=Hr(R.cssPrefix,e);r?n=r:e&&t.push(e)}),{iconName:n,rest:t}}function Qr(e){return e.sort().filter(function(e,t,n){return n.indexOf(e)===t})}var $r=xn.concat(cn);function ei(e){var t=(arguments.length>1&&arguments[1]!==void 0?arguments[1]:{}).skipLookups,n=t===void 0?!1:t,r=null,i=Qr(e.filter(function(e){return $r.includes(e)})),a=Qr(e.filter(function(e){return!$r.includes(e)})),o=Qe(i.filter(function(e){return r=e,!vt.includes(e)}),1)[0],s=o===void 0?null:o,c=Yr(i),l=k(k({},Zr(a)),{},{prefix:Xr(s,{family:c})});return k(k(k({},l),ii({values:e,family:c,styles:jr,config:R,canonical:l,givenPrefix:r})),ti(n,r,l))}function ti(e,t,n){var r=n.prefix,i=n.iconName;if(e||!r||!i)return{prefix:r,iconName:i};var a=t===`fa`?Kr(i):{},o=W(r,i);return i=a.iconName||o||i,r=a.prefix||r,r===`far`&&!jr.far&&jr.fas&&!R.autoFetchSvg&&(r=`fas`),{prefix:r,iconName:i}}var ni=nn.filter(function(e){return e!==P||e!==yt}),ri=Object.keys(bn).filter(function(e){return e!==P}).map(function(e){return Object.keys(bn[e])}).flat();function ii(e){var t=e.values,n=e.family,r=e.canonical,i=e.givenPrefix,a=i===void 0?``:i,o=e.styles,s=o===void 0?{}:o,c=e.config,l=c===void 0?{}:c,u=n===yt,d=t.includes(`fa-duotone`)||t.includes(`fad`),f=l.familyDefault===`duotone`,p=r.prefix===`fad`||r.prefix===`fa-duotone`;return!u&&(d||f||p)&&(r.prefix=`fad`),(t.includes(`fa-brands`)||t.includes(`fab`))&&(r.prefix=`fab`),!r.prefix&&ni.includes(n)&&(Object.keys(s).find(function(e){return ri.includes(e)})||l.autoFetchSvg)&&(r.prefix=on.get(n).defaultShortPrefixId,r.iconName=W(r.prefix,r.iconName)||r.iconName),(r.prefix===`fa`||a===`fa`)&&(r.prefix=G()||`fas`),r}var ai=function(){function e(){Ue(this,e),this.definitions={}}return Ge(e,[{key:`add`,value:function(){var e=this,t=[...arguments].reduce(this._pullDefinitions,{});Object.keys(t).forEach(function(n){e.definitions[n]=k(k({},e.definitions[n]||{}),t[n]),Ar(n,t[n]);var r=Gn[P][n];r&&Ar(r,t[n]),Ur()})}},{key:`reset`,value:function(){this.definitions={}}},{key:`_pullDefinitions`,value:function(e,t){var n=t.prefix&&t.iconName&&t.icon?{0:t}:t;return Object.keys(n).map(function(t){var r=n[t],i=r.prefix,a=r.iconName,o=r.icon,s=o[2];e[i]||(e[i]={}),s.length>0&&s.forEach(function(t){typeof t==`string`&&(e[i][t]=o)}),e[i][a]=o}),e}}])}(),oi=[],K={},q={},si=Object.keys(q);function ci(e,t){var n=t.mixoutsTo;return oi=e,K={},Object.keys(q).forEach(function(e){si.indexOf(e)===-1&&delete q[e]}),oi.forEach(function(e){var t=e.mixout?e.mixout():{};if(Object.keys(t).forEach(function(e){typeof t[e]==`function`&&(n[e]=t[e]),tt(t[e])===`object`&&Object.keys(t[e]).forEach(function(r){n[e]||(n[e]={}),n[e][r]=t[e][r]})}),e.hooks){var r=e.hooks();Object.keys(r).forEach(function(e){K[e]||(K[e]=[]),K[e].push(r[e])})}e.provides&&e.provides(q)}),n}function li(e,t){var n=[...arguments].slice(2);return(K[e]||[]).forEach(function(e){t=e.apply(null,[t].concat(n))}),t}function J(e){var t=[...arguments].slice(1);(K[e]||[]).forEach(function(e){e.apply(null,t)})}function Y(){var e=arguments[0],t=Array.prototype.slice.call(arguments,1);return q[e]?q[e].apply(null,t):void 0}function ui(e){e.prefix===`fa`&&(e.prefix=`fas`);var t=e.iconName,n=e.prefix||G();if(t)return t=W(n,t)||t,Tr(di.definitions,n,t)||Tr(U.styles,n,t)}var di=new ai,X={noAuto:function(){R.autoReplaceSvg=!1,R.observeMutations=!1,J(`noAuto`)},config:R,dom:{i2svg:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return N?(J(`beforeI2svg`,e),Y(`pseudoElements2svg`,e),Y(`i2svg`,e)):Promise.reject(Error(`Operation requires a DOM of some kind.`))},watch:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=e.autoReplaceSvgRoot;R.autoReplaceSvg===!1&&(R.autoReplaceSvg=!0),R.observeMutations=!0,Cr(function(){fi({autoReplaceSvgRoot:t}),J(`watch`,e)})}},parse:{icon:function(e){if(e===null)return null;if(tt(e)===`object`&&e.prefix&&e.iconName)return{prefix:e.prefix,iconName:W(e.prefix,e.iconName)||e.iconName};if(Array.isArray(e)&&e.length===2){var t=e[1].indexOf(`fa-`)===0?e[1].slice(3):e[1],n=Xr(e[0]);return{prefix:n,iconName:W(n,t)||t}}if(typeof e==`string`&&(e.indexOf(`${R.cssPrefix}-`)>-1||e.match(qn))){var r=ei(e.split(` `),{skipLookups:!0});return{prefix:r.prefix||G(),iconName:W(r.prefix,r.iconName)||r.iconName}}if(typeof e==`string`){var i=G();return{prefix:i,iconName:W(i,e)||e}}}},library:di,findIconDefinition:ui,toHtml:wr},fi=function(){var e=(arguments.length>0&&arguments[0]!==void 0?arguments[0]:{}).autoReplaceSvgRoot,t=e===void 0?M:e;(Object.keys(U.styles).length>0||R.autoFetchSvg)&&N&&R.autoReplaceSvg&&X.dom.i2svg({node:t})};function pi(e,t){return Object.defineProperty(e,"abstract",{get:t}),Object.defineProperty(e,"html",{get:function(){return e.abstract.map(function(e){return wr(e)})}}),Object.defineProperty(e,"node",{get:function(){if(N){var t=M.createElement(`div`);return t.innerHTML=e.html,t.children}}}),e}function mi(e){var t=e.children,n=e.main,r=e.mask,i=e.attributes,a=e.styles,o=e.transform;if(fr(o)&&n.found&&!r.found){var s={x:n.width/n.height/2,y:.5};i.style=dr(k(k({},a),{},{"transform-origin":`${s.x+o.x/16}em ${s.y+o.y/16}em`}))}return[{tag:`svg`,attributes:i,children:t}]}function hi(e){var t=e.prefix,n=e.iconName,r=e.children,i=e.attributes,a=e.symbol,o=a===!0?`${t}-${R.cssPrefix}-${n}`:a;return[{tag:`svg`,attributes:{style:`display: none;`},children:[{tag:`symbol`,attributes:k(k({},i),{},{id:o}),children:r}]}]}function gi(e){return[`aria-label`,`aria-labelledby`,`title`,`role`].some(function(t){return t in e})}function _i(e){var t=e.icons,n=t.main,r=t.mask,i=e.prefix,a=e.iconName,o=e.transform,s=e.symbol,c=e.maskId,l=e.extra,u=e.watchable,d=u===void 0?!1:u,f=r.found?r:n,p=f.width,m=f.height,h=[R.replacementClass,a?`${R.cssPrefix}-${a}`:``].filter(function(e){return l.classes.indexOf(e)===-1}).filter(function(e){return e!==``||!!e}).concat(l.classes).join(` `),g={children:[],attributes:k(k({},l.attributes),{},{"data-prefix":i,"data-icon":a,class:h,role:l.attributes.role||`img`,viewBox:`0 0 ${p} ${m}`})};!gi(l.attributes)&&!l.attributes[`aria-hidden`]&&(g.attributes[`aria-hidden`]=`true`),d&&(g.attributes[I]=``);var _=k(k({},g),{},{prefix:i,iconName:a,main:n,mask:r,maskId:c,transform:o,symbol:s,styles:k({},l.styles)}),v=r.found&&n.found?Y(`generateAbstractMask`,_)||{children:[],attributes:{}}:Y(`generateAbstractIcon`,_)||{children:[],attributes:{}},y=v.children,b=v.attributes;return _.children=y,_.attributes=b,s?hi(_):mi(_)}function vi(e){var t=e.content,n=e.width,r=e.height,i=e.transform,a=e.extra,o=e.watchable,s=o===void 0?!1:o,c=k(k({},a.attributes),{},{class:a.classes.join(` `)});s&&(c[I]=``);var l=k({},a.styles);fr(i)&&(l.transform=mr({transform:i,startCentered:!0,width:n,height:r}),l[`-webkit-transform`]=l.transform);var u=dr(l);u.length>0&&(c.style=u);var d=[];return d.push({tag:`span`,attributes:c,children:[t]}),d}function yi(e){var t=e.content,n=e.extra,r=k(k({},n.attributes),{},{class:n.classes.join(` `)}),i=dr(n.styles);i.length>0&&(r.style=i);var a=[];return a.push({tag:`span`,attributes:r,children:[t]}),a}var bi=U.styles;function xi(e){var t=e[0],n=e[1],r=Qe(e.slice(4),1)[0],i=null;return i=Array.isArray(r)?{tag:`g`,attributes:{class:`${R.cssPrefix}-${Zn.GROUP}`},children:[{tag:`path`,attributes:{class:`${R.cssPrefix}-${Zn.SECONDARY}`,fill:`currentColor`,d:r[0]}},{tag:`path`,attributes:{class:`${R.cssPrefix}-${Zn.PRIMARY}`,fill:`currentColor`,d:r[1]}}]}:{tag:`path`,attributes:{fill:`currentColor`,d:r}},{found:!0,width:t,height:n,icon:i}}var Si={found:!1,width:512,height:512};function Ci(e,t){!Rn&&!R.showMissingIcons&&e&&console.error(`Icon with name "${e}" and prefix "${t}" is missing.`)}function wi(e,t){var n=t;return t===`fa`&&R.styleDefault!==null&&(t=G()),new Promise(function(r,i){if(n===`fa`){var a=Kr(e)||{};e=a.iconName||e,t=a.prefix||t}if(e&&t&&bi[t]&&bi[t][e]){var o=bi[t][e];return r(xi(o))}Ci(e,t),r(k(k({},Si),{},{icon:R.showMissingIcons&&e&&Y(`missingIconAbstract`)||{}}))})}var Ti=function(){},Ei=R.measurePerformance&&dt&&dt.mark&&dt.measure?dt:{mark:Ti,measure:Ti},Di=`FA "7.2.0"`,Oi=function(e){return Ei.mark(`${Di} ${e} begins`),function(){return ki(e)}},ki=function(e){Ei.mark(`${Di} ${e} ends`),Ei.measure(`${Di} ${e}`,`${Di} ${e} begins`,`${Di} ${e} ends`)},Ai={begin:Oi,end:ki},ji=function(){};function Mi(e){return typeof(e.getAttribute?e.getAttribute(I):null)==`string`}function Ni(e){var t=e.getAttribute?e.getAttribute(Mn):null,n=e.getAttribute?e.getAttribute(Nn):null;return t&&n}function Pi(e){return e&&e.classList&&e.classList.contains&&e.classList.contains(R.replacementClass)}function Fi(){return R.autoReplaceSvg===!0?Bi.replace:Bi[R.autoReplaceSvg]||Bi.replace}function Ii(e){return M.createElementNS(`http://www.w3.org/2000/svg`,e)}function Li(e){return M.createElement(e)}function Ri(e){var t=(arguments.length>1&&arguments[1]!==void 0?arguments[1]:{}).ceFn,n=t===void 0?e.tag===`svg`?Ii:Li:t;if(typeof e==`string`)return M.createTextNode(e);var r=n(e.tag);return Object.keys(e.attributes||[]).forEach(function(t){r.setAttribute(t,e.attributes[t])}),(e.children||[]).forEach(function(e){r.appendChild(Ri(e,{ceFn:n}))}),r}function zi(e){var t=` ${e.outerHTML} `;return t=`${t}Font Awesome fontawesome.com `,t}var Bi={replace:function(e){var t=e[0];if(t.parentNode)if(e[1].forEach(function(e){t.parentNode.insertBefore(Ri(e),t)}),t.getAttribute(I)===null&&R.keepOriginalSource){var n=M.createComment(zi(t));t.parentNode.replaceChild(n,t)}else t.remove()},nest:function(e){var t=e[0],n=e[1];if(~cr(t).indexOf(R.replacementClass))return Bi.replace(e);var r=RegExp(`${R.cssPrefix}-.*`);if(delete n[0].attributes.id,n[0].attributes.class){var i=n[0].attributes.class.split(` `).reduce(function(e,t){return t===R.replacementClass||t.match(r)?e.toSvg.push(t):e.toNode.push(t),e},{toNode:[],toSvg:[]});n[0].attributes.class=i.toSvg.join(` `),i.toNode.length===0?t.removeAttribute(`class`):t.setAttribute(`class`,i.toNode.join(` `))}var a=n.map(function(e){return wr(e)}).join(`
`);t.setAttribute(I,``),t.innerHTML=a}};function Vi(e){e()}function Hi(e,t){var n=typeof t==`function`?t:ji;if(e.length===0)n();else{var r=Vi;R.mutateApproach===Fn&&(r=j.requestAnimationFrame||Vi),r(function(){var t=Fi(),r=Ai.begin(`mutate`);e.map(t),r(),n()})}}var Ui=!1;function Wi(){Ui=!0}function Gi(){Ui=!1}var Ki=null;function qi(e){if(ut&&R.observeMutations){var t=e.treeCallback,n=t===void 0?ji:t,r=e.nodeCallback,i=r===void 0?ji:r,a=e.pseudoElementsCallback,o=a===void 0?ji:a,s=e.observeMutationsRoot,c=s===void 0?M:s;Ki=new ut(function(e){if(!Ui){var t=G();V(e).forEach(function(e){if(e.type===`childList`&&e.addedNodes.length>0&&!Mi(e.addedNodes[0])&&(R.searchPseudoElements&&o(e.target),n(e.target)),e.type===`attributes`&&e.target.parentNode&&R.searchPseudoElements&&o([e.target],!0),e.type===`attributes`&&Mi(e.target)&&~Xn.indexOf(e.attributeName))if(e.attributeName===`class`&&Ni(e.target)){var r=ei(cr(e.target)),a=r.prefix,s=r.iconName;e.target.setAttribute(Mn,a||t),s&&e.target.setAttribute(Nn,s)}else Pi(e.target)&&i(e.target)})}}),N&&Ki.observe(c,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}}function Ji(){Ki&&Ki.disconnect()}function Yi(e){var t=e.getAttribute(`style`),n=[];return t&&(n=t.split(`;`).reduce(function(e,t){var n=t.split(`:`),r=n[0],i=n.slice(1);return r&&i.length>0&&(e[r]=i.join(`:`).trim()),e},{})),n}function Xi(e){var t=e.getAttribute(`data-prefix`),n=e.getAttribute(`data-icon`),r=e.innerText===void 0?``:e.innerText.trim(),i=ei(cr(e));return i.prefix||(i.prefix=G()),t&&n&&(i.prefix=t,i.iconName=n),i.iconName&&i.prefix?i:(i.prefix&&r.length>0&&(i.iconName=Gr(i.prefix,e.innerText)||Wr(i.prefix,Or(e.innerText))),!i.iconName&&R.autoFetchSvg&&e.firstChild&&e.firstChild.nodeType===Node.TEXT_NODE&&(i.iconName=e.firstChild.data),i)}function Zi(e){return V(e.attributes).reduce(function(e,t){return e.name!==`class`&&e.name!==`style`&&(e[t.name]=t.value),e},{})}function Qi(){return{iconName:null,prefix:null,transform:B,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function $i(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},n=Xi(e),r=n.iconName,i=n.prefix,a=n.rest,o=Zi(e),s=li(`parseNodeAttributes`,{},e);return k({iconName:r,prefix:i,transform:B,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:a,styles:t.styleParser?Yi(e):[],attributes:o}},s)}var ea=U.styles;function ta(e){var t=R.autoReplaceSvg===`nest`?$i(e,{styleParser:!1}):$i(e);return~t.extra.classes.indexOf(Jn)?Y(`generateLayersText`,e,t):Y(`generateSvgReplacementMutation`,e,t)}function na(){return[].concat(A(cn),A(xn))}function ra(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!N)return Promise.resolve();var n=M.documentElement.classList,r=function(e){return n.add(`${Pn}-${e}`)},i=function(e){return n.remove(`${Pn}-${e}`)},a=R.autoFetchSvg?na():vt.concat(Object.keys(ea));a.includes(`fa`)||a.push(`fa`);var o=[`.${Jn}:not([${I}])`].concat(a.map(function(e){return`.${e}:not([${I}])`})).join(`, `);if(o.length===0)return Promise.resolve();var s=[];try{s=V(e.querySelectorAll(o))}catch{}if(s.length>0)r(`pending`),i(`complete`);else return Promise.resolve();var c=Ai.begin(`onTree`),l=s.reduce(function(e,t){try{var n=ta(t);n&&e.push(n)}catch(e){Rn||e.name===`MissingIcon`&&console.error(e)}return e},[]);return new Promise(function(e,n){Promise.all(l).then(function(n){Hi(n,function(){r(`active`),r(`complete`),i(`pending`),typeof t==`function`&&t(),c(),e()})}).catch(function(e){c(),n(e)})})}function ia(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;ta(e).then(function(e){e&&Hi([e],t)})}function aa(e){return function(t){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=(t||{}).icon?t:ui(t||{}),i=n.mask;return i&&(i=(i||{}).icon?i:ui(i||{})),e(r,k(k({},n),{},{mask:i}))}}var oa=function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.transform,r=n===void 0?B:n,i=t.symbol,a=i===void 0?!1:i,o=t.mask,s=o===void 0?null:o,c=t.maskId,l=c===void 0?null:c,u=t.classes,d=u===void 0?[]:u,f=t.attributes,p=f===void 0?{}:f,m=t.styles,h=m===void 0?{}:m;if(e){var g=e.prefix,_=e.iconName,v=e.icon;return pi(k({type:`icon`},e),function(){return J(`beforeDOMElementCreation`,{iconDefinition:e,params:t}),_i({icons:{main:xi(v),mask:s?xi(s.icon):{found:!1,width:null,height:null,icon:{}}},prefix:g,iconName:_,transform:k(k({},B),r),symbol:a,maskId:l,extra:{attributes:p,styles:h,classes:d}})})}},sa={mixout:function(){return{icon:aa(oa)}},hooks:function(){return{mutationObserverCallbacks:function(e){return e.treeCallback=ra,e.nodeCallback=ia,e}}},provides:function(e){e.i2svg=function(e){var t=e.node,n=t===void 0?M:t,r=e.callback;return ra(n,r===void 0?function(){}:r)},e.generateSvgReplacementMutation=function(e,t){var n=t.iconName,r=t.prefix,i=t.transform,a=t.symbol,o=t.mask,s=t.maskId,c=t.extra;return new Promise(function(t,l){Promise.all([wi(n,r),o.iconName?wi(o.iconName,o.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(function(o){var l=Qe(o,2),u=l[0],d=l[1];t([e,_i({icons:{main:u,mask:d},prefix:r,iconName:n,transform:i,symbol:a,maskId:s,extra:c,watchable:!0})])}).catch(l)})},e.generateAbstractIcon=function(e){var t=e.children,n=e.attributes,r=e.main,i=e.transform,a=e.styles,o=dr(a);o.length>0&&(n.style=o);var s;return fr(i)&&(s=Y(`generateAbstractTransformGrouping`,{main:r,transform:i,containerWidth:r.width,iconWidth:r.width})),t.push(s||r.icon),{children:t,attributes:n}}}},ca={mixout:function(){return{layer:function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.classes,r=n===void 0?[]:n;return pi({type:`layer`},function(){J(`beforeDOMElementCreation`,{assembler:e,params:t});var n=[];return e(function(e){Array.isArray(e)?e.map(function(e){n=n.concat(e.abstract)}):n=n.concat(e.abstract)}),[{tag:`span`,attributes:{class:[`${R.cssPrefix}-layers`].concat(A(r)).join(` `)},children:n}]})}}}},la={mixout:function(){return{counter:function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.title,r=n===void 0?null:n,i=t.classes,a=i===void 0?[]:i,o=t.attributes,s=o===void 0?{}:o,c=t.styles,l=c===void 0?{}:c;return pi({type:`counter`,content:e},function(){return J(`beforeDOMElementCreation`,{content:e,params:t}),yi({content:e.toString(),title:r,extra:{attributes:s,styles:l,classes:[`${R.cssPrefix}-layers-counter`].concat(A(a))}})})}}}},ua={mixout:function(){return{text:function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.transform,r=n===void 0?B:n,i=t.classes,a=i===void 0?[]:i,o=t.attributes,s=o===void 0?{}:o,c=t.styles,l=c===void 0?{}:c;return pi({type:`text`,content:e},function(){return J(`beforeDOMElementCreation`,{content:e,params:t}),vi({content:e,transform:k(k({},B),r),extra:{attributes:s,styles:l,classes:[`${R.cssPrefix}-layers-text`].concat(A(a))}})})}}},provides:function(e){e.generateLayersText=function(e,t){var n=t.transform,r=t.extra,i=null,a=null;if(ft){var o=parseInt(getComputedStyle(e).fontSize,10),s=e.getBoundingClientRect();i=s.width/o,a=s.height/o}return Promise.resolve([e,vi({content:e.innerHTML,width:i,height:a,transform:n,extra:r,watchable:!0})])}}},da=RegExp(`"`,`ug`),fa=[1105920,1112319],pa=k(k(k(k({},{FontAwesome:{normal:`fas`,400:`fas`}}),an),En),fn),ma=Object.keys(pa).reduce(function(e,t){return e[t.toLowerCase()]=pa[t],e},{}),ha=Object.keys(ma).reduce(function(e,t){var n=ma[t];return e[t]=n[900]||A(Object.entries(n))[0][1],e},{});function ga(e){return Or(A(e.replace(da,``))[0]||``)}function _a(e){var t=e.getPropertyValue(`font-feature-settings`).includes(`ss01`),n=e.getPropertyValue(`content`).replace(da,``),r=n.codePointAt(0),i=r>=fa[0]&&r<=fa[1],a=n.length===2?n[0]===n[1]:!1;return i||a||t}function va(e,t){var n=e.replace(/^['"]|['"]$/g,``).toLowerCase(),r=parseInt(t),i=isNaN(r)?`normal`:r;return(ma[n]||{})[i]||ha[n]}function ya(e,t){var n=`${jn}${t.replace(`:`,`-`)}`;return new Promise(function(r,i){if(e.getAttribute(n)!==null)return r();var a=V(e.children).filter(function(e){return e.getAttribute(An)===t})[0],o=j.getComputedStyle(e,t),s=o.getPropertyValue(`font-family`),c=s.match(Yn),l=o.getPropertyValue(`font-weight`),u=o.getPropertyValue(`content`);if(a&&!c)return e.removeChild(a),r();if(c&&u!==`none`&&u!==``){var d=o.getPropertyValue(`content`),f=va(s,l),p=ga(d),m=c[0].startsWith(`FontAwesome`),h=_a(o),g=Wr(f,p),_=g;if(m){var v=qr(p);v.iconName&&v.prefix&&(g=v.iconName,f=v.prefix)}if(g&&!h&&(!a||a.getAttribute(Mn)!==f||a.getAttribute(Nn)!==_)){e.setAttribute(n,_),a&&e.removeChild(a);var y=Qi(),b=y.extra;b.attributes[An]=t,wi(g,f).then(function(i){var a=_i(k(k({},y),{},{icons:{main:i,mask:Jr()},prefix:f,iconName:_,extra:b,watchable:!0})),o=M.createElementNS(`http://www.w3.org/2000/svg`,`svg`);t===`::before`?e.insertBefore(o,e.firstChild):e.appendChild(o),o.outerHTML=a.map(function(e){return wr(e)}).join(`
`),e.removeAttribute(n),r()}).catch(i)}else r()}else r()})}function ba(e){return Promise.all([ya(e,`::before`),ya(e,`::after`)])}function xa(e){return e.parentNode!==document.head&&!~In.indexOf(e.tagName.toUpperCase())&&!e.getAttribute(An)&&(!e.parentNode||e.parentNode.tagName!==`svg`)}var Sa=function(e){return!!e&&Ln.some(function(t){return e.includes(t)})},Ca=function(e){if(!e)return[];var t=new Set,n=e.split(/,(?![^()]*\))/).map(function(e){return e.trim()});n=n.flatMap(function(e){return e.includes(`(`)?e:e.split(`,`).map(function(e){return e.trim()})});var r=Ke(n),i;try{for(r.s();!(i=r.n()).done;){var a=i.value;if(Sa(a)){var o=Ln.reduce(function(e,t){return e.replace(t,``)},a);o!==``&&o!==`*`&&t.add(o)}}}catch(e){r.e(e)}finally{r.f()}return t};function wa(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;if(N){var n;if(t)n=e;else if(R.searchPseudoElementsFullScan)n=e.querySelectorAll(`*`);else{var r=new Set,i=Ke(document.styleSheets),a;try{for(i.s();!(a=i.n()).done;){var o=a.value;try{var s=Ke(o.cssRules),c;try{for(s.s();!(c=s.n()).done;){var l=c.value,u=Ke(Ca(l.selectorText)),d;try{for(u.s();!(d=u.n()).done;){var f=d.value;r.add(f)}}catch(e){u.e(e)}finally{u.f()}}}catch(e){s.e(e)}finally{s.f()}}catch(e){R.searchPseudoElementsWarnings&&console.warn(`Font Awesome: cannot parse stylesheet: ${o.href} (${e.message})
If it declares any Font Awesome CSS pseudo-elements, they will not be rendered as SVG icons. Add crossorigin="anonymous" to the <link>, enable searchPseudoElementsFullScan for slower but more thorough DOM parsing, or suppress this warning by setting searchPseudoElementsWarnings to false.`)}}}catch(e){i.e(e)}finally{i.f()}if(!r.size)return;var p=Array.from(r).join(`, `);try{n=e.querySelectorAll(p)}catch{}}return new Promise(function(e,t){var r=V(n).filter(xa).map(ba),i=Ai.begin(`searchPseudoElements`);Wi(),Promise.all(r).then(function(){i(),Gi(),e()}).catch(function(){i(),Gi(),t()})})}}var Ta={hooks:function(){return{mutationObserverCallbacks:function(e){return e.pseudoElementsCallback=wa,e}}},provides:function(e){e.pseudoElements2svg=function(e){var t=e.node,n=t===void 0?M:t;R.searchPseudoElements&&wa(n)}}},Ea=!1,Da={mixout:function(){return{dom:{unwatch:function(){Wi(),Ea=!0}}}},hooks:function(){return{bootstrap:function(){qi(li(`mutationObserverCallbacks`,{}))},noAuto:function(){Ji()},watch:function(e){var t=e.observeMutationsRoot;Ea?Gi():qi(li(`mutationObserverCallbacks`,{observeMutationsRoot:t}))}}}},Oa=function(e){return e.toLowerCase().split(` `).reduce(function(e,t){var n=t.toLowerCase().split(`-`),r=n[0],i=n.slice(1).join(`-`);if(r&&i===`h`)return e.flipX=!0,e;if(r&&i===`v`)return e.flipY=!0,e;if(i=parseFloat(i),isNaN(i))return e;switch(r){case`grow`:e.size+=i;break;case`shrink`:e.size-=i;break;case`left`:e.x-=i;break;case`right`:e.x+=i;break;case`up`:e.y-=i;break;case`down`:e.y+=i;break;case`rotate`:e.rotate+=i;break}return e},{size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0})},ka={mixout:function(){return{parse:{transform:function(e){return Oa(e)}}}},hooks:function(){return{parseNodeAttributes:function(e,t){var n=t.getAttribute(`data-fa-transform`);return n&&(e.transform=Oa(n)),e}}},provides:function(e){e.generateAbstractTransformGrouping=function(e){var t=e.main,n=e.transform,r=e.containerWidth,i=e.iconWidth,a={outer:{transform:`translate(${r/2} 256)`},inner:{transform:`${`translate(${n.x*32}, ${n.y*32}) `} ${`scale(${n.size/16*(n.flipX?-1:1)}, ${n.size/16*(n.flipY?-1:1)}) `} ${`rotate(${n.rotate} 0 0)`}`},path:{transform:`translate(${i/2*-1} -256)`}};return{tag:`g`,attributes:k({},a.outer),children:[{tag:`g`,attributes:k({},a.inner),children:[{tag:t.icon.tag,children:t.icon.children,attributes:k(k({},t.icon.attributes),a.path)}]}]}}}},Aa={x:0,y:0,width:`100%`,height:`100%`};function ja(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return e.attributes&&(e.attributes.fill||t)&&(e.attributes.fill=`black`),e}function Ma(e){return e.tag===`g`?e.children:[e]}ci([yr,sa,ca,la,ua,Ta,Da,ka,{hooks:function(){return{parseNodeAttributes:function(e,t){var n=t.getAttribute(`data-fa-mask`),r=n?ei(n.split(` `).map(function(e){return e.trim()})):Jr();return r.prefix||(r.prefix=G()),e.mask=r,e.maskId=t.getAttribute(`data-fa-mask-id`),e}}},provides:function(e){e.generateAbstractMask=function(e){var t=e.children,n=e.attributes,r=e.main,i=e.mask,a=e.maskId,o=e.transform,s=r.width,c=r.icon,l=i.width,u=i.icon,d=pr({transform:o,containerWidth:l,iconWidth:s}),f={tag:`rect`,attributes:k(k({},Aa),{},{fill:`white`})},p=c.children?{children:c.children.map(ja)}:{},m={tag:`g`,attributes:k({},d.inner),children:[ja(k({tag:c.tag,attributes:k(k({},c.attributes),d.path)},p))]},h={tag:`g`,attributes:k({},d.outer),children:[m]},g=`mask-${a||sr()}`,_=`clip-${a||sr()}`,v={tag:`mask`,attributes:k(k({},Aa),{},{id:g,maskUnits:`userSpaceOnUse`,maskContentUnits:`userSpaceOnUse`}),children:[f,h]},y={tag:`defs`,children:[{tag:`clipPath`,attributes:{id:_},children:Ma(u)},v]};return t.push(y,{tag:`rect`,attributes:k({fill:`currentColor`,"clip-path":`url(#${_})`,mask:`url(#${g})`},Aa)}),{children:t,attributes:n}}}},{provides:function(e){var t=!1;j.matchMedia&&(t=j.matchMedia(`(prefers-reduced-motion: reduce)`).matches),e.missingIconAbstract=function(){var e=[],n={fill:`currentColor`},r={attributeType:`XML`,repeatCount:`indefinite`,dur:`2s`};e.push({tag:`path`,attributes:k(k({},n),{},{d:`M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z`})});var i=k(k({},r),{},{attributeName:`opacity`}),a={tag:`circle`,attributes:k(k({},n),{},{cx:`256`,cy:`364`,r:`28`}),children:[]};return t||a.children.push({tag:`animate`,attributes:k(k({},r),{},{attributeName:`r`,values:`28;14;28;28;14;28;`})},{tag:`animate`,attributes:k(k({},i),{},{values:`1;0;1;1;0;1;`})}),e.push(a),e.push({tag:`path`,attributes:k(k({},n),{},{opacity:`1`,d:`M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z`}),children:t?[]:[{tag:`animate`,attributes:k(k({},i),{},{values:`1;0;0;0;0;1;`})}]}),t||e.push({tag:`path`,attributes:k(k({},n),{},{opacity:`0`,d:`M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z`}),children:[{tag:`animate`,attributes:k(k({},i),{},{values:`0;0;1;1;0;0;`})}]}),{tag:`g`,attributes:{class:`missing`},children:e}}}},{hooks:function(){return{parseNodeAttributes:function(e,t){var n=t.getAttribute(`data-fa-symbol`);return e.symbol=n===null?!1:n===``?!0:n,e}}}}],{mixoutsTo:X}),X.noAuto;var Na=X.config;X.library,X.dom;var Pa=X.parse;X.findIconDefinition,X.toHtml;var Fa=X.icon;X.layer,X.text,X.counter;function Ia(e){return e-=0,e===e}function La(e){return Ia(e)?e:(e=e.replace(/[_-]+(.)?/g,(e,t)=>t?t.toUpperCase():``),e.charAt(0).toLowerCase()+e.slice(1))}var Ra=(e,t)=>T.createElement(`stop`,{key:`${t}-${e.offset}`,offset:e.offset,stopColor:e.color,...e.opacity!==void 0&&{stopOpacity:e.opacity}});function za(e){return e.charAt(0).toUpperCase()+e.slice(1)}var Ba=new Map,Va=1e3;function Ha(e){if(Ba.has(e))return Ba.get(e);let t={},n=0,r=e.length;for(;n<r;){let i=e.indexOf(`;`,n),a=i===-1?r:i,o=e.slice(n,a).trim();if(o){let e=o.indexOf(`:`);if(e>0){let n=o.slice(0,e).trim(),r=o.slice(e+1).trim();if(n&&r){let e=La(n);t[e.startsWith(`webkit`)?za(e):e]=r}}}n=a+1}if(Ba.size===Va){let e=Ba.keys().next().value;e&&Ba.delete(e)}return Ba.set(e,t),t}function Ua(e,t,n={}){if(typeof t==`string`)return t;let r=(t.children||[]).map(t=>{let r=t;return(`fill`in n||n.gradientFill)&&t.tag===`path`&&`fill`in t.attributes&&(r={...t,attributes:{...t.attributes,fill:void 0}}),Ua(e,r)}),i=t.attributes||{},a={};for(let[e,t]of Object.entries(i))switch(!0){case e===`class`:a.className=t;break;case e===`style`:a.style=Ha(String(t));break;case e.startsWith(`aria-`):case e.startsWith(`data-`):a[e.toLowerCase()]=t;break;default:a[La(e)]=t}let{style:o,role:s,"aria-label":c,gradientFill:l,...u}=n;if(o&&(a.style=a.style?{...a.style,...o}:o),s&&(a.role=s),c&&(a[`aria-label`]=c,a[`aria-hidden`]=`false`),l){a.fill=`url(#${l.id})`;let{type:t,stops:n=[],...i}=l;r.unshift(e(t===`linear`?`linearGradient`:`radialGradient`,{...i,id:l.id},n.map(Ra)))}return e(t.tag,{...a,...u},...r)}var Wa=Ua.bind(null,T.createElement),Ga=(e,t)=>{let n=(0,T.useId)();return e||(t?n:void 0)},Ka=class{constructor(e=`react-fontawesome`){this.enabled=!1;let t=!1;try{t=typeof process<`u`&&!1}catch{}this.scope=e,this.enabled=t}log(...e){this.enabled&&console.log(`[${this.scope}]`,...e)}warn(...e){this.enabled&&console.warn(`[${this.scope}]`,...e)}error(...e){this.enabled&&console.error(`[${this.scope}]`,...e)}};typeof process<`u`&&{}.FA_VERSION;var qa=`searchPseudoElementsFullScan`in Na&&typeof Na.searchPseudoElementsFullScan==`boolean`?`7.0.0`:`6.0.0`,Ja=Number.parseInt(qa)>=7,Ya=()=>Ja,Xa=`fa`,Z={beat:`fa-beat`,fade:`fa-fade`,beatFade:`fa-beat-fade`,bounce:`fa-bounce`,shake:`fa-shake`,spin:`fa-spin`,spinPulse:`fa-spin-pulse`,spinReverse:`fa-spin-reverse`,pulse:`fa-pulse`},Za={left:`fa-pull-left`,right:`fa-pull-right`},Qa={90:`fa-rotate-90`,180:`fa-rotate-180`,270:`fa-rotate-270`},$a={"2xs":`fa-2xs`,xs:`fa-xs`,sm:`fa-sm`,lg:`fa-lg`,xl:`fa-xl`,"2xl":`fa-2xl`,"1x":`fa-1x`,"2x":`fa-2x`,"3x":`fa-3x`,"4x":`fa-4x`,"5x":`fa-5x`,"6x":`fa-6x`,"7x":`fa-7x`,"8x":`fa-8x`,"9x":`fa-9x`,"10x":`fa-10x`},Q={border:`fa-border`,fixedWidth:`fa-fw`,flip:`fa-flip`,flipHorizontal:`fa-flip-horizontal`,flipVertical:`fa-flip-vertical`,inverse:`fa-inverse`,rotateBy:`fa-rotate-by`,swapOpacity:`fa-swap-opacity`,widthAuto:`fa-width-auto`},eo={default:`fa-layers`};function to(e){let t=Na.cssPrefix||Na.familyPrefix||Xa;return t===Xa?e:e.replace(new RegExp(String.raw`(?<=^|\s)${Xa}-`,`g`),`${t}-`)}function no(e){let{beat:t,fade:n,beatFade:r,bounce:i,shake:a,spin:o,spinPulse:s,spinReverse:c,pulse:l,fixedWidth:u,inverse:d,border:f,flip:p,size:m,rotation:h,pull:g,swapOpacity:_,rotateBy:v,widthAuto:y,className:b}=e,x=[];return b&&x.push(...b.split(` `)),t&&x.push(Z.beat),n&&x.push(Z.fade),r&&x.push(Z.beatFade),i&&x.push(Z.bounce),a&&x.push(Z.shake),o&&x.push(Z.spin),c&&x.push(Z.spinReverse),s&&x.push(Z.spinPulse),l&&x.push(Z.pulse),u&&x.push(Q.fixedWidth),d&&x.push(Q.inverse),f&&x.push(Q.border),p===!0&&x.push(Q.flip),(p===`horizontal`||p===`both`)&&x.push(Q.flipHorizontal),(p===`vertical`||p===`both`)&&x.push(Q.flipVertical),m!=null&&x.push($a[m]),h!=null&&h!==0&&x.push(Qa[h]),g!=null&&x.push(Za[g]),_&&x.push(Q.swapOpacity),Ya()?(v&&x.push(Q.rotateBy),y&&x.push(Q.widthAuto),(Na.cssPrefix||Na.familyPrefix||Xa)===Xa?x:x.map(to)):x}var ro=e=>typeof e==`object`&&`icon`in e&&!!e.icon;function io(e){if(e)return ro(e)?e:Pa.icon(e)}function ao(e){return Object.keys(e)}var oo=new Ka(`FontAwesomeIcon`),so={border:!1,className:``,mask:void 0,maskId:void 0,fixedWidth:!1,inverse:!1,flip:!1,icon:void 0,listItem:!1,pull:void 0,pulse:!1,rotation:void 0,rotateBy:!1,size:void 0,spin:!1,spinPulse:!1,spinReverse:!1,beat:!1,fade:!1,beatFade:!1,bounce:!1,shake:!1,symbol:!1,title:``,titleId:void 0,transform:void 0,swapOpacity:!1,widthAuto:!1},co=new Set(Object.keys(so)),lo=T.forwardRef((e,t)=>{let n={...so,...e},{icon:r,mask:i,symbol:a,title:o,titleId:s,maskId:c,transform:l}=n,u=Ga(c,!!i),d=Ga(s,!!o),f=io(r);if(!f)return oo.error(`Icon lookup is undefined`,r),null;let p=no(n),m=typeof l==`string`?Pa.transform(l):l,h=io(i),g=Fa(f,{...p.length>0&&{classes:p},...m&&{transform:m},...h&&{mask:h},symbol:a,title:o,titleId:d,maskId:u});if(!g)return oo.error(`Could not find icon`,f),null;let{abstract:_}=g,v={ref:t};for(let e of ao(n))co.has(e)||(v[e]=n[e]);return Wa(_[0],v)});lo.displayName=`FontAwesomeIcon`,`${eo.default}${Q.fixedWidth}`;var uo=[{icon:{prefix:`fab`,iconName:`instagram`,icon:[448,512,[],`f16d`,`M224.3 141a115 115 0 1 0 -.6 230 115 115 0 1 0 .6-230zm-.6 40.4a74.6 74.6 0 1 1 .6 149.2 74.6 74.6 0 1 1 -.6-149.2zm93.4-45.1a26.8 26.8 0 1 1 53.6 0 26.8 26.8 0 1 1 -53.6 0zm129.7 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM399 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z`]},href:`#`,label:`Instagram`,color:`hover:bg-pink-500/20 hover:border-pink-400/40 hover:text-pink-400`},{icon:{prefix:`fab`,iconName:`youtube`,icon:[576,512,[61802],`f167`,`M549.7 124.1C543.5 100.4 524.9 81.8 501.4 75.5 458.9 64 288.1 64 288.1 64S117.3 64 74.7 75.5C51.2 81.8 32.7 100.4 26.4 124.1 15 167 15 256.4 15 256.4s0 89.4 11.4 132.3c6.3 23.6 24.8 41.5 48.3 47.8 42.6 11.5 213.4 11.5 213.4 11.5s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zM232.2 337.6l0-162.4 142.7 81.2-142.7 81.2z`]},href:`#`,label:`YouTube`,color:`hover:bg-red-500/20 hover:border-red-400/40 hover:text-red-400`},{icon:{prefix:`fab`,iconName:`twitter`,icon:[512,512,[],`f099`,`M459.4 151.7c.3 4.5 .3 9.1 .3 13.6 0 138.7-105.6 298.6-298.6 298.6-59.5 0-114.7-17.2-161.1-47.1 8.4 1 16.6 1.3 25.3 1.3 49.1 0 94.2-16.6 130.3-44.8-46.1-1-84.8-31.2-98.1-72.8 6.5 1 13 1.6 19.8 1.6 9.4 0 18.8-1.3 27.6-3.6-48.1-9.7-84.1-52-84.1-103l0-1.3c14 7.8 30.2 12.7 47.4 13.3-28.3-18.8-46.8-51-46.8-87.4 0-19.5 5.2-37.4 14.3-53 51.7 63.7 129.3 105.3 216.4 109.8-1.6-7.8-2.6-15.9-2.6-24 0-57.8 46.8-104.9 104.9-104.9 30.2 0 57.5 12.7 76.7 33.1 23.7-4.5 46.5-13.3 66.6-25.3-7.8 24.4-24.4 44.8-46.1 57.8 21.1-2.3 41.6-8.1 60.4-16.2-14.3 20.8-32.2 39.3-52.6 54.3z`]},href:`#`,label:`Twitter`,color:`hover:bg-sky-500/20 hover:border-sky-400/40 hover:text-sky-400`},{icon:{prefix:`fab`,iconName:`facebook-f`,icon:[320,512,[],`f39e`,`M80 299.3l0 212.7 116 0 0-212.7 86.5 0 18-97.8-104.5 0 0-34.6c0-51.7 20.3-71.5 72.7-71.5 16.3 0 29.4 .4 37 1.2l0-88.7C291.4 4 256.4 0 236.2 0 129.3 0 80 50.5 80 159.4l0 42.1-66 0 0 97.8 66 0z`]},href:`#`,label:`Facebook`,color:`hover:bg-blue-500/20 hover:border-blue-400/40 hover:text-blue-400`}],fo=[{href:`/`,label:`Beranda`},{href:`/news`,label:`Berita`},{href:`/ilkomgallery`,label:`Ilkom Gallery`}],po=[{href:`#`,label:`SAPA`},{href:`#`,label:`BEM Official`},{href:`#`,label:`Unsri`}],mo={hidden:{},show:{transition:{staggerChildren:.06}}},ho={hidden:{opacity:0,y:12},show:{opacity:1,y:0,transition:{duration:.5,ease:[.25,.46,.45,.94]}}};function go(){return(0,E.jsxs)(`footer`,{className:`relative overflow-hidden`,children:[(0,E.jsx)(`div`,{className:`absolute inset-0 bg-gradient-to-br from-[#1A0533] via-[#300B55] to-[#1a0533]`}),(0,E.jsx)(`div`,{className:`absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(122,71,166,0.15),transparent_60%)]`}),(0,E.jsx)(`div`,{className:`absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(191,148,255,0.08),transparent_60%)]`}),(0,E.jsx)(w.div,{variants:mo,initial:`hidden`,whileInView:`show`,viewport:{once:!0,margin:`-80px`},className:`relative z-10 px-4 lg:px-8 pt-16 pb-8 lg:pt-24 lg:pb-10`,children:(0,E.jsxs)(`div`,{className:`max-w-7xl mx-auto`,children:[(0,E.jsxs)(w.div,{variants:ho,className:`md:flex md:items-start md:justify-between mb-10`,children:[(0,E.jsxs)(S,{to:`/`,className:`flex items-center gap-x-3 group`,"aria-label":`ILKOM NEWS`,children:[(0,E.jsx)(`img`,{src:Re,alt:`ILKOM`,className:`h-9 w-auto group-hover:scale-105 transition-transform`}),(0,E.jsx)(`span`,{className:`font-bold text-xl font-header text-white`,children:`ILKOM NEWS`})]}),(0,E.jsx)(`ul`,{className:`flex list-none mt-6 md:mt-0 gap-2`,children:uo.map((e,t)=>(0,E.jsx)(w.li,{variants:ho,children:(0,E.jsx)(`a`,{href:e.href,target:`_blank`,rel:`noopener noreferrer`,"aria-label":e.label,className:`inline-flex items-center justify-center h-10 w-10 rounded-xl bg-white/5 border border-white/10 text-white/50 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-lg ${e.color}`,children:(0,E.jsx)(lo,{icon:e.icon,className:`text-sm`})})},t))})]}),(0,E.jsx)(w.div,{variants:ho,className:`h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8`}),(0,E.jsxs)(`div`,{className:`md:flex md:items-center md:justify-between gap-6`,children:[(0,E.jsxs)(w.div,{variants:ho,className:`text-white/30 text-sm leading-6`,children:[(0,E.jsxs)(`div`,{children:[`© `,new Date().getFullYear(),` ILKOM NEWS`]}),(0,E.jsx)(`div`,{className:`text-white/20 text-xs mt-0.5`,children:`BEM FASILKOM UNSRI — Hak cipta dilindungi`})]}),(0,E.jsx)(w.nav,{variants:ho,className:`mt-4 md:mt-0`,children:(0,E.jsxs)(`ul`,{className:`list-none flex flex-wrap gap-4`,children:[fo.map((e,t)=>(0,E.jsx)(`li`,{children:(0,E.jsxs)(S,{to:e.href,className:`text-sm text-white/50 hover:text-white transition-colors duration-200 inline-flex items-center gap-1 group`,children:[e.label,(0,E.jsx)(g,{size:12,className:`opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all`})]})},t)),(0,E.jsx)(`li`,{className:`text-white/15`,children:`|`}),po.map((e,t)=>(0,E.jsx)(`li`,{children:(0,E.jsx)(`a`,{href:e.href,className:`text-sm text-white/30 hover:text-white/70 transition-colors duration-200`,children:e.label})},t))]})})]}),(0,E.jsxs)(w.div,{variants:ho,className:`mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-1.5 text-white/20 text-xs`,children:[(0,E.jsx)(`span`,{children:`Dibuat dengan`}),(0,E.jsx)(n,{size:10,className:`text-pink-400/60 fill-pink-400/60`}),(0,E.jsx)(`span`,{children:`oleh FASILKOM UNSRI`})]})]})})]})}var _o=()=>((0,T.useEffect)(()=>{},[]),null);function vo(e){"@babel/helpers - typeof";return vo=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},vo(e)}function yo(e,t){if(vo(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(vo(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function bo(e){var t=yo(e,`string`);return vo(t)==`symbol`?t:t+``}function xo(e,t,n){return(t=bo(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var So=class extends T.Component{constructor(...e){super(...e),xo(this,`state`,{error:null})}static getDerivedStateFromError(e){return{error:e}}render(){return this.state.error?(0,E.jsx)(`div`,{className:`min-h-screen bg-white dark:bg-black flex items-center justify-center p-8`,children:(0,E.jsxs)(`div`,{className:`max-w-md w-full text-center`,children:[(0,E.jsx)(`h1`,{className:`text-2xl font-bold text-red-500 mb-4`,children:`Something went wrong`}),(0,E.jsx)(`p`,{className:`text-neutral-600 dark:text-neutral-400 mb-4 text-sm font-mono break-all`,children:this.state.error.message}),(0,E.jsx)(`pre`,{className:`text-xs text-neutral-500 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-900 p-4 rounded-xl overflow-auto text-left max-h-64`,children:this.state.error.stack}),(0,E.jsx)(`button`,{onClick:()=>window.location.reload(),className:`mt-6 px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700`,children:`Reload`})]})}):this.props.children}},Co=`modulepreload`,wo=function(e){return`/`+e},To={},$=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}r=o(t.map(t=>{if(t=wo(t,n),t in To)return;To[t]=!0;let r=t.endsWith(`.css`),i=r?`[rel="stylesheet"]`:``;if(n)for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${t}"]${i}`))return;let o=document.createElement(`link`);if(o.rel=r?`stylesheet`:Co,r||(o.as=`script`),o.crossOrigin=``,o.href=t,a&&o.setAttribute(`nonce`,a),document.head.appendChild(o),r)return new Promise((e,n)=>{o.addEventListener(`load`,e),o.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},Eo=(0,T.lazy)(()=>$(()=>import(`./HomePage-QnETdSp2.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10]))),Do=(0,T.lazy)(()=>$(()=>import(`./NewsPage-B5e0Uce8.js`),__vite__mapDeps([11,1,4,3,5,2,6,7,12,8,13,9,10]))),Oo=(0,T.lazy)(()=>$(()=>import(`./EventsPage-zg-_FRiV.js`),__vite__mapDeps([14,1,2,3,4,12,7,8,6,10]))),ko=(0,T.lazy)(()=>$(()=>import(`./IlkomGalleryPage-BhVzpY7g.js`),__vite__mapDeps([15,1,2,3,4,12,7,13,9,6,10]))),Ao=(0,T.lazy)(()=>$(()=>import(`./DetailPage-BHTD-Jxv.js`),__vite__mapDeps([16,1,2,3,4,12,7,8,10]))),jo=(0,T.lazy)(()=>$(()=>import(`./ProjectDetailPage-qVnr-Lpr.js`),__vite__mapDeps([17,1,2,3,4]))),Mo=(0,T.lazy)(()=>$(()=>import(`./GameDetailPage-BxEiptrM.js`),__vite__mapDeps([18,1,2,3,4]))),No=(0,T.lazy)(()=>$(()=>import(`./MobileDetailPage-DYAaQ7iU.js`),__vite__mapDeps([19,1,2,3,4]))),Po=(0,T.lazy)(()=>$(()=>import(`./UiUxDetailPage-BnXtPn-2.js`),__vite__mapDeps([20,1,2,3,4]))),Fo=(0,T.lazy)(()=>$(()=>import(`./WebDetailPage-CmGR0QET.js`),__vite__mapDeps([21,1,2,3,4]))),Io=(0,T.lazy)(()=>$(()=>import(`./SubmitProjectPage-Dzv2QtYm.js`),__vite__mapDeps([22,1,2,3,4,12,7,6,9]))),Lo=(0,T.lazy)(()=>$(()=>import(`./TrackPage-DwS60Nco.js`),__vite__mapDeps([23,1,2,3,4,12,7,6,9]))),Ro=(0,T.lazy)(()=>$(()=>import(`./LoginPage-D03lkdL2.js`),__vite__mapDeps([24,1,2,3,4]))),zo=(0,T.lazy)(()=>$(()=>import(`./DashboardPage-O12kAcKR.js`),__vite__mapDeps([25,1,2,3,4]))),Bo=(0,T.lazy)(()=>$(()=>import(`./NewsListPage-CMX0E5td.js`),__vite__mapDeps([26,1,2,3,4]))),Vo=(0,T.lazy)(()=>$(()=>import(`./NewsFormPage-BHMTvvSj.js`),__vite__mapDeps([27,1,2,3,4]))),Ho=(0,T.lazy)(()=>$(()=>import(`./ProjectsListPage-DA71z7Mg.js`),__vite__mapDeps([28,1,2,3,4]))),Uo=(0,T.lazy)(()=>$(()=>import(`./ProjectDetailPage-Bdi0hPxs.js`),__vite__mapDeps([29,1,2,3,4]))),Wo=()=>(0,E.jsx)(`div`,{className:`min-h-screen bg-white dark:bg-black flex items-center justify-center`,children:(0,E.jsxs)(`div`,{className:`text-center`,children:[(0,E.jsx)(`div`,{className:`w-10 h-10 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3`}),(0,E.jsx)(`p`,{className:`text-neutral-500 text-sm`,children:`Memuat...`})]})});function Go(){let[e,t]=(0,T.useState)(!0),n=te().pathname.startsWith(`/admin`);return(0,T.useEffect)(()=>{let e=setTimeout(()=>t(!1),2e3);return()=>clearTimeout(e)},[]),(0,E.jsx)(So,{children:(0,E.jsx)(fe,{children:(0,E.jsxs)(we,{children:[e&&(0,E.jsx)(Me,{}),(0,E.jsxs)(`div`,{className:`min-h-screen flex flex-col bg-white dark:bg-black transition-colors duration-300`,children:[(0,E.jsx)(_o,{}),!n&&(0,E.jsx)(ze,{}),(0,E.jsx)(`main`,{className:`flex-grow`,children:(0,E.jsx)(T.Suspense,{fallback:(0,E.jsx)(Wo,{}),children:(0,E.jsxs)(x,{children:[(0,E.jsx)(C,{path:`/`,element:(0,E.jsx)(Eo,{})}),(0,E.jsx)(C,{path:`/news`,element:(0,E.jsx)(Do,{})}),(0,E.jsx)(C,{path:`/news/:slug`,element:(0,E.jsx)(Ao,{type:`news`})}),(0,E.jsx)(C,{path:`/events`,element:(0,E.jsx)(Oo,{})}),(0,E.jsx)(C,{path:`/events/:slug`,element:(0,E.jsx)(Ao,{type:`events`})}),(0,E.jsx)(C,{path:`/ilkomgallery`,element:(0,E.jsx)(ko,{})}),(0,E.jsx)(C,{path:`/ilkomgallery/project/:slug`,element:(0,E.jsx)(jo,{})}),(0,E.jsx)(C,{path:`/ilkomgallery/game/:slug`,element:(0,E.jsx)(Mo,{})}),(0,E.jsx)(C,{path:`/ilkomgallery/mobile/:slug`,element:(0,E.jsx)(No,{})}),(0,E.jsx)(C,{path:`/ilkomgallery/uiux/:slug`,element:(0,E.jsx)(Po,{})}),(0,E.jsx)(C,{path:`/ilkomgallery/web/:slug`,element:(0,E.jsx)(Fo,{})}),(0,E.jsx)(C,{path:`/submit`,element:(0,E.jsx)(Io,{})}),(0,E.jsx)(C,{path:`/track`,element:(0,E.jsx)(Lo,{})}),(0,E.jsx)(C,{path:`/admin/login`,element:(0,E.jsx)(Ro,{})}),(0,E.jsxs)(C,{path:`/admin`,element:(0,E.jsx)(Ee,{children:(0,E.jsx)(ke,{})}),children:[(0,E.jsx)(C,{index:!0,element:(0,E.jsx)(zo,{})}),(0,E.jsx)(C,{path:`dashboard`,element:(0,E.jsx)(zo,{})}),(0,E.jsx)(C,{path:`news`,element:(0,E.jsx)(Bo,{})}),(0,E.jsx)(C,{path:`news/create`,element:(0,E.jsx)(Vo,{})}),(0,E.jsx)(C,{path:`news/:id/edit`,element:(0,E.jsx)(Vo,{})}),(0,E.jsx)(C,{path:`projects`,element:(0,E.jsx)(Ho,{})}),(0,E.jsx)(C,{path:`projects/:id`,element:(0,E.jsx)(Uo,{})})]}),(0,E.jsx)(C,{path:`*`,element:(0,E.jsx)(Eo,{})})]})})}),!n&&(0,E.jsx)(go,{})]})]})})})}`serviceWorker`in navigator&&window.addEventListener(`load`,()=>{navigator.serviceWorker.register(`/sw.js`).catch(()=>{})}),ue.createRoot(document.getElementById(`root`)).render((0,E.jsx)(T.StrictMode,{children:(0,E.jsx)(ie,{children:(0,E.jsx)(Go,{})})}));export{xe as a,be as i,Ae as n,Se as o,Te as r,je as t};