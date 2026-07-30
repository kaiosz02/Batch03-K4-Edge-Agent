# Bộ Prompt Tạo Giao Diện UI cho Dự Án VLearn AI Tutor trên Stitch AI

Dưới đây là các prompt được thiết kế chi tiết để bạn có thể copy và dán vào Stitch AI (hoặc các công cụ tạo UI tương tự) nhằm sinh ra các thành phần giao diện Frontend (dùng React, TailwindCSS, v.v.).

---

## 1. Màn Hình Chính Học Tập (Main Learning Interface)

**Prompt:**
```text
Create a modern, clean, and highly engaging web-based learning interface for an AI-powered education platform. 
The layout should have a dark mode or sleek glassmorphism aesthetic.
Divide the screen into three main areas:
1. Left/Center Area (70% width): A document/slide viewer showing an educational slide presentation. Include a top bar with the course name and pagination controls.
2. Right Sidebar (30% width): An AI Tutor chat interface.
3. Bottom Right Corner (Floating over the sidebar): A floating widget containing a pixel-art or cute 2D Virtual Pet (V-Pet).

The color palette should feel premium (e.g., deep navy blue, subtle purples, and vibrant neon accents for buttons). Use modern fonts like Inter or Outfit. Make it look professional yet slightly gamified.
```

---

## 2. Khung Chat AI Tutor (AI Tutor Chat Panel)

**Prompt:**
```text
Create a chat interface component for an AI Tutor. This component is a vertical sidebar.
Header: Title "VLearn AI Tutor" with a small green dot indicating "Online".
Quick Actions: Just below the header, place a horizontal scrollable row of 4 distinct, colorful, pill-shaped buttons with icons: 
- "Giải thích slide" (Explain slide)
- "Tóm tắt" (Summarize)
- "Tổng kết" (Review)
- "Tạo câu hỏi ôn tập" (Quiz me)
Chat Area: Show a conversation between a User and the AI. 
CRITICAL FEATURE: The AI's responses MUST include visually distinct citation badges or tooltip links (e.g., a small tag saying "Trích dẫn: Slide 12") at the end of the explanation. 
Input Area: A text input field at the bottom with a send icon and an attachment icon. Use a clean, modern aesthetic with soft shadows and rounded corners.
```

---

## 3. Widget Thú Cưng Ảo (V-Pet Companion Widget)

**Prompt:**
```text
Create a floating widget component for a "Virtual Pet" companion used in a gamified learning app.
The widget should be compact and have a playful, engaging design (glassmorphism background).
Inside the widget:
- Center: A placeholder for a cute pet avatar (e.g., a little glowing egg, a chick, or a cat) with an expressive face (happy/excited).
- Top: A small text indicating the current mood ("Đang Vui 😻").
- Bottom: A visually appealing progress bar showing "EXP: 350/500" towards the next evolution level.
- Add a subtle glowing animation effect around the pet to make it feel alive. Ensure the component looks like it can sit smoothly in the bottom corner of a screen.
```

---

## 4. Bảng Điểm Cá Nhân & Streak (Gamification Dashboard Modal)

**Prompt:**
```text
Create a beautiful, modern modal/popup component for a student's Gamification Dashboard (EXP Dashboard).
The design should feel rewarding and motivating.
Include the following sections inside the modal:
1. Header: "Bảng Điểm Cá Nhân" (Personal Dashboard) with a celebratory banner or confetti background.
2. Top Stats: A row of three statistic cards:
   - "Tổng EXP" (Total EXP) with a glowing number (e.g., 2,450).
   - "Cấp Độ Thú Cưng" (Pet Level) showing "Level 3 - Gà Trống".
   - "Streak Học Tập" (Learning Streak) showing "🔥 5 Ngày liên tiếp" with a fire icon.
3. Recent Activity List: A clean list showing history of learning interactions (e.g., "Hỏi bài +15 EXP", "Làm Quiz đúng +50 EXP") with timestamps.
Use vibrant gradient colors (like orange-red for fire/streak, purple-blue for EXP) to make the metrics pop.
```

---

*Lưu ý: Bạn có thể copy lần lượt từng khối `Prompt` bằng tiếng Anh ở trên và dán vào công cụ để công cụ hiểu chính xác thiết kế và bố cục. Tiếng Anh thường mang lại kết quả UI sinh ra (từ AI) đẹp và chuẩn xác hơn.*
