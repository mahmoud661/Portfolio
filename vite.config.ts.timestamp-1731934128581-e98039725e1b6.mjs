// vite.config.ts
import { defineConfig } from "file:///C:/Users/User1/Documents/Myfiles/Web%20Development/portfolio/portfolio/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/User1/Documents/Myfiles/Web%20Development/portfolio/portfolio/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import tailwindcss from "file:///C:/Users/User1/Documents/Myfiles/Web%20Development/portfolio/portfolio/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///C:/Users/User1/Documents/Myfiles/Web%20Development/portfolio/portfolio/node_modules/autoprefixer/lib/autoprefixer.js";
var __vite_injected_original_dirname = "C:\\Users\\User1\\Documents\\Myfiles\\Web Development\\portfolio\\portfolio";
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer()
      ]
    }
  },
  server: {
    host: "0.0.0.0",
    // Allows access from your local network
    port: 5173,
    // You can specify the port if needed
    open: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVc2VyMVxcXFxEb2N1bWVudHNcXFxcTXlmaWxlc1xcXFxXZWIgRGV2ZWxvcG1lbnRcXFxccG9ydGZvbGlvXFxcXHBvcnRmb2xpb1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcVXNlcjFcXFxcRG9jdW1lbnRzXFxcXE15ZmlsZXNcXFxcV2ViIERldmVsb3BtZW50XFxcXHBvcnRmb2xpb1xcXFxwb3J0Zm9saW9cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL1VzZXIxL0RvY3VtZW50cy9NeWZpbGVzL1dlYiUyMERldmVsb3BtZW50L3BvcnRmb2xpby9wb3J0Zm9saW8vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIlxuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ3RhaWx3aW5kY3NzJztcbmltcG9ydCBhdXRvcHJlZml4ZXIgZnJvbSAnYXV0b3ByZWZpeGVyJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICB9LFxuICB9LFxuICAgY3NzOiB7XG4gICAgcG9zdGNzczoge1xuICAgICAgcGx1Z2luczogW1xuICAgICAgICB0YWlsd2luZGNzcygpLFxuICAgICAgICBhdXRvcHJlZml4ZXIoKSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogJzAuMC4wLjAnLCAvLyBBbGxvd3MgYWNjZXNzIGZyb20geW91ciBsb2NhbCBuZXR3b3JrXG4gICAgcG9ydDogNTE3MywgLy8gWW91IGNhbiBzcGVjaWZ5IHRoZSBwb3J0IGlmIG5lZWRlZFxuICAgICAgICBvcGVuOiB0cnVlLFxuXG4gIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnWixTQUFTLG9CQUFvQjtBQUM3YSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sa0JBQWtCO0FBSnpCLElBQU0sbUNBQW1DO0FBT3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQyxLQUFLO0FBQUEsSUFDSixTQUFTO0FBQUEsTUFDUCxTQUFTO0FBQUEsUUFDUCxZQUFZO0FBQUEsUUFDWixhQUFhO0FBQUEsTUFDZjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUE7QUFBQSxJQUNOLE1BQU07QUFBQTtBQUFBLElBQ0YsTUFBTTtBQUFBLEVBRVo7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
