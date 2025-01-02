import{j as e,c as a}from"./index-BNXbxCoW.js";import{r as t}from"./react-vendor-BKfAGeUj.js";import{A as s,m as i,X as o,g as r,h as n,E as l}from"./ui-vendor-Bvd8MPr9.js";import{F as c}from"./fade-in-BYadEvcx.js";const d=[{title:"E-Commerce Platform",description:"A modern e-commerce platform built with React and Node.js, featuring real-time inventory management, secure payments, and an intuitive admin dashboard.",technologies:["React","Node.js","MongoDB","Express","Redux"],github:"https://github.com/yourusername/ecommerce",demo:"https://ecommerce-demo.com",image:"https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2089&q=80"},{title:"AI Image Generator",description:"An AI-powered image generation tool that creates unique artwork using DALL-E API. Features custom style transfer and advanced image manipulation options.",technologies:["Python","FastAPI","React","OpenAI"],github:"https://github.com/yourusername/ai-image-gen",demo:"https://ai-image-gen-demo.com",image:"https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2832&q=80"},{title:"Task Management App",description:"A collaborative task management application with real-time updates, team collaboration features, and advanced project tracking capabilities.",technologies:["Next.js","Firebase","Tailwind CSS","TypeScript"],github:"https://github.com/yourusername/task-manager",demo:"https://task-manager-demo.com",image:"https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"},{title:"Smart Home Dashboard",description:"A comprehensive IoT dashboard for managing smart home devices, featuring real-time monitoring, automation rules, and energy consumption analytics.",technologies:["React","Node.js","Socket.io","Chart.js"],github:"https://github.com/yourusername/smart-home",demo:"https://smart-home-demo.com",image:"https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}],m={sm:"max-w-sm",md:"max-w-md",lg:"max-w-lg",xl:"max-w-xl",full:"max-w-[95vw]"};function p({isOpen:r,onClose:n,children:l,className:c,size:d="lg"}){return t.useEffect((()=>(document.body.style.overflow=r?"hidden":"unset",()=>{document.body.style.overflow="unset"})),[r]),e.jsx(s,{children:r&&e.jsxs(e.Fragment,{children:[e.jsx(i.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:n,className:"fixed inset-0 z-[999] bg-background/80 backdrop-blur-sm"}),e.jsx("div",{className:"fixed inset-0 z-[10000] flex items-center justify-center p-4",children:e.jsx(i.div,{initial:{opacity:0,scale:.95,y:20},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.95,y:20},transition:{type:"spring",duration:.5},className:a("relative w-full",m[d]),onClick:e=>e.stopPropagation(),children:e.jsxs("div",{className:a("relative rounded-xl border bg-background shadow-lg",c),children:[e.jsx(i.button,{onClick:n,whileHover:{scale:1.1},whileTap:{scale:.9},className:"absolute right-4 top-4 z-[1001] flex size-8 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground",children:e.jsx(o,{className:"size-4"})}),l]})})})]})})}function x({children:t,delay:s=0,className:o,...r}){return e.jsx(i.div,{initial:{opacity:0,scale:.9},whileInView:{opacity:1,scale:1},viewport:{once:!0},transition:{type:"spring",stiffness:200,damping:20,delay:s},className:a(o),...r,children:t})}function u({project:a,isOpen:s,onClose:o}){const[c,d]=t.useState(!1),m="video"===a.media?.type;return e.jsx(p,{isOpen:s,onClose:o,size:"xl",children:e.jsxs("div",{className:"p-6",children:[e.jsx(x,{children:e.jsx("div",{className:"relative aspect-video bg-secondary rounded-xl overflow-hidden mb-6 group bg-black",children:m?c?e.jsx("video",{src:a.media?.url,className:"w-full h-full object-cover",autoPlay:!0,controls:!0}):e.jsxs(e.Fragment,{children:[e.jsx("img",{src:a.image,alt:a.title,className:"w-full h-full object-cover"}),e.jsx("button",{onClick:()=>d(!0),className:"absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity",children:e.jsx(r,{className:"w-16 h-16 text-white"})})]}):e.jsx("img",{src:a.image,alt:a.title,className:"w-full h-full object-cover"})})}),e.jsxs(i.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.2},className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl md:text-3xl font-bold mb-4",children:a.title}),e.jsx("p",{className:"text-muted-foreground text-base md:text-lg",children:a.description})]}),e.jsx("div",{className:"flex flex-wrap gap-2",children:a.technologies.map(((a,t)=>e.jsx("span",{className:"px-3 py-1 text-sm bg-secondary rounded-full",children:a},t)))}),e.jsxs("div",{className:"flex flex-col sm:flex-row gap-4 pt-4",children:[e.jsxs("a",{href:a.github,target:"_blank",rel:"noopener noreferrer",className:"flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors",children:[e.jsx(n,{className:"w-5 h-5"}),e.jsx("span",{children:"View Code"})]}),e.jsxs("a",{href:a.demo,target:"_blank",rel:"noopener noreferrer",className:"flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors",children:[e.jsx(l,{className:"w-5 h-5"}),e.jsx("span",{children:"Live Demo"})]})]})]})]})})}function h({project:a,index:s}){const[o,r]=t.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(c,{delay:.1*s,children:e.jsxs(i.div,{whileHover:{y:-5},whileTap:{scale:.98},className:"group relative overflow-hidden rounded-xl bg-card shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer",onClick:()=>r(!0),children:[e.jsxs("div",{className:"aspect-video overflow-hidden",children:[e.jsx("img",{src:a.image,alt:a.title,className:"w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"}),e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"})]}),e.jsxs("div",{className:"p-6",children:[e.jsx("h3",{className:"text-xl font-semibold mb-2 group-hover:text-primary transition-colors",children:a.title}),e.jsx("p",{className:"text-muted-foreground mb-4 line-clamp-2",children:a.description}),e.jsxs("div",{className:"flex flex-wrap gap-2",children:[a.technologies.slice(0,3).map(((a,t)=>e.jsx("span",{className:"px-3 py-1 text-sm bg-secondary rounded-full",children:a},t))),a.technologies.length>3&&e.jsxs("span",{className:"px-3 py-1 text-sm bg-secondary rounded-full",children:["+",a.technologies.length-3]})]})]})]})}),e.jsx(u,{project:a,isOpen:o,onClose:()=>r(!1)})]})}export{h as P,d as p};