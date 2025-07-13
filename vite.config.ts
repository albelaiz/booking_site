import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// لتحديد المسار الحالي (ضروري في ESM)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// تصدير إعداد Vite
export default defineConfig({
  base: "/", // ✅ ضروري لتجنب مشاكل تحميل الملفات عبر IP أو مسارات غير صحيحة
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"), // للوصول السريع إلى src
      "@shared": path.resolve(__dirname, "shared"),   // لمشاركة الملفات بين السيرفر والفرونت
    },
  },
  root: path.resolve(__dirname, "client"), // مجلد المشروع الرئيسي للفرونت
  build: {
    outDir: path.resolve(__dirname, "dist/public"), // مكان إخراج الملفات بعد البناء
    emptyOutDir: true, // حذف الملفات القديمة قبل البناء
  },
  server: {
    host: "0.0.0.0", // يسمح بالوصول من خلال IP
    port: 8080, // رقم البورت
  },
});
