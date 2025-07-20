import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// تحديد __dirname في نظام ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: './', // مهم لتفادي مشاكل تحميل الملفات على مسارات غير جذرية (مثلاً عبر IP)
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),  // اختصار للوصول لمجلد src داخل client
      "@shared": path.resolve(__dirname, "shared"),   // لمشاركة ملفات بين السيرفر والفرونت
    },
  },
  root: path.resolve(__dirname, "client"), // مجلد العمل الرئيسي للفرونت إند
  build: {
    outDir: path.resolve(__dirname, "dist/public"), // مجلد إخراج ملفات البناء (واحد مستوى فوق client)
    emptyOutDir: true, // يمسح محتويات مجلد الإخراج قبل البناء
  },
  server: {
    host: "0.0.0.0", // يسمح بالوصول إلى السيرفر من أي IP (مهم في بيئات التطوير الشبكية)
    port: 8080,       // رقم بورت سيرفر التطوير
  },
});
