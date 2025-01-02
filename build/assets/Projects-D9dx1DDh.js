import{j as e,c as t}from"./index-BNXbxCoW.js";import{r}from"./react-vendor-BKfAGeUj.js";import{P as a,p as s}from"./ProjectCard-BtnXcwtj.js";import{m as i,e as n}from"./ui-vendor-Bvd8MPr9.js";import{F as o}from"./fade-in-BYadEvcx.js";import{P as l}from"./particles-D_XGp7rn.js";function c(){return e.jsxs(i.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5},className:"text-center max-w-3xl mx-auto mb-16",children:[e.jsx(i.div,{initial:{scale:0},animate:{scale:1},transition:{type:"spring",stiffness:200,damping:10},className:"w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center",children:e.jsx(n,{className:"w-8 h-8 text-primary"})}),e.jsx("h1",{className:"text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70",children:"Featured Projects"}),e.jsx("p",{className:"text-lg text-muted-foreground",children:"Explore my latest works and creative endeavors. Each project represents a unique challenge and demonstrates my commitment to crafting exceptional digital experiences."})]})}function m({technologies:a,activeFilter:s,onFilterChange:n}){const[o,l]=r.useState(null);return e.jsxs("div",{className:"flex flex-wrap gap-3 justify-center mb-12",children:[e.jsxs(i.button,{whileHover:{scale:1.05},whileTap:{scale:.95},onClick:()=>n(""),onMouseEnter:()=>l("all"),onMouseLeave:()=>l(null),className:t("relative px-4 py-2 rounded-full text-sm font-medium transition-colors",""===s?"bg-primary text-primary-foreground":"bg-secondary hover:bg-secondary/80"),children:["All Projects","all"===o&&e.jsx(i.span,{layoutId:"filter-hover",className:"absolute inset-0 rounded-full bg-primary/10",transition:{type:"spring",bounce:.2,duration:.6}})]}),a.map((r=>e.jsxs(i.button,{whileHover:{scale:1.05},whileTap:{scale:.95},onClick:()=>n(r),onMouseEnter:()=>l(r),onMouseLeave:()=>l(null),className:t("relative px-4 py-2 rounded-full text-sm font-medium transition-colors",s===r?"bg-primary text-primary-foreground":"bg-secondary hover:bg-secondary/80"),children:[r,o===r&&e.jsx(i.span,{layoutId:"filter-hover",className:"absolute inset-0 rounded-full bg-primary/10",transition:{type:"spring",bounce:.2,duration:.6}})]},r)))]})}function d({projects:t,filter:r}){const s=r?t.filter((e=>e.technologies.some((e=>e.toLowerCase().includes(r.toLowerCase()))))):t;return e.jsx(o,{className:"grid grid-cols-1 lg:grid-cols-2 gap-8",children:s.map(((t,r)=>e.jsx(i.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5,delay:.1*r},children:e.jsx(a,{project:t,index:r})},t.title)))})}function u(){const[t,a]=r.useState(""),i=r.useMemo((()=>{const e=new Set;return s.forEach((t=>{t.technologies.forEach((t=>e.add(t)))})),Array.from(e)}),[]);return e.jsxs("main",{className:"relative min-h-screen py-20 px-4 md:px-8 lg:px-16",children:[e.jsx(l,{className:"absolute inset-0",quantity:150,staticity:50,ease:50}),e.jsxs("div",{className:"relative z-10 max-w-7xl mx-auto",children:[e.jsx(c,{}),e.jsx(m,{technologies:i,activeFilter:t,onFilterChange:a}),e.jsx(d,{projects:s,filter:t})]})]})}export{u as default};